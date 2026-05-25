import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostByIdForAdmin } from "../AdminPostService";
import PostContent from "./PostContent";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-[calc(100vh-200px)]">
    <Loader2 className="animate-spin text-pblue" size={48} />
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-center">
    <AlertTriangle className="text-red-500" size={48} />
    <h2 className="mt-4 text-2xl font-bold text-gray-800">
      Không thể tải bài viết
    </h2>
    <p className="mt-2 text-gray-600">
      Đã có lỗi xảy ra. Vui lòng thử lại sau.
    </p>
    <p className="mt-1 text-xs text-gray-500 bg-red-50 p-2 rounded-md">
      {error?.message || "Unknown error"}
    </p>
  </div>
);

export default function AdminWatchPost() {
  const { id } = useParams();

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminPostDetail", id],

    queryFn: () => getPostByIdForAdmin(id),

    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorDisplay error={error} />;
  }

  if (!post) {
    return <div>Không tìm thấy dữ liệu bài viết.</div>;
  }

  return (
    <div className="px-6 py-2 mt-4 bg-gray-100 min-h-full">
      <div className="flex  mb-[-44px] items-center">
        <Link
          to="/admin/posts"
          className=" flex items-center text-gray-500 hover:text-pblue font-semibold transition-colors mr-4 p-2 hover:bg-gray-200 rounded-full"
        >
          <ArrowLeft size={28} />
        </Link>
      </div>

      <div className="overflow-hidden mb-10">
        <PostContent post={post} />
      </div>
    </div>
  );
}
