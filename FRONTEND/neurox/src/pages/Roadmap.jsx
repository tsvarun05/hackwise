import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ModuleCard from "../components/ModuleCard";
import AIMentorChat from "../components/AIMentorChat";
import DarkLayout from "../components/DarkLayout";
import { getRoadmap, getAIRoadmap, getInsights } from "../services/testService";
import { useAuth } from "../context/AuthContext";

const FILTER_CONFIG = {
  all:    { label: "All", active: "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/20" },
  weak:   { label: "Weak", active: "bg-red-500/20 text-red-400 border-red-500/30" },
  strong: { label: "Strong", active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
};

export default function Roadmap() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const domain = localStorage.getItem("neurox_domain") || "";
  const [modules, setModules] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiRoadmap, setAiRoadmap] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [timeSaved, setTimeSaved] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    // Fetch insights (time saved + AI roadmap) in parallel with modules
    getInsights(userId, domain)
      .then((r) => {
        if (r.data.timeSaved) setTimeSaved(r.data.timeSaved);
        if (r.data.aiRoadmap) setAiRoadmap(r.data.aiRoadmap);
      })
      .catch(() => {});

    getRoadmap(userId, domain)
      .then((res) => {
        const data = (res.data || []).map((m) => ({
          ...m,
          status: m.weak ? "weak" : "strong",
        }));
        setModules(data);

        const weakConcepts = [...new Set(data.filter(m => m.weak).map(m => m.concept))];
        if (weakConcepts.length > 0) {
          setAiLoading(true);
          getAIRoadmap(weakConcepts)
            .then((r) => {
              if (r.data.error) setAiError(r.data.error);
              else if (r.data.aiRoadmap) setAiRoadmap(r.data.aiRoadmap);
            })
            .catch(() => setAiError("AI suggestion unavailable."))
            .finally(() => setAiLoading(false));
        }
      })
      .catch(() => setError("Failed to load roadmap."))
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered = filter === "all" ? modules : modules.filter((m) => m.status === filter);
  const weakCount = modules.filter((m) => m.status === "weak").length;
  const strongCount = modules.filter((m) => m.status === "strong").length;

  return (
    <DarkLayout>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-blue-400 font-medium mb-3">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Your Personalized Roadmap
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {domain.charAt(0).toUpperCase() + domain.slice(1)}{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Learning Path
            </span>
          </h1>
          <p className="text-gray-500">Based on your assessment — here's exactly what you need to focus on.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Weak Areas", value: weakCount, color: "text-red-400", bg: "border-red-500/20", glow: "shadow-red-500/10" },
            { label: "Strong Areas", value: strongCount, color: "text-emerald-400", bg: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
            { label: "Total Modules", value: modules.length, color: "text-blue-400", bg: "border-blue-500/20", glow: "shadow-blue-500/10" },
          ].map((s) => (
            <div key={s.label} className={`bg-white/5 backdrop-blur-lg border ${s.bg} rounded-2xl p-5 text-center shadow-xl ${s.glow}`}>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Full Course CTA */}
        <div className="relative bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20
                        rounded-2xl p-5 mb-8 overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500 to-blue-500" />
          <div className="flex items-center gap-4">
            <span className="text-4xl">🧩</span>
            <div>
              <p className="font-bold text-white">Data Structures & Algorithms — Full Course</p>
              <p className="text-gray-400 text-sm mt-0.5">54 micro-units · Visual journey path · Adaptive to your level</p>
            </div>
          </div>
          <button onClick={() => navigate("/course/dsa-course")}
            className="btn-primary whitespace-nowrap ml-4">
            Start Journey →
          </button>
        </div>

        {/* Time saved banner */}
        <div className="relative bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/20
                        rounded-2xl p-5 mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="flex items-center gap-4">
            <div className="text-4xl">⏱️</div>
            <div className="flex-1">
              <p className="font-bold text-white text-lg">
                {timeSaved
                  ? `You saved ${timeSaved.timeSavedPct} of learning time!`
                  : `You saved ~${strongCount * 20} hours of learning!`}
              </p>
              <p className="text-gray-400 text-sm mt-0.5">
                {timeSaved
                  ? `${timeSaved.optimizedHours}h personalized path vs ${timeSaved.originalHours}h full course`
                  : `Skipped ${strongCount} modules you already know.`}
              </p>
            </div>
            {timeSaved && (
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400">{timeSaved.timeSavedPct}</div>
                <div className="text-xs text-gray-500">saved</div>
              </div>
            )}
          </div>
        </div>

        {/* AI Roadmap Suggestion */}
        {(aiLoading || aiRoadmap || aiError) && (
          <div className="relative bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-5 mb-8 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500 to-blue-500" />
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div className="flex-1">
                <p className="font-semibold text-white mb-1">AI Learning Suggestion</p>
                {aiLoading ? (
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" />
                    Generating personalized roadmap...
                  </span>
                ) : aiError ? (
                  <p className="text-sm text-amber-400">{aiError}</p>
                ) : (
                  <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{aiRoadmap}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {Object.entries(FILTER_CONFIG).map(([key, cfg]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border capitalize ${
                filter === key ? cfg.active : "bg-white/5 text-gray-500 border-white/5 hover:border-white/15 hover:text-gray-300"
              }`}>
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Module grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl h-44 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-400 py-10">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No modules found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((mod) => <ModuleCard key={mod.id} module={mod} />)}
          </div>
        )}
      </div>
      <AIMentorChat />
    </DarkLayout>
  );
}
