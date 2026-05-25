import React, { useState, useEffect } from "react"; 
import { Users, FileText } from "lucide-react"; 

import StatCard from "./partical/Statcard";
import TopicsBarChart from "./partical/TopicsBarChart";
import TopUsersTable from "./partical/TopUsertable";
import {
  getDashboardStats,
  getPostsByAllTopics,
  getUsersSortedByPostCount,
  getUsersSortedByFollowers,
} from "./AdminDashboardService"; 

export default function AdminDashboardPage() {


  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const [postsByTopic, setPostsByTopic] = useState([]);
  const [isLoadingPostsByTopic, setIsLoadingPostsByTopic] = useState(true);

  const [topUsersByPosts, setTopUsersByPosts] = useState([]);
  const [isLoadingTopPosts, setIsLoadingTopPosts] = useState(true);

  const [topUsersByFollowers, setTopUsersByFollowers] = useState([]);
  const [isLoadingTopFollowers, setIsLoadingTopFollowers] = useState(true);
  
  useEffect(() => {
    const loadAllDashboardData = async () => {
      try {
        await Promise.all([
          (async () => {
            const data = await getDashboardStats();
            setStats(data);
            setIsLoadingStats(false);
          })(),

          (async () => {
            const data = await getPostsByAllTopics();
            setPostsByTopic(data);
            setIsLoadingPostsByTopic(false);
          })(),

          (async () => {
            const data = await getUsersSortedByPostCount();
            setTopUsersByPosts(data);
            setIsLoadingTopPosts(false);
          })(),

          (async () => {
            const data = await getUsersSortedByFollowers();
            setTopUsersByFollowers(data);
            setIsLoadingTopFollowers(false);
          })(),
        ]);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
        setIsLoadingStats(false);
        setIsLoadingPostsByTopic(false);
        setIsLoadingTopPosts(false);
        setIsLoadingTopFollowers(false);
      }
    };

    loadAllDashboardData();
    
  }, []); 


  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Thống kê tổng quan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FileText />} title="Tổng số bài viết" value={stats?.totalPosts} isLoading={isLoadingStats} />
        <StatCard icon={<Users />} title="Tổng số người dùng" value={stats?.totalUsers} isLoading={isLoadingStats} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Số lượng bài viết theo Chủ đề</h2>
        </div>
        <TopicsBarChart data={postsByTopic} isLoading={isLoadingPostsByTopic} />
      </div>

       <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Người dùng nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TopUsersTable 
                title="Đăng bài nhiều nhất" 
                data={topUsersByPosts?.slice(0, 10)} 
                isLoading={isLoadingTopPosts} 
                valueLabel="Bài viết" 
            />
            <TopUsersTable 
                title="Nhiều follower nhất" 
                data={topUsersByFollowers?.slice(0, 10)} 
                isLoading={isLoadingTopFollowers} 
                valueLabel="Follower" 
            />
        </div>
      </div>
    </div>
  );
}