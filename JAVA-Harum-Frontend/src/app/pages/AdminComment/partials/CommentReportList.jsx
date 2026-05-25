// src/pages/admin/components/CommentReportList.jsx

import React from "react";
import CommentReportItem from "./CommentReportItem";
import { Loader2 } from "lucide-react"; // Import spinner

const CommentReportList = ({
  reports,
  isLoading,
  isError,
  error,
  onDismiss,
  onDeleteComment,
  isFetching, // Nhận prop isFetching
}) => {
  if (isLoading) {
    return <div className="text-center p-8">Đang tải danh sách báo cáo...</div>;
  }

  if (isError) {
    return <div className="text-center p-8 text-red-500">{error.message}</div>;
  }

  return (
    <div className="relative min-h-[200px]">
      {isFetching && !isLoading ? (
        <div className="flex flex-col mt-24 items-center">
          <Loader2 size={32} className="animate-spin text-pblue" />
          <p className="mt-2 font-semibold text-gray-600">Đang cập nhật...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center p-8">Không có báo cáo nào phù hợp.</div>
      ) : (
        <div className="p-4 space-y-4">
          {reports.map((report) => (
            <CommentReportItem
              key={report.reportId}
              report={report}
              onDismiss={onDismiss}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentReportList;
