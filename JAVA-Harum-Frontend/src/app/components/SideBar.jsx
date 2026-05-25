// src/components/SideBar.jsx

import {
  Home,
  MessageSquareQuote,
  Pencil,
  User,
  ChartLine
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

// Tách menuItems ra ngoài để dễ quản lý
const menuItems = [
  {
    id: "users",
    name: "Quản lý Người dùng",
    path: "/admin/users",
    icon: <User size={20} />,
  },
  {
    id: "posts",
    name: "Báo cáo Bài viết",
    path: "/admin/posts",
    icon: <Pencil size={20} />,
  },
  {
    id: "comments",
    name: "Báo cáo Bình luận",
    path: "/admin/comments",
    icon: <MessageSquareQuote size={20} />,
  },
   {
    id: "dashboard",
    name: "Thống kê",
    path: "/admin/dashboard", 
    icon: <  ChartLine size={20} />,
  },
];

export default function SideBar() {
  return (
    <aside className="w-wsidebar bg-slate-800 text-gray-300 fixed h-screen flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center p-6 border-b border-slate-700">
        <img src="/logo.svg" className="h-12" alt="Logo" />
        <h1 className="ml-3 text-xl font-bold text-white">Admin</h1>
      </div>

      <nav className="flex-1 mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center py-3 px-6 mx-3 my-1 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-pblue text-white shadow-md"
                      : "hover:bg-slate-700 hover:text-white"
                  }`
                }
              >
                <span className="mr-4">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700 text-center text-xs text-slate-500">
        <div>© 2025 Harum08</div>
      </div>
    </aside>
  );
}
