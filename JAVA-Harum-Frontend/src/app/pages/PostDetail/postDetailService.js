import axios from "axios";
import { API_URL } from "../../../bkUrl";

export const getPosticbyId = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/posts/${id}`);

    return res;
  } catch (error) {
    console.error("Lỗi khi lấy post:", error);
    return error;
  }
};
export const getVote = async (userId, postId) => {
  try {
    const res = await axios.get(`${API_URL}/vote/check/${userId}/${postId}`);

    return res;
  } catch (error) {
    console.error("Lỗi khi lấy vote:", error);
    return error;
  }
};
export const doVote = async (vote) => {
  try {
    const res = await axios.post(`${API_URL}/vote/interact`, vote);

    return res;
  } catch (error) {
    console.error("Lỗi khi vote:", error);
    return error;
  }
};
export const checkSave = async (userId, postId) => {
  try {
    const res = await axios.get(
      `${API_URL}/saved-posts/check/${userId}/${postId}`
    );

    return res;
  } catch (error) {
    console.error("Lỗi khi xem lưu:", error);
    return error;
  }
};
export const doSave = async (savedPosts) => {
  try {
    const res = await axios.post(`${API_URL}/saved-posts/interact`, savedPosts);
    return res;
  } catch (error) {
    console.error("Lỗi khi save:", error);
    return error;
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
export const getComment = async (postId) => {
  try {
    const res = await axios.get(`${API_URL}/comment/post/${postId}`);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy comment:", error);
    return error;
  }
};
export const postComment = async (comment) => {
  try {
    const res = await axios.post(`${API_URL}/comment`, comment);

    return res;
  } catch (error) {
    console.error("Lỗi khi post comment:", error);
    return error;
  }
};
export const postReply = async (parentId, comment) => {
  try {
    const res = await axios.post(
      `${API_URL}/comment/${parentId}/reply`,
      comment
    );

    return res;
  } catch (error) {
    console.error("Lỗi khi post reply:", error);
    return error;
  }
};
export const doReport = async (report) => {
  try {
    const res = await axios.post(`${API_URL}/post_reports`, report);

    return res;
  } catch (error) {
    console.error("Lỗi khi report post:", error);
    return error;
  }
};
export const doReportComment = async (report) => {
  try {
    const res = await axios.post(`${API_URL}/comment_reports`, report);

    return res;
  } catch (error) {
    console.error("Lỗi khi report comment:", error);
    return error;
  }
};

export const createPostInteractionAndCompareElo = async (postInteraction) => {
  try {
    const res = await axios.post(
      `${API_URL}/post-interactions/create-and-compare-elo`,
      postInteraction
    );
    return res;
  } catch (error) {
    console.error("Lỗi khi tạo postInteraction và so sánh elo:", error);
    return error;
  }
};
