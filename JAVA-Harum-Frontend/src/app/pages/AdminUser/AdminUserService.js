// src/pages/admin/AdminUserService.js

import { API_URL } from "../../../bkUrl";
import axios from "axios";

/**
 * Lấy danh sách người dùng với phân trang và bộ lọc từ server.
 * @param {object} params - Các tham số cho query.
 * @param {number} params.page - Số trang (bắt đầu từ 1).
 * @param {number} params.size - Kích thước trang.
 * @param {string} [params.searchTerm] - Từ khóa tìm kiếm.
 * @param {string} [params.role] - Vai trò cần lọc.
 * @returns {Promise<object>} Dữ liệu phân trang trả về từ API.
 */
export const getUsers = async (params) => {
  try {
    // Tạo bản sao để xử lý, đảm bảo page là 0-based cho API
    const apiParams = {
      ...params,
      page: params.page, // Chuyển đổi từ 1-based (UI) sang 0-based (API)
    };

    // Xóa các trường rỗng hoặc không cần thiết
    if (!apiParams.searchTerm) {
      delete apiParams.searchTerm;
    }
    if (apiParams.role === "ALL") {
      delete apiParams.role;
    }

    const response = await axios.get(`${API_URL}/users`, { params: apiParams });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách người dùng:`, error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái của người dùng.
 * @param {string} userId - ID của người dùng.
 * @param {object} body - Dữ liệu cần cập nhật.
 * @param {string} body.status - Trạng thái mới ('ENABLE' hoặc 'DISABLE').
 * @param {string} body.emailContent - Nội dung email thông báo.
 * @returns {Promise<object>} Phản hồi từ API.
 */

export const updateUserStatus = async (userId, body) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/put-status/${userId}`,
      body
    );
    console.log("Update user: ", response);

    return response;
  } catch (error) {
    console.error(`Lỗi khi update user`, error);
    throw error;
  }
};
