import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TabSection from "./partical/TabSection"; // Giả định TabSection này có thể tự fetch dữ liệu
import { getOtherUserProfileApi } from "./OtherProfileService";
import { UserX, UserPlus } from "lucide-react";
import Profile from "./partical/Profile";

const OtherProfileSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-10 px-4">
      {/* Sidebar giả */}
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
      {/* Main content giả */}
      <div className="md:col-span-3 mt-5">
        <div className="flex border-b">
          <div className="h-10 bg-gray-200 rounded-t-md w-28 mr-2"></div>
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

export default function OtherProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await getOtherUserProfileApi(id);
      setUser(res); // Giả định API trả về { data: userObject }
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    fetchUserData();
  }, [id]);

  if (loading) {
    return <OtherProfileSkeleton />;
  }

  if (!user) {
    return <UserNotFound />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl mx-auto pb-10">
        <div className="grid mt-3 grid-cols-1 md:grid-cols-4 gap-x-10 px-4">
          <Profile user={user} refresh={fetchUserData} />

          {/* Main Content */}
          <main className="md:col-span-3 ">
            <TabSection userId={id} />
          </main>
        </div>
      </div>
    </div>
  );
}
