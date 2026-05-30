import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import InternLayout from "../../layouts/InternLayout";

import {
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import { FaVideo, FaTasks } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";

function ProgressReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const fetchReport = async () => {
    try {
      const response = await axiosInstance.get(
        "/intern/progress-report",
        authHeader,
      );
      setReport(response.data);
    } catch (error) {
      console.error("Progress report fetch error:", error);
      toast.error("Session expired. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <InternLayout title="Progress Report">
      {loading ? (
        <div>Loading progress report...</div>
      ) : !report ? (
        <div>No report found.</div>
      ) : (
        <div className="space-y-6 max-w-[1400px] mx-auto scale-[0.95] origin-top">
          {/* TOP STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
              <FiBarChart2 className="text-purple-600 text-2xl" />
              <div>
                <h2 className="text-xs text-slate-500">Total Score</h2>
                <p className="text-2xl font-bold text-purple-600">
                  {report.totalScore?.toFixed
                    ? report.totalScore.toFixed(1)
                    : report.totalScore}
                  %
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
              <FaTasks className="text-blue-600 text-2xl" />
              <div>
                <h2 className="text-xs text-slate-500">Tasks Done</h2>
                <p className="text-2xl font-bold text-blue-600">
                  {report.tasksDone} / {report.totalTasks}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
              <FiClock className="text-green-600 text-2xl" />
              <div>
                <h2 className="text-xs text-slate-500">Training Time</h2>
                <p className="text-2xl font-bold text-green-600">
                  {report.trainingTime}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
              <FiTrendingUp className="text-pink-600 text-2xl" />
              <div>
                <h2 className="text-xs text-slate-500">Overall Progress</h2>
                <p className="text-2xl font-bold text-pink-600">
                  {report.overallProgress?.toFixed
                    ? report.overallProgress.toFixed(1)
                    : report.overallProgress}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* LOWER SECTION */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* PROGRESS */}
            <div className="bg-white rounded-2xl shadow p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FiCheckCircle /> Progress Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center gap-2">
                      <FaVideo /> Videos
                    </span>
                    <span>
                      {report.videosCompleted} / {report.totalVideos}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${
                          report.totalVideos
                            ? (report.videosCompleted / report.totalVideos) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center gap-2">
                      <MdQuiz /> Tests
                    </span>
                    <span>
                      {report.testsPassed} / {report.totalTests}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          report.totalTests
                            ? (report.testsPassed / report.totalTests) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center gap-2">
                      <BsCalendarEvent /> Meetings
                    </span>
                    <span>
                      {report.meetingsAttended} / {report.totalMeetings}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          report.totalMeetings
                            ? (report.meetingsAttended / report.totalMeetings) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT TESTS */}
            <div className="bg-white rounded-2xl shadow p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <MdQuiz /> Recent Test Results
              </h2>

              {report.recentTests?.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No recent test results.
                </p>
              ) : (
                <div className="space-y-3">
                  {report.recentTests.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 flex items-center justify-between hover:bg-slate-50 transition"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-slate-800">
                          {item.testName}
                        </h3>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold">{item.score}%</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            item.status === "Passed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </InternLayout>
  );
}

export default ProgressReport;
