import { UserPlus, UserX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { checkFollow, doFollow } from "../OtherProfileService";
import { toast } from "react-toastify";
import { LoginRequiredModal } from "../../../components/LoginRequiredModal";
import { useNavigate } from "react-router-dom";

export default function Profile({ user, refresh }) {
  const userID = localStorage.getItem("user_id");
  const nav = useNavigate();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    fetchFollow();
  }, []);
  const fetchFollow = async () => {
    if (userID) {
      try {
        const res = await checkFollow(userID, user.id);
        if (res.status === 200) {
          setIsFollowing(res.data);
        } else {
          console.error("Lỗi: Không xem được follow");
        }
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      }
    } else setIsFollowing(false);
  };
  const handleFollow = async () => {
    if (userID) {
      const res = await doFollow(userID, user.id);
      if (res?.status === 200) {
        toast.success(isFollowing ? "Đã bỏ theo dõi!" : "Đã theo dõi!");
        setIsFollowing(!isFollowing);
        console.log("done: ", res);
        refresh();
      }
    } else setIsLoginModalOpen(true);
  };

  return (
    <aside className="md:col-span-1 -mt-20">
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => nav("/login")}
      />
      <div className="relative">
        <img
          className="h-36 w-36 object-cover rounded-full border-4 border-white bg-white shadow-lg"
          src={user.avatarUrl || "/defaultAvatar.jpg"}
          alt={user.username}
        />
      </div>
      <div className="mt-4">
        <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
        <button
          className={`w-full cursor-pointer mt-4 py-2 px-4 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 
  ${
    isFollowing
      ? "bg-gray-200 hover:bg-gray-300 text-text"
      : "bg-pblue hover:bg-sblue text-white"
  }`}
          onClick={() => handleFollow()}
        >
          {isFollowing ? <UserX size={16} /> : <UserPlus size={16} />}
          {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
        </button>
      </div>

      <div className="flex justify-start gap-6 items-center text-gray-600 mt-4 text-sm">
        <div>
          <span className="font-bold text-gray-900">{user.followers || 0}</span>{" "}
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
  );
}
