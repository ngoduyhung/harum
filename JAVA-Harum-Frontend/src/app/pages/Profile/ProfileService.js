import { API_URL } from "../../../bkUrl";
import axios from "axios";

export const getUserProfileApi = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile/${userId}`);
    console.log("Dữ liệu profile user", response.data);
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
    console.log("bài viết của toi: ", response.data);

    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết của user:", error);
    throw error;
  }
};
export const getSavePostsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/saved-posts/user/${userId}`);
    console.log("bài viết đã lưu: ", response.data);

    return response;
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã lưu:", error);
    throw error;
  }
};
export const getFollowedByUserApi = async (userId, page = 0, size = 9) => {
  try {
    const response = await axios.get(
      `${API_URL}/follow/followed-users/${userId}/${page}/${size}`
    );
    console.log("follow  stoi: ", response);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người theo dõi của user:", error);
    throw error;
  }
};
export const unFollow = async (followerId, followedId) => {
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
export const unSave = async (save) => {
  try {
    const res = await axios.post(`${API_URL}/saved-posts/interact`, save);

    return res;
  } catch (error) {
    console.error("Lỗi khi save:", error);
    return error;
  }
};
