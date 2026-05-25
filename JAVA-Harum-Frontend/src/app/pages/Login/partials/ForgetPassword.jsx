/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { handleForgotPasswordApi } from "../loginService";

export default function ForgetPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" }); // Lưu trạng thái thông báo
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const forgotPassword = async () => {
    if (!email.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập email" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" }); // Xóa thông báo cũ trước khi gửi

      const res = await handleForgotPasswordApi(email);

      if (res?.status === 200) {
        setMessage({
          type: "success",
          text: "Chúng tôi đã gửi mật khẩu mới đến email của bạn. Vui lòng kiểm tra email.",
        });
        setEmail(""); // Xóa input sau khi gửi thành công
      } else {
        setMessage({
          type: "error",
          text: res?.data?.message || "Email chưa đăng ký tài khoản.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Lỗi kết nối. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white backdrop-opacity-30 flex items-center justify-center">
      <div className="p-10 rounded-sm shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="font-semibold text-sblue text-xl mb-3">
            Quên mật khẩu
          </div>
          <p className="text-text font-medium text-sm mb-4">
            Nhập Email của bạn để nhận liên kết đặt lại mật khẩu
          </p>
          <div className="w-full">
            <label className="text-text font-medium">Email</label>
            <input
              type="email"
              className="w-full h-9 mt-2 px-2 border-2 border-text rounded-md focus:outline-sblue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Hiển thị thông báo */}
          {message.text && (
            <p
              className={`text-sm mt-2 ${
                message.type === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {message.text}
            </p>
          )}

          {/* Nút xác nhận */}
          <button
            className="bg-sblue text-white font-medium rounded-md w-full h-9 mt-4 hover:bg-pblue disabled:bg-gray-400"
            onClick={forgotPassword}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Xác nhận"}
          </button>

          {/* Nút quay lại */}
          <p
            className="text-sblue text-sm mt-4 font-medium cursor-pointer"
            onClick={onBack}
          >
            Quay lại đăng nhập
          </p>
        </div>
      </div>
    </div>
  );
}
