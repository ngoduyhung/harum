/* eslint-disable no-unused-vars */
import { API_URL } from "../../../bkUrl";

import axios from "axios";
export const getCommentReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/comment_reports/all`);
    console.log("báo cáo comment: ", response.data);

    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy post report`, error);
    throw error;
  }
};
export const updateCommentReportStatus = async (reportId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/comment_reports/${reportId}`,
      status,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("UPDATE báo cáo comment: ", response);

    return response;
  } catch (error) {
    console.error(`Lỗi khi update bỏ qua báo cáo`, error);
    throw error;
  }
};
export const updateCommentStatus = async (commentId) => {
  try {
    const response = await axios.put(
      `${API_URL}/comment/${commentId}/toggle-status`
    );
    console.log("Update comment: ", response);

    return response;
  } catch (error) {
    console.error(`Lỗi khi update comment`, error);
    throw error;
  }
};
