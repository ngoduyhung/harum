// src/layouts/AdminLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import AdminHeader from "../components/AdminHeader";

export default function AdminLayout() {
  return (
    // Nền chính của toàn bộ khu vực nội dung (phần bên phải sidebar)
    <div className="bg-gray-100 min-h-screen">
      <SideBar />

      {/* Container cho phần nội dung bên phải */}
      <div className="ml-wsidebar">
        <AdminHeader />

        {/* Khu vực nội dung chính, có padding và cách header một khoảng */}
        <main className="p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
