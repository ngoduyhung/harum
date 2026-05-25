// src/components/AdminHeader.jsx

import React from "react";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const nav = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("avatarUrl");
    nav("/login");
  };
  return (
    <header className="fixed bg-white h-hheader [width:calc(100vw-var(--spacing-wsidebar))] border-b border-gray-200 z-30">
      <div className="flex h-full justify-between items-center px-6">
        <div className="relative"></div>

        <div className="flex items-center space-x-4 ">
          <button
            className="relative cursor-pointer text-gray-500 hover:text-pblue"
            onClick={() => handleLogOut()}
          >
            <LogOut size={22} />
          </button>
          <div className="h-8 w-px bg-gray-200"></div>
          <button className="flex items-center space-x-2 text-left mr-2 ml-[-8px] hover:bg-gray-100 p-2 rounded-lg">
            <img
              className="rounded-full h-10 w-10 object-cover"
              src={
                localStorage.getItem("avatarUrl") === null
                  ? localStorage.getItem("avatarUrl")
                  : "/defaultAvatar.jpg"
              }
              alt="Admin Avatar"
            />
            <div className="hidden sm:block">
              <div className="font-semibold text-sm text-gray-800">dohuy</div>
            </div>
            {/* <ChevronDown size={16} className="text-gray-500" /> */}
          </button>
        </div>
      </div>
    </header>
  );
}
