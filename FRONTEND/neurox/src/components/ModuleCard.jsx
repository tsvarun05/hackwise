import React from "react";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  weak: {
    border: "border-red-500/30",
    badge: "bg-red-500/10 text-red-400 border border-red-500/20",
    badgeLabel: "Needs Work",
    btn: "bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-red-500/30",
    glow: "shadow-red-500/10",
    dot: "bg-red-400 shadow-red-400/60",
    accent: "from-red-500/10 to-transparent",
  },
  strong: {
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    badgeLabel: "Strong",
    btn: "bg-gradient-to-r from-emerald-500 to-cyan-600 hover:shadow-emerald-500/30",
    glow: "shadow-emerald-500/10",
    dot: "bg-emerald-400 shadow-emerald-400/60",
    accent: "from-emerald-500/10 to-transparent",
  },
  locked: {
    border: "border-white/5",
    badge: "bg-white/5 text-gray-500 border border-white/10",
    badgeLabel: "Locked",
    btn: "bg-white/5 text-gray-500 cursor-not-allowed",
    glow: "",
    dot: "bg-gray-600",
    accent: "from-white/5 to-transparent",
  },
};

export default function ModuleCard({ module }) {
  const navigate = useNavigate();
  const cfg = statusConfig[module.status] || statusConfig.locked;

  return (
    <div className={`relative bg-white/5 backdrop-blur-lg border ${cfg.border} rounded-2xl p-6 shadow-xl ${cfg.glow}
                     hover:scale-[1.02] hover:bg-white/8 transition-all duration-300 overflow-hidden group`}>
      {/* Accent gradient top */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${cfg.accent}`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-3 h-3 rounded-full ${cfg.dot} shadow-lg`} />
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
          {cfg.badgeLabel}
        </span>
      </div>

      <h3 className="font-semibold text-white text-base mb-2 group-hover:text-blue-300 transition-colors">
        {module.title}
      </h3>
      <p className="text-sm text-gray-500 mb-5 line-clamp-2">{module.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">{module.duration || "~20 min"}</span>
        <button
          disabled={module.status === "locked"}
          onClick={() => module.status !== "locked" && navigate(`/learn/${module.id}`)}
          className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 text-white
                      hover:scale-105 hover:shadow-lg ${cfg.btn} disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {module.status === "locked" ? "🔒 Locked" : "Start →"}
        </button>
      </div>
    </div>
  );
}
