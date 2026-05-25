import axios from "axios";
import { Client } from "@stomp/stompjs";
import { API_URL, WEBSOCKET_URL } from "../bkUrl";

class AppService {
  constructor() {
    this.stompClient = null;
    this.axiosInstance = axios.create({
      baseURL: API_URL,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Không cần thay đổi interceptor
        const { config, response } = error;
        console.error(
          `API Error on ${config.method.toUpperCase()} ${config.url}:`,
          response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  // Chuyển tất cả các phương thức dùng 'this' thành arrow function
  // để 'this' luôn được ràng buộc đúng với instance của class.

  initializeWebSocket = (userId, onNotificationReceived) => {
    if (this.stompClient && this.stompClient.active) {
      console.log("WebSocket đã được kết nối, không khởi tạo lại.");
      return () => {};
    }

    this.stompClient = new Client({
      brokerURL: WEBSOCKET_URL,
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        console.log("Notification WebSocket đã kết nối thành công!");
        const topic = `/notifications/${userId}`;
        console.log(`Đang đăng ký lắng nghe thông báo tại: ${topic}`);

        this.stompClient.subscribe(topic, (message) => {
          try {
            const newNotification = JSON.parse(message.body);
            onNotificationReceived(newNotification);
          } catch (e) {
            console.error("Không thể parse thông báo JSON:", message.body, e);
          }
        });
      },
      onStompError: (frame) => {
        console.error(
          "Lỗi từ Broker (Notification): " + frame.headers["message"],
          frame.body
        );
      },
    });

    this.stompClient.activate();

    return () => {
      if (this.stompClient && this.stompClient.active) {
        console.log("Ngắt kết nối WebSocket thông báo.");
        this.stompClient.deactivate();
      }
    };
  };

  getNotifications = async (userId) => {
    const response = await this.axiosInstance.get(
      `/notification/user/${userId}`
    );
    return response;
  };

  setReadNotification = async (notificationId) => {
    // Bây giờ 'this' ở đây sẽ luôn đúng
    const response = await this.axiosInstance.put(
      `/notification/${notificationId}/read`
    );
    return response;
  };

  deleteNotification = async (notificationId) => {
    // Và cả ở đây
    await this.axiosInstance.delete(`/notification/${notificationId}`);
  };

  getCommentById = async (commentId) => {
    const response = await this.axiosInstance.get(`/comment/${commentId}`);
    console.log("lây comment theo id: ", response);
    return response;
  };

  isReadPost = async (userId, postId) => {
    const response = await this.axiosInstance.get(
      `/views/check/${userId}/${postId}`
    );
    return response.data;
  };

  setReadPost = async (views) => {
    const response = await this.axiosInstance.post(`/views`, views);
    return response.data;
  };
}

export const service = new AppService();
