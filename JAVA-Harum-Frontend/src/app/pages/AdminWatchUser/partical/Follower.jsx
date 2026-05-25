import { useNavigate } from "react-router-dom";

export default function Follower({ user, refresh }) {
  const nav = useNavigate();

  return (
    <div
      key={user?.id}
      className="flex items-center w-full p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={() => nav(`/admin/profile/${user?.id}`)}
    >
      <img
        src={user?.avatarUrl || "/defaultAvatar.jpg"}
        alt={`${user?.username}'s avatar`}
        className="w-12 h-12 object-cover rounded-full mr-4 shrink-0"
      />
      <div className="flex w-full justify-between items-center">
        <div className="font-semibold line-clamp-1 text-gray-800">
          {user?.username}
        </div>
      </div>
    </div>
  );
}