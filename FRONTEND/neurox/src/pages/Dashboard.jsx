import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import AIMentorChat from "../components/AIMentorChat";
import InsightsPanel from "../components/InsightsPanel";
import DarkLayout from "../components/DarkLayout";
import { getDashboard } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 shadow-xl">
        <p className="font-semibold text-white">{label}</p>
        <p className="text-blue-400">{payload[0].value} modules</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user, userId } = useAuth();
  const navigate = useNavigate();
  // GET /dashboard/{userId} → { progress, weakAreas, strongAreas }
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getDashboard(userId)
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <DarkLayout>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <span className="w-10 h-10 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
        </div>
      </DarkLayout>
    );
  }

  const progress = stats?.progress ?? 0;
  const weakAreas = stats?.weakAreas ?? [];
  const strongAreas = stats?.strongAreas ?? [];
  const modulesCompleted = stats?.modulesCompleted ?? 0;
  const totalModules = stats?.totalModules ?? 0;
  const streak = stats?.streak ?? 0;
  const hoursSaved = stats?.hoursSaved ?? 0;
  const weeklyProgress = stats?.weeklyProgress ?? [];
  const confidenceScore = stats?.confidenceScore ?? 0;
  const timeSaved = stats?.timeSaved ?? "0%";

  const statCards = [
    { label: "Completion",   value: `${progress}%`,   icon: "📈", color: "text-blue-400",   border: "border-blue-500/20",   glow: "shadow-blue-500/10" },
    { label: "Modules Done", value: totalModules ? `${modulesCompleted}/${totalModules}` : modulesCompleted, icon: "✅", color: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
    { label: "Confidence",   value: `${confidenceScore}%`, icon: "🧠", color: "text-purple-400", border: "border-purple-500/20", glow: "shadow-purple-500/10" },
    { label: "Time Saved",   value: timeSaved,         icon: "⏱️", color: "text-cyan-400",   border: "border-cyan-500/20",   glow: "shadow-cyan-500/10" },
  ];

  return (
    <DarkLayout>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user?.name?.split(" ")[0]}
            </span>{" "}
            👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your learning progress at a glance.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className={`relative bg-white/5 backdrop-blur-lg border ${s.border} rounded-2xl p-5 shadow-xl ${s.glow} overflow-hidden`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* AI Insights Panel */}
        <div className="mb-6">
          <InsightsPanel />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Progress */}          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-5">Overall Progress</h3>
            <div className="space-y-5">
              <ProgressBar value={progress} max={100} label="Course Completion" color="indigo" />
              {totalModules > 0 && (
                <ProgressBar value={modulesCompleted} max={totalModules} label="Modules Completed" color="green" />
              )}
            </div>
          </div>

          {/* Chart */}
          {weeklyProgress.length > 0 && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-5">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={weeklyProgress} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="modules" radius={[6, 6, 0, 0]}>
                    {weeklyProgress.map((entry, i) => (
                      <Cell key={i} fill={entry.modules > 0 ? "url(#barGrad)" : "rgba(255,255,255,0.05)"} />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Weak areas */}
          {weakAreas.length > 0 && (
            <div className="bg-white/5 backdrop-blur-lg border border-red-500/20 rounded-2xl p-6 shadow-xl shadow-red-500/5">
              <h3 className="font-semibold text-white mb-4">🔴 Weak Areas</h3>
              <div className="space-y-2">
                {weakAreas.map((area) => (
                  <div key={area} className="flex items-center justify-between bg-red-500/5 border border-red-500/10 px-3 py-2.5 rounded-xl">
                    <span className="text-sm text-gray-300">{area}</span>
                    <span className="text-xs text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded-full">Needs Work</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strong areas */}
          {strongAreas.length > 0 && (
            <div className="bg-white/5 backdrop-blur-lg border border-emerald-500/20 rounded-2xl p-6 shadow-xl shadow-emerald-500/5">
              <h3 className="font-semibold text-white mb-4">🟢 Strong Areas</h3>
              <div className="space-y-2">
                {strongAreas.map((area) => (
                  <div key={area} className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 px-3 py-2.5 rounded-xl">
                    <span className="text-sm text-gray-300">{area}</span>
                    <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">Mastered</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6 overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500 to-purple-500" />
          <div>
            <p className="font-bold text-white text-lg">Continue Learning</p>
            <p className="text-gray-400 text-sm mt-0.5">Pick up where you left off on your roadmap.</p>
          </div>
          <button onClick={() => navigate("/roadmap")} className="btn-primary whitespace-nowrap">
            Go to Roadmap →
          </button>
        </div>
      </div>
      <AIMentorChat />
    </DarkLayout>
  );
}
