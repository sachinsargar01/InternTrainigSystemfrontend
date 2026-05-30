import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import InternLayout from "../../layouts/InternLayout";
import { FaVideo, FaCheckCircle } from "react-icons/fa";
import { FiPlayCircle } from "react-icons/fi";
import { BiTime } from "react-icons/bi";
import { MdOutlineClose } from "react-icons/md";
function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const playerRef = useRef(null);
  const allowedPositionRef = useRef(0);
  const lastSavedSecondRef = useRef(0);

  const fetchVideos = async () => {
    try {
      const response = await axiosInstance.get("/intern/videos", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setVideos(response.data);
    } catch (error) {
      console.error("Intern videos fetch error:", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(videos.map((video) => video.category).filter(Boolean)),
    ];
    return ["All", ...unique];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        selectedCategory === "All" || video.category === selectedCategory;

      const keyword = search.toLowerCase();
      const matchesSearch =
        video.title?.toLowerCase().includes(keyword) ||
        video.description?.toLowerCase().includes(keyword) ||
        video.category?.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, search]);

  const stats = useMemo(() => {
    const totalVideos = videos.length;

    const completed = videos.filter((video) => video.completed).length;

    const inProgress = videos.filter(
      (video) => !video.completed && (video.watchedSeconds || 0) > 0,
    ).length;

    const totalWatchedSeconds = videos.reduce(
      (sum, video) => sum + (video.watchedSeconds || 0),
      0,
    );

    return {
      totalVideos,
      completed,
      inProgress,
      watchHours: (totalWatchedSeconds / 3600).toFixed(1),
    };
  }, [videos]);

  const openVideoPlayer = async (videoId) => {
    try {
      const response = await axiosInstance.get(`/intern/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      console.log("VIDEO DETAILS:", response.data);
      console.log("VIDEO URL:", response.data.videoUrl);

      setSelectedVideo(response.data);
      allowedPositionRef.current = response.data.watchedSeconds || 0;
      lastSavedSecondRef.current = response.data.watchedSeconds || 0;
    } catch (error) {
      console.error("Video details error:", error);
      toast.error("Failed to load video");
    }
  };

  const closeVideoPlayer = () => {
    setSelectedVideo(null);
    allowedPositionRef.current = 0;
    lastSavedSecondRef.current = 0;
  };

  const saveProgress = async (currentTime, duration) => {
    if (!selectedVideo) return;

    try {
      await axiosInstance.post(
        `/intern/videos/${selectedVideo.videoId}/progress`,
        {
          currentTimeSeconds: Math.floor(currentTime),
          durationSeconds: Math.floor(duration),
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
    } catch (error) {
      console.error("Progress save error:", error);
    }
  };

  const handleTimeUpdate = async () => {
    if (!playerRef.current || !selectedVideo) return;

    const currentTime = playerRef.current.currentTime;
    const duration =
      playerRef.current.duration || selectedVideo.durationSeconds || 0;

    if (currentTime > allowedPositionRef.current) {
      allowedPositionRef.current = currentTime;
    }

    const diff = Math.floor(currentTime) - lastSavedSecondRef.current;
    if (diff >= 5) {
      lastSavedSecondRef.current = Math.floor(currentTime);
      await saveProgress(currentTime, duration);

      setSelectedVideo((prev) =>
        prev
          ? {
              ...prev,
              watchedSeconds: Math.floor(currentTime),
              progressPercentage:
                duration > 0
                  ? Math.min(Math.floor((currentTime * 100) / duration), 100)
                  : 0,
            }
          : prev,
      );
    }
  };

  const handleSeeking = () => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.currentTime;

    if (currentTime > allowedPositionRef.current + 2) {
      toast.warning("Skipping is not allowed");
      playerRef.current.currentTime = allowedPositionRef.current;
    }
  };

  const handleLoadedMetadata = () => {
    if (playerRef.current && selectedVideo) {
      playerRef.current.currentTime = selectedVideo.watchedSeconds || 0;
      allowedPositionRef.current = selectedVideo.watchedSeconds || 0;
    }
  };

  const handleEnded = async () => {
    if (!playerRef.current || !selectedVideo) return;

    const duration =
      playerRef.current.duration || selectedVideo.durationSeconds || 0;
    await saveProgress(duration, duration);

    setSelectedVideo((prev) =>
      prev
        ? {
            ...prev,
            watchedSeconds: Math.floor(duration),
            progressPercentage: 100,
            completed: true,
          }
        : prev,
    );

    toast.success("Video completed");
    fetchVideos();
  };

  if (loading) {
    return (
      <InternLayout title="Training Videos">
        <div>Loading videos...</div>
      </InternLayout>
    );
  }

  return (
    // <InternLayout title="Training Videos">
    //   <div className="space-y-6">
    //     <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
    //       <div>
    //         <h1 className="text-2xl font-bold text-slate-900">
    //           Training Videos
    //         </h1>
    //         <p className="text-sm text-slate-500 mt-1">
    //           Watch and learn from our curated training content
    //         </p>
    //       </div>

    //       <div className="w-full xl:w-72">
    //         <input
    //           type="text"
    //           placeholder="Search videos..."
    //           value={search}
    //           onChange={(e) => setSearch(e.target.value)}
    //           className="w-full border rounded-xl px-4 py-3"
    //         />
    //       </div>
    //     </div>

    //     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    //       <div className="bg-white rounded-2xl shadow border p-5">
    //         <p className="text-sm text-slate-500">Total Videos</p>
    //         <h2 className="text-3xl font-bold text-slate-900 mt-2">
    //           {stats.totalVideos}
    //         </h2>
    //       </div>

    //       <div className="bg-white rounded-2xl shadow border p-5">
    //         <p className="text-sm text-slate-500">Completed</p>
    //         <h2 className="text-3xl font-bold text-green-600 mt-2">
    //           {stats.completed}
    //         </h2>
    //       </div>

    //       <div className="bg-white rounded-2xl shadow border p-5">
    //         <p className="text-sm text-slate-500">In Progress</p>
    //         <h2 className="text-3xl font-bold text-orange-600 mt-2">
    //           {stats.inProgress}
    //         </h2>
    //       </div>

    //       <div className="bg-white rounded-2xl shadow border p-5">
    //         <p className="text-sm text-slate-500">Watch Time</p>
    //         <h2 className="text-3xl font-bold text-purple-600 mt-2">
    //           {stats.watchHours} hrs
    //         </h2>
    //       </div>
    //     </div>

    //     <div className="bg-white rounded-2xl shadow border overflow-hidden">
    //       <div className="px-4 py-4 border-b flex flex-wrap gap-3">
    //         {categories.map((category) => (
    //           <button
    //             key={category}
    //             onClick={() => setSelectedCategory(category)}
    //             className={`px-4 py-2 rounded-full text-sm font-medium ${
    //               selectedCategory === category
    //                 ? "bg-teal-600 text-white"
    //                 : "bg-slate-100 text-slate-700"
    //             }`}
    //           >
    //             {category}
    //           </button>
    //         ))}
    //       </div>

    //       <div className="p-5">
    //         {filteredVideos.length === 0 ? (
    //           <div className="text-slate-500">No videos found.</div>
    //         ) : (
    //           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
    //             {filteredVideos.map((video) => (
    //               <div
    //                 key={video.videoId}
    //                 className="border rounded-2xl overflow-hidden bg-white shadow-sm"
    //               >
    //                 <div className="relative h-72 bg-slate-100">
    //                   {video.thumbnailUrl ? (
    //                     <img
    //                       src={video.thumbnailUrl}
    //                       alt={video.title}
    //                       className="w-full h-full object-cover"
    //                     />
    //                   ) : (
    //                     <div className="w-full h-full flex items-center justify-center text-slate-400">
    //                       No Thumbnail
    //                     </div>
    //                   )}

    //                   <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
    //                     {Math.ceil((video.durationSeconds || 0) / 60)} min
    //                   </div>
    //                 </div>

    //                 <div className="w-full bg-slate-200 h-1.5">
    //                   <div
    //                     className="bg-teal-600 h-1.5"
    //                     style={{ width: `${video.progressPercentage || 0}%` }}
    //                   ></div>
    //                 </div>

    //                 <div className="p-4 space-y-3">
    //                   <div className="flex items-start justify-between gap-3">
    //                     <div>
    //                       <h3 className="text-lg font-semibold text-slate-900">
    //                         {video.title}
    //                       </h3>
    //                       <p className="text-sm text-slate-500 mt-1">
    //                         {video.description}
    //                       </p>
    //                     </div>

    //                     <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-600">
    //                       {video.category}
    //                     </span>
    //                   </div>

    //                   <div className="flex items-center justify-between text-sm">
    //                     <p className="text-slate-500">
    //                       Progress:{" "}
    //                       <span className="font-medium text-slate-700">
    //                         {video.progressPercentage || 0}% watched
    //                       </span>
    //                     </p>

    //                     <p
    //                       className={`font-medium ${video.completed ? "text-green-600" : "text-orange-600"}`}
    //                     >
    //                       {video.completed ? "Completed" : "In Progress"}
    //                     </p>
    //                   </div>

    //                   <button
    //                     onClick={() => openVideoPlayer(video.videoId)}
    //                     className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl"
    //                   >
    //                     {video.completed ? "Watch Again" : "Continue Watching"}
    //                   </button>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         )}
    //       </div>
    //     </div>

    //     {selectedVideo && (
    //       <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
    //         <div className="bg-white rounded-2xl w-full max-w-5xl shadow-xl overflow-hidden">
    //           <div className="flex items-center justify-between px-5 py-4 border-b">
    //             <div>
    //               <h2 className="text-xl font-semibold text-slate-900">
    //                 {selectedVideo.title}
    //               </h2>
    //               <p className="text-sm text-slate-500 mt-1">
    //                 {selectedVideo.category}
    //               </p>
    //             </div>

    //             <button
    //               onClick={() => {
    //                 fetchVideos();
    //                 closeVideoPlayer();
    //               }}
    //               className="text-slate-500 hover:text-slate-700 text-xl"
    //             >
    //               ✕
    //             </button>
    //           </div>

    //           <div className="p-5 space-y-4">
    //             <div className="aspect-video bg-black rounded-xl overflow-hidden">
    //               <video
    //                 ref={playerRef}
    //                 controls
    //                 controlsList="nodownload noplaybackrate"
    //                 className="w-full h-full"
    //                 onTimeUpdate={handleTimeUpdate}
    //                 onSeeking={handleSeeking}
    //                 onLoadedMetadata={handleLoadedMetadata}
    //                 onEnded={handleEnded}
    //                 onError={(e) => {
    //                   console.error("VIDEO ERROR:", e);
    //                   console.error("VIDEO SRC:", selectedVideo?.videoUrl);
    //                   toast.error("Video could not be played");
    //                 }}
    //               >
    //                 <source src={selectedVideo.videoUrl} type="video/mp4" />
    //                 Your browser does not support the video tag.
    //               </video>
    //             </div>

    //             <div className="flex justify-between text-sm">
    //               <span className="text-slate-500">
    //                 Watched:{" "}
    //                 {Math.floor((selectedVideo.watchedSeconds || 0) / 60)} min
    //               </span>
    //               <span className="font-medium text-slate-700">
    //                 {selectedVideo.progressPercentage || 0}% completed
    //               </span>
    //             </div>

    //             <div className="w-full bg-slate-200 rounded-full h-2.5">
    //               <div
    //                 className="bg-blue-600 h-2.5 rounded-full"
    //                 style={{
    //                   width: `${selectedVideo.progressPercentage || 0}%`,
    //                 }}
    //               ></div>
    //             </div>

    //             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
    //               Skipping is not allowed. Please watch continuously to complete
    //               progress.
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </InternLayout>

    <InternLayout title="Training Videos">
      <div className="space-y-5 w-full max-w-[1600px] mx-auto scale-[0.98] origin-top">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FaVideo /> Training Videos
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Watch and learn from training content
            </p>
          </div>

          <div className="w-full xl:w-72">
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow border p-3 flex items-center gap-3">
            <FaVideo className="text-blue-500 text-lg" />
            <div>
              <p className="text-[11px] text-slate-500">Total</p>
              <h2 className="text-lg font-bold">{stats.totalVideos}</h2>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-3 flex items-center gap-3">
            <FaCheckCircle className="text-green-600 text-lg" />
            <div>
              <p className="text-[11px] text-slate-500">Completed</p>
              <h2 className="text-lg font-bold text-green-600">
                {stats.completed}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-3 flex items-center gap-3">
            <FiPlayCircle className="text-orange-500 text-lg" />
            <div>
              <p className="text-[11px] text-slate-500">Progress</p>
              <h2 className="text-lg font-bold text-orange-600">
                {stats.inProgress}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-3 flex items-center gap-3">
            <BiTime className="text-purple-600 text-lg" />
            <div>
              <p className="text-[11px] text-slate-500">Watch</p>
              <h2 className="text-lg font-bold text-purple-600">
                {stats.watchHours}h
              </h2>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="px-3 py-2 border-b flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-xs rounded-full ${
                  selectedCategory === category
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="p-3">
            {filteredVideos.length === 0 ? (
              <div className="text-slate-500 text-sm">No videos found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVideos.map((video) => (
                  <div
                    key={video.videoId}
                    className="border rounded-lg bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative h-36 bg-slate-100">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-slate-400">
                          No Thumbnail
                        </div>
                      )}

                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {Math.ceil((video.durationSeconds || 0) / 60)}m
                      </div>
                    </div>

                    <div className="h-1 bg-slate-200">
                      <div
                        className="h-1 bg-teal-600"
                        style={{ width: `${video.progressPercentage || 0}%` }}
                      ></div>
                    </div>

                    <div className="p-2 space-y-2">
                      <h3 className="text-xs font-semibold line-clamp-1">
                        {video.title}
                      </h3>

                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>{video.progressPercentage || 0}%</span>
                        {video.completed ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FiPlayCircle />
                        )}
                      </div>

                      <button
                        onClick={() => openVideoPlayer(video.videoId)}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-1.5 rounded text-xs flex items-center justify-center gap-1"
                      >
                        <FiPlayCircle />
                        {video.completed ? "Watch" : "Continue"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popup */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-3">
            <div className="bg-white rounded-lg w-full max-w-3xl shadow-lg">
              <div className="flex justify-between items-center px-3 py-2 border-b">
                <h2 className="text-xs font-semibold">{selectedVideo.title}</h2>

                <button
                  onClick={() => {
                    fetchVideos();
                    closeVideoPlayer();
                  }}
                  className="text-red-500 text-lg"
                >
                  <MdOutlineClose />
                </button>
              </div>

              <div className="p-3 space-y-2">
                <div className="aspect-video max-h-[350px] bg-black rounded overflow-hidden">
                  <video
                    ref={playerRef}
                    controls
                    className="w-full h-full"
                    onTimeUpdate={handleTimeUpdate}
                    onSeeking={handleSeeking}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                  >
                    <source src={selectedVideo.videoUrl} />
                  </video>
                </div>

                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">
                    {Math.floor((selectedVideo.watchedSeconds || 0) / 60)}m
                  </span>
                  <span className="font-medium">
                    {selectedVideo.progressPercentage || 0}%
                  </span>
                </div>

                <div className="h-2 bg-slate-200 rounded">
                  <div
                    className="h-2 bg-blue-600 rounded"
                    style={{
                      width: `${selectedVideo.progressPercentage || 0}%`,
                    }}
                  ></div>
                </div>

                <div className="text-[11px] text-yellow-700 bg-yellow-50 border border-yellow-200 p-2 rounded">
                  Skipping is not allowed
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InternLayout>
  );
}

export default Videos;

// import { useEffect, useMemo, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import axiosInstance from "../../api/axiosInstance";
// import { getToken } from "../../utils/auth";
// import InternLayout from "../../layouts/InternLayout";

// // Icons
// import { FiPlayCircle } from "react-icons/fi";
// import { FaCheckCircle } from "react-icons/fa";
// import { MdAccessTime } from "react-icons/md";
// import { FaVideo } from "react-icons/fa";
// import { AiOutlineCheckCircle } from "react-icons/ai";
// import { BiTime } from "react-icons/bi";

// function Videos() {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [search, setSearch] = useState("");
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   const playerRef = useRef(null);
//   const allowedPositionRef = useRef(0);
//   const lastSavedSecondRef = useRef(0);

//   const fetchVideos = async () => {
//     try {
//       const response = await axiosInstance.get("/intern/videos", {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       setVideos(response.data);
//     } catch (error) {
//       toast.error("Failed to load videos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   const filteredVideos = useMemo(() => {
//     return videos.filter((video) => {
//       const keyword = search.toLowerCase();
//       return (
//         video.title?.toLowerCase().includes(keyword) ||
//         video.description?.toLowerCase().includes(keyword)
//       );
//     });
//   }, [videos, search]);

//   const stats = useMemo(() => {
//     const totalVideos = videos.length;
//     const completed = videos.filter((v) => v.completed).length;
//     const inProgress = videos.filter(
//       (v) => !v.completed && (v.watchedSeconds || 0) > 0
//     ).length;

//     const totalWatchedSeconds = videos.reduce(
//       (sum, v) => sum + (v.watchedSeconds || 0),
//       0
//     );

//     return {
//       totalVideos,
//       completed,
//       inProgress,
//       watchHours: (totalWatchedSeconds / 3600).toFixed(1),
//     };
//   }, [videos]);

//   const openVideoPlayer = async (videoId) => {
//     const res = await axiosInstance.get(`/intern/videos/${videoId}`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });
//     setSelectedVideo(res.data);
//   };

//   const closeVideoPlayer = () => setSelectedVideo(null);

//   const handleTimeUpdate = () => {};
//   const handleSeeking = () => {};
//   const handleLoadedMetadata = () => {};
//   const handleEnded = () => {};

//   if (loading) {
//     return (
//       <InternLayout title="Training Videos">
//         <div>Loading...</div>
//       </InternLayout>
//     );
//   }

//   return (
//     <InternLayout title="Training Videos">
//       <div className="space-y-6 max-w-[1400px] mx-auto scale-[0.95] origin-top">

//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Training Videos</h1>

//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border px-4 py-2 rounded-lg text-sm"
//           />
//         </div>

//         {/* Stats with Icons */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

//           <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
//             <FaVideo className="text-blue-500 text-xl" />
//             <div>
//               <p className="text-xs text-slate-500">Total</p>
//               <h2 className="font-bold">{stats.totalVideos}</h2>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
//             <AiOutlineCheckCircle className="text-green-600 text-xl" />
//             <div>
//               <p className="text-xs text-slate-500">Completed</p>
//               <h2 className="font-bold">{stats.completed}</h2>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
//             <FiPlayCircle className="text-orange-500 text-xl" />
//             <div>
//               <p className="text-xs text-slate-500">In Progress</p>
//               <h2 className="font-bold">{stats.inProgress}</h2>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
//             <BiTime className="text-purple-600 text-xl" />
//             <div>
//               <p className="text-xs text-slate-500">Watch Time</p>
//               <h2 className="font-bold">{stats.watchHours} hrs</h2>
//             </div>
//           </div>

//         </div>

//         {/* Videos Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {filteredVideos.map((video) => (
//             <div
//               key={video.videoId}
//               className="border rounded-xl bg-white shadow hover:shadow-md transition"
//             >
//               <div className="h-40 bg-slate-100">
//                 <img
//                   src={video.thumbnailUrl}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               <div className="p-3 space-y-2">
//                 <h3 className="font-semibold text-sm line-clamp-1">
//                   {video.title}
//                 </h3>

//                 <div className="flex justify-between text-xs">
//                   <span className="flex items-center gap-1">
//                     <MdAccessTime />
//                     {video.progressPercentage || 0}%
//                   </span>

//                   <span>
//                     {video.completed ? <FaCheckCircle /> : <FiPlayCircle />}
//                   </span>
//                 </div>

//                 <button
//                   onClick={() => openVideoPlayer(video.videoId)}
//                   className="w-full bg-teal-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
//                 >
//                   <FiPlayCircle /> Play
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Popup */}
//         {selectedVideo && (
//           <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
//             <div className="bg-white w-full max-w-3xl rounded-xl">

//               <div className="flex justify-between p-3 border-b">
//                 <h2 className="text-sm font-semibold">
//                   {selectedVideo.title}
//                 </h2>

//                 <button
//                   onClick={closeVideoPlayer}
//                   className="text-red-500 font-bold"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="p-4">
//                 <div className="aspect-video max-h-[400px]">
//                   <video
//                     ref={playerRef}
//                     controls
//                     className="w-full h-full"
//                   >
//                     <source src={selectedVideo.videoUrl} />
//                   </video>
//                 </div>
//               </div>

//             </div>
//           </div>
//         )}
//       </div>
//     </InternLayout>
//   );
// }

// export default Videos;
