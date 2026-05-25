import { API_URL } from "../../../bkUrl";
import axios from "axios";

export const getOtherUserProfileApi = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile/${userId}`);
    console.log("Dữ liệu profile user khác:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy profile userId=${userId}:`, error);
  }
};
export const getPostsByUserApi = async (userId, page = 1, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}/posts/user/${userId}`, {
      params: { page, size },
    });
    console.log("bài: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết của user:", error);
    throw error;
  }
};
export const checkFollow = async (followerId, followedId) => {
  try {
    const res = await axios.get(
      `${API_URL}/follow/check/${followerId}/${followedId}`
    );

    return res;
  } catch (error) {
    console.error("Lỗi khi xem follow:", error);
    return error;
  }
};
export const doFollow = async (followerId, followedId) => {
  try {
    const res = await axios.post(
      `${API_URL}/follow/interact/${followerId}/${followedId}`
    );

    return res;
  } catch (error) {
    console.error("Lỗi khi follow:", error);
    return error;
  }
};
