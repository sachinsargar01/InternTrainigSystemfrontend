import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import MentorLayout from "../../layouts/MentorLayout";
import { FiUsers, FiCheckCircle } from "react-icons/fi";
import { MdPendingActions } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiUpload, FiPlusCircle } from "react-icons/fi";
import { FaCalendarPlus } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalInterns: 0,
    tasksAssigned: 0,
    pendingSubmissions: 0,
    upcomingMeetings: 0,
  });

  const [submissions, setSubmissions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const fetchDashboard = async () => {
    const response = await axiosInstance.get("/mentor/dashboard", authHeader);
    setDashboardData(response.data);
  };

  const fetchSubmissions = async () => {
    const response = await axiosInstance.get("/mentor/submissions", authHeader);
    setSubmissions(response.data);
  };

  const fetchReports = async () => {
    const response = await axiosInstance.get("/mentor/reports", authHeader);
    setReports(response.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchDashboard(),
          fetchSubmissions(),
          fetchReports(),
        ]);
      } catch (error) {
        console.error("Mentor dashboard error:", error);
        toast.error("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const recentSubmissions = useMemo(() => {
    return [...submissions].slice(0, 5);
  }, [submissions]);

  const performanceStats = useMemo(() => {
    if (!reports.length) {
      return {
        avgCompletionRate: 0,
        avgTestScore: 0,
      };
    }

    const avgCompletionRate =
      reports.reduce((sum, item) => sum + (item.overallProgress || 0), 0) /
      reports.length;

    const avgTestScore =
      reports.reduce((sum, item) => {
        const totalTests = item.totalTests || 0;
        const testsPassed = item.testsPassed || 0;
        const score = totalTests > 0 ? (testsPassed / totalTests) * 100 : 0;
        return sum + score;
      }, 0) / reports.length;

    return {
      avgCompletionRate: Math.round(avgCompletionRate),
      avgTestScore: Math.round(avgTestScore),
    };
  }, [reports]);

  if (loading) {
    return (
      <MentorLayout title="Dashboard">
        <div>Loading dashboard...</div>
      </MentorLayout>
    );
  }

  return (
    // <MentorLayout title="Mentor Dashboard">
    //   <div className="space-y-6">
    //     {/* Heading */}
    //     <div>
    //       <h1 className="text-3xl font-bold text-slate-900">
    //         Mentor Dashboard
    //       </h1>
    //       <p className="text-slate-500 mt-1">
    //         Manage interns, tasks, and track progress
    //       </p>
    //     </div>

    //     {/* Top Cards */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    //       <div className="bg-white rounded-2xl shadow-sm border p-6">
    //         <div className="flex items-start gap-4">
    //           <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg">
    //             👥
    //           </div>
    //           <div>
    //             <p className="text-sm text-slate-500">Total Interns</p>
    //             <h2 className="text-3xl font-bold text-slate-900 mt-1">
    //               {dashboardData.totalInterns}
    //             </h2>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-white rounded-2xl shadow-sm border p-6">
    //         <div className="flex items-start gap-4">
    //           <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-green-600 text-lg">
    //             ✅
    //           </div>
    //           <div>
    //             <p className="text-sm text-slate-500">Tasks Assigned</p>
    //             <h2 className="text-3xl font-bold text-slate-900 mt-1">
    //               {dashboardData.tasksAssigned}
    //             </h2>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-white rounded-2xl shadow-sm border p-6">
    //         <div className="flex items-start gap-4">
    //           <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 text-lg">
    //             📩
    //           </div>
    //           <div>
    //             <p className="text-sm text-slate-500">Pending Submissions</p>
    //             <h2 className="text-3xl font-bold text-slate-900 mt-1">
    //               {dashboardData.pendingSubmissions}
    //             </h2>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-white rounded-2xl shadow-sm border p-6">
    //         <div className="flex items-start gap-4">
    //           <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-lg">
    //             📅
    //           </div>
    //           <div>
    //             <p className="text-sm text-slate-500">Upcoming Meetings</p>
    //             <h2 className="text-3xl font-bold text-slate-900 mt-1">
    //               {dashboardData.upcomingMeetings}
    //             </h2>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Recent Submissions */}
    //     <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
    //       <div className="px-6 py-5 border-b">
    //         <h2 className="text-2xl font-semibold text-slate-900">
    //           Recent Submissions
    //         </h2>
    //       </div>

    //       {recentSubmissions.length === 0 ? (
    //         <div className="p-6 text-slate-500">No submissions found.</div>
    //       ) : (
    //         <div className="overflow-x-auto">
    //           <table className="w-full text-left">
    //             <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
    //               <tr>
    //                 <th className="px-6 py-4">Intern Name</th>
    //                 <th className="px-6 py-4">Task</th>
    //                 <th className="px-6 py-4">Date</th>
    //                 <th className="px-6 py-4">Status</th>
    //                 <th className="px-6 py-4">Action</th>
    //               </tr>
    //             </thead>

    //             <tbody>
    //               {recentSubmissions.map((submission) => (
    //                 <tr key={submission.id} className="border-t">
    //                   <td className="px-6 py-4 font-medium text-slate-800">
    //                     {submission.intern?.name || "N/A"}
    //                   </td>

    //                   <td className="px-6 py-4 text-slate-700">
    //                     {submission.task?.title || "N/A"}
    //                   </td>

    //                   <td className="px-6 py-4 text-slate-600">
    //                     {submission.submittedAt
    //                       ? new Date(
    //                           submission.submittedAt,
    //                         ).toLocaleDateString()
    //                       : "N/A"}
    //                   </td>

    //                   <td className="px-6 py-4">
    //                     <span
    //                       className={`px-3 py-1 rounded-full text-xs font-medium ${
    //                         submission.status === "REVIEWED"
    //                           ? "bg-green-100 text-green-700"
    //                           : "bg-orange-100 text-orange-700"
    //                       }`}
    //                     >
    //                       {submission.status === "REVIEWED"
    //                         ? "Reviewed"
    //                         : "Pending"}
    //                     </span>
    //                   </td>

    //                   <td className="px-6 py-4">
    //                     <button
    //                       onClick={() => navigate("/mentor/submissions")}
    //                       className="text-blue-600 hover:text-blue-700 font-medium text-sm"
    //                     >
    //                       Review
    //                     </button>
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>
    //         </div>
    //       )}
    //     </div>

    //     {/* Bottom Grid */}
    //     <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
    //       {/* Quick Actions */}
    //       <div className="bg-white rounded-2xl shadow-sm border p-6">
    //         <h2 className="text-2xl font-semibold text-slate-900 mb-5">
    //           Quick Actions
    //         </h2>

    //         <div className="space-y-3">
    //           <button
    //             onClick={() => navigate("/mentor/videos")}
    //             className="w-full text-left px-5 py-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-medium"
    //           >
    //             ⬆ Upload Training Video
    //           </button>

    //           <button
    //             onClick={() => navigate("/mentor/tasks")}
    //             className="w-full text-left px-5 py-4 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition font-medium"
    //           >
    //             ⊕ Create New Task
    //           </button>

    //           <button
    //             onClick={() => navigate("/mentor/meetings")}
    //             className="w-full text-left px-5 py-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition font-medium"
    //           >
    //             📅 Schedule Meeting
    //           </button>
    //         </div>
    //       </div>

    //       {/* Intern Performance */}
    //       <div className="bg-white rounded-2xl shadow-sm border p-6">
    //         <h2 className="text-2xl font-semibold text-slate-900 mb-5">
    //           Intern Performance
    //         </h2>

    //         <div className="space-y-6">
    //           <div>
    //             <div className="flex justify-between text-sm mb-2">
    //               <span className="text-slate-600">
    //                 Average Completion Rate
    //               </span>
    //               <span className="font-semibold text-slate-800">
    //                 {performanceStats.avgCompletionRate}%
    //               </span>
    //             </div>

    //             <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
    //               <div
    //                 className="h-3 bg-green-600 rounded-full"
    //                 style={{ width: `${performanceStats.avgCompletionRate}%` }}
    //               ></div>
    //             </div>
    //           </div>

    //           <div>
    //             <div className="flex justify-between text-sm mb-2">
    //               <span className="text-slate-600">Average Test Score</span>
    //               <span className="font-semibold text-slate-800">
    //                 {performanceStats.avgTestScore}%
    //               </span>
    //             </div>

    //             <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
    //               <div
    //                 className="h-3 bg-blue-600 rounded-full"
    //                 style={{ width: `${performanceStats.avgTestScore}%` }}
    //               ></div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </MentorLayout>

    <MentorLayout title="Mentor Dashboard">
      <div className="space-y-6">
        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Mentor Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Manage interns, tasks, and track progress
          </p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg">
                <FiUsers />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Interns</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">
                  {dashboardData.totalInterns}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-green-600 text-lg">
                <FiCheckCircle />
              </div>
              <div>
                <p className="text-sm text-slate-500">Tasks Assigned</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">
                  {dashboardData.tasksAssigned}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 text-lg">
                <MdPendingActions />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending Submissions</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">
                  {dashboardData.pendingSubmissions}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-lg">
                <FaRegCalendarAlt />
              </div>
              <div>
                <p className="text-sm text-slate-500">Upcoming Meetings</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">
                  {dashboardData.upcomingMeetings}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-5 border-b">
            <h2 className="text-2xl font-semibold text-slate-900">
              Recent Submissions
            </h2>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="p-6 text-slate-500">No submissions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Intern Name</th>
                    <th className="px-6 py-4">Task</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {recentSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-t">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {submission.intern?.name || "N/A"}
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {submission.task?.title || "N/A"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {submission.submittedAt
                          ? new Date(
                              submission.submittedAt,
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            submission.status === "REVIEWED"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {submission.status === "REVIEWED"
                            ? "Reviewed"
                            : "Pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate("/mentor/submissions")}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
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

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-5">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/mentor/videos")}
                className="w-full text-left px-5 py-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-medium flex items-center gap-2"
              >
                <FiUpload /> Upload Training Video
              </button>

              <button
                onClick={() => navigate("/mentor/tasks")}
                className="w-full text-left px-5 py-4 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition font-medium flex items-center gap-2"
              >
                <FiPlusCircle /> Create New Task
              </button>

              <button
                onClick={() => navigate("/mentor/meetings")}
                className="w-full text-left px-5 py-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition font-medium flex items-center gap-2"
              >
                <FaCalendarPlus /> Schedule Meeting
              </button>
            </div>
          </div>

          {/* Intern Performance (NO CHANGE) */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-5">
              Intern Performance
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">
                    Average Completion Rate
                  </span>
                  <span className="font-semibold text-slate-800">
                    {performanceStats.avgCompletionRate}%
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-green-600 rounded-full"
                    style={{ width: `${performanceStats.avgCompletionRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Average Test Score</span>
                  <span className="font-semibold text-slate-800">
                    {performanceStats.avgTestScore}%
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-blue-600 rounded-full"
                    style={{ width: `${performanceStats.avgTestScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MentorLayout>
  );
}

export default Dashboard;
