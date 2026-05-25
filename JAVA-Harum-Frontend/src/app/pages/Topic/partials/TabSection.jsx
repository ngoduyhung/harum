/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostV from "./PostV";
import { getPostsByTopic, getTopPosts } from "../topicService";

const PostVSkeleton = () => {
  return (
    <div className="flex w-full animate-pulse">
      <div className="h-40 w-72 bg-gray-200 rounded-md flex-shrink-0"></div>
      <div className="flex flex-col justify-between w-full ml-4 py-1">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

const TabSection = ({ topicId }) => {
  const [activeTab, setActiveTab] = useState("all");

  // ALL POSTS (theo topic)
  const allPostsQuery = useInfiniteQuery({
    queryKey: ["posts", topicId, "all"],
    queryFn: ({ pageParam = 1 }) =>
      getPostsByTopic({ id: topicId, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.number < lastPage.totalPages - 1) {
        return lastPage.number + 2;
      }
      return undefined;
    },
    enabled: !!topicId && activeTab === "all",
  });

  // 🔥 TOP POSTS (ELO cao nhất)
  const topPostsQuery = useInfiniteQuery({
    queryKey: ["posts", topicId, "top"],
    queryFn: ({ pageParam = 1 }) => getTopPosts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.number < lastPage.totalPages - 1) {
        return lastPage.number + 2;
      }
      return undefined;
    },
    enabled: !!topicId && activeTab === "top",
  });

  const activeQuery =
    activeTab === "all" ? allPostsQuery : topPostsQuery;

  const postsToDisplay =
    activeQuery.data?.pages.flatMap((page) => page.content) || [];

  const renderContent = () => {
    if (activeQuery.isLoading) {
      return (
        <div className="flex flex-col gap-y-6">
          {[...Array(5)].map((_, index) => (
            <PostVSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (activeQuery.isError) {
      return (
        <div className="py-10 text-center text-red-500">
          Lỗi khi tải bài viết
        </div>
      );
    }

    if (postsToDisplay.length === 0) {
      return (
        <div className="py-10 text-center text-gray-500">
          Chưa có bài viết nào trong mục này.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-y-6">
        {postsToDisplay.map((post) => (
          <PostV key={post?.id} post={post} />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* TAB */}
      <div className="flex text-lg mb-4 border-b border-gray-200">
        <button
          className={`pb-2 px-4 font-medium ${
            activeTab === "all"
              ? "border-b-2 border-pblue text-pblue"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả
        </button>

        <button
          className={`pb-2 px-4 font-medium ${
            activeTab === "top"
              ? "border-b-2 border-pblue text-pblue"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("top")}
        >
          Bài viết nổi bật
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-6">{renderContent()}</div>

      {/* LOAD MORE */}
      {activeQuery.hasNextPage && (
        <div className="mt-6 text-center">
          <button
            onClick={() => activeQuery.fetchNextPage()}
            disabled={activeQuery.isFetchingNextPage}
            className="px-6 py-2 text-pblue border-2 border-pblue rounded-full"
          >
            {activeQuery.isFetchingNextPage
              ? "Đang tải..."
              : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TabSection;