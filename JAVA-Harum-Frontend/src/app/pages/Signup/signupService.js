import { API_URL } from "../../../bkUrl";
import axios from "axios";

export const handleSignUpApi = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      username: username,
      email: email,
      passwordHash: password,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("FULL ERROR:", error);

    console.log("STATUS:", error.response?.status);

    console.log("RESPONSE DATA:", error.response?.data);

    console.log("REQUEST DATA:", error.config?.data);
  }
};
export const handleVerifyOtpApi = async (email, otp, user) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, {
      email: email,
      otp: otp,
      user: user,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Lỗi khi xác thực:", error);
    return error;
  }
};
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sau đăng nhập:", error);
  }
};
