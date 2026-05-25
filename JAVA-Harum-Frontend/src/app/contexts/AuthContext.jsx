// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const avatarUrl = localStorage.getItem("avatarUrl");
    const role = localStorage.getItem("role");

    if (userId) {
      setUser({
        id: userId,
        avatarUrl: avatarUrl,
        role: role,
      });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("avatarUrl", userData.avatarUrl);
    localStorage.setItem("role", userData.role);

    setUser(userData);
  };

  // HÀM LOGOUT ĐƯỢC CẬP NHẬT
  const logout = () => {
    // 1. Xóa các item trong localStorage
    localStorage.removeItem("user_id");
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("role");

    setUser(null);
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook giữ nguyên
export const useAuth = () => {
  return useContext(AuthContext);
};
