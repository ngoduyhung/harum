import { API_URL } from "../../../bkUrl";
import axios from "axios";
export const getTopics = async () => {
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
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sở thích người dùng:", error);
    throw error;
  }
};
