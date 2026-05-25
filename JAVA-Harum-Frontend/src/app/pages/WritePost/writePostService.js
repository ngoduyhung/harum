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
export const createPostApi = async (post) => {
  try {
    const res = await axios.post(`${API_URL}/posts/with-blocks`, post, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("postsss:  ", res);
    return res;
  } catch (error) {
    console.error("Lỗi khi post bài: ", error);
    return error;
  }
};
