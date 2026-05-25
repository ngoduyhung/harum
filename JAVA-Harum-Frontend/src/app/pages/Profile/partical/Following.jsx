import { User, CheckCircle, XCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { unFollow } from "../ProfileService";
import { toast } from "react-toastify";

export default function Following({ user, refresh }) {
  const nav = useNavigate();
  const handleUnfollow = async (e, userId) => {
    e.stopPropagation();
    const res = await unFollow(localStorage.getItem("user_id"), userId);
    if (res?.status === 200) {
      toast.success(`Đã bỏ theo dõi ${user?.username}!`);
      refresh();
    } else toast.warn(`Lỗi khi bỏ theo dõi ${user?.username}!`);
  };

  return (
    <div
      key={user?.id}
      className="flex items-center w-full p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={() => nav(`/profile/${user?.id}`)}
    >
      <img
        src={user?.avatarUrl || "/defaultAvatar.jpg"}
        alt={`${user?.username}'s avatar`}
        className="w-12 h-12 object-cover rounded-full mr-4 shrink-0"
      />
      <div className="flex w-full justify-between items-center">
        <div className="font-semibold line-clamp-1 text-gray-800 ">
          {user?.username}
        </div>
        <XCircle
          className=" text-text2 h-5 hover:text-red-500  cursor-pointer"
          onClick={(e) => handleUnfollow(e, user?.id)}
        />
      </div>
    </div>
  );
}
