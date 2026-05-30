import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import Modal from "./Modal";

function Interns() {
  const [interns, setInterns] = useState([]);
  const [batches, setBatches] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [internForm, setInternForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editingIntern, setEditingIntern] = useState(null);

  const [assignBatchForm, setAssignBatchForm] = useState({
    internId: "",
    batchId: "",
  });
  const [assignMentorForm, setAssignMentorForm] = useState({
    internId: "",
    mentorId: "",
  });

  const [showInternModal, setShowInternModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);

  const authHeader = { headers: { Authorization: `Bearer ${getToken()}` } };

  const fetchInterns = async () => {
    try {
      const res = await axiosInstance.get("/admin/interns", authHeader);
      setInterns(res.data);
    } catch {
      toast.error("Failed to load interns");
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await axiosInstance.get("/admin/batches", authHeader);
      setBatches(res.data);
    } catch {
      toast.error("Failed to load batches");
    }
  };

  const fetchMentors = async () => {
    try {
      const res = await axiosInstance.get("/admin/mentors", authHeader);
      setMentors(res.data);
    } catch {
      toast.error("Failed to load mentors");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchInterns(), fetchBatches(), fetchMentors()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleInternChange = (e) =>
    setInternForm({ ...internForm, [e.target.name]: e.target.value });
  const handleAssignBatchChange = (e) =>
    setAssignBatchForm({ ...assignBatchForm, [e.target.name]: e.target.value });
  const handleAssignMentorChange = (e) =>
    setAssignMentorForm({
      ...assignMentorForm,
      [e.target.name]: e.target.value,
    });

  const handleEdit = (intern) => {
    setEditingIntern(intern);
    setInternForm({ name: intern.name, email: intern.email, password: "" });
    setShowInternModal(true);
  };

  const handleCreateIntern = async (e) => {
    e.preventDefault();
    try {
      if (editingIntern)
        await axiosInstance.put(
          `/admin/interns/${editingIntern.id}`,
          internForm,
          authHeader,
        );
      else
        await axiosInstance.post("/admin/createIntern", internForm, authHeader);
      toast.success(
        editingIntern
          ? "Intern updated successfully"
          : "Intern created successfully",
      );
      setInternForm({ name: "", email: "", password: "" });
      setEditingIntern(null);
      setShowInternModal(false);
      fetchInterns();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(`/admin/interns/${id}`, authHeader);
      toast.success("Intern deleted");
      fetchInterns();
    } catch {
      toast.error("Failed to delete intern");
    }
  };

  const handleAssignBatch = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        "/admin/assignInternToBatch",
        {
          internId: Number(assignBatchForm.internId),
          batchId: Number(assignBatchForm.batchId),
        },
        authHeader,
      );
      toast.success("Assigned batch");
      setAssignBatchForm({ internId: "", batchId: "" });
      setShowBatchModal(false);
      fetchInterns();
    } catch {
      toast.error("Failed to assign batch");
    }
  };

  const handleAssignMentor = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        "/admin/assignInternToMentor",
        {
          internId: Number(assignMentorForm.internId),
          mentorId: Number(assignMentorForm.mentorId),
        },
        authHeader,
      );
      toast.success("Assigned mentor");
      setAssignMentorForm({ internId: "", mentorId: "" });
      setShowMentorModal(false);
      fetchInterns();
    } catch {
      toast.error("Failed to assign mentor");
    }
  };

  return (
    <AdminLayout title="Interns">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Intern List
            </h2>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => {
                  setEditingIntern(null);
                  setInternForm({ name: "", email: "", password: "" });
                  setShowInternModal(true);
                }}
                className="border border-teal-600 hover:bg-teal-600 text-teal-600 hover:text-white px-4 py-2 rounded-xl"
              >
                Create Intern
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6">Loading interns...</div>
          ) : interns.length === 0 ? (
            <div className="p-6 text-slate-500">No interns found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Batch</th>
                    <th className="px-6 py-4">Mentor</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interns.map((intern) => (
                    <tr key={intern.id} className="border-t">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {intern.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {intern.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                          {intern.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {intern.batch ? intern.batch.name : "Not Assigned"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {intern.mentor ? intern.mentor.name : "Not Assigned"}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(intern)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(intern.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            setAssignBatchForm({
                              internId: intern.id,
                              batchId: "",
                            });
                            setShowBatchModal(true);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Assign Batch
                        </button>
                        <button
                          onClick={() => {
                            setAssignMentorForm({
                              internId: intern.id,
                              mentorId: "",
                            });
                            setShowMentorModal(true);
                          }}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Assign Mentor
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modals */}
          <Modal
            title={editingIntern ? "Edit Intern" : "Create Intern"}
            show={showInternModal}
            onClose={() => setShowInternModal(false)}
          >
            <form onSubmit={handleCreateIntern} className="grid gap-4">
              <input
                type="text"
                name="name"
                placeholder="Intern Name"
                value={internForm.name}
                onChange={handleInternChange}
                className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Intern Email"
                value={internForm.email}
                onChange={handleInternChange}
                className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={internForm.password}
                onChange={handleInternChange}
                className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                required={!editingIntern}
              />
              <button
                type="submit"
                className="border border-teal-600 hover:bg-teal-600 text-teal-600 hover:text-white px-5 py-3 rounded-xl"
              >
                {editingIntern ? "Update Intern" : "Save Intern"}
              </button>
            </form>
          </Modal>

          <Modal
            title="Assign Batch"
            show={showBatchModal}
            onClose={() => setShowBatchModal(false)}
          >
            <form onSubmit={handleAssignBatch} className="grid gap-4">
              <select
                name="batchId"
                value={assignBatchForm.batchId}
                onChange={handleAssignBatchChange}
                className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
              >
                Assign Batch
              </button>
            </form>
          </Modal>

          <Modal
            title="Assign Mentor"
            show={showMentorModal}
            onClose={() => setShowMentorModal(false)}
          >
            <form onSubmit={handleAssignMentor} className="grid gap-4">
              <select
                name="mentorId"
                value={assignMentorForm.mentorId}
                onChange={handleAssignMentorChange}
                className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name} ({mentor.email})
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl"
              >
                Assign Mentor
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Interns;
