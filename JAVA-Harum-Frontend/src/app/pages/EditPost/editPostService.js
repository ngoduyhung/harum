import axios from "axios";
import { API_URL } from "../../../bkUrl";

export const getTopics = async () => {
  try {
    const res = await axios.get(`${API_URL}/topics`);
    console.log("topics này: ", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy topics:", error);
    return error;
  }
};
export const getPostById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/posts/${id}`);
    console.log("post này: ", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy post:", error);
    return error;
  }
};
export const updatePostApi = async (id, post) => {
  try {
    const res = await axios.put(`${API_URL}/posts/with-blocks/${id}`, post, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("res khi puttt:  ", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi put bài: ", error);
    return error;
  }
};
