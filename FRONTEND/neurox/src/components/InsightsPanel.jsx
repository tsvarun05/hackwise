import React, { useEffect, useState } from "react";
import { getInsights } from "../services/testService";
import { useAuth } from "../context/AuthContext";

export default function InsightsPanel() {
  const { userId } = useAuth();
  const domain = localStorage.getItem("neurox_domain") || "";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getInsights(userId, domain)
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [userId, domain]);

  if (loading) {
    return (
      <div className="relative bg-white/5 border border-purple-500/20 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500 to-blue-500" />
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🧠</span>
          <span className="font-semibold text-white">AI Analysis Engine</span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-purple-400">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
            Analyzing...
          </span>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 bg-white/5 rounded-full animate-pulse" style={{ width: `${70 - i * 15}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { weakAreas = [], strongAreas = [], confidenceScore = 0,
          explanation = "", timeSaved = {}, recommendations = [] } = data;

  const confColor = confidenceScore >= 70 ? "text-emerald-400"
                  : confidenceScore >= 40 ? "text-amber-400"
                  : "text-red-400";
  const confBg    = confidenceScore >= 70 ? "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20"
                  : confidenceScore >= 40 ? "from-amber-500/20 to-amber-500/5 border-amber-500/20"
                  : "from-red-500/20 to-red-500/5 border-red-500/20";

  return (
    <div className="space-y-4">

      {/* AI Explanation Card */}
      <div className="relative bg-gradient-to-br from-purple-600/10 to-blue-600/5 border border-purple-500/20 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500 to-blue-500" />
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🧠</span>
          <span className="font-semibold text-white text-sm">AI Analysis</span>
          <span className="ml-auto text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">
            Powered by AI
          </span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{explanation}</p>
      </div>

      {/* Confidence + Time Saved row */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`relative bg-gradient-to-br ${confBg} border rounded-2xl p-5 overflow-hidden`}>
          <div className="text-xs text-gray-500 mb-1">Confidence Score</div>
          <div className={`text-3xl font-bold ${confColor}`}>{confidenceScore}%</div>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                confidenceScore >= 70 ? "bg-emerald-400" : confidenceScore >= 40 ? "bg-amber-400" : "bg-red-400"
              }`}
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5 overflow-hidden">
          <div className="text-xs text-gray-500 mb-1">Time Saved</div>
          <div className="text-3xl font-bold text-cyan-400">{timeSaved.timeSavedPct || "0%"}</div>
          <div className="text-xs text-gray-500 mt-1">
            {timeSaved.optimizedHours}h vs {timeSaved.originalHours}h full course
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🎯</span>
            <span className="font-semibold text-white text-sm">Smart Recommendations</span>
          </div>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="text-sm text-gray-300 bg-white/3 border border-white/5 rounded-xl px-3 py-2.5 leading-relaxed">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weak / Strong areas inline */}
      {(weakAreas.length > 0 || strongAreas.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {weakAreas.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
              <div className="text-xs font-semibold text-red-400 mb-2">🔴 Needs Work</div>
              <div className="space-y-1">
                {weakAreas.map((a) => (
                  <div key={a} className="text-xs text-gray-300 bg-red-500/10 px-2 py-1 rounded-lg">{a}</div>
                ))}
              </div>
            </div>
          )}
          {strongAreas.length > 0 && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
              <div className="text-xs font-semibold text-emerald-400 mb-2">🟢 Mastered</div>
              <div className="space-y-1">
                {strongAreas.map((a) => (
                  <div key={a} className="text-xs text-gray-300 bg-emerald-500/10 px-2 py-1 rounded-lg">{a}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
