import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms & Modals
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [mentorForm, setMentorForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const authHeader = { headers: { Authorization: `Bearer ${getToken()}` } };

  // Fetch mentors
  const fetchMentors = async () => {
    try {
      const response = await axiosInstance.get("/admin/mentors", authHeader);
      setMentors(response.data);
    } catch (error) {
      toast.error("Failed to load mentors");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleMentorChange = (e) =>
    setMentorForm({ ...mentorForm, [e.target.name]: e.target.value });

  // Create / Update Mentor
  const handleCreateMentor = async (e) => {
    e.preventDefault();
    try {
      if (editingMentor) {
        await axiosInstance.put(
          `/admin/mentors/${editingMentor.id}`,
          mentorForm,
          authHeader,
        );
        toast.success("Mentor updated successfully");
      } else {
        await axiosInstance.post("/admin/createMentor", mentorForm, authHeader);
        toast.success("Mentor created successfully");
      }
      setMentorForm({ name: "", email: "", password: "" });
      setEditingMentor(null);
      setShowCreateForm(false);
      fetchMentors();
    } catch (error) {
      toast.error("Operation failed");
      console.error(error);
    }
  };

  // Edit mentor
  const handleEdit = (mentor) => {
    setEditingMentor(mentor);
    setMentorForm({ name: mentor.name, email: mentor.email, password: "" });
    setShowCreateForm(true);
  };

  // Open Delete Modal
  const handleDeleteModal = (mentor) => {
    setSelectedMentor(mentor);
    setShowDeleteModal(true);
  };

  // Confirm Delete with 403 handling
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/admin/mentors/${selectedMentor.id}`,
        authHeader,
      );
      toast.success("Mentor deleted successfully");
      setShowDeleteModal(false);
      fetchMentors();
    } catch (error) {
      console.error("Delete mentor error full:", error);
      if (error.response?.status === 403) {
        toast.error("You don’t have permission to delete this mentor.");
      } else {
        toast.error(error.response?.data?.message || "Failed to delete mentor");
      }
    }
  };

  return (
    <AdminLayout title="Mentors">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Mentor List
            </h2>

            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingMentor(null);
                setMentorForm({ name: "", email: "", password: "" });
              }}
              className=" border-2 border-teal-600 text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-600 hover:text-white transition"
            >
              Create Mentor
            </button>
          </div>

          {/* Create / Edit Mentor Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-96 relative">
                <h2 className="text-lg font-semibold mb-4">
                  {editingMentor ? "Edit Mentor" : "Create Mentor"}
                </h2>
                <form onSubmit={handleCreateMentor} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Mentor Name"
                    value={mentorForm.name}
                    onChange={handleMentorChange}
                    className="border rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Mentor Email"
                    value={mentorForm.email}
                    onChange={handleMentorChange}
                    className="border rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={mentorForm.password}
                    onChange={handleMentorChange}
                    className="border rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-teal-500"
                    required={!editingMentor}
                  />
                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="w-1/2 border px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 bg-teal-800 text-white px-4 py-2 rounded-lg"
                    >
                      {editingMentor ? "Update Mentor" : "Save Mentor"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Mentors Table */}
          {loading ? (
            <div className="p-6">Loading mentors...</div>
          ) : mentors.length === 0 ? (
            <div className="p-6 text-slate-500">No mentors found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((mentor) => (
                    <tr
                      key={mentor.id}
                      className="border-t hover:bg-slate-50 transition-all"
                    >
                      <td className="px-6 py-4">{mentor.name}</td>
                      <td className="px-6 py-4">{mentor.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700">
                          {mentor.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(mentor)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteModal(mentor)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 relative">
              <h2 className="text-lg font-semibold mb-4">Delete Mentor</h2>
              <p>Are you sure you want to delete {selectedMentor?.name}?</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-1/2 border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="w-1/2 bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Mentors;
