import { Flag, X } from "lucide-react";
import React, { useState, useEffect } from "react";

export const ReportModal = ({ type, isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason);
  };

  const isConfirmDisabled = reason.trim() === "";

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl mx-auto transform transition-all animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pblue transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-5">
          <Flag size={40} className="text-red-500" />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Báo cáo {type}
          </h3>
          <p className="text-gray-500 mt-2 mb-6">
            Hành động này sẽ gửi một báo cáo đến quản trị viên để xem xét.
          </p>
        </div>

        <div className="w-full mb-6">
          <label
            htmlFor="report-reason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Lý do báo cáo:
          </label>
          <textarea
            spellCheck="false"
            id="report-reason"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Vui lòng cho biết lý do bạn báo cáo ${type} này...`}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pblue focus:border-transparent outline-none transition-shadow"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-lg cursor-pointer text-gray-800 bg-gray-100 hover:bg-gray-200 font-semibold transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled} // 4. Áp dụng trạng thái disabled
            className="w-full px-4 py-2.5 rounded-lg cursor-pointer text-white bg-pblue hover:bg-sblue font-semibold transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
