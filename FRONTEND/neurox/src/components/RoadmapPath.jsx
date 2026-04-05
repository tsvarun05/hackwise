import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const STATUS = {
  completed:  { ring: "border-emerald-500",  bg: "bg-emerald-500/20",  dot: "bg-emerald-400",  glow: "shadow-emerald-500/40", badge: "bg-emerald-500/20 text-emerald-300", label: "Done",    icon: "✓" },
  current:    { ring: "border-blue-400",     bg: "bg-blue-500/20",     dot: "bg-blue-400",     glow: "shadow-blue-500/60",   badge: "bg-blue-500/20 text-blue-300",    label: "Up Next", icon: "▶" },
  weak:       { ring: "border-red-500",      bg: "bg-red-500/15",      dot: "bg-red-400",      glow: "shadow-red-500/40",    badge: "bg-red-500/20 text-red-300",      label: "Weak",    icon: "!" },
  strong:     { ring: "border-emerald-400/50",bg:"bg-emerald-500/10",  dot: "bg-emerald-300",  glow: "shadow-emerald-400/20",badge: "bg-emerald-500/10 text-emerald-400",label:"Strong",  icon: "★" },
  locked:     { ring: "border-white/10",     bg: "bg-white/5",         dot: "bg-gray-600",     glow: "",                     badge: "bg-white/5 text-gray-600",        label: "Locked",  icon: "🔒" },
  recommended:{ ring: "border-purple-500/50",bg: "bg-purple-500/10",   dot: "bg-purple-400",   glow: "shadow-purple-500/30", badge: "bg-purple-500/20 text-purple-300", label: "Next",    icon: "→" },
};

const DIFF_COLOR = { beginner: "text-emerald-400", intermediate: "text-amber-400", advanced: "text-red-400" };

export default function RoadmapPath({ units = [], onUnitClick }) {
  const navigate = useNavigate();
  const pathRef = useRef(null);

  const handleClick = (unit) => {
    if (unit.status === "locked") return;
    if (onUnitClick) onUnitClick(unit);
    else navigate(`/quiz/${unit.id}`);
  };

  if (!units.length) return null;

  return (
    <div ref={pathRef} className="relative max-w-2xl mx-auto py-4">
      {units.map((unit, i) => {
        const isLeft  = i % 2 === 0;
        const cfg     = STATUS[unit.status] || STATUS.locked;
        const isLast  = i === units.length - 1;
        const isCurrent = unit.status === "current";

        return (
          <div key={unit.id} className="relative">
            {/* Connector line to next node */}
            {!isLast && (
              <div className={`absolute ${isLeft ? "left-[calc(50%-1px)]" : "left-[calc(50%-1px)]"}
                              top-[72px] w-0.5 h-12 z-0
                              ${unit.status === "completed" ? "bg-gradient-to-b from-emerald-500 to-emerald-500/30"
                                : unit.status === "current" ? "bg-gradient-to-b from-blue-400 to-blue-400/20"
                                : "bg-white/10"}`}
              />
            )}

            {/* Node row — alternates left/right */}
            <div className={`relative z-10 flex items-center mb-12 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>

              {/* Card */}
              <div className={`w-[calc(50%-32px)] ${isLeft ? "mr-8" : "ml-8"}`}>
                <button
                  onClick={() => handleClick(unit)}
                  disabled={unit.status === "locked"}
                  className={`w-full text-left relative border-2 ${cfg.ring} ${cfg.bg}
                              rounded-2xl p-4 transition-all duration-300 overflow-hidden
                              ${unit.status !== "locked"
                                ? `hover:scale-[1.03] hover:shadow-xl ${cfg.glow} cursor-pointer`
                                : "opacity-50 cursor-not-allowed"}
                              ${isCurrent ? "animate-pulse-border" : ""}`}
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                    unit.status === "completed" ? "bg-emerald-400"
                    : unit.status === "current"  ? "bg-blue-400"
                    : unit.status === "weak"     ? "bg-red-400"
                    : "bg-white/10"
                  }`} />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <span className={`text-xs ${DIFF_COLOR[unit.difficulty] || "text-gray-500"}`}>
                      {unit.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-semibold text-sm leading-snug mb-2 ${
                    unit.status === "locked" ? "text-gray-600" : "text-white"
                  }`}>
                    {unit.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>⏱ {unit.durationMinutes}m</span>
                    <span className="text-gray-700">·</span>
                    <span>{unit.concept}</span>
                    {unit.score != null && (
                      <>
                        <span className="text-gray-700">·</span>
                        <span className={unit.score >= 75 ? "text-emerald-400" : unit.score >= 50 ? "text-amber-400" : "text-red-400"}>
                          {unit.score}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  {unit.status !== "locked" && (
                    <div className={`mt-3 text-xs font-semibold ${
                      unit.status === "completed" ? "text-emerald-400"
                      : unit.status === "current"  ? "text-blue-400"
                      : unit.status === "weak"     ? "text-red-400"
                      : "text-gray-400"
                    }`}>
                      {unit.status === "completed" ? "✓ Completed — Review →"
                       : unit.status === "strong"  ? "★ Skip or Review →"
                       : "Start Quiz →"}
                    </div>
                  )}
                </button>
              </div>

              {/* Centre node circle */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full border-2 ${cfg.ring} ${cfg.bg}
                                flex items-center justify-center shadow-lg ${cfg.glow}
                                ${isCurrent ? "ring-4 ring-blue-400/30 ring-offset-2 ring-offset-transparent" : ""}
                                transition-all duration-300`}>
                  <div className={`w-5 h-5 rounded-full ${cfg.dot} flex items-center justify-center
                                  text-xs font-bold text-white`}>
                    {unit.status === "completed" ? "✓"
                     : unit.status === "locked"  ? "🔒"
                     : unit.orderIndex}
                  </div>
                </div>
                {/* Order label */}
                <span className="text-xs text-gray-600 mt-1">#{unit.orderIndex}</span>
              </div>

              {/* Spacer for opposite side */}
              <div className="w-[calc(50%-32px)]" />
            </div>
          </div>
        );
      })}

      {/* End node */}
      <div className="flex justify-center mt-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
                        flex items-center justify-center shadow-xl shadow-blue-500/30 text-white text-lg">
          🏆
        </div>
      </div>
    </div>
  );
}
