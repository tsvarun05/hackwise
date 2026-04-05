import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Interests from "./pages/Interests";
import Assessment from "./pages/Assessment";
import Roadmap from "./pages/Roadmap";
import Learn from "./pages/Learn";
import ModuleTest from "./pages/ModuleTest";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CoursePage from "./pages/CoursePage";
import UnitQuizPage from "./pages/UnitQuizPage";

// Protect routes that require login
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />

      <Route path="/interests" element={<PrivateRoute><Interests /></PrivateRoute>} />
      <Route path="/assessment" element={<PrivateRoute><Assessment /></PrivateRoute>} />
      <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
      <Route path="/course/:courseId" element={<PrivateRoute><CoursePage /></PrivateRoute>} />
      <Route path="/quiz/:unitId" element={<PrivateRoute><UnitQuizPage /></PrivateRoute>} />
      <Route path="/learn/:id" element={<PrivateRoute><Learn /></PrivateRoute>} />
      <Route path="/test/:id" element={<PrivateRoute><ModuleTest /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
