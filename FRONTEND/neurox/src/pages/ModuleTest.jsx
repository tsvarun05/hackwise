import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import DarkLayout from "../components/DarkLayout";
import { getModule, getQuestions, completeModule } from "../services/testService";
import { useAuth } from "../context/AuthContext";

const PASS_THRESHOLD = 0.6;

export default function ModuleTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [moduleName, setModuleName] = useState("");
  const [concept, setConcept] = useState("");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Step 1: fetch the module to get its concept
    getModule(id)
      .then((res) => {
        const mod = res.data;
        setModuleName(mod.title || "");
        setConcept(mod.concept || "");
        // Step 2: fetch questions filtered by that concept
        return getQuestions(null, mod.concept);
      })
      .then((res) => {
        const qs = res.data || [];
        if (qs.length === 0) {
          setError("No quiz questions available for this module yet.");
        }
        setQuestions(qs);
      })
      .catch(() => setError("Failed to load quiz. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

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
      try { await completeModule(userId, id); } catch {}
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
            <p className="text-gray-500 mb-2">{concept} Quiz</p>
            <p className="text-gray-500 mb-6">
              {result.correct} / {result.total} correct · {result.score}%
            </p>
            <div className="mb-8">
              <ProgressBar value={result.score} max={100} color={result.passed ? "green" : "red"} label="Your Score" />
            </div>
            <p className="text-sm text-gray-500 mb-8">
              {result.passed
                ? "Great job! The next module is now unlocked."
                : `You need ${Math.round(PASS_THRESHOLD * 100)}% to pass. Review the lesson and try again.`}
            </p>
            <div className="flex gap-3 justify-center">
              {result.passed ? (
                <button onClick={() => navigate("/roadmap")} className="btn-primary">
                  Continue Roadmap →
                </button>
              ) : (
                <>
                  <button onClick={() => navigate(`/learn/${id}`)} className="btn-secondary">Review Lesson</button>
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

  if (error || questions.length === 0) {
    return (
      <DarkLayout>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-amber-400 text-center px-4">{error || "No questions available for this module."}</p>
          <button onClick={() => navigate(`/learn/${id}`)} className="btn-secondary">← Back to Lesson</button>
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
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" /> Module Quiz
          </div>
          <h1 className="text-3xl font-bold text-white">{moduleName}</h1>
          <p className="text-gray-500 mt-1">
            {concept} · Score {Math.round(PASS_THRESHOLD * 100)}%+ to complete
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-6">
          <ProgressBar value={current + 1} max={total} label={`Question ${current + 1} of ${total}`} color="purple" />
        </div>

        {/* Question */}
        {q && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Q{current + 1}
              </span>
              <span className="text-xs text-gray-600">{concept}</span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-6 leading-relaxed">
              {q.question}
            </h2>
            <div className="space-y-3">
              {(q.options || []).map((opt, i) => (
                <button key={i} onClick={() => setAnswers({ ...answers, [current]: i })}
                  className={`w-full text-left px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    answers[current] === i
                      ? "border-purple-500/60 bg-purple-500/10 text-white shadow-lg shadow-purple-500/10"
                      : "border-white/5 bg-white/3 hover:border-white/15 hover:bg-white/5 text-gray-400"
                  }`}>
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
