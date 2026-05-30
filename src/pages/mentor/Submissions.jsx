import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import MentorLayout from "../../layouts/MentorLayout";

function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [reviewData, setReviewData] = useState({
    marks: "",
    feedback: "",
  });

  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const response = await axiosInstance.get(
        "/mentor/submissions",
        authHeader,
      );
      setSubmissions(response.data);
    } catch (error) {
      console.error("Submissions error:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Open review modal
  const openReview = (submission) => {
    setSelectedSubmission(submission);

    setReviewData({
      marks: submission.marks || "",
      feedback: submission.feedback || "",
    });
  };

  // Close review modal
  const closeReview = () => {
    setSelectedSubmission(null);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit review
  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put(
        `/mentor/submissions/${selectedSubmission.id}/review`,
        reviewData,
        authHeader,
      );

      toast.success("Submission reviewed successfully");

      closeReview();
      fetchSubmissions();
    } catch (error) {
      console.error("Review error full:", error);
      console.error("Status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      toast.error("Failed to review submission");
    }
  };

  return (
    <MentorLayout title="Submissions">
      {loading ? (
        <div>Loading submissions...</div>
      ) : (
        <div className="space-y-6">
          {/* Table */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-slate-800">
                Intern Submissions
              </h2>
            </div>

            {submissions.length === 0 ? (
              <div className="p-6 text-slate-500">No submissions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-6 py-4">Intern</th>
                      <th className="px-6 py-4">Task</th>
                      <th className="px-6 py-4">Submission</th>
                      <th className="px-6 py-4">Submitted Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="border-t">
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {submission.intern?.name}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {submission.task?.title}
                        </td>

                        <td className="px-6 py-4">
                          {submission.fileUrl ? (
                            <a
                              href={submission.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-teal-600 hover:underline"
                            >
                              View Submission
                            </a>
                          ) : (
                            <span className="text-slate-500">
                              {submission.submissionText ||
                                "No submission link"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {submission.submittedAt}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              submission.status === "REVIEWED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {submission.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => openReview(submission)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Review Modal */}
          {selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-6 w-[450px] shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Review Submission
                </h2>

                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      marks
                    </label>
                    <input
                      type="number"
                      name="marks"
                      value={reviewData.marks}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Feedback
                    </label>
                    <textarea
                      name="feedback"
                      rows="4"
                      value={reviewData.feedback}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeReview}
                      className="px-4 py-2 rounded-xl border"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </MentorLayout>
  );
}

export default Submissions;
