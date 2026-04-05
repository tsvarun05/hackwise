import React from "react";

const gradients = {
  indigo: "from-blue-500 to-purple-600",
  green:  "from-emerald-400 to-cyan-500",
  red:    "from-red-500 to-pink-500",
  purple: "from-purple-500 to-pink-500",
  cyan:   "from-cyan-400 to-blue-500",
};

export default function ProgressBar({ value, max = 100, label, color = "indigo" }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const grad = gradients[color] || gradients.indigo;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400 font-medium">{label}</span>
          <span className="text-gray-300 font-semibold">{pct}%</span>
        </div>
      )}
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
        <div
          className={`bg-gradient-to-r ${grad} h-2 rounded-full transition-all duration-700`}
          style={{ width: `${pct}%`, boxShadow: `0 0 8px rgba(99,102,241,0.6)` }}
        />
      </div>
    </div>
  );
}
