import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DarkLayout from "../components/DarkLayout";
import { getUnitQuiz, completeModule } from "../services/testService";
import { useAuth } from "../context/AuthContext";

const PASS_THRESHOLD = 0.6;

export default function UnitQuizPage() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUnitQuiz(unitId)
      .then((res) => {
        const qs = res.data || [];
        if (qs.length < 5) {
          setError(`This unit has ${qs.length} questions (minimum 5 required).`);
        }
        setQuestions(qs);
      })
      .catch(() => setError("Failed to load quiz."))
      .finally(() => setLoading(false));
  }, [unitId]);

  const total = questions.length;
  const q = questions[current];

  const handleSubmit = async () => {
    const correct = questions.filter((q, i) => {
      const selectedText = q.options[answers[i]];
      return selectedText === q.correctAnswer;
    }).length;
    const score = correct / total;
    const passed = score >= PASS_THRESHOLD;
    if (passed) {
      try { await completeModule(userId, unitId); } catch {}
    }
    setResult({ passed, score: Math.round(score * 100), correct, total });
  };

  if (result) {
    return (
      <DarkLayout>
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-10 shadow-2xl overflow-hidden ${
            result.passed ? "border-emerald-500/30 shadow-emerald-500/10" : "border-red-500/30 shadow-red-500/10"
          }`}>
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${
              result.passed ? "from-emerald-500 to-cyan-500" : "from-red-500 to-pink-500"
            }`} />
            <div className="text-7xl mb-5">{result.passed ? "🎉" : "😅"}</div>
            <h2 className={`text-3xl font-bold mb-2 ${result.passed ? "text-emerald-400" : "text-red-400"}`}>
              {result.passed ? "You Passed!" : "Not Quite Yet"}
            </h2>
            <p className="text-gray-500 mb-6">
              {result.correct} / {result.total} correct · {result.score}%
            </p>
            <div className="mb-8">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${
                  result.passed ? "bg-emerald-500" : "bg-red-500"
                }`} style={{ width: `${result.score}%` }} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              {result.passed
                ? "Great job! The next unit is now unlocked."
                : `You need ${Math.round(PASS_THRESHOLD * 100)}% to pass. Review the video and try again.`}
            </p>
            <div className="flex gap-3 justify-center">
              {result.passed ? (
                <button onClick={() => navigate("/course/dsa-course")} className="btn-primary">
                  Continue Journey →
                </button>
              ) : (
                <>
                  <button onClick={() => navigate("/course/dsa-course")} className="btn-secondary">
                    ← Back to Course
                  </button>
                  <button onClick={() => { setAnswers({}); setResult(null); setCurrent(0); }} className="btn-primary">
                    Try Again
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </DarkLayout>
    );
  }

  if (loading) {
    return (
      <DarkLayout>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <span className="w-10 h-10 border-2 border-white/20 border-t-purple-400 rounded-full animate-spin" />
        </div>
      </DarkLayout>
    );
  }

  if (error && questions.length === 0) {
    return (
      <DarkLayout>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-amber-400">{error}</p>
          <button onClick={() => navigate("/course/dsa-course")} className="btn-secondary">← Back</button>
        </div>
      </DarkLayout>
    );
  }

  return (
    <DarkLayout>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" /> Unit Quiz
          </div>
          <h1 className="text-3xl font-bold text-white">Knowledge Check</h1>
          <p className="text-gray-500 mt-1">Score {Math.round(PASS_THRESHOLD * 100)}%+ to unlock the next unit</p>
        </div>

        {/* Progress */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span>Question {current + 1} of {total}</span>
            <span className="text-purple-400 font-semibold">{Math.round(((current + 1) / total) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                 style={{ width: `${((current + 1) / total) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        {q && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
              <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Q{current + 1}
              </span>
              <span className="text-xs text-gray-600">Multiple Choice</span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-6 leading-relaxed">
              {q.question}
            </h2>
            <div className="space-y-3">
              {(q.options || []).map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [current]: i })}
                  className={`w-full text-left px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    answers[current] === i
                      ? "border-purple-500/60 bg-purple-500/10 text-white shadow-lg shadow-purple-500/10"
                      : "border-white/5 bg-white/3 hover:border-white/15 hover:bg-white/5 text-gray-400"
                  }`}
                >
                  <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs mr-3 font-bold transition-all ${
                    answers[current] === i
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30"
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

        <div className="flex justify-between">
          <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
            className="btn-secondary disabled:opacity-30">← Previous</button>
          {current < total - 1 ? (
            <button onClick={() => setCurrent(current + 1)} disabled={answers[current] === undefined}
              className="btn-primary disabled:opacity-40 disabled:hover:scale-100">Next →</button>
          ) : (
            <button onClick={handleSubmit} disabled={Object.keys(answers).length < total}
              className="btn-primary disabled:opacity-40 disabled:hover:scale-100">Submit Quiz →</button>
          )}
        </div>
      </div>
    </DarkLayout>
  );
}
