import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions, submitResponses, runEvaluation } from "../services/testService";
import { useAuth } from "../context/AuthContext";
import ProgressBar from "../components/ProgressBar";
import DarkLayout from "../components/DarkLayout";

export default function Assessment() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const domain = localStorage.getItem("neurox_domain") || "";
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getQuestions(domain)
      .then((res) => setQuestions(res.data))
      .catch(() => setError("Failed to load questions."))
      .finally(() => setLoading(false));
  }, [domain]);

  const total = questions.length;
  const q = questions[current];

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      // Submit all answers first
      const answersPayload = questions.map((q, i) => ({
        questionId: q.id,
        selectedOption: q.options[answers[i]], // convert index to option text
      }));
      await submitResponses(userId, answersPayload);

      // Then run evaluation
      const res = await runEvaluation(userId);
      localStorage.setItem("neurox_evaluation", JSON.stringify(res.data));
      navigate("/roadmap");
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DarkLayout>
        <div className="flex items-center justify-center min-h-screen">
          <span className="w-10 h-10 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
        </div>
      </DarkLayout>
    );
  }

  if (error && questions.length === 0) {
    return (
      <DarkLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-red-400">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
        </div>
      </DarkLayout>
    );
  }

  return (
    <DarkLayout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" /> Reassessment
          </div>
          <h1 className="text-3xl font-bold text-white">Retake Assessment</h1>
          <p className="text-gray-500 mt-1">
            {domain ? `Retesting your ${domain.toUpperCase()} knowledge` : "Update your knowledge profile"}
          </p>
        </div>

        {/* Progress card */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span>Question {current + 1} of {total}</span>
            <span className="text-blue-400 font-semibold">{Math.round(((current + 1) / total) * 100)}%</span>
          </div>
          <ProgressBar value={current + 1} max={total} color="indigo" />
          <div className="flex gap-1.5 mt-4">
            {questions.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                i < current ? "bg-gradient-to-r from-blue-500 to-purple-500"
                : i === current ? "bg-blue-400 shadow-sm shadow-blue-400/50"
                : "bg-white/10"
              }`} />
            ))}
          </div>
        </div>

        {/* Question card */}
        {q && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Q{current + 1}
              </span>
              <span className="text-xs text-gray-600">Multiple Choice</span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-6 leading-relaxed">
              {q.text || q.question}
            </h2>

            <div className="space-y-3">
              {(q.options || []).map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [current]: i })}
                  className={`w-full text-left px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    answers[current] === i
                      ? "border-blue-500/60 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10"
                      : "border-white/5 bg-white/3 hover:border-white/15 hover:bg-white/5 text-gray-400"
                  }`}
                >
                  <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs mr-3 font-bold transition-all ${
                    answers[current] === i
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/5 text-gray-500"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-red-400 mb-4">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
            className="btn-secondary disabled:opacity-30">
            ← Previous
          </button>
          {current < total - 1 ? (
            <button onClick={() => setCurrent(current + 1)} disabled={answers[current] === undefined}
              className="btn-primary disabled:opacity-40 disabled:hover:scale-100">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={Object.keys(answers).length < total || submitting}
              className="btn-primary disabled:opacity-40 disabled:hover:scale-100">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI is analyzing...
                </span>
              ) : "Submit & Get Roadmap →"}
            </button>
          )}
        </div>

        {Object.keys(answers).length < total && current === total - 1 && (
          <p className="text-center text-sm text-amber-400/80 mt-4">
            ⚠️ Please answer all questions before submitting
          </p>
        )}
      </div>
    </DarkLayout>
  );
}
