import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DarkLayout from "../components/DarkLayout";
import { getQuestions, submitResponses } from "../services/testService";
import { useAuth } from "../context/AuthContext";

const DOMAINS = [
  { id: "ai", label: "Artificial Intelligence", icon: "🤖", desc: "ML, Deep Learning, NLP", color: "border-blue-500/30 hover:border-blue-500/60", accent: "from-blue-500/10" },
  { id: "webdev", label: "Web Development", icon: "🌐", desc: "HTML, CSS, JS, React", color: "border-cyan-500/30 hover:border-cyan-500/60", accent: "from-cyan-500/10" },
  { id: "dsa", label: "Data Structures & Algo", icon: "🧩", desc: "Arrays, Trees, Graphs", color: "border-purple-500/30 hover:border-purple-500/60", accent: "from-purple-500/10" },
  { id: "cloud", label: "Cloud Computing", icon: "☁️", desc: "AWS, GCP, Azure", color: "border-sky-500/30 hover:border-sky-500/60", accent: "from-sky-500/10" },
  { id: "cybersec", label: "Cybersecurity", icon: "🔐", desc: "Networking, Ethical Hacking", color: "border-red-500/30 hover:border-red-500/60", accent: "from-red-500/10" },
  { id: "datascience", label: "Data Science", icon: "📊", desc: "Python, Pandas, Visualization", color: "border-emerald-500/30 hover:border-emerald-500/60", accent: "from-emerald-500/10" },
];

export default function Interests() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch domain-specific questions when user moves to step 2
  useEffect(() => {
    if (step === 2 && selected) {
      setLoading(true);
      setError("");
      getQuestions(selected)
        .then((res) => setQuestions(res.data))
        .catch(() => setError("Failed to load questions. Please try again."))
        .finally(() => setLoading(false));
    }
  }, [step, selected]);

  const handleNext = async () => {
    if (step === 1 && selected) {
      setStep(2);
    } else if (step === 2) {
      setLoading(true);
      setError("");
      try {
        // Build answers array: [{ questionId, selectedOption }]
        const answersPayload = questions.map((q, i) => ({
          questionId: q.id,
          selectedOption: answers[i],
        }));
        await submitResponses(userId, answersPayload);
        localStorage.setItem("neurox_domain", selected);
        // Go straight to roadmap — assessment is done, no need for a second test
        navigate("/roadmap");
      } catch {
        setError("Failed to submit. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <DarkLayout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            {step === 1 ? "What do you want to learn?" : "Tell us about yourself"}
          </h1>
          <p className="text-gray-500 mt-2">
            {step === 1
              ? "Pick a domain and we'll build your personalized roadmap"
              : `A few quick questions about ${DOMAINS.find((d) => d.id === selected)?.label}`}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${
              s <= step
                ? "bg-gradient-to-r from-blue-500 to-purple-500 w-10 shadow-lg shadow-blue-500/30"
                : "bg-white/10 w-5"
            }`} />
          ))}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DOMAINS.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelected(d.id)}
                className={`relative bg-white/5 backdrop-blur-lg border rounded-2xl p-5 text-left
                            transition-all duration-300 overflow-hidden group
                            ${selected === d.id
                              ? "border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                              : `${d.color} hover:bg-white/8`
                            }`}
              >
                {selected === d.id && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500 to-purple-500" />
                )}
                <div className="text-3xl mb-3">{d.icon}</div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">{d.label}</h3>
                <p className="text-sm text-gray-500">{d.desc}</p>
                {selected === d.id && (
                  <div className="mt-2 text-xs text-blue-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-7">
            {loading ? (
              <div className="flex justify-center py-10">
                <span className="w-8 h-8 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
              </div>
            ) : (
              questions.map((q, i) => (
                <div key={q.id}>
                  <p className="font-medium text-white mb-3 text-sm">
                    <span className="text-blue-400 font-bold">{i + 1}.</span> {q.text || q.question}
                  </p>
                  <div className="space-y-2">
                    {(q.options || []).map((opt) => (
                      <label key={opt}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                          answers[i] === opt
                            ? "border-blue-500/50 bg-blue-500/10 shadow-sm shadow-blue-500/10"
                            : "border-white/5 hover:border-white/15 bg-white/3"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          answers[i] === opt ? "border-blue-500 bg-blue-500" : "border-gray-600"
                        }`}>
                          {answers[i] === opt && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <input type="radio" name={`q${i}`} value={opt} checked={answers[i] === opt}
                          onChange={() => setAnswers({ ...answers, [i]: opt })} className="hidden" />
                        <span className="text-sm text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-red-400 mt-4">{error}</p>
        )}

        <div className="mt-8 flex justify-between">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
          )}
          <button
            onClick={handleNext}
            disabled={
              loading ||
              (step === 1 ? !selected : Object.keys(answers).length < questions.length)
            }
            className="btn-primary ml-auto disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : step === 1 ? "Next →" : "Build My Roadmap →"}
          </button>
        </div>
      </div>
    </DarkLayout>
  );
}
