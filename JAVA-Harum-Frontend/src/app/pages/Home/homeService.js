/* eslint-disable no-unused-vars */
import axios from "axios";
import { API_URL } from "../../../bkUrl";

export const getTopPosts = async () => {
  try {
    const res = await axios.get(`${API_URL}/posts/top?page=1&size=10`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy Top Posts :", error);
    throw error;
  }
};
export const getPopularPosts = async () => {
  try {
    const res = await axios.get(`${API_URL}/posts/popular?page=1&size=10`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy popular posts :", error);
    return error;
  }
};
export const getForYouPosts = async ({ userId, pageParam = 1, size = 8 }) => {
  try {
    const res = await axios.get(
      `${API_URL}/recommend/${userId}?page=${pageParam}&size=${size}`
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy for you:", error);
    throw error;
  }
};

export const getFollowPosts = async ({ userId, pageParam = 1 }) => {
  try {
    const res = await axios.get(
      `${API_URL}/posts/popular?page=${pageParam}&size=8`
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy follow:", error);
    throw error;
  }
};
