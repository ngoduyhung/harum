/* eslint-disable no-unused-vars */
import { API_URL } from "../../../bkUrl";

import axios from "axios";
export const getPostReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/post_reports/all`);
    console.log(
      "báo cáo post: ",
      response.data?.filter((p) => p.postId !== null)
    );

    return response.data?.filter((p) => p.postId !== null);
  } catch (error) {
    console.error(`Lỗi khi lấy post report`, error);
    throw error;
  }
};
export const getPostByIdForAdmin = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${id}`);
    console.log("post cho admin: ", response.data);

    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy post cho admin`, error);
    throw error;
  }
};

export const updatePostReportStatus = async (reportId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/post_reports/${reportId}`,
      status,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("UPDATE báo cáo post: ", response);

    return response;
  } catch (error) {
    console.error(`Lỗi khi update bỏ qua post`, error);
    throw error;
  }
};
export const updatePostStatus = async (postId) => {
  try {
    const response = await axios.put(
      `${API_URL}/posts/${postId}/toggle-status`
    );
    console.log("Update post: ", response);

    return response;
  } catch (error) {
    console.error(`Lỗi khi update post`, error);
    throw error;
  }
};
