import React from "react";
import { useNavigate } from "react-router-dom";
import DarkLayout from "../components/DarkLayout";

const features = [
  { icon: "🧠", title: "AI-Powered Assessment", desc: "Identifies exactly what you know and what you don't.", color: "from-blue-500/20 to-transparent", border: "border-blue-500/20" },
  { icon: "🗺️", title: "Personalized Roadmap", desc: "A custom learning path built just for you.", color: "from-purple-500/20 to-transparent", border: "border-purple-500/20" },
  { icon: "⚡", title: "Save Time", desc: "Skip what you already know. Learn only what matters.", color: "from-cyan-500/20 to-transparent", border: "border-cyan-500/20" },
  { icon: "📊", title: "Track Progress", desc: "Visual dashboards to keep you motivated.", color: "from-pink-500/20 to-transparent", border: "border-pink-500/20" },
];

const stats = [
  { value: "40+", label: "Hours Saved" },
  { value: "10k+", label: "Learners" },
  { value: "95%", label: "Pass Rate" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <DarkLayout>
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Neurox
          </span>
        </div>
        <button onClick={() => navigate("/login")} className="btn-secondary text-sm">
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400
                        text-sm font-medium px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          AI-Powered Smart Curriculum Designer
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Learn anything{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              faster with AI
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-blue-500 to-cyan-500 opacity-50" />
          </span>
        </h1>

        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Neurox builds a personalized learning roadmap by assessing your current knowledge —
          skip what you already know and focus on what actually matters.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate("/register")}
            className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-blue-500/20"
          >
            Get Started Free →
          </button>
          <button
            onClick={() => navigate("/login")}
            className="btn-secondary text-base px-8 py-3.5"
          >
            I have an account
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Time saved badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20
                        text-emerald-400 text-sm px-5 py-2.5 rounded-full">
          <span>⏱️</span>
          <span>Users save an average of <strong>40+ hours</strong> of unnecessary learning</span>
        </div>
      </section>

      {/* Floating AI icons */}
      <div className="absolute top-32 left-10 text-4xl animate-float opacity-20 pointer-events-none hidden lg:block">🤖</div>
      <div className="absolute top-48 right-16 text-3xl animate-float opacity-20 pointer-events-none hidden lg:block" style={{ animationDelay: "1.5s" }}>🧠</div>
      <div className="absolute top-80 left-24 text-2xl animate-float opacity-15 pointer-events-none hidden lg:block" style={{ animationDelay: "0.8s" }}>⚡</div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why Neurox?</h2>
          <p className="text-gray-500">Everything you need to learn smarter, not harder.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title}
              className={`relative bg-white/5 backdrop-blur-lg border ${f.border} rounded-2xl p-6
                          hover:bg-white/8 hover:scale-[1.03] transition-all duration-300 overflow-hidden group`}>
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${f.color}`} />
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 pb-8 border-t border-white/5 pt-6">
        Built with ❤️ for learners everywhere · Neurox 2024
      </footer>
    </DarkLayout>
  );
}
