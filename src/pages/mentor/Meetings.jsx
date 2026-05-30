import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import MentorLayout from "../../layouts/MentorLayout";

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meetingLink: "",
    meetingDate: "",
    startTime: "",
    endTime: "",
    batchId: "",
  });

  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const fetchMeetings = async () => {
    try {
      const response = await axiosInstance.get("/mentor/meetings", authHeader);
      setMeetings(response.data);
    } catch (error) {
      console.error("Meetings fetch error:", error);
      toast.error("Failed to load meetings");
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axiosInstance.get("/mentor/batches", authHeader);
      setBatches(response.data);
    } catch (error) {
      console.error("Batches fetch error:", error);
      toast.error("Failed to load batches");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchMeetings(), fetchBatches()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      meetingLink: "",
      meetingDate: "",
      startTime: "",
      endTime: "",
      batchId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(
        "/mentor/meetings",
        {
          ...formData,
          batchId: Number(formData.batchId),
        },
        authHeader,
      );

      toast.success("Meeting scheduled successfully");
      resetForm();
      fetchMeetings();
    } catch (error) {
      console.error("Create meeting error:", error);
      toast.error("Failed to schedule meeting");
    }
  };

  return (
    <MentorLayout title="Meetings">
      {loading ? (
        <div>Loading meetings...</div>
      ) : (
        <div className="space-y-6">
          {/* Schedule Meeting Form */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-slate-800">
                Schedule Meeting
              </h2>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Meeting Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />

                <select
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>

                <textarea
                  name="description"
                  placeholder="Meeting Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 md:col-span-2"
                  required
                />

                <input
                  type="text"
                  name="meetingLink"
                  placeholder="Meeting Link"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 md:col-span-2"
                  required
                />

                <input
                  type="date"
                  name="meetingDate"
                  value={formData.meetingDate}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />

                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />

                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl"
                  >
                    Schedule Meeting
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Meetings Table */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-slate-800">
                Meetings List
              </h2>
            </div>

            {meetings.length === 0 ? (
              <div className="p-6 text-slate-500">No meetings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Start Time</th>
                      <th className="px-6 py-4">End Time</th>
                      <th className="px-6 py-4">Meeting Link</th>
                    </tr>
                  </thead>

                  <tbody>
                    {meetings.map((meeting) => (
                      <tr key={meeting.id} className="border-t">
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {meeting.title}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {meeting.meetingDate}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {meeting.startTime}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {meeting.endTime}
                        </td>

                        <td className="px-6 py-4">
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Join Meeting
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </MentorLayout>
  );
}

export default Meetings;
