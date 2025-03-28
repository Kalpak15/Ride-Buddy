// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Changed to named import
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token); // Use named jwtDecode
    const currentTime = Date.now() / 1000; // Current time in seconds

    // If token is expired, log out and redirect
    if (decoded.exp < currentTime) {
      dispatch(logout());
      return <Navigate to="/login" replace />;
    }

    // Token is valid, render children
    return children;
  } catch (error) {
    // Invalid token, log out and redirect
    console.error("Invalid token:", error);
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
