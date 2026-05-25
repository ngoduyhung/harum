// src/pages/admin/components/UserTable.jsx

import React from "react";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Badge = ({ children, colorClass }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
  >
    {children}
  </span>
);

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getRoleBadge = (roleName) => {
  switch (roleName) {
    case "ADMIN":
      return <Badge colorClass="bg-red-100 text-red-700">Admin</Badge>;
    case "USER":
      return <Badge colorClass="bg-blue-100 text-blue-700">User</Badge>;
    default:
      return <Badge colorClass="bg-gray-100 text-gray-700">Unknown</Badge>;
  }
};

const UserTable = ({
  users,
  onRequestChangeStatus,
  isLoading,
  isError,
  error,
}) => {
   const navigate = useNavigate(); 

  if (isLoading) {
    return <div className="text-center p-8">Đang tải dữ liệu...</div>;
  }

  if (isError) {
    return <div className="text-center p-8 text-red-500">{error.message}</div>;
  }

  if (users.length === 0) {
    return (
      <div className="text-center p-8">Không tìm thấy người dùng nào.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Người dùng
            </th>
            <th scope="col" className="px-6 py-3">
              Vai trò
            </th>
            <th scope="col" className="px-6 py-3">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3">
              Ngày tạo
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-white border-b hover:bg-gray-50"
            onClick={() => navigate(`/admin/profile/${user.id}`)}>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img
                    className="w-10 h-10 rounded-full object-cover mr-3"
                    src={user.avatarUrl || "/defaultAvatar.jpg"}
                    alt={user.username}
                  />
                  <div>
                    <div className="font-semibold text-gray-800">
                      {user.username}
                    </div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">{getRoleBadge(user.role?.roleName)}</td>
              <td className="px-6 py-4">
                <Badge
                  colorClass={
                    user.status === "ENABLE"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {user.status === "ENABLE" ? "Hoạt động" : "Vô hiệu hóa"}
                </Badge>
              </td>
              <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center">
                  <button
                    disabled={user.role.roleName === "ADMIN"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestChangeStatus(user.id, user.status);
                    }} className="p-2 cursor-pointer text-sblue hover:bg-blue-100 rounded-full disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title={
                      user.status === "ENABLE"
                        ? "Vô hiệu hóa tài khoản"
                        : "Kích hoạt lại tài khoản"
                    }
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
