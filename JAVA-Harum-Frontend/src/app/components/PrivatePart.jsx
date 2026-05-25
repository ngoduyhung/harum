import React from "react";
import { Navigate } from "react-router-dom";
export default function PrivatePart({ children }) {
  return localStorage.getItem("user_id") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
