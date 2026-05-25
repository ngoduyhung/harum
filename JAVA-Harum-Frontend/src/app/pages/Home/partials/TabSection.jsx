/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import formatDate from "../../../utils/formatDate";
import { navToDetail } from "../../../utils/navToDetail";
import { sGlobalInfo } from "../../../stores/globalStore";
import { getForYouPosts, getFollowPosts } from "../homeService";
import { Eye, MessageCircleMore, ThumbsUp } from "lucide-react";

const PostVSkeleton = () => {
  return (
    <div className="flex w-full animate-pulse">
      <div className="h-40 w-72 bg-gray-200 rounded-md flex-shrink-0"></div>

      <div className="flex flex-col justify-between w-full ml-4 py-1">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 bg-gray-200 rounded w-12"></div>
            <div className="h-5 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

function PostV({ post }) {
  const nav = useNavigate();
  const userId = localStorage.getItem("user_id");
  const imageUrl = post?.contentBlock.find(
    (block) => block.type === "image"
  )?.value;

  return (
    <div
      className="flex w-full cursor-pointer group p-2 rounded-lg hover:bg-gray-50/70 transition-colors"
      onClick={() => navToDetail(nav, userId, post?.id)}
    >
      <div className="flex-shrink-0">
        <img
          src={imageUrl || "/defaultImage.png"}
          alt={post?.title}
          className="h-40 w-72 object-cover rounded-md group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-between w-full ml-4">
        <div>
          <div className="text-xs font-semibold mb-1 text-text2 tracking-wider">
            {post?.topicName.toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-gray-800 line-clamp-2 min-h-14 group-hover:text-sblue transition-colors">
            {post?.title}
          </h2>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={post?.userImage || "/defaultAvatar.jpg"}
              alt={post?.username}
              className="rounded-full h-10 w-10 object-cover mr-2.5"
            />
            <div>
              <div className="font-bold line-clamp-1 w-24 text-sm mr-5 text-gray-700">
                {post?.username}
              </div>
              <div className="text-xs font-medium text-gray-500">
                {formatDate(post?.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center text-gray-500 gap-4">
            <div className="text-sm flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{post?.countLike}</span>
            </div>
            <div className="text-sm flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post?.countView}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const TabSection = () => {
  const userId = localStorage.getItem("user_id");
  const [activeTab, setActiveTab] = useState("forYou");

  const queryKey = ["tabPosts", activeTab, userId];

  const queryFn = ({ pageParam = 1 }) => {
    if (activeTab === "forYou") {
      return getForYouPosts({ userId, pageParam });
    } else if (activeTab === "following" && userId) {
      return getFollowPosts({ userId, pageParam });
    }
    return Promise.resolve({ content: [], last: true, number: 0 });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage && !lastPage.last) {
        return lastPage.number + 2;
      }
      return undefined;
    },
    enabled: !(activeTab === "following" && !userId),
  });

  const allPosts = data?.pages.flatMap((page) => page?.content || []) || [];

  const handleTabClick = (tabName) => {
    if (activeTab !== tabName) {
      setActiveTab(tabName);
    }
  };

  const renderContent = () => {
    if (!userId) {
      return (
        <p className="text-center text-gray-500 py-10">
          Vui lòng đăng nhập để khám phá thêm.
        </p>
      );
    }
    const isInitialLoading =
      isFetching && !isFetchingNextPage && allPosts.length === 0;

    if (isInitialLoading) {
      return [...Array(5)].map((_, index) => <PostVSkeleton key={index} />);
    }

    // if (status === "error" && !isFetching) {
    //   return (
    //     <p className="text-center text-red-500">
    //       Lỗi: {error?.message || "Đã có lỗi xảy ra"}
    //     </p>
    //   );
    // }

    if (allPosts.length === 0 && !isFetching) {
      if (activeTab === "following" && !userId) {
        return (
          <p className="text-center text-gray-500 py-10">
            Vui lòng đăng nhập để xem bài viết từ những người bạn theo dõi.
          </p>
        );
      }
      return (
        <p className="text-center text-gray-500 py-10">
          Không có bài viết nào để hiển thị.
        </p>
      );
    }

    return (
      <>
        {allPosts.map((post) => (
          <PostV key={`${post.id}-${activeTab}`} post={post} />
        ))}

        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pblue"></div>
            <span className="ml-2 text-gray-600">Đang tải thêm...</span>
          </div>
        )}

        {hasNextPage && !isFetchingNextPage && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetching}
              className="px-6 py-2 font-semibold cursor-pointer text-pblue border-2 border-pblue rounded-full hover:bg-pblue hover:text-white transition-colors duration-300 disabled:opacity-50"
            >
              Xem thêm
            </button>
          </div>
        )}

        {!hasNextPage && allPosts.length > 0 && !isFetching && (
          <p className="mt-6 text-center text-gray-500">
            Đã hiển thị tất cả bài viết.
          </p>
        )}
      </>
    );
  };

  return (
    <div>
      <div className="flex text-lg mb-4 border-b">
        <button
          className={`pb-2 cursor-pointer px-4 -mb-px transition-all duration-200 ${
            activeTab === "forYou"
              ? "border-b-2 border-pblue text-pblue font-semibold"
              : "text-gray-500 hover:text-pblue border-b-2 border-transparent"
          }`}
          onClick={() => handleTabClick("forYou")}
        >
          Dành cho bạn
        </button>
        <button
          className={`pb-2 cursor-pointer px-4 -mb-px transition-all duration-200 ${
            activeTab === "following"
              ? "border-b-2 border-pblue text-pblue font-semibold"
              : "text-gray-500 hover:text-pblue border-b-2 border-transparent"
          }`}
          onClick={() => handleTabClick("following")}
        >
          Đang theo dõi
        </button>
      </div>
      <div className="flex flex-col gap-y-6 mt-6">{renderContent()}</div>
    </div>
  );
};

export default TabSection;
