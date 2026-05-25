// src/pages/admin/components/PostReportItem.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, Trash2, Clock } from "lucide-react";

const Badge = ({ children, colorClass }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
  >
    {children}
  </span>
);

const getStatusBadge = (status) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge colorClass="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>
      );
    case "REVIEWED":
      return <Badge colorClass="bg-green-100 text-green-800">Đã bỏ qua</Badge>;
    case "RESOLVED":
      return <Badge colorClass="bg-red-100 text-red-500">Đã ẩn</Badge>;
    default:
      return <Badge colorClass="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PostReportItem = ({ report, onDismiss, onDeletePost }) => {
  const navigate = useNavigate();

  const handleNavigateToPost = () => {
    navigate(`${report.postId}`);
  };

  const handleDismissClick = (e) => {
    e.stopPropagation();
    onDismiss(report.reportId);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDeletePost(report.postId, report.reportId);
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-sm border border-transparent hover:border-pblue transition-all cursor-pointer"
      onClick={handleNavigateToPost}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <img
            src={report.reporterAvatar || "/defaultAvatar.jpg"}
            alt={report.reporterName}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <div className="font-semibold text-gray-800">
              {report.reporterName}
            </div>
            <div className="text-sm text-gray-500">Đã báo cáo một bài viết</div>
          </div>
        </div>
        {getStatusBadge(report.status)}
      </div>

      <div className="mt-4 pl-13 bg-gray-50 p-3 rounded-md">
        <p className="text-sm text-gray-700">
          <strong>Lý do:</strong> {report.reason}
        </p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={14} className="mr-1.5" />
          <span>{formatDate(report.createdAt)}</span>
        </div>
        {report.status === "PENDING" && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDismissClick}
              className="flex items-center cursor-pointer text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors"
            >
              <Check size={16} className="mr-1.5" />
              Bỏ qua
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center cursor-pointer text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
            >
              <Trash2 size={16} className="mr-1.5" />
              Ẩn bài viết
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostReportItem;
