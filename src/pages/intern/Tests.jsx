import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import InternLayout from "../../layouts/InternLayout";

import {
  FaClock,
  FaQuestionCircle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";

function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState({});

  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  const totalQuestions = selectedTest?.questions.length || 0;

  const answeredCount = Object.keys(answers).length;
  const remainingCount = totalQuestions - answeredCount;
  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const fetchTests = async () => {
    try {
      const response = await axiosInstance.get("/intern/tests", authHeader);

      const localAttempted =
        JSON.parse(localStorage.getItem("attemptedTests")) || [];

      const normalized = (response.data || []).map((t) => ({
        ...t,
        attempted: t.attempted ?? localAttempted.includes(t.id),
      }));

      setTests(normalized);
    } catch {
      toast.error("Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const lockTest = (testId) => {
    const attempted = JSON.parse(localStorage.getItem("attemptedTests")) || [];

    if (!attempted.includes(testId)) {
      localStorage.setItem(
        "attemptedTests",
        JSON.stringify([...attempted, testId]),
      );
    }

    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, attempted: true } : t)),
    );
  };

  const openAttempt = async (test) => {
    if (test.attempted) {
      toast.info("Already attempted");
      return;
    }

    try {
      const res = await axiosInstance.get(
        `/intern/tests/${test.id}/questions`,
        authHeader,
      );

      setSelectedTest({ ...test, questions: res.data || [] });
      setAnswers({});
      enterFullscreen();
    } catch {
      toast.error("Failed to load questions");
    }
  };

  const closeAttempt = () => {
    setSelectedTest(null);
    setAnswers({});
    document.exitFullscreen?.();
  };

  useEffect(() => {
    if (!selectedTest) return;

    setTimeLeft(selectedTest.durationMinutes * 60);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTest]);

  const handleOptionSelect = (qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const res = await axiosInstance.post(
        `/intern/tests/${selectedTest.id}/submit`,
        { answers },
        authHeader,
      );

      setResult(res.data);
      setShowResultModal(true); // 👈 popup open
      lockTest(selectedTest.id);
      closeAttempt();
    } catch {
      toast.error("Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  // AUTO SUBMIT
  const handleAutoSubmit = async () => {
    try {
      const res = await axiosInstance.post(
        `/intern/tests/${selectedTest.id}/submit`,
        { answers },
        authHeader,
      );

      setResult(res.data);
      setShowResultModal(true);
      lockTest(selectedTest.id);
      closeAttempt();

      toast.warning("Auto submitted!");
    } catch {
      toast.error("Auto submit failed");
    }
  };

  // FULLSCREEN
  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.();
  };

  //EXIT FULLSCREEN DETECT
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement && selectedTest) {
        toast.error("Exited fullscreen!");
        handleAutoSubmit();
      }
    };

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [selectedTest]);

  // TAB SWITCH DETECT
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && selectedTest) {
        toast.error("Tab switch detected!");
        handleAutoSubmit();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [selectedTest]);

  // 🔐 BLOCK COPY / RIGHT CLICK
  useEffect(() => {
    const block = (e) => e.preventDefault();

    const keyBlock = (e) => {
      if (e.ctrlKey && ["c", "v", "x", "a"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === "F12") e.preventDefault();
    };

    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    document.addEventListener("keydown", keyBlock);

    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("keydown", keyBlock);
    };
  }, []);

  if (loading) return <InternLayout>Loading...</InternLayout>;

  return (
    <InternLayout title="Tests">
      <div className="space-y-6">
        {/*  TEST CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition-all duration-300
          ${test.attempted ? "opacity-60" : "hover:shadow-xl hover:-translate-y-1"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <MdQuiz className="text-teal-600 text-xl" />
                <h2 className="text-lg font-semibold text-slate-800">
                  {test.title}
                </h2>
              </div>

              <div className="text-sm text-slate-500 mb-4 space-y-2">
                <p className="flex items-center gap-2">
                  <FaClock /> {test.durationMinutes} min
                </p>
                <p className="flex items-center gap-2">
                  <FaQuestionCircle /> {test.totalQuestions} questions
                </p>
                <p className="flex items-center gap-2">
                  <FaCheckCircle /> {test.passingPercentage}% pass
                </p>
              </div>

              <div className="mb-4">
                {test.attempted ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                    <FaCheckCircle /> Attempted
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                    <FaClock /> Not Attempted
                  </span>
                )}
              </div>

              <button
                disabled={test.attempted}
                onClick={() => openAttempt(test)}
                className={`w-full py-2 rounded-xl font-medium transition ${
                  test.attempted
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700 active:scale-95"
                }`}
              >
                {test.attempted ? "Already Attempted" : "Start Test"}
              </button>
            </div>
          ))}
        </div>

        {/* 📝 TEST MODAL */}

        {selectedTest && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl flex overflow-hidden">
              {/* 🧠 LEFT SIDE (QUESTIONS) */}
              <div className="flex-1 flex flex-col">
                {/* 🔝 TOP BAR */}
                <div className="p-4 border-b bg-slate-50">
                  <h2 className="text-xl font-bold">{selectedTest.title}</h2>

                  <div className="flex justify-between mt-2 text-sm">
                    <div>
                      <p>Total: {totalQuestions}</p>
                      <p>Answered: {answeredCount}</p>
                      <p>Remaining: {remainingCount}</p>
                    </div>

                    {/* TIMER */}
                    <div className="text-red-600 font-bold text-lg">
                      ⏱ {Math.floor(timeLeft / 60)}:
                      {String(timeLeft % 60).padStart(2, "0")}
                    </div>
                  </div>

                  {/* 📜 INSTRUCTIONS */}
                  <div className="mt-3 text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                    👉 Read all questions carefully <br />
                    👉 Each question has one correct answer <br />
                    👉 Do not refresh the page during test <br />
                  </div>
                </div>

                {/* ❓ QUESTION AREA */}
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedTest.questions.map(
                    (q, i) =>
                      currentQ === i && (
                        <div key={q.id}>
                          <p className="font-semibold text-lg mb-4">
                            Q{i + 1}. {q.questionText}
                          </p>

                          {["A", "B", "C", "D"].map((opt) => (
                            <label
                              key={opt}
                              className="flex items-center gap-3 p-3 border rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="radio"
                                checked={answers[q.id] === opt}
                                onChange={() => handleOptionSelect(q.id, opt)}
                              />
                              {q[`option${opt}`]}
                            </label>
                          ))}
                        </div>
                      ),
                  )}
                </div>

                {/* ⏭ NAVIGATION */}
                <div className="p-4 border-t flex justify-between">
                  <button
                    disabled={currentQ === 0}
                    onClick={() => setCurrentQ(currentQ - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {currentQ === totalQuestions - 1 ? (
                    <button
                      onClick={handleSubmitTest}
                      className="px-6 py-2 bg-green-600 text-white rounded"
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQ(currentQ + 1)}
                      className="px-4 py-2 bg-pink-600 text-white rounded"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>

              {/* 📊 RIGHT SIDE (QUESTION PALETTE) */}
              <div className="w-64 border-l bg-slate-50 p-4 flex flex-col">
                <h3 className="font-semibold mb-3">Questions</h3>

                {/* GRID */}
                <div className="grid grid-cols-5 gap-2 overflow-y-auto">
                  {selectedTest.questions.map((q, i) => {
                    const isAnswered = answers[q.id];

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQ(i)}
                        className={`w-10 h-10 rounded text-sm font-medium
                  ${
                    currentQ === i
                      ? "bg-blue-600 text-white"
                      : isAnswered
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                  }
                `}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                {/* LEGEND */}
                <div className="mt-4 text-xs space-y-1">
                  <p>
                    <span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>
                    Answered
                  </p>
                  <p>
                    <span className="inline-block w-3 h-3 bg-gray-300 mr-2"></span>
                    Not Answered
                  </p>
                  <p>
                    <span className="inline-block w-3 h-3 bg-blue-600 mr-2"></span>
                    Current
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🎉 RESULT MODAL */}
        {showResultModal && result && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center animate-scaleIn">
              <div className="flex justify-center mb-3">
                {result.percentage >= 50 ? (
                  <FaCheckCircle className="text-green-500 text-5xl" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-5xl" />
                )}
              </div>

              <h2 className="text-2xl font-bold mb-2 text-slate-800">
                {result.percentage >= 50
                  ? "Congratulations!"
                  : "Better Luck Next Time"}
              </h2>

              <div className="bg-slate-100 rounded-xl p-4 mb-4">
                <p className="text-lg font-semibold">Score: {result.score}</p>
                <p className="text-lg font-semibold text-teal-600">
                  {result.percentage}%
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  result.percentage >= 50
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {result.percentage >= 50 ? "PASSED" : "FAILED"}
              </span>

              <button
                onClick={() => setShowResultModal(false)}
                className="mt-5 w-full bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700 active:scale-95 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </InternLayout>
  );
}

export default Tests;
