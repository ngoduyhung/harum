import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TabSection from "./partical/TabSection";
import { getUserProfileApi } from "./AdminWatchUserService";
import { UserX, Edit3, UserPlus } from "lucide-react"; // Icons

const ProfileSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-10 px-4">
      <div className="md:col-span-1 -mt-16">
        <div className="h-36 w-36 bg-gray-300 rounded-full border-4 border-white"></div>
        <div className="mt-4 space-y-3">
          <div className="h-7 bg-gray-200 rounded w-3/4"></div>
          <div className="h-9 bg-gray-200 rounded-lg w-full"></div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
      <div className="md:col-span-3 mt-5">
        <div className="flex border-b">
          <div className="h-10 bg-gray-200 rounded-t-md w-28 mr-2"></div>
          <div className="h-10 bg-gray-200 rounded-t-md w-28 mr-2"></div>
          <div className="h-10 bg-gray-200 rounded-t-md w-36"></div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-40 bg-gray-200 rounded-lg"></div>
              <div className="h-5 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const UserNotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <UserX className="w-24 h-24 text-gray-400 mb-4" />
    <h2 className="text-3xl font-bold text-gray-800">
      Không tìm thấy người dùng
    </h2>
    <p className="mt-2 text-gray-500">
      Người dùng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
    </p>
  </div>
);

export default function AdminWatchUser() {
  const nav = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedInUserId = localStorage.getItem("user_id");
  const isOwnProfile = id === loggedInUserId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await getUserProfileApi(id);
        setUser(userRes);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu Profile:", error);
        setUser(null); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return <UserNotFound />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl mx-auto pt-24">
        <div className="grid grid-cols-1 mt-3 md:grid-cols-4 gap-x-10 px-4">
          {/* Sidebar */}
          <aside className="md:col-span-1 -mt-20">
            <div className="relative">
              <img
                className="h-36 w-36 object-cover rounded-full border-4 border-white bg-white shadow-lg"
                src={user.avatarUrl || "/defaultAvatar.jpg"}
                alt="avatar"
              />
            </div>
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.username}
              </h1> 
            </div>

            <div className="flex justify-start gap-6 items-center text-gray-600 mt-4 text-sm">
              <div>
                <span className="font-bold text-gray-900">
                  {user.followers || 0}
                </span>{" "}
                người theo dõi
              </div>
              <div>
                <span className="font-bold text-gray-900">
                  {user.followings || 0}
                </span>{" "}
                đang theo dõi
              </div>
            </div>

            {user.bio && (
              <p className="text-sm whitespace-pre-line text-gray-500 mt-4 border-t pt-4">
                {user.bio}
              </p>
            )}
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3 ">
            <TabSection  userId={id} />
          </main>
        </div>
      </div>
    </div>
  );
}
