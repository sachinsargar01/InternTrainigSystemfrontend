import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import MentorDashboard from "../pages/mentor/Dashboard";
import InternDashboard from "../pages/intern/Dashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Batches from "../pages/admin/Batches";
import Mentors from "../pages/admin/Mentors";
import Interns from "../pages/admin/Interns";
import Reports from "../pages/mentor/Reports";
import Tasks from "../pages/mentor/Tasks";
import Submissions from "../pages/mentor/Submissions";
import Videos from "../pages/mentor/Videos";
import Meetings from "../pages/mentor/Meetings";
import Tests from "../pages/mentor/Tests";
import InternTasks from "../pages/intern/Tasks";
import InternVideos from "../pages/intern/Videos";
import InternMeetings from "../pages/intern/Meetings";
import InternTests from "../pages/intern/Tests";
import ProgressReport from "../pages/intern/ProgressReport";
import CreateAdmin from "../components/admin/CreateAdmin";
import AdminOptions from "../components/admin/AdminOptions";
import MentorChat from "../pages/mentor/MentorChat";
import InternChat from "../pages/intern/InternChat";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/create-admin" element={<CreateAdmin />} />
        <Route path="/admin-options" element={<AdminOptions />} />

        <Route path="/mentor/chat" element={<MentorChat />} />

        <Route path="/intern/chat" element={<InternChat />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/dashboard"
          element={
            <ProtectedRoute allowedRole="MENTOR">
              <MentorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intern/dashboard"
          element={
            <ProtectedRoute allowedRole="INTERN">
              <InternDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/batches"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Batches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/mentors"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Mentors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/interns"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Interns />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/dashboard"
          element={
            <ProtectedRoute allowedRole="MENTOR">
              <MentorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/tasks"
          element={
            <ProtectedRoute allowedRole="MENTOR">
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/submissions"
          element={
            <ProtectedRoute allowedRole="MENTOR">
              <Submissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/videos"
          element={
            <ProtectedRoute allowedRole="MENTOR">
              <Videos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/meetings"
          element={
            <ProtectedRoute allowedRole="MENTOR">
              <Meetings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/tests"
          element={
            <ProtectedRoute allowedRole="MENTOR">
              <Tests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/reports"
          element={
            <ProtectedRoute allowedRole="MENTOR">
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intern/dashboard"
          element={
            <ProtectedRoute allowedRole="INTERN">
              <InternDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intern/tasks"
          element={
            <ProtectedRoute allowedRole="INTERN">
              <InternTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intern/videos"
          element={
            <ProtectedRoute allowedRole="INTERN">
              <InternVideos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intern/meetings"
          element={
            <ProtectedRoute allowedRole="INTERN">
              <InternMeetings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intern/tests"
          element={
            <ProtectedRoute allowedRole="INTERN">
              <InternTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intern/progress-report"
          element={
            <ProtectedRoute allowedRole="INTERN">
              <ProgressReport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
