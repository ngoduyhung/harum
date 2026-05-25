import axios from 'axios';
import { Client } from '@stomp/stompjs';
import { API_URL } from '../../../bkUrl';
import { WEBSOCKET_URL } from '../../../bkUrl';

class MessageService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = new Map();
        
        this.axiosInstance = axios.create({
            baseURL: API_URL,
        });

    }

    initialize() {
        if (this.stompClient && this.stompClient.connected) {
            console.log('STOMP client đã được kết nối.');
            return;
        }
        
        this.stompClient = new Client({
            brokerURL: WEBSOCKET_URL,
            connectHeaders: {},
            reconnectDelay: 5000,
            debug: (str) => {
            },
            onConnect: () => {
                console.log('WebSocket đã kết nối thành công!');
            },
            onStompError: (frame) => {
                console.error('Lỗi từ Broker: ' + frame.headers['message']);
                console.error('Chi tiết: ' + frame.body);
            },
        });

        this.stompClient.activate();
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
            this.subscriptions.clear();
            console.log("WebSocket đã ngắt kết nối.");
        }
    }
    async sendFirstMessage(senderId, receiverId, content) {
        try {
            const response = await this.axiosInstance.post('/messages/send', {
                senderId,
                receiverId,
                message: content, 
            });
            return response.data; 
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn đầu tiên qua HTTP:', error);
            throw error;
        }
    }


     async getConversation(user1Id, user2Id) {
        try {
            const response = await this.axiosInstance.get('/messages/conversation', {
                params: { user1: user1Id, user2: user2Id },
            });
            return response.data; 
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("Cuộc trò chuyện mới, chưa có lịch sử tin nhắn.");
                return []; 
            }
            console.error('Lỗi khi tải cuộc trò chuyện:', error);
            throw error;
        }
    }

    async getContacts(userId) {
       if (!userId) {
           console.error("Cần có User ID để lấy danh bạ");
           return [];
       }
       try {
           const response = await this.axiosInstance.get(`/messages/conversations/contacts/${userId}`);
           return response.data.map(user => ({
               id: user.id,
               name: user.username,
               avatarUrl: user.avatarUrl,
           }));
       } catch (error) {
           console.error("Lỗi khi tải danh sách liên hệ:", error);
           return [];
       }
    }

    async updateMessage(messageId, newContent) {
        try {
            const response = await this.axiosInstance.put(`/messages/update/${messageId}`, { newContent });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật tin nhắn:', error);
            throw error;
        }
    }

    async recallMessage(messageId) {
        try {
            await this.axiosInstance.delete(`/messages/recall/${messageId}`);
            return true; 
        } catch (error) {
            console.error('Lỗi khi thu hồi tin nhắn:', error);
            return false;
        }
    }

    sendMessage(senderId, receiverId, content) {
        if (this.stompClient && this.stompClient.connected) {
            const chatMessage = {
                senderId,
                receiverId,
                content,
            };
            this.stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage),
            });
        } else {
            console.error('Không thể gửi tin nhắn. STOMP client chưa kết nối.');
        }
    }
    
    subscribeToConversation(conversationId, onMessageReceived) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.error('STOMP client chưa kết nối để đăng ký.');
            if (!this.stompClient) this.initialize();
            return () => {};
        }

        const topic = `/topic/conversation/${conversationId}`;
        
        if (this.subscriptions.has(topic)) {
            console.log(`Đã đăng ký ${topic} từ trước. Bỏ qua.`);
            return () => {}; 
        }
        
        console.log(`Đang đăng ký lắng nghe tại: ${topic}`);
        const subscription = this.stompClient.subscribe(topic, (message) => {
            const newMessage = JSON.parse(message.body);
            onMessageReceived(newMessage);
        });

        this.subscriptions.set(topic, subscription);

        return () => {
            console.log(`Hủy đăng ký khỏi ${topic}`);
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
        };
    }


     async searchUsers(keyword, page = 1, size = 10) {
        if (!keyword || keyword.trim() === '') {
            return [];
        }
        try {
            const response = await this.axiosInstance.get('/search/users', {
                params: {
                    keyword,
                    page,
                    size,
                },
            });
    return response.data.content.map(user => ({
        id: user.id,
        name: user.username,
        avatarUrl: user.avatarUrl,
    }));
        } catch (error) {
            console.error('Lỗi khi tìm kiếm người dùng:', error);
            return [];
        }
    }
}

export const messageService = new MessageService();