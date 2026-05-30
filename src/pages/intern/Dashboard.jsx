import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken, getUser } from "../../utils/auth";
import InternLayout from "../../layouts/InternLayout";
import { FaTasks, FaVideo, FaCalendarAlt } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";

function Dashboard() {
  const user = getUser();
  const userName = user?.name || "Intern";

  const [dashboardData, setDashboardData] = useState({
    totalVideos: 0,
    pendingTasks: 0,
    nextTest: "No test available",
    nextMeeting: "No meeting scheduled",
  });

  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [tests, setTests] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const fetchDashboard = async () => {
    const response = await axiosInstance.get("/intern/dashboard", authHeader);
    setDashboardData(response.data);
  };

  const fetchTasks = async () => {
    const response = await axiosInstance.get("/intern/tasks", authHeader);
    setTasks(response.data);
  };

  const fetchMeetings = async () => {
    const response = await axiosInstance.get("/intern/meetings", authHeader);
    setMeetings(response.data);
  };

  const fetchTests = async () => {
    const response = await axiosInstance.get("/intern/tests", authHeader);
    setTests(response.data);
  };

  const fetchReport = async () => {
    const response = await axiosInstance.get(
      "/intern/progress-report",
      authHeader,
    );
    setReport(response.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchDashboard(),
          fetchTasks(),
          fetchMeetings(),
          fetchTests(),
          fetchReport(),
        ]);
      } catch (error) {
        console.error("Intern dashboard error:", error);
        toast.error("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const recentTasks = useMemo(() => {
    return tasks;
  }, [tasks]);

  const upcomingEvents = useMemo(() => {
    const meetingEvents = meetings.map((meeting) => ({
      type: "meeting",
      title: meeting.title,
      subtitle:
        meeting.meetingDate && meeting.startTime
          ? `${meeting.meetingDate} at ${meeting.startTime}`
          : meeting.meetingDate || "Scheduled",
    }));

    const testEvents = tests.map((test) => ({
      type: "test",
      title: test.title,
      subtitle: test.createdAt
        ? `Created on ${new Date(test.createdAt).toLocaleDateString()}`
        : `${test.durationMinutes || 0} min test`,
    }));

    return [...meetingEvents, ...testEvents].slice(0, 4);
  }, [meetings, tests]);

  const overallProgress = useMemo(() => {
    if (!report) return 0;
    return Math.round(report.overallProgress || 0);
  }, [report]);

  // 🔥 MAIN FIX → correct next test
  const nextTest = useMemo(() => {
    if (!tests.length) return "No test available";

    const pending = tests.filter(
      (t) =>
        !t.attempted &&
        !t.isCompleted &&
        !t.completed &&
        t.status !== "COMPLETED" &&
        !t.score &&
        !t.attemptedAt,
    );

    if (!pending.length) return "All tests completed 🎉";

    const sorted = pending.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    return sorted[0]?.title || "No test available";
  }, [tests]);

  if (loading) {
    return (
      <InternLayout title="Dashboard">
        <div>Loading dashboard...</div>
      </InternLayout>
    );
  }
  return (
    <InternLayout title="Dashboard">
      <div className="h-[calc(100vh-100px)] overflow-hidden flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome Back, {userName}!
          </h1>
          <p className="text-sm text-slate-500">
            Track your training progress and complete daily tasks
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3">
            <FaVideo className="text-blue-500" />
            <div>
              <p className="text-xs text-slate-500">Videos</p>
              <h2 className="text-xl font-bold">{dashboardData.totalVideos}</h2>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3">
            <FaTasks className="text-green-500" />
            <div>
              <p className="text-xs text-slate-500">Tasks</p>
              <h2 className="text-xl font-bold">
                {dashboardData.pendingTasks}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3">
            <MdQuiz className="text-purple-500" />
            <div>
              <p className="text-xs text-slate-500">Next Test</p>
              <h2 className="text-sm font-semibold truncate text-teal-600">
                {nextTest}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3">
            <FaCalendarAlt className="text-orange-500" />
            <div>
              <p className="text-xs text-slate-500">Meeting</p>
              <h2 className="text-sm font-semibold truncate">
                {dashboardData.nextMeeting}
              </h2>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Completion</span>
            <span className="text-teal-600 font-semibold">
              {overallProgress}%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full">
            <div
              className="h-2 bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Recent Tasks */}
          <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaTasks className="text-blue-500" />
              Recent Tasks
            </h2>

            {/* 🔥 FIX: 3 items visible */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              {recentTasks.length === 0 ? (
                <p className="text-sm text-slate-400">No tasks</p>
              ) : (
                recentTasks.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-3 rounded-lg transition"
                  >
                    <span className="text-sm font-medium">
                      {item.task?.title || "Untitled"}
                    </span>

                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Events */}
          <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-orange-500" />
              Events
            </h2>

            {/* 🔥 FIX: 3 items visible */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-slate-400">No events</p>
              ) : (
                upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 hover:bg-slate-100 p-3 rounded-lg transition"
                  >
                    <h3 className="text-sm font-medium">{event.title}</h3>
                    <p className="text-xs text-slate-500">{event.subtitle}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </InternLayout>
  );
}

export default Dashboard;
