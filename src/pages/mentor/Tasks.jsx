import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import MentorLayout from "../../layouts/MentorLayout";

function Tasks() {
  const [batches, setBatches] = useState([]);
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    dueDate: "",
    estimatedHours: "",
    batchId: "",
    internIds: [],
  });
  // requirements: "",
  // resources: "",
  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const categoryOptions = [
    "Frontend",
    "Backend",
    "JavaScript",
    "React",
    "Java",
    "Database",
    "DevOps",
    "Testing",
  ];
  const fetchBatches = async () => {
    const response = await axiosInstance.get("/mentor/batches", authHeader);
    setBatches(response.data);
  };

  const fetchInterns = async () => {
    const response = await axiosInstance.get("/mentor/interns", authHeader);
    setInterns(response.data);
  };

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/mentor/tasks", authHeader);
      setTasks(response.data);
    } catch (err) {
      console.error("Tasks fetch error:", err);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchBatches(), fetchInterns(), fetchTasks()]);
      } catch (error) {
        console.error("Tasks page error:", error);
        toast.error("Failed to load tasks page data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredInterns = useMemo(() => {
    if (!formData.batchId) return interns;
    return interns.filter(
      (intern) =>
        intern.batch && String(intern.batch.id) === String(formData.batchId),
    );
  }, [interns, formData.batchId]);

  const recentTasks = useMemo(() => {
    return [...tasks].slice(-3).reverse();
  }, [tasks]);

  const quickStats = useMemo(() => {
    const total = tasks.length;
    const pending = 0; // backend task list मध्ये status नाही, म्हणून placeholder
    const inProgress = 0;
    const completed = 0;

    return { total, pending, inProgress, completed };
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "batchId") {
      setFormData((prev) => ({
        ...prev,
        batchId: value,
        internIds: [],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInternSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      Number(option.value),
    );

    setFormData((prev) => ({
      ...prev,
      internIds: selectedOptions,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "MEDIUM",
      dueDate: "",
      estimatedHours: "",
      batchId: "",
      internIds: [],
    });
  };

  //  requirements: "",
  //     resources: "",

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.batchId) {
      toast.error("Please select a batch");
      return;
    }

    if (formData.internIds.length === 0) {
      toast.error("Please assign at least one intern");
      return;
    }

    try {
      await axiosInstance.post(
        "/mentor/tasks",
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          dueDate: formData.dueDate,
          estimatedHours: Number(formData.estimatedHours),
          batchId: Number(formData.batchId),
          internIds: formData.internIds,
        },
        authHeader,
      );

      toast.success("Task created successfully");
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error("Create task error:", error);
      toast.error("Failed to create task");
    }
  };

  if (loading) {
    return (
      <MentorLayout title="Create Task">
        <div>Loading tasks...</div>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout title="Create Task">
      <div className="space-y-6">
        <div>
          {/* <h1 className="text-2xl font-bold text-slate-900">Create Task</h1> */}
          <p className="text-sm text-slate-500 mt-1">
            Assign tasks and track intern progress
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Form Section */}
          <div className="xl:col-span-8 bg-white rounded-2xl border shadow-sm">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Task Details
              </h2>
              {/* <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Show Preview
              </button> */}
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter a clear and concise task title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe the task in detail. Include context, goals, and any important information."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estimated Hours <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="estimatedHours"
                    placeholder="e.g., 4"
                    value={formData.estimatedHours}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Batch <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select batch</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assign To <span className="text-red-500">*</span>
                </label>
                <select
                  multiple
                  value={formData.internIds.map(String)}
                  onChange={handleInternSelect}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
                  required
                >
                  {filteredInterns.length === 0 ? (
                    <option disabled>
                      {formData.batchId
                        ? "No interns found for selected batch"
                        : "Select batch first or choose from all interns"}
                    </option>
                  ) : (
                    filteredInterns.map((intern) => (
                      <option key={intern.id} value={intern.id}>
                        {intern.name} ({intern.email})
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  Hold Ctrl (Windows) / Cmd (Mac) to select multiple interns
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-xl"
                >
                  + Create Task
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="md:w-28 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar Section */}
          <div className="xl:col-span-4 space-y-6">
            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-4">
                💡
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Task Creation Tips
              </h3>

              <ul className="space-y-3 text-sm text-slate-600">
                <li>• Be specific about deliverables and expectations</li>
                <li>• Set realistic deadlines considering skill level</li>
                <li>• Provide adequate resources and documentation</li>
                <li>• Define clear acceptance criteria</li>
              </ul>
            </div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-2xl shadow border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Recent Tasks
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </button>
              </div>

              {recentTasks.length === 0 ? (
                <p className="text-sm text-slate-500">No recent tasks found.</p>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border-b last:border-b-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm">
                          ☑
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800">
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Due {task.dueDate}
                          </p>

                          <div className="mt-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.priority === "HIGH"
                                  ? "bg-red-100 text-red-700"
                                  : task.priority === "MEDIUM"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow border p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Quick Stats
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Tasks</span>
                  <span className="font-semibold text-slate-800">
                    {quickStats.total}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Pending</span>
                  <span className="font-semibold text-orange-600">
                    {quickStats.pending}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">In Progress</span>
                  <span className="font-semibold text-blue-600">
                    {quickStats.inProgress}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Completed</span>
                  <span className="font-semibold text-green-600">
                    {quickStats.completed}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MentorLayout>
  );
}

export default Tasks;
