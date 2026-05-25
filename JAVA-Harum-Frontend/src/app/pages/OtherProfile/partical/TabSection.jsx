import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";
import Post from "./Post";
import { getPostsByUserApi } from "../OtherProfileService";

const PostCardSkeleton = () => (
  <div className="w-full animate-pulse space-y-3">
    <div className="h-48 w-full bg-gray-200 rounded-lg"></div>
    <div className="space-y-2">
      <div className="h-5 bg-gray-200 rounded w-5/6"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="flex items-center pt-2">
      <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
      <div className="ml-3 h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

const LoadMoreButton = ({ hasNextPage, isFetchingNextPage, fetchNextPage }) => {
  if (!hasNextPage) {
    return null;
  }

  return (
    <div className="col-span-full flex justify-center mt-4">
      <button
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
        className="flex items-center  cursor-pointer justify-center bg-pblue text-white px-6 py-2 rounded-lg font-semibold hover:bg-sblue transition-colors disabled:bg-gray-400 disabled:cursor-wait"
      >
        {isFetchingNextPage ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang tải...
          </>
        ) : (
          "Xem thêm"
        )}
      </button>
    </div>
  );
};

const TabSection = ({ userId }) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["userProfilePosts", userId],

    queryFn: ({ pageParam }) => getPostsByUserApi(userId, pageParam, 6),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const isLastPage = lastPage.last;

      if (isLastPage) {
        return undefined;
      }

      return allPages.length + 1;
    },

    enabled: !!userId,
  });

  const allPosts = data?.pages.flatMap((page) => page.content) || [];

  const postsCount = data?.pages[0]?.totalElements || 0;

  const renderContent = () => {
    if (isLoading) {
      return [...Array(6)].map((_, index) => <PostCardSkeleton key={index} />);
    }

    if (isError) {
      return (
        <p className="text-red-500 text-center col-span-full">
          {error.message}
        </p>
      );
    }

    if (allPosts.length === 0) {
      return (
        <p className="text-gray-500 text-center col-span-full">
          Người dùng này chưa có bài viết nào.
        </p>
      );
    }
    if (allPosts.length === 1) {
      if (allPosts[1] == undefined)
        return (
          <p className="text-gray-500 text-center col-span-full">
            Người dùng này chưa có bài viết nào.
          </p>
        );
    }
    return (
      <>
        {allPosts.map((post) => (
          <Post key={post?.id} post={post} />
        ))}
        <LoadMoreButton
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </>
    );
  };

  return (
    <div className="w-full">
      <div className="flex text-lg mb-4 border-b mt-6">
        <button className="flex items-center gap-2 pb-2 px-4 transition bg-transparent border-b-2 border-pblue text-pblue font-semibold">
          <FileText size={18} />
          Bài viết ({isLoading ? "0" : postsCount})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default TabSection;
