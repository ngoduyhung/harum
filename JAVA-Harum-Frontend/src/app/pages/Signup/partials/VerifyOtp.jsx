// VerifyOtp.js
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function VerifyOtp({ email, onClose, onVerify }) {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error("Mã OTP phải có 6 chữ số");
      return;
    }
    onVerify(otp);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-center">Xác thực OTP</h2>
        <p className="text-sm text-center mb-4">Mã OTP đã gửi đến {email}</p>
        <input
          type="text"
          className="w-full border-2 border-text rounded-md p-2 mb-3 text-center focus:outline-sblue"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <div className="flex justify-between">
          <button
            className="bg-gray-300 px-4 py-2 rounded-md cursor-pointer"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-sblue text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={handleVerify}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
