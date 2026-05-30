import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

import {
  FiUsers,
  FiUserCheck,
  FiLayers,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalBatches: 0,
    totalMentors: 0,
    totalInterns: 0,
    activeBatches: 0,
  });

  const [upcomingBatches, setUpcomingBatches] = useState([]);
  const [recentMentors, setRecentMentors] = useState([]);
  const [recentInterns, setRecentInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, batchesRes, mentorsRes, internsRes] =
          await Promise.all([
            axiosInstance.get("/admin/dashboard", authHeader),
            axiosInstance.get("/admin/batches", authHeader),
            axiosInstance.get("/admin/mentors", authHeader),
            axiosInstance.get("/admin/interns", authHeader),
          ]);

        setDashboardData(dashboardRes.data);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sortedBatches = [...batchesRes.data]
          .filter((batch) => {
            const batchStart = new Date(batch.startDate);
            batchStart.setHours(0, 0, 0, 0);
            return batch.status === "UPCOMING" && batchStart >= today;
          })
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 5);

        setUpcomingBatches(sortedBatches);

        const latestMentors = [...mentorsRes.data].slice(-5).reverse();
        setRecentMentors(latestMentors);

        const latestInterns = [...internsRes.data].slice(-5).reverse();
        setRecentInterns(latestInterns);
      } catch (error) {
        console.error("Admin dashboard error:", error);
        toast.error("Session Has Expired please Login Return");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="text-slate-500">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-5 flex items-center justify-between shadow-sm hover:scale-[1.02] transition">
            <div>
              <p className="text-sm opacity-90">Total Batches</p>
              <h2 className="text-2xl font-bold">
                {dashboardData.totalBatches}
              </h2>
            </div>
            <FiLayers size={30} />
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-5 flex items-center justify-between shadow-sm hover:scale-[1.02] transition">
            <div>
              <p className="text-sm opacity-90">Total Mentors</p>
              <h2 className="text-2xl font-bold">
                {dashboardData.totalMentors}
              </h2>
            </div>
            <FiUserCheck size={30} />
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-5 flex items-center justify-between shadow-sm hover:scale-[1.02] transition">
            <div>
              <p className="text-sm opacity-90">Total Interns</p>
              <h2 className="text-2xl font-bold">
                {dashboardData.totalInterns}
              </h2>
            </div>
            <FiUsers size={30} />
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-5 flex items-center justify-between shadow-sm hover:scale-[1.02] transition">
            <div>
              <p className="text-sm opacity-90">Active Batches</p>
              <h2 className="text-2xl font-bold">
                {dashboardData.activeBatches}
              </h2>
            </div>
            <FiCalendar size={30} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => navigate("/admin/batches")}
              className="cursor-pointer border rounded-xl p-4 flex items-center justify-between hover:bg-blue-50 transition"
            >
              <div className="flex items-center gap-3">
                <FiLayers className="text-blue-600 text-xl" />
                <span className="font-medium text-slate-700">
                  Manage Batches
                </span>
              </div>
              <FiArrowRight />
            </div>

            <div
              onClick={() => navigate("/admin/mentors")}
              className="cursor-pointer border rounded-xl p-4 flex items-center justify-between hover:bg-green-50 transition"
            >
              <div className="flex items-center gap-3">
                <FiUserCheck className="text-green-600 text-xl" />
                <span className="font-medium text-slate-700">
                  Manage Mentors
                </span>
              </div>
              <FiArrowRight />
            </div>

            <div
              onClick={() => navigate("/admin/interns")}
              className="cursor-pointer border rounded-xl p-4 flex items-center justify-between hover:bg-purple-50 transition"
            >
              <div className="flex items-center gap-3">
                <FiUsers className="text-purple-600 text-xl" />
                <span className="font-medium text-slate-700">
                  Manage Interns
                </span>
              </div>
              <FiArrowRight />
            </div>
          </div>
        </div>

        {/* Lower Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Upcoming Batches */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FiCalendar /> Upcoming Batches
            </h2>

            {upcomingBatches.length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming batches</p>
            ) : (
              <div className="space-y-3">
                {upcomingBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="border rounded-lg p-3 bg-slate-50"
                  >
                    <h3 className="font-medium text-slate-800 text-sm">
                      {batch.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Start: {batch.startDate}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      {batch.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Mentors */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Mentors
            </h2>

            {recentMentors.length === 0 ? (
              <p className="text-sm text-slate-500">No mentors found</p>
            ) : (
              <div className="space-y-3">
                {recentMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="border rounded-lg p-3 bg-slate-50"
                  >
                    <h3 className="font-medium text-sm text-slate-800">
                      {mentor.name}
                    </h3>
                    <p className="text-xs text-slate-500">{mentor.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {mentor.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Interns */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Interns
            </h2>

            {recentInterns.length === 0 ? (
              <p className="text-sm text-slate-500">No interns found</p>
            ) : (
              <div className="space-y-3">
                {recentInterns.map((intern) => (
                  <div
                    key={intern.id}
                    className="border rounded-lg p-3 bg-slate-50"
                  >
                    <h3 className="font-medium text-sm text-slate-800">
                      {intern.name}
                    </h3>
                    <p className="text-xs text-slate-500">{intern.email}</p>
                    <p className="text-xs text-slate-500">
                      Batch: {intern.batch ? intern.batch.name : "Not Assigned"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Mentor:{" "}
                      {intern.mentor ? intern.mentor.name : "Not Assigned"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
