import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";

function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  // Create/Edit modal
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
  });

  //assign mentor
  const [mentors, setMentors] = useState([]);
  const [showAssignMentor, setShowAssignMentor] = useState(false);
  const [assignData, setAssignData] = useState({
    batchId: null,
    mentorId: "",
  });
  useEffect(() => {
    fetchBatches();
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await axiosInstance.get("/admin/mentors", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setMentors(res.data);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to load mentors");
    }
  };

  const handleAssignMentor = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(
        "/admin/assignMentorToBatch",
        {
          batchId: assignData.batchId,
          mentorId: assignData.mentorId,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      toast.success("Mentor assigned successfully");

      setShowAssignMentor(false);

      // batch details refresh
      handleViewDetails(assignData.batchId);
    } catch (error) {
      console.error("Assign mentor error:", error);
      toast.error("Failed to assign mentor");
    }
  };
  // View details modal
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // ---------------- FETCH ALL BATCHES ----------------
  const fetchBatches = async () => {
    try {
      const response = await axiosInstance.get("/admin/batches", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setBatches(response.data);
    } catch (error) {
      console.error("Batches error:", error);
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // ---------------- FORM CHANGE ----------------
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---------------- CREATE OR UPDATE BATCH ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axiosInstance.put(`/admin/batches/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        toast.success("Batch updated successfully");
      } else {
        await axiosInstance.post("/admin/createBatch", formData, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        toast.success("Batch created successfully");
      }

      setFormData({
        id: null,
        name: "",
        startDate: "",
        endDate: "",
        status: "ACTIVE",
      });
      setShowForm(false);
      setIsEdit(false);
      fetchBatches();
    } catch (error) {
      console.error("Batch error:", error);
      toast.error("Failed to save batch");
    }
  };

  // ---------------- VIEW DETAILS ----------------
  const handleViewDetails = async (batchId) => {
    setDetailsLoading(true);
    setShowDetails(true);
    setSelectedBatchDetails(null);

    try {
      const response = await axiosInstance.get(
        `/admin/batches/${batchId}/details`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      setSelectedBatchDetails(response.data);
    } catch (error) {
      console.error("Batch details error:", error);
      toast.error("Failed to load batch details");
    } finally {
      setDetailsLoading(false);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (batch) => {
    setFormData(batch);
    setShowForm(true);
    setIsEdit(true);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;

    try {
      await axiosInstance.delete(`/admin/batches/${batchId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Batch deleted successfully");
      fetchBatches();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete batch");
    }
  };

  // Pagination pages
  const totalPages = Math.ceil(batches.length / recordsPerPage);
  const currentRecords = batches.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <AdminLayout title="Batches">
      <div className="space-y-6">
        {/* Top Buttons */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Batch List</h2>
          <div className="flex justify-between items-center mb-4"></div>

          <button
            onClick={() => {
              setShowForm(true);
              setIsEdit(false);
            }}
            className="border border-teal-500 text-teal-500 px-4 py-2 rounded-xl hover:bg-teal-500 hover:text-white transition"
          >
            Create Batch
          </button>
        </div>

        {/* CREATE/EDIT FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 transition"
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {isEdit ? "Edit Batch" : "Create Batch"}
              </h3>

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Batch Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="UPCOMING">UPCOMING</option>
                </select>
                <button
                  type="submit"
                  className="border border-teal-500 text-teal-500 px-4 py-2 rounded-xl hover:bg-green-800 hover:text-white transition"
                >
                  {isEdit ? "Update Batch" : "Create Batch"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {loading ? (
            <div className="p-6">Loading batches...</div>
          ) : currentRecords.length === 0 ? (
            <div className="p-6 text-slate-500">No batches found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-4">Batch Name</th>
                    <th className="px-6 py-4">Start Date</th>
                    <th className="px-6 py-4">End Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((batch) => (
                    <tr
                      key={batch.id}
                      className="border-t hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {batch.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {batch.startDate}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {batch.endDate}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            batch.status === "ACTIVE" ||
                            batch.status === "UPCOMING"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleViewDetails(batch.id)}
                          className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1 rounded-lg text-sm transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(batch)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(batch.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => {
                            setAssignData({
                              batchId: batch.id,
                              mentorId: "",
                            });
                            setShowAssignMentor(true);
                          }}
                          className="bg-black hover:bg-gray-900 text-white px-3 py-1 rounded-lg"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-4">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-700"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ASSIGN MENTOR MODAL */}

        {showAssignMentor && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md relative">
              <button
                onClick={() => setShowAssignMentor(false)}
                className="absolute top-3 right-3 text-slate-500"
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold mb-4">Assign Mentor</h3>

              <form onSubmit={handleAssignMentor} className="grid gap-4">
                <select
                  value={assignData.mentorId}
                  onChange={(e) =>
                    setAssignData({ ...assignData, mentorId: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3"
                  required
                >
                  <option value="">Select Mentor</option>

                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                >
                  Assign
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW DETAILS MODAL */}
        {showDetails && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow p-6 w-full max-w-lg relative">
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 transition"
              >
                ✕
              </button>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Batch Details
              </h3>
              {detailsLoading ? (
                <div>Loading...</div>
              ) : selectedBatchDetails ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border">
                    <p className="text-sm text-slate-500">Batch ID</p>
                    <h3 className="font-medium text-slate-800">
                      {selectedBatchDetails.batchId}
                    </h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border">
                    <p className="text-sm text-slate-500">Batch Name</p>
                    <h3 className="font-medium text-slate-800">
                      {selectedBatchDetails.batchName}
                    </h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border">
                    <p className="text-sm text-slate-500">Status</p>
                    <h3 className="font-medium text-slate-800">
                      {selectedBatchDetails.status}
                    </h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border">
                    <p className="text-sm text-slate-500">Mentor Count</p>
                    <h3 className="font-medium text-slate-800">
                      {selectedBatchDetails.mentorCount}
                    </h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border md:col-span-2">
                    <p className="text-sm text-slate-500">Intern Count</p>
                    <h3 className="font-medium text-slate-800">
                      {selectedBatchDetails.internCount}
                    </h3>
                  </div>
                </div>
              ) : (
                <div>No details available.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Batches;
