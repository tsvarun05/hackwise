import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AIMentorChat from "../components/AIMentorChat";
import DarkLayout from "../components/DarkLayout";
import { getModule, completeModule } from "../services/testService";
import { useAuth } from "../context/AuthContext";

export default function Learn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    // GET /modules/{moduleId} → { title, videoUrl, ... }
    getModule(id)
      .then((res) => setModule(res.data))
      .catch(() => setError("Failed to load module."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      // POST /progress → { userId, moduleId }
      await completeModule(userId, id);
      setCompleted(true);
    } catch {
      setError("Could not mark as complete. Please try again.");
    } finally {
      setCompleting(false);
    }
  };

  // Extract YouTube video ID from a full URL or use as-is if already an ID
  const getVideoId = (url = "") => {
    if (!url) return "";
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return match ? match[1] : url;
  };

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

  if (error && !module) {
    return (
      <DarkLayout>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-red-400">{error}</p>
          <button onClick={() => navigate("/roadmap")} className="btn-secondary">← Back to Roadmap</button>
        </div>
      </DarkLayout>
    );
  }

  const videoId = getVideoId(module?.videoUrl);

  return (
    <DarkLayout>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate("/roadmap")} className="hover:text-blue-400 transition-colors">
            Roadmap
          </button>
          <span className="text-gray-700">/</span>
          <span className="text-gray-400">{module?.title}</span>
        </div>

        {/* Video */}
        <div className="rounded-2xl overflow-hidden mb-8 bg-black aspect-video border border-white/5 shadow-2xl shadow-blue-500/10">
          {videoId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={module?.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              No video available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Lesson
                </span>
                {module?.concept && (
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {module.concept}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">{module?.title}</h1>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                <span>🎬 Chapter video · focused topic</span>
                <span>⏱️ ~5–15 min</span>
                {module?.orderIndex && <span>📌 Module {module.orderIndex}</span>}
              </div>
            </div>

            {module?.topics?.length > 0 && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {module.topics.map((t) => (
                    <span key={t} className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm px-3 py-1.5 rounded-full font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4">Module Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleComplete}
                  disabled={completing || completed}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {completing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : completed ? "✅ Completed!" : "Mark as Complete"}
                </button>
                <button onClick={() => navigate(`/test/${id}`)} className="btn-secondary w-full">
                  Take Module Test →
                </button>
                <button onClick={() => navigate("/roadmap")} className="btn-secondary w-full">
                  ← Back to Roadmap
                </button>
              </div>
              {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            </div>

            <div className={`bg-white/5 backdrop-blur-lg border rounded-2xl p-5 text-center ${
              completed ? "border-emerald-500/30 shadow-lg shadow-emerald-500/10" : "border-white/10"
            }`}>
              <div className="text-4xl mb-2">{completed ? "🔓" : "🔒"}</div>
              <p className="text-sm font-medium text-gray-400">
                {completed ? "Next module unlocked!" : "Complete this module to unlock the next"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <AIMentorChat />
    </DarkLayout>
  );
}
