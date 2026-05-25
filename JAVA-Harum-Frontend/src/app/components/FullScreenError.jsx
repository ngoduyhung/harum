// src/components/FullScreenError.jsx
import React from "react";
import { AlertTriangle } from "lucide-react"; // Icon để trông chuyên nghiệp hơn

// Component này nhận vào `error` và hàm `onRetry`
export default function FullScreenError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h1>
      <p className="text-gray-600 mb-6">
        Không thể tải được dữ liệu cần thiết cho trang.
      </p>
    </div>
  );
}
