
import axios from "axios";
import { API_URL } from "../../../bkUrl";

export const getDashboardStats = async () => {
  try {
    const [postsRes, usersRes] = await Promise.all([
      axios.get(`${API_URL}/posts/count`),
      axios.get(`${API_URL}/users/count`),
    ]);

    return {
      totalPosts: postsRes.data.totalPosts || 0,
      totalUsers: usersRes.data|| 0,
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thống kê tổng quan:", error);
    throw error;
  }
};



export const getPostsByAllTopics = async () => {
    try {
        const topicsRes = await axios.get(`${API_URL}/topics`);
        const topics = topicsRes.data;

        const countPromises = topics.map(topic => 
            axios.get(`${API_URL}/posts/count/topic/${topic.id}`)
                .then(res => ({ 
                    name: topic.name,       
                    count: res.data.postCount  
                }))
        );

        const results = await Promise.all(countPromises);
        console.log (results)
        return results.sort((a, b) => b.count - a.count);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết theo chủ đề:", error);
        throw error;
    }
};


export const getUsersSortedByPostCount = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/sorted-by-posts`);
    console.log(response.data);
    return response.data.map(user => ({ ...user, value: user.postCount }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng theo bài viết:", error);
    throw error;
  }
};

export const getUsersSortedByFollowers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/sorted-by-followers`);
    return response.data.map(user => ({ ...user, value: user.followerCount }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng theo người theo dõi:", error);
    throw error;
  }
};