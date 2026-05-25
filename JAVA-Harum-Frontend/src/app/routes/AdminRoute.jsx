import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  if (!localStorage.getItem("user_id")) {
    return <Navigate to="/login" replace />;
  }

  // Logic kiểm tra vai trò vẫn chính xác
  if (localStorage.getItem("role") !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
