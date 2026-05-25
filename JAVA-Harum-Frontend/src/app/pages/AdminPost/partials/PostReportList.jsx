import React from "react";
import PostReportItem from "./PostReportItem";
import { Loader2 } from "lucide-react";

const PostReportList = ({
  reports,
  isLoading,
  isError,
  error,
  onDismiss,
  onDeletePost,
  isFetching,
}) => {
  if (isLoading) {
    return <div className="text-center p-8">Đang tải danh sách báo cáo...</div>;
  }

  if (isError) {
    return <div className="text-center p-8 text-red-500">{error.message}</div>;
  }

  return (
    <div className=" min-h-[200px]">
      {isFetching && !isLoading ? (
        <div className="flex flex-col mt-20 items-center">
          <Loader2 size={32} className="animate-spin text-pblue" />
          <p className="mt-2 font-semibold text-gray-600">Đang cập nhật...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center p-8">Không có báo cáo nào phù hợp.</div>
      ) : (
        <div className="p-4 space-y-4">
          {reports.map((report) => (
            <PostReportItem
              key={report.reportId}
              report={report}
              onDismiss={onDismiss}
              onDeletePost={onDeletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostReportList;
