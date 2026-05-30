import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import MentorLayout from "../../layouts/MentorLayout";

function Videos() {
  const [videos, setVideos] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    batchId: "",
    videoFile: null,
    thumbnailFile: null,
  });

  const categoryOptions = [
    "Frontend",
    "Backend",
    "JavaScript",
    "React",
    "Java",
    "Database",
    "DevOps",
    "Testing",
  ];

  const parseDurationToSeconds = (durationText) => {
    const value = String(durationText).trim().toLowerCase();
    if (!value) return 0;

    if (value.includes("hour") || value.includes("hr")) {
      const num = parseFloat(value);
      return Number.isNaN(num) ? 0 : Math.round(num * 3600);
    }

    const num = parseInt(value);
    return Number.isNaN(num) ? 0 : num * 60;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0 min";
    return `${Math.ceil(seconds / 60)} min`;
  };

  const fetchVideos = async () => {
    try {
      const response = await axiosInstance.get("/mentor/videos", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setVideos(response.data);
    } catch (error) {
      console.error("Videos fetch error:", error);
      toast.error("Failed to load videos");
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axiosInstance.get("/mentor/batches", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setBatches(response.data);
    } catch (error) {
      console.error("Batches fetch error:", error);
      toast.error("Failed to load batches");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchVideos(), fetchBatches()]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const uniqueBatches = useMemo(() => {
    const map = new Map();
    batches.forEach((batch) => {
      if (!map.has(batch.id)) map.set(batch.id, batch);
    });
    return Array.from(map.values());
  }, [batches]);

  const recentUploads = useMemo(() => {
    return [...videos].slice(-3).reverse();
  }, [videos]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "videoFile" || name === "thumbnailFile") {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      duration: "",
      batchId: "",
      videoFile: null,
      thumbnailFile: null,
    });
    setEditingVideoId(null);
  };

  const openVideoDetails = async (videoId) => {
    try {
      const response = await axiosInstance.get(`/mentor/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSelectedVideo(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load video details");
    }
  };

  const handleEdit = (video) => {
    setEditingVideoId(video.id);
    setFormData({
      title: video.title,
      description: video.description,
      category: video.category,
      duration: `${Math.ceil((video.durationSeconds || 0) / 60)} min`,
      batchId: video.batch?.id || "",
      videoFile: null,
      thumbnailFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (videoId) => {
    const ok = window.confirm("Are you sure you want to delete this video?");
    if (!ok) return;

    try {
      await axiosInstance.delete(`/mentor/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Video deleted successfully");
      fetchVideos();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete video");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const durationSeconds = parseDurationToSeconds(formData.duration);
    if (!durationSeconds || durationSeconds <= 0) {
      toast.error("Please enter valid duration like 45 min");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("category", formData.category);
    payload.append("durationSeconds", durationSeconds);
    payload.append("batchId", formData.batchId);

    if (formData.videoFile) payload.append("videoFile", formData.videoFile);
    if (formData.thumbnailFile)
      payload.append("thumbnailFile", formData.thumbnailFile);

    try {
      if (editingVideoId) {
        await axiosInstance.put(`/mentor/videos/${editingVideoId}`, payload, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        toast.success("Video updated successfully");
      } else {
        if (!formData.videoFile) {
          toast.error("Please choose a video file");
          return;
        }
        await axiosInstance.post("/mentor/videos", payload, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        toast.success("Video uploaded successfully");
      }

      resetForm();
      fetchVideos();
    } catch (error) {
      console.error("Upload video error:", error);
      toast.error("Failed to upload video");
    }
  };

  if (loading) {
    return (
      <MentorLayout title="Upload Training Video">
        <div>Loading videos...</div>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout title="Upload Training Video">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Upload Training Video
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Share knowledge with interns by uploading training content
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Video Form */}
          <div className="xl:col-span-8 bg-white rounded-2xl border shadow-sm">
            <div className="px-5 py-4 border-b">
              <h2 className="text-lg font-semibold text-slate-800">
                Video Details
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Video title"
                className="w-full border rounded-xl px-4 py-3"
                required
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Description"
                className="w-full border rounded-xl px-4 py-3"
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3"
                  required
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 45 min"
                  className="w-full border rounded-xl px-4 py-3"
                  required
                />
              </div>

              <select
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
                required
              >
                <option value="">Select batch</option>
                {uniqueBatches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-sm mb-2">Video File</label>
                <input
                  type="file"
                  name="videoFile"
                  accept="video/*"
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3"
                  required={!editingVideoId}
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Thumbnail Image</label>
                <input
                  type="file"
                  name="thumbnailFile"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <button
                type="submit"
                className="flex-1 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl"
              >
                {editingVideoId ? "Update Video" : "Upload Video"}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Upload Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>• Use MP4 for best browser support</li>
                <li>• Keep videos under 120 minutes</li>
                <li>• Add thumbnail for better presentation</li>
                <li>• Use clear audio and readable recording</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow border p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Recent Uploads
              </h3>

              {recentUploads.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No recent uploads found.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentUploads.map((video) => (
                    <div
                      key={video.id}
                      className="border-b last:border-b-0 pb-4 last:pb-0"
                    >
                      <h4 className="font-medium text-slate-800">
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {video.category} •{" "}
                        {formatDuration(video.durationSeconds)}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => openVideoDetails(video.id)}
                          className="text-xs bg-slate-700 hover:bg-slate-800 text-white px-3 py-1 rounded-lg"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(video)}
                          className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Details Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-xl font-semibold text-slate-900">
                Video Details
              </h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-500 hover:text-slate-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {selectedVideo.thumbnailUrl && (
                <img
                  src={`http://localhost:8080${selectedVideo.thumbnailUrl}`}
                  alt={selectedVideo.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
              )}

              <h3 className="text-xl font-semibold text-slate-900">
                {selectedVideo.title}
              </h3>
              <p className="text-slate-600">{selectedVideo.description}</p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedVideo.category}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {Math.ceil((selectedVideo.durationSeconds || 0) / 60)} min
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Batch</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedVideo.batch?.name || "N/A"}
                  </p>
                </div>
              </div>

              <video
                controls
                className="w-full rounded-xl"
                src={`http://localhost:8080${selectedVideo.videoUrl}`}
              />
            </div>
          </div>
        </div>
      )}
    </MentorLayout>
  );
}

export default Videos;
