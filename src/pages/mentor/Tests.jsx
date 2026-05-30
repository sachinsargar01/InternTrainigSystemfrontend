import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import MentorLayout from "../../layouts/MentorLayout";

function Tests() {
  const [tests, setTests] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [testForm, setTestForm] = useState({
    title: "",
    description: "",
    durationMinutes: "",
    totalQuestions: "",
    passingPercentage: "",
    batchId: "",
  });

  const [selectedTestId, setSelectedTestId] = useState("");
  const [questionForm, setQuestionForm] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
  });

  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const fetchTests = async () => {
    try {
      const response = await axiosInstance.get("/mentor/tests", authHeader);
      setTests(response.data);
    } catch (error) {
      console.error("Tests fetch error:", error);
      toast.error("Failed to load tests");
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axiosInstance.get("/mentor/batches", authHeader);
      setBatches(response.data);
    } catch (error) {
      console.error("Batches fetch error:", error);
      toast.error("Failed to load batches");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchTests(), fetchBatches()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTestChange = (e) => {
    const { name, value } = e.target;
    setTestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetTestForm = () => {
    setTestForm({
      title: "",
      description: "",
      durationMinutes: "",
      totalQuestions: "",
      passingPercentage: "",
      batchId: "",
    });
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
    });
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(
        "/mentor/tests",
        {
          ...testForm,
          durationMinutes: Number(testForm.durationMinutes),
          totalQuestions: Number(testForm.totalQuestions),
          passingPercentage: Number(testForm.passingPercentage),
          batchId: Number(testForm.batchId),
        },
        authHeader,
      );

      toast.success("Test created successfully");
      resetTestForm();
      fetchTests();
    } catch (error) {
      console.error("Create test error:", error);
      toast.error("Failed to create test");
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();

    if (!selectedTestId) {
      toast.error("Please select a test first");
      return;
    }

    try {
      await axiosInstance.post(
        `/mentor/tests/${selectedTestId}/questions`,
        questionForm,
        authHeader,
      );

      toast.success("Question added successfully");
      resetQuestionForm();
    } catch (error) {
      console.error("Add question error:", error);
      toast.error("Failed to add question");
    }
  };

  return (
    <MentorLayout title="Tests">
      {loading ? (
        <div>Loading tests...</div>
      ) : (
        <div className="space-y-6">
          {/* Create Test Form */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-slate-800">
                Create Test
              </h2>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleCreateTest}
                className="grid md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Test Title"
                  value={testForm.title}
                  onChange={handleTestChange}
                  className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500"
                  required
                />

                <select
                  name="batchId"
                  value={testForm.batchId}
                  onChange={handleTestChange}
                  className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>

                <textarea
                  name="description"
                  placeholder="Test Description"
                  value={testForm.description}
                  onChange={handleTestChange}
                  rows="4"
                  className="border rounded-xl px-4 py-3 md:col-span-2"
                  required
                />

                <input
                  type="number"
                  name="durationMinutes"
                  placeholder="Duration in Minutes"
                  value={testForm.durationMinutes}
                  onChange={handleTestChange}
                  className="border rounded-xl px-4 py-3"
                  required
                />

                <input
                  type="number"
                  name="totalQuestions"
                  placeholder="Total Questions"
                  value={testForm.totalQuestions}
                  onChange={handleTestChange}
                  className="border rounded-xl px-4 py-3"
                  required
                />

                <input
                  type="number"
                  name="passingPercentage"
                  placeholder="Passing Percentage"
                  value={testForm.passingPercentage}
                  onChange={handleTestChange}
                  className="border rounded-xl px-4 py-3 md:col-span-2"
                  required
                />

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl"
                  >
                    Create Test
                  </button>

                  <button
                    type="button"
                    onClick={resetTestForm}
                    className="border px-5 py-3 rounded-xl"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tests List */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            {/* Header + Button */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">
                Tests List
              </h2>

              <button
                onClick={() => setShowQuestionModal(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
              >
                + Add Question
              </button>
            </div>

            {tests.length === 0 ? (
              <div className="p-6 text-slate-500">No tests found.</div>
            ) : (
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Questions</th>
                      <th className="px-6 py-4">Passing %</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tests.map((test) => (
                      <tr key={test.id} className="border-t">
                        <td className="px-6 py-4 font-medium">{test.title}</td>
                        <td className="px-6 py-4">
                          {test.durationMinutes} min
                        </td>
                        <td className="px-6 py-4">{test.totalQuestions}</td>
                        <td className="px-6 py-4">{test.passingPercentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 🔥 POPUP MODAL */}
          {showQuestionModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative">
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="absolute top-3 right-3 text-xl"
                >
                  ✕
                </button>

                <h2 className="text-xl font-semibold mb-4">Add Question</h2>

                <form
                  onSubmit={(e) => {
                    handleAddQuestion(e);
                    setShowQuestionModal(false);
                  }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <select
                    value={selectedTestId}
                    onChange={(e) => setSelectedTestId(e.target.value)}
                    className="border rounded-xl px-4 py-3 md:col-span-2"
                    required
                  >
                    <option value="">Select Test</option>
                    {tests.map((test) => (
                      <option key={test.id} value={test.id}>
                        {test.title}
                      </option>
                    ))}
                  </select>

                  <textarea
                    name="questionText"
                    placeholder="Question"
                    value={questionForm.questionText}
                    onChange={handleQuestionChange}
                    rows="3"
                    className="border rounded-xl px-4 py-3 md:col-span-2"
                    required
                  />

                  <input
                    name="optionA"
                    placeholder="Option A"
                    value={questionForm.optionA}
                    onChange={handleQuestionChange}
                    className="border rounded-xl px-4 py-3"
                    required
                  />

                  <input
                    name="optionB"
                    placeholder="Option B"
                    value={questionForm.optionB}
                    onChange={handleQuestionChange}
                    className="border rounded-xl px-4 py-3"
                    required
                  />

                  <input
                    name="optionC"
                    placeholder="Option C"
                    value={questionForm.optionC}
                    onChange={handleQuestionChange}
                    className="border rounded-xl px-4 py-3"
                    required
                  />

                  <input
                    name="optionD"
                    placeholder="Option D"
                    value={questionForm.optionD}
                    onChange={handleQuestionChange}
                    className="border rounded-xl px-4 py-3"
                    required
                  />

                  <select
                    name="correctAnswer"
                    value={questionForm.correctAnswer}
                    onChange={handleQuestionChange}
                    className="border rounded-xl px-4 py-3 md:col-span-2"
                  >
                    <option value="A">Correct Answer: A</option>
                    <option value="B">Correct Answer: B</option>
                    <option value="C">Correct Answer: C</option>
                    <option value="D">Correct Answer: D</option>
                  </select>

                  <button
                    type="submit"
                    className="bg-teal-600 text-white py-3 rounded-xl md:col-span-2"
                  >
                    Add Question
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </MentorLayout>
  );
}

export default Tests;
