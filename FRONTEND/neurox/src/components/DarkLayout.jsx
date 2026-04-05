import React from "react";

// Reusable dark futuristic background with blobs + grid
export default function DarkLayout({ children, className = "" }) {
  return (
    <div className={`relative min-h-screen bg-[#0B0F1A] overflow-hidden ${className}`}>
      {/* Radial grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[10%] left-[30%] w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
