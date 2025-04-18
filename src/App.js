import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.js";
import Login from "./pages/Login/Login.js";
import Register from "./pages/Register/Register.js";
import Navbar from "./components/Navbar/Navbar.js";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check token in localStorage
  return token ? children : <Navigate to="/login" />;
};
const AuthProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check token in localStorage
  return token ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <AuthProtectedRoute>
              <Login />
            </AuthProtectedRoute>
          }
        />
        <Route path="/register" element={
          <AuthProtectedRoute>
          <Register />
        </AuthProtectedRoute>} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
