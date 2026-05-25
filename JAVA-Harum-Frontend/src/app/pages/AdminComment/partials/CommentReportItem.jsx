// src/pages/admin/components/CommentReportItem.jsx

import React from "react";
import { Check, Trash2, Clock, MessageSquare, ArrowRight } from "lucide-react";

const Badge = ({ children, colorClass }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
  >
    {children}
  </span>
);

const getStatusBadge = (status) => {
  // Tái sử dụng hàm này
  switch (status) {
    case "PENDING":
      return (
        <Badge colorClass="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>
      );
    case "REVIEWED":
      return <Badge colorClass="bg-green-100 text-green-800">Đã bỏ qua</Badge>;
    case "RESOLVED":
      return <Badge colorClass="bg-red-100 text-red-600">Đã ẩn</Badge>;
    default:
      return <Badge colorClass="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

const formatDate = (isoString) => {
  if (!isoString) return "Vừa xong";
  return new Date(isoString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserInfo = ({ name, avatar, role }) => (
  <div className="flex items-center">
    <img
      src={avatar || "/defaultAvatar.jpg"}
      alt={name}
      className="w-10 h-10 rounded-full object-cover mr-3"
    />
    <div>
      <div className="font-semibold text-gray-800">{name}</div>
      <div className="text-sm text-gray-500">{role}</div>
    </div>
  </div>
);

const CommentReportItem = ({ report, onDismiss, onDeleteComment }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* Header: Người báo cáo -> Người bị báo cáo */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          <UserInfo
            name={report.reporterName}
            avatar={report.reporterAvatar}
            role="Người báo cáo"
          />
          <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
          <UserInfo
            name={report.commentOwnerName}
            avatar={report.commentOwnerAvatar}
            role="Chủ bình luận"
          />
          <div className="">
            <div className="flex  items-center text-gray-600">
              {/* <MessageSquare
                size={18}
                className="mr-3 mt-1 flex-shrink-0 text-pblue"
              /> */}
              <p className="bg-gray-100 p-3 rounded-md text-sm italic">
                "{report.commentContent}"
              </p>
            </div>
          </div>
        </div>
        {getStatusBadge(report.status)}
      </div>

      {/* Nội dung bình luận bị báo cáo */}

      <div className="mb-4">
        <p className="text-sm text-gray-800">
          <strong className="font-semibold">Lý do báo cáo:</strong>{" "}
          {report.reason}
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
              onClick={() => onDismiss(report.reportId)}
              className="flex items-center cursor-pointer text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors"
            >
              <Check size={16} className="mr-1.5" />
              Bỏ qua
            </button>
            <button
              onClick={() => onDeleteComment(report.commentId, report.reportId)}
              className="flex items-center cursor-pointer text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
            >
              <Trash2 size={16} className="mr-1.5" />
              Ẩn bình luận
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentReportItem;
