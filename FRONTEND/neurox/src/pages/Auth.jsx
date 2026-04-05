import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register, login as loginUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import DarkLayout from "../components/DarkLayout";

export default function Auth() {
  const location = useLocation();
  const isRegister = location.pathname === "/register";
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = isRegister ? await register(form) : await loginUser(form);
      // Backend returns { id, username, email, name, token }
      const { token, ...userData } = res.data;
      login(userData, token || "");
      navigate(isRegister ? "/interests" : "/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message
                || err.response?.data?.error
                || (err.response?.status === 401 ? "Invalid email or password" : null)
                || (err.response?.status === 409 ? "An account with this email already exists" : null)
                || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DarkLayout className="flex items-center justify-center px-4">
      <div className="w-full max-w-md py-16">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isRegister ? "Start your personalized learning journey" : "Continue where you left off"}
          </p>
        </div>

        {/* Glass card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-blue-500/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input
                  className="input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3.5 mt-2 shadow-xl shadow-blue-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Please wait...
                </span>
              ) : isRegister ? "Start Learning →" : "Sign In →"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <p className="text-center text-sm text-gray-500">
            {isRegister ? "Already have an account?" : "New to Neurox?"}{" "}
            <button
              onClick={() => navigate(isRegister ? "/login" : "/register")}
              className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
            >
              {isRegister ? "Sign in" : "Create account"}
            </button>
          </p>
        </div>
      </div>
    </DarkLayout>
  );
}
