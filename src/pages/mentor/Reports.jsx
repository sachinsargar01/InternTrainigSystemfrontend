import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import MentorLayout from "../../layouts/MentorLayout";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import { FiUsers, FiTrendingUp } from "react-icons/fi";

import { FaTasks } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { FaVideo } from "react-icons/fa";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const fetchReports = async () => {
    try {
      const response = await axiosInstance.get("/mentor/reports", authHeader);
      setReports(response.data);
    } catch (error) {
      console.error("Reports fetch error:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const keyword = search.toLowerCase();
      return (
        item.internName?.toLowerCase().includes(keyword) ||
        item.internEmail?.toLowerCase().includes(keyword)
      );
    });
  }, [reports, search]);

  const summary = useMemo(() => {
    const totalInterns = reports.length;

    const avgProgress =
      totalInterns > 0
        ? (
            reports.reduce(
              (sum, item) => sum + (item.overallProgress || 0),
              0,
            ) / totalInterns
          ).toFixed(1)
        : 0;

    const totalTasksDone = reports.reduce(
      (sum, item) => sum + (item.tasksDone || 0),
      0,
    );

    const totalTestsPassed = reports.reduce(
      (sum, item) => sum + (item.testsPassed || 0),
      0,
    );

    const totalVideosCompleted = reports.reduce(
      (sum, item) => sum + (item.videosCompleted || 0),
      0,
    );

    return {
      totalInterns,
      avgProgress,
      totalTasksDone,
      totalTestsPassed,
      totalVideosCompleted,
    };
  }, [reports]);

  return (
    // <MentorLayout title="Reports">
    //   {loading ? (
    //     <div>Loading reports...</div>
    //   ) : (
    //     <div className="space-y-6">
    //       {/* Top Summary Cards */}
    //       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
    //         <div className="bg-white rounded-2xl shadow p-6">
    //           <h2 className="text-sm font-medium text-slate-500">
    //             Total Interns
    //           </h2>
    //           <p className="text-3xl font-bold text-green-600 mt-2">
    //             {summary.totalInterns}
    //           </p>
    //         </div>

    //         <div className="bg-white rounded-2xl shadow p-6">
    //           <h2 className="text-sm font-medium text-slate-500">
    //             Avg Progress
    //           </h2>
    //           <p className="text-3xl font-bold text-blue-600 mt-2">
    //             {summary.avgProgress}%
    //           </p>
    //         </div>

    //         <div className="bg-white rounded-2xl shadow p-6">
    //           <h2 className="text-sm font-medium text-slate-500">Tasks Done</h2>
    //           <p className="text-3xl font-bold text-orange-600 mt-2">
    //             {summary.totalTasksDone}
    //           </p>
    //         </div>

    //         <div className="bg-white rounded-2xl shadow p-6">
    //           <h2 className="text-sm font-medium text-slate-500">
    //             Videos Completed
    //           </h2>
    //           <p className="text-3xl font-bold text-purple-600 mt-2">
    //             {summary.totalVideosCompleted}
    //           </p>
    //         </div>

    //         <div className="bg-white rounded-2xl shadow p-6">
    //           <h2 className="text-sm font-medium text-slate-500">
    //             Tests Passed
    //           </h2>
    //           <p className="text-3xl font-bold text-pink-600 mt-2">
    //             {summary.totalTestsPassed}
    //           </p>
    //         </div>
    //       </div>

    //       {/* Search + Table */}
    //       <div className="bg-white rounded-2xl shadow overflow-hidden">
    //         <div className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    //           <h2 className="text-xl font-semibold text-slate-800">
    //             Intern Performance Reports
    //           </h2>

    //           <input
    //             type="text"
    //             placeholder="Search by name or email"
    //             value={search}
    //             onChange={(e) => setSearch(e.target.value)}
    //             className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 w-full md:w-72"
    //           />
    //         </div>

    //         {filteredReports.length === 0 ? (
    //           <div className="p-6 text-slate-500">No reports found.</div>
    //         ) : (
    //           <div className="overflow-x-auto">
    //             <table className="w-full text-left">
    //               <thead className="bg-slate-100 text-slate-700">
    //                 <tr>
    //                   <th className="px-6 py-4">Intern</th>
    //                   <th className="px-6 py-4">Email</th>
    //                   <th className="px-6 py-4">Tasks</th>
    //                   <th className="px-6 py-4">Videos</th>
    //                   <th className="px-6 py-4">Tests</th>
    //                   <th className="px-6 py-4">Progress</th>
    //                 </tr>
    //               </thead>

    //               <tbody>
    //                 {filteredReports.map((report) => (
    //                   <tr key={report.internId} className="border-t">
    //                     <td className="px-6 py-4 font-medium text-slate-800">
    //                       {report.internName}
    //                     </td>

    //                     <td className="px-6 py-4 text-slate-600">
    //                       {report.internEmail}
    //                     </td>

    //                     <td className="px-6 py-4 text-slate-600">
    //                       {report.tasksDone} / {report.totalTasks}
    //                     </td>

    //                     <td className="px-6 py-4 text-slate-600">
    //                       {report.videosCompleted} / {report.totalVideos}
    //                     </td>

    //                     <td className="px-6 py-4 text-slate-600">
    //                       {report.testsPassed} / {report.totalTests}
    //                     </td>

    //                     <td className="px-6 py-4">
    //                       <div className="w-40">
    //                         <div className="flex justify-between text-sm mb-1">
    //                           <span className="text-slate-600">Progress</span>
    //                           <span className="font-medium text-slate-800">
    //                             {report.overallProgress?.toFixed
    //                               ? report.overallProgress.toFixed(1)
    //                               : report.overallProgress}
    //                             %
    //                           </span>
    //                         </div>

    //                         <div className="w-full bg-slate-200 rounded-full h-2.5">
    //                           <div
    //                             className="bg-green-600 h-2.5 rounded-full"
    //                             style={{
    //                               width: `${report.overallProgress || 0}%`,
    //                             }}
    //                           ></div>
    //                         </div>
    //                       </div>
    //                     </td>
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   )}
    // </MentorLayout>

    <MentorLayout title="Reports">
      {loading ? (
        <div className="text-center py-10 animate-pulse text-slate-500">
          Loading reports...
        </div>
      ) : (
        <div className="space-y-6 max-w-[1400px] mx-auto">
          {/* 🔥 TOP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow hover:scale-105 transition">
              <FiUsers className="text-3xl mb-2" />
              <p className="text-sm opacity-80">Total Interns</p>
              <h2 className="text-3xl font-bold">{summary.totalInterns}</h2>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow hover:scale-105 transition">
              <FiTrendingUp className="text-3xl mb-2" />
              <p className="text-sm opacity-80">Avg Progress</p>
              <h2 className="text-3xl font-bold">{summary.avgProgress}%</h2>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white p-6 rounded-2xl shadow hover:scale-105 transition">
              <FaTasks className="text-3xl mb-2" />
              <p className="text-sm opacity-80">Tasks Done</p>
              <h2 className="text-3xl font-bold">{summary.totalTasksDone}</h2>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-2xl shadow hover:scale-105 transition">
              <FaVideo className="text-3xl mb-2" />
              <p className="text-sm opacity-80">Videos</p>
              <h2 className="text-3xl font-bold">
                {summary.totalVideosCompleted}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-700 text-white p-6 rounded-2xl shadow hover:scale-105 transition">
              <MdQuiz className="text-3xl mb-2" />
              <p className="text-sm opacity-80">Tests</p>
              <h2 className="text-3xl font-bold">{summary.totalTestsPassed}</h2>
            </div>
          </div>

          {/* 🔥 CHART */}
          {/* 🔥 UNIQUE PERFORMANCE SECTION */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 🔥 TOP PERFORMERS */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">🚀 Top Performers</h2>

              <div className="space-y-4">
                {[...reports]
                  .sort(
                    (a, b) =>
                      (b.overallProgress || 0) - (a.overallProgress || 0),
                  )
                  .slice(0, 3)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.internName}</p>
                        <p className="text-xs opacity-70">{item.internEmail}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {item.overallProgress?.toFixed(1)}%
                        </p>
                        <p className="text-xs opacity-70">Rank #{index + 1}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 🔥 PROGRESS DISTRIBUTION */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                📊 Progress Distribution
              </h2>

              <div className="space-y-4 text-sm">
                {[
                  { label: "0-25%", color: "bg-red-500", range: [0, 25] },
                  { label: "26-50%", color: "bg-yellow-500", range: [26, 50] },
                  { label: "51-75%", color: "bg-blue-500", range: [51, 75] },
                  { label: "76-100%", color: "bg-green-500", range: [76, 100] },
                ].map((bucket, i) => {
                  const count = reports.filter(
                    (r) =>
                      (r.overallProgress || 0) >= bucket.range[0] &&
                      (r.overallProgress || 0) <= bucket.range[1],
                  ).length;

                  const percent = reports.length
                    ? (count / reports.length) * 100
                    : 0;

                  return (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span>{bucket.label}</span>
                        <span>{count} interns</span>
                      </div>

                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`${bucket.color} h-2 transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🔥 QUICK INSIGHTS */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">⚡ Quick Insights</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>🔥 Highest Progress</span>
                  <span className="font-semibold text-green-600">
                    {Math.max(
                      ...reports.map((r) => r.overallProgress || 0),
                    ).toFixed(1)}
                    %
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>🐢 Lowest Progress</span>
                  <span className="font-semibold text-red-500">
                    {Math.min(
                      ...reports.map((r) => r.overallProgress || 0),
                    ).toFixed(1)}
                    %
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>📈 Avg Progress</span>
                  <span className="font-semibold text-blue-600">
                    {summary.avgProgress}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>💪 Active Interns</span>
                  <span className="font-semibold text-purple-600">
                    {
                      reports.filter((r) => (r.overallProgress || 0) > 50)
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 TABLE */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex flex-col md:flex-row justify-between gap-3">
              <h2 className="text-xl font-semibold">Intern Reports</h2>

              <input
                type="text"
                placeholder="Search intern..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none w-full md:w-72"
              />
            </div>

            {filteredReports.length === 0 ? (
              <div className="p-6 text-slate-500">No reports found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-6 py-4">Intern</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Tasks</th>
                      <th className="px-6 py-4">Videos</th>
                      <th className="px-6 py-4">Tests</th>
                      <th className="px-6 py-4">Progress</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredReports.map((report) => (
                      <tr
                        key={report.internId}
                        className="border-t hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-4 font-medium">
                          {report.internName}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {report.internEmail}
                        </td>

                        <td className="px-6 py-4">
                          {report.tasksDone}/{report.totalTasks}
                        </td>

                        <td className="px-6 py-4">
                          {report.videosCompleted}/{report.totalVideos}
                        </td>

                        <td className="px-6 py-4">
                          {report.testsPassed}/{report.totalTests}
                        </td>

                        <td className="px-6 py-4">
                          <div className="w-40">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span className="font-semibold">
                                {report.overallProgress?.toFixed
                                  ? report.overallProgress.toFixed(1)
                                  : report.overallProgress}
                                %
                              </span>
                            </div>

                            <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-green-500 h-2 transition-all duration-500"
                                style={{
                                  width: `${report.overallProgress || 0}%`,
                                }}
                              />
                            </div>
                          </div>
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

export default Reports;
