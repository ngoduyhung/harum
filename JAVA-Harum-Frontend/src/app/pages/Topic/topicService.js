/* eslint-disable no-unused-vars */
import axios from "axios";
import { API_URL } from "../../../bkUrl";

export const getPostsByTopic = async ({ id, pageParam = 1 }) => {
  console.log("id khi gọi api ", id);
  try {
    const res = await axios.get(
      `${API_URL}/posts/topic/${id}?page=${pageParam}&size=10`
    );
    console.log("post theo topic này: ", res?.data);
    return res?.data;
  } catch (error) {
    console.error("Lỗi khi lấy post theo topic:", error);
    return error;
  }
};
export const getTopicDetails = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/topics/${id}`);
    console.log("detail theo topic này: ", res);
    return res?.data;
  } catch (error) {
    console.error("Lỗi khi lấy topic:", error);
    return error;
  }
};
export const getForYouPosts = async ({ userId, topicId, pageParam = 1 }) => {
  try {
    const res = await axios.get(
      `${API_URL}/recommend/${userId}/by-topic/${topicId}?page=${pageParam}&size=8`
    );
    console.log("For you này (page " + pageParam + "): ", res.data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy for you:", error);
    throw error;
  }
};
export const getTopPosts = async ({ pageParam = 1 }) => {
  try {
    const res = await axios.get(
      `${API_URL}/posts/top?page=${pageParam}&size=10`
    );
    return res?.data;
  } catch (error) {
    console.error("Lỗi khi lấy top posts:", error);
    throw error;
  }
};