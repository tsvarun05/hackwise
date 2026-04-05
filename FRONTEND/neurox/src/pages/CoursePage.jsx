import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DarkLayout from "../components/DarkLayout";
import RoadmapPath from "../components/RoadmapPath";
import AIMentorChat from "../components/AIMentorChat";
import { getCourse } from "../services/testService";
import { useAuth } from "../context/AuthContext";

const COURSE_META = {
  "dsa-course": { name: "Data Structures & Algorithms", icon: "🧩", color: "from-purple-500 to-blue-600" },
};

export default function CoursePage() {
  const { courseId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const meta = COURSE_META[courseId] || { name: courseId, icon: "📚", color: "from-blue-500 to-purple-600" };

  useEffect(() => {
    if (!userId) return;
    getCourse(courseId, userId)
      .then((r) => {
        setUnits(r.data.units || []);
        setMetrics(r.data.metrics || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId, userId]);

  const FILTERS = ["all", "weak", "current", "completed", "strong", "locked"];
  const filtered = filter === "all" ? units : units.filter((u) => u.status === filter);

  const completedCount = units.filter((u) => u.status === "completed").length;
  const progress = units.length ? Math.round((completedCount / units.length) * 100) : 0;

  return (
    <DarkLayout>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate("/roadmap")}
            className="text-xs text-gray-500 hover:text-blue-400 mb-4 flex items-center gap-1 transition-colors">
            ← Back to Roadmap
          </button>
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${meta.color} bg-clip-text mb-3`}>
            <span className="text-3xl">{meta.icon}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">{meta.name}</h1>
          <p className="text-gray-500 text-sm">Your personalized learning journey — {units.length} micro-units</p>
        </div>

        {/* Progress bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Journey Progress</span>
            <span className="text-sm font-bold text-blue-400">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
                 style={{ width: `${progress}%` }} />
          </div>
          {metrics && (
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: "Total",     value: metrics.totalUnits,     color: "text-blue-400" },
                { label: "Done",      value: metrics.completedUnits, color: "text-emerald-400" },
                { label: "Remaining", value: metrics.remainingUnits, color: "text-amber-400" },
                { label: "Saved",     value: metrics.timeSavedPct,   color: "text-cyan-400" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 rounded-xl p-2">
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time saved banner */}
        {metrics && (
          <div className="relative bg-gradient-to-r from-cyan-600/15 to-blue-600/15 border border-cyan-500/20
                          rounded-2xl p-4 mb-6 flex items-center gap-4 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500 to-blue-500" />
            <span className="text-3xl">⏱️</span>
            <div>
              <p className="font-bold text-white">
                {metrics.optimizedDuration} personalized path
                <span className="text-gray-500 font-normal"> vs </span>
                {metrics.totalDuration} full course
              </p>
              <p className="text-xs text-cyan-400 mt-0.5">
                You saved {metrics.timeSavedPct} by skipping {metrics.skippedUnits} units you already know
              </p>
            </div>
            <div className="ml-auto text-2xl font-bold text-cyan-400">{metrics.timeSavedPct}</div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${
                filter === f
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  : "bg-white/5 text-gray-500 border-white/5 hover:border-white/15"
              }`}>
              {f} {f !== "all" && <span className="ml-1 opacity-60">
                ({units.filter(u => u.status === f).length})
              </span>}
            </button>
          ))}
        </div>

        {/* Roadmap Path */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-10 h-10 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No units in this category.</p>
        ) : (
          <RoadmapPath units={filtered} />
        )}
      </div>
      <AIMentorChat />
    </DarkLayout>
  );
}
