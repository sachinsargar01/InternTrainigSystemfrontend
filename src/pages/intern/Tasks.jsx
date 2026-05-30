import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import InternLayout from "../../layouts/InternLayout";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [submissionData, setSubmissionData] = useState({
    submissionText: "",
    fileUrl: "",
  });

  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/intern/tasks", authHeader);
      setTasks(response.data);
    } catch (error) {
      console.error("Intern tasks fetch error:", error);
      toast.error("Session expired. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openSubmitForm = (taskId) => {
    setSelectedTaskId(taskId);
    setSubmissionData({
      submissionText: "",
      fileUrl: "",
    });
  };

  const closeSubmitForm = () => {
    setSelectedTaskId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmissionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(
        `/intern/tasks/${selectedTaskId}/submit`,
        submissionData,
        authHeader,
      );

      toast.success("Task submitted successfully");
      closeSubmitForm();
      fetchTasks();
    } catch (error) {
      console.error("Task submit error:", error);
      toast.error("Failed to submit task");
    }
  };

  return (
    <InternLayout title="Tasks">
      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-slate-800">
                Assigned Tasks
              </h2>
            </div>

            {tasks.length === 0 ? (
              <div className="p-6 text-slate-500">No tasks assigned.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-6 py-4">Task</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {item.task?.title}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.status === "COMPLETED" ||
                              item.status === "REVIEWED"
                                ? "bg-green-100 text-green-700"
                                : item.status === "SUBMITTED"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {item.task?.dueDate}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.task?.priority === "HIGH"
                                ? "bg-red-100 text-red-700"
                                : item.task?.priority === "MEDIUM"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {item.task?.priority}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {item.status === "PENDING" ||
                          item.status === "IN_PROGRESS" ? (
                            <button
                              onClick={() => openSubmitForm(item.task?.id)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm"
                            >
                              Submit
                            </button>
                          ) : (
                            <span className="text-slate-400 text-sm">
                              Already Submitted
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedTaskId && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Submit Task</h2>

                <form onSubmit={handleSubmitTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Submission Text
                    </label>
                    <textarea
                      name="submissionText"
                      rows="4"
                      value={submissionData.submissionText}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Write your submission details"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      File / GitHub URL
                    </label>
                    <input
                      type="text"
                      name="fileUrl"
                      value={submissionData.fileUrl}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeSubmitForm}
                      className="px-4 py-2 rounded-xl border"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl"
                    >
                      Submit Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </InternLayout>
  );
}

export default Tasks;
