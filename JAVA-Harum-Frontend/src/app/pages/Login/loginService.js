import { API_URL } from "../../../bkUrl";
import axios from "axios";

export const handleLoginApi = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: email,
      passwordHash: password,
    });
    console.log("đăng nhập: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
  }
};
export const handleForgotPasswordApi = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/forgot-password?email=${email}`
    );
    console.log(response);

    return response;
  } catch (error) {
    console.error("Lỗi ", error);
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
