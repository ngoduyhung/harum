/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ForgetPassword from "./partials/ForgetPassword";
import { Eye, EyeOff, X } from "lucide-react";
import { getUserById, handleLoginApi } from "./loginService";
import { sGlobalInfo } from "../../stores/globalStore";

export default function Login() {
  const nav = useNavigate();
  const [isShowModal, setIsShowModal] = useState(false);
  const [isRememberPassword, setIsRememberPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHidePassword, setIsHidePassword] = useState(true);
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    setSavedAccounts(accounts);
  }, []);

  const handleForgotPassword = () => {
    setIsShowModal(true);
  };

  const toggleHidePassword = () => {
    setIsHidePassword(!isHidePassword);
  };

  const loggin = async () => {
    try {
      const res = await handleLoginApi(email, password);
      if (!res) {
        setErrorMsg(
          "Sai thông tin đăng nhập hoặc tài khoản đã bị vô hiệu hóa."
        );
      } else {
        setErrorMsg("");
        localStorage.setItem("user_id", res?.id);
        sGlobalInfo.set((pre) => {
          pre.value.userId = res?.id;
          pre.value.userName = res?.username;
        });
        if (isRememberPassword) {
          const updatedAccounts = [
            ...savedAccounts.filter((acc) => acc.email !== email),
            { email, password },
          ];
          localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
        }
        const resUser = await getUserById(res?.id);
        localStorage.setItem("avatarUrl", resUser.avatarUrl);
        localStorage.setItem("role", res.role);
        if (res.role === "USER") nav("/");
        else nav("/admin/users");
      }
    } catch (error) {
      setErrorMsg("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setErrorMsg("");

    if (!password || !email) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setIsLoading(true);
    loggin();
  };

  const handleSelectAccount = (selectedEmail) => {
    const selectedAccount = savedAccounts.find(
      (acc) => acc.email === selectedEmail
    );
    if (selectedAccount) {
      setEmail(selectedAccount.email);
      setPassword(selectedAccount.password);
    }
    setShowDropdown(false);
  };

  const handleDeleteAccount = (e, deletedEmail) => {
    e.stopPropagation();
    const updatedAccounts = savedAccounts.filter(
      (acc) => acc.email !== deletedEmail
    );
    setSavedAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errorMsg) setErrorMsg("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMsg) setErrorMsg("");
  };

  return (
    <div className="p-10 rounded-sm shadow-lg w-full max-w-sm bg-white">
      <div className="flex flex-col items-center">
        <div>
          <img className="h-12" src="/logoFull.svg" alt="Logo" />
        </div>
        <div className="font-semibold text-sblue text-xl mt-2">Đăng nhập</div>

        <div className="relative w-[306px] mt-6">
          <p className="text-text font-medium">Email</p>
          <input
            className="w-full mt-2 mb-4 h-9 px-2 border-2 border-text rounded-md focus:outline-sblue"
            value={email}
            onChange={handleEmailChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {showDropdown && savedAccounts.length > 0 && (
            <div className="absolute w-full z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-[-10px]">
              {savedAccounts.map((acc, index) => (
                <div
                  key={index}
                  onMouseDown={() => handleSelectAccount(acc.email)}
                  className="p-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                >
                  <span>{acc.email}</span>
                  <button
                    onClick={(e) => handleDeleteAccount(e, acc.email)}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-[306px]">
          <p className="text-text font-medium">Mật khẩu</p>
          <div className="relative">
            <input
              type={isHidePassword ? "password" : "text"}
              className="w-full mt-2 mb-4 h-9 px-2 border-2 border-text rounded-md focus:outline-sblue"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              onClick={toggleHidePassword}
              className="absolute top-7 -translate-y-1/2 right-2 p-1"
            >
              {isHidePassword ? (
                <Eye className="text-text h-5 cursor-pointer hover:text-sblue" />
              ) : (
                <EyeOff className="text-text h-5 cursor-pointer hover:text-sblue" />
              )}
            </button>
          </div>
        </div>

        <div className="w-[306px] flex justify-between items-center mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 border-1 border-text rounded-sm accent-sblue"
              checked={isRememberPassword}
              onChange={(e) => setIsRememberPassword(e.target.checked)}
            />
            <label
              htmlFor="remember"
              className="text-sm text-text ml-2 cursor-pointer"
            >
              Nhớ mật khẩu
            </label>
          </div>
          <div
            className="font-medium cursor-pointer text-sm text-sblue hover:text-pblue"
            onClick={handleForgotPassword}
          >
            Quên mật khẩu?
          </div>
        </div>

        <div
          className={`rounded-md cursor-pointer flex justify-center items-center w-[306px] h-9 transition-colors
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-sblue hover:bg-pblue"
            }`}
          onClick={!isLoading ? handleLogin : undefined}
        >
          <p className="font-medium text-white">
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </p>
        </div>

        {/* 4. Hiển thị thông báo lỗi tại đây */}
        {errorMsg && (
          <div className="w-[306px] mt-3 text-center">
            <p className="text-red-500 text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="flex mt-4">
          <p className="text-text text-sm mr-1">Chưa có tài khoản?</p>
          <p
            className="text-sblue underline text-sm font-medium hover:text-pblue cursor-pointer"
            onClick={() => {
              nav("/signup");
            }}
          >
            Đăng ký
          </p>
        </div>
      </div>

      {isShowModal && (
        <ForgetPassword
          onBack={() => {
            setIsShowModal(false);
            setErrorMsg("");
          }}
        />
      )}
    </div>
  );
}
