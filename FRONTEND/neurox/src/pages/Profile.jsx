import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import AIMentorChat from "../components/AIMentorChat";
import DarkLayout from "../components/DarkLayout";
import { getDashboard } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const MOCK_PROFILE = {
  joinDate: "March 2024",
  domain: "Artificial Intelligence",
  completionPct: 0,
  modulesCompleted: 0,
  totalModules: 0,
  streak: 0,
  hoursSaved: 0,
  badges: [],
};

export default function Profile() {
  const { user, userId, logout } = useAuth();
  const [profile, setProfile] = useState(MOCK_PROFILE);

  useEffect(() => {
    if (!userId) return;
    getDashboard(userId)
      .then((res) => setProfile({ ...MOCK_PROFILE, ...res.data }))
      .catch(() => {});
  }, [userId]);

  return (
    <DarkLayout>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Profile header */}
        <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/30">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#0B0F1A] shadow-lg shadow-emerald-400/50" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {profile.domain}
                </span>
                <span className="text-xs text-gray-600">Joined {profile.joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Completion", value: `${profile.progress ?? profile.completionPct ?? 0}%`, icon: "📈", color: "text-blue-400", border: "border-blue-500/20" },
            { label: "Modules", value: profile.totalModules ? `${profile.modulesCompleted}/${profile.totalModules}` : (profile.modulesCompleted ?? 0), icon: "📚", color: "text-purple-400", border: "border-purple-500/20" },
            { label: "Streak", value: `${profile.streak ?? 0} days`, icon: "🔥", color: "text-orange-400", border: "border-orange-500/20" },
            { label: "Hours Saved", value: `${profile.hoursSaved ?? 0}h`, icon: "⏱️", color: "text-cyan-400", border: "border-cyan-500/20" },
          ].map((s) => (
            <div key={s.label} className={`bg-white/5 backdrop-blur-lg border ${s.border} rounded-2xl p-5 text-center`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-white mb-5">Learning Progress</h3>
          <div className="space-y-5">
            <ProgressBar value={profile.progress ?? profile.completionPct ?? 0} max={100} label="Overall Completion" color="indigo" />
            {profile.totalModules > 0 && (
              <ProgressBar value={profile.modulesCompleted ?? 0} max={profile.totalModules} label="Modules Completed" color="purple" />
            )}
            {(profile.streak ?? 0) > 0 && (
              <ProgressBar value={profile.streak} max={30} label="Streak (days)" color="green" />
            )}
          </div>
        </div>

        {/* Badges */}
        {profile.badges?.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-white mb-4">Achievements</h3>
            <div className="flex flex-wrap gap-3">
              {profile.badges.map((b) => (
                <div key={b.label} className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl ${b.color}`}>
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-sm font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account */}
        <div className="bg-white/5 backdrop-blur-lg border border-red-500/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-3">Account</h3>
          <button onClick={logout}
            className="text-sm text-red-400 hover:text-red-300 font-medium border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all duration-200">
            Sign Out
          </button>
        </div>
      </div>
      <AIMentorChat />
    </DarkLayout>
  );
}
