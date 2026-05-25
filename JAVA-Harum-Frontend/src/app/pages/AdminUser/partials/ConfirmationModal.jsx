// src/pages/admin/components/ConfirmationModal.jsx

import React from "react";
import { X, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";

const icons = {
  danger: <AlertTriangle size={40} className="text-red-500" />,
  success: <ShieldCheck size={40} className="text-green-500" />,
};

const buttonClasses = {
  danger: "bg-red-600 hover:bg-red-700",
  success: "bg-green-600 hover:bg-green-700",
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  variant = "danger",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto transform transition-all animate-scale-in">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-pblue transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <X size={24} />
        </button>

        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-${
            variant === "danger" ? "red" : "green"
          }-100 mb-5`}
        >
          {icons[variant]}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500 mt-2 mb-8">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-lg cursor-pointer text-gray-800 bg-gray-100 hover:bg-gray-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full px-4 py-2.5 rounded-lg cursor-pointer text-white ${buttonClasses[variant]} font-semibold transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-wait flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
