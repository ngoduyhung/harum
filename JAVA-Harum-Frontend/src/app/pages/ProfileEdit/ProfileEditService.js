import { API_URL } from "../../../bkUrl";
import axios from "axios";

export const getUserProfileApi = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile/${userId}`);
    return response.data;
  } catch (err) {
    console.error("Lỗi khi gọi API lấy profile:", err);
    throw err;
  }
};

export const updateUserProfileApi = async (userId, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/profile/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("sau khi cập nhật: ", response);
    return response;
  } catch (err) {
    console.error("Lỗi khi cập nhật profile:", err);
    throw err;
  }
};

export const changePassword = async (request) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/change-password`,
      request
    );
    console.log("đổi mật khẩu: ", response);
    return response;
  } catch (err) {
    console.error("Lỗi khi gọi API lấy profile:", err);
    throw err;
  }
};
export const getAllTopic = async () => {
  try {
    const res = await axios.get(`${API_URL}/topics`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chủ đề:", error);
    throw error;
  }
};

export const updateUserTopicsApi = async (userId, payload) => {
  try {
 
    const response = await axios.post(
      `${API_URL}/users/favorite-topics/${userId}`,
      payload 
    );
    console.log("Dữ liệu trả về sau khi cập nhật:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sở thích người dùng:", error);
    throw error;
  }
};
