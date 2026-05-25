import React, { useState, useMemo } from "react";
import { changePassword } from "../ProfileEditService";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";

// Component con để hiển thị các yêu cầu của mật khẩu
const PasswordValidationInfo = ({ password }) => {
  const validations = useMemo(() => {
    return [
      { rule: /.{6,}/, text: "Ít nhất 6 ký tự" },
      { rule: /[A-Z]/, text: "Ít nhất một chữ hoa (A-Z)" },
      { rule: /[a-z]/, text: "Ít nhất một chữ thường (a-z)" },
      { rule: /[0-9]/, text: "Ít nhất một chữ số (0-9)" },
      { rule: /[!@#$%^&*(),.?":{}|<>]/, text: "Ít nhất một ký tự đặc biệt" },
    ];
  }, []);

  return (
    <div className="mt-2 space-y-1 text-sm">
      {validations.map((v, index) => {
        const isValid = v.rule.test(password);
        return (
          <div
            key={index}
            className={`flex items-center gap-2 ${
              isValid ? "text-green-600" : "text-gray-500"
            }`}
          >
            {isValid ? (
              <CheckCircle2 size={16} />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
            )}
            <span>{v.text}</span>
          </div>
        );
      })}
    </div>
  );
};

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu cũ.";
    }

    // Kiểm tra các quy tắc cho mật khẩu mới
    if (!/.{6,}/.test(newPassword))
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự.";
    else if (!/[A-Z]/.test(newPassword))
      newErrors.newPassword = "Mật khẩu phải chứa ít nhất một chữ hoa.";
    else if (!/[a-z]/.test(newPassword))
      newErrors.newPassword = "Mật khẩu phải chứa ít nhất một chữ thường.";
    else if (!/[0-9]/.test(newPassword))
      newErrors.newPassword = "Mật khẩu phải chứa ít nhất một chữ số.";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword))
      newErrors.newPassword = "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage({ type: "", text: "" });

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const request = {
        userId: localStorage.getItem("user_id"),
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      };

      const res = await changePassword(request); // API call
      if (res.data === "Old password is incorrect") {
        setApiMessage({
          type: "error",
          text: "Mật khẩu cũ không đúng!",
        });
        return;
      }
      setApiMessage({
        type: "success",
        text: "Mật khẩu đã được cập nhật thành công!",
      });
      // Reset form
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Giả sử API trả về lỗi trong error.response.data.message
      const errorMessage =
        error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      setApiMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="w-full  mx-auto bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Đổi mật khẩu
        </h2>

        {apiMessage.text && (
          <div
            className={`p-3 rounded-md mb-6 text-center ${
              apiMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {apiMessage.text}
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="currentPassword"
          >
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition-shadow duration-200 ${
                errors.currentPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-sblue"
              } focus:outline-none focus:ring-2`}
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("current")}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            >
              {showPasswords.current ? (
                <EyeOff className="hover:text-pblue cursor-pointer" size={20} />
              ) : (
                <Eye className="hover:text-pblue cursor-pointer" size={20} />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="newPassword"
          >
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition-shadow duration-200 ${
                errors.newPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-sblue"
              } focus:outline-none focus:ring-2`}
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("new")}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            >
              {showPasswords.new ? (
                <EyeOff className="hover:text-pblue cursor-pointer" size={20} />
              ) : (
                <Eye className="hover:text-pblue cursor-pointer" size={20} />
              )}
            </button>
          </div>
          <PasswordValidationInfo password={passwords.newPassword} />
          {errors.newPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="confirmPassword"
          >
            Nhập lại mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition-shadow duration-200 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-sblue"
              } focus:outline-none focus:ring-2`}
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("confirm")}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            >
              {showPasswords.confirm ? (
                <EyeOff size={20} className="hover:text-pblue cursor-pointer" />
              ) : (
                <Eye className="hover:text-pblue cursor-pointer" size={20} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-pblue hover:bg-sblue  text-white font-bold rounded-lg  cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận thay đổi"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
