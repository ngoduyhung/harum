import { ShieldAlert, X } from "lucide-react";
import React from "react";

export const LoginRequiredModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto transform transition-all animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pblue transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-5">
          <ShieldAlert size={40} className="text-pblue" />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">Yêu cầu đăng nhập</h3>
          <p className="text-gray-500 mt-2 mb-8">
            Bạn cần đăng nhập để có thể tiếp tục thực hiện hành động này.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-lg cursor-pointer text-gray-800 bg-gray-100 hover:bg-gray-200 font-semibold transition-all"
          >
            Để sau
          </button>
          <button
            onClick={onLogin}
            className="w-full px-4 py-2.5 rounded-lg cursor-pointer text-white bg-pblue hover:bg-sblue font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};
