/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getPopularPosts } from "../homeService"; // Đã đổi sang getPopularPosts
import { Eye, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react"; // Thêm icon cho nút
import formatDate from "../../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { navToDetail } from "../../../utils/navToDetail";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";


const PostHSkeleton = () => {
  return (
    <div className="flex flex-col w-full animate-pulse">
      <div className="mb-2 w-full h-[172px] bg-gray-200 rounded-sm"></div>
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <div className="flex flex-col space-y-1">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

function PostH({ post }) {
  const nav = useNavigate();
  const userId = localStorage.getItem("user_id");

  const imageUrl = post?.contentBlock.find(
    (block) => block.type === "image"
  )?.value;

  return (
    <div
      className="flex flex-col cursor-pointer w-full group"
      onClick={() => navToDetail(nav, userId, post?.id)}
    >
      <div className="mb-2 w-full overflow-hidden rounded-sm">
        <img
          src={imageUrl || "/defaultImage.png"}
          alt={post?.title}
          className="h-[172px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div>
        <div className="flex mb-2 justify-between items-start">
          <h3 className="font-medium line-clamp-2 min-h-[48px] text-gray-800 group-hover:text-pblue transition-colors">
            {post?.title}
          </h3>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2">
              <img
                src={post?.userImage || "/defaultAvatar.jpg"}
                alt={post?.username}
                className="h-8 w-8 object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold line-clamp-1 w-24 text-[14px] text-gray-700">
                {post?.username}
              </div>
              <div className="text-[12px] text-gray-500">
                {formatDate(post?.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <div className="flex items-center mr-4">
              <ThumbsUp className="h-4 w-4" />
              <p className="ml-1 text-sm font-medium">{post?.countLike}</p>
            </div>
            <div className="flex items-center">
              <Eye className="w-4.5" />
              <p className="ml-1 text-sm font-medium">{post?.countView}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function PopularSection() {
  const {
    data: popularPosts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["popularPosts"],
    queryFn: getPopularPosts,
    staleTime: 5 * 60 * 1000,
  });

  // Sao chép toàn bộ logic của Swiper từ TopSection
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
          {[...Array(4)].map((_, index) => (
            <PostHSkeleton key={index} />
          ))}
        </div>
      );
    }
    if (isError) {
      return (
        <div className="text-center text-red-500 py-10">Đã có lỗi xảy ra.</div>
      );
    }
    if (!popularPosts?.content || popularPosts.content.length === 0) {
      return (
        <div className="text-center text-gray-500 py-10">
          Chưa có bài viết phổ biến nào.
        </div>
      );
    }

    return (
      <Swiper
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {/* Thay đổi ở đây: dùng popularPosts.content */}
        {popularPosts.content.map((post) => (
          <SwiperSlide key={post.id}>
            <PostH post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <section className="relative flex flex-col my-4">
      <div className="flex justify-between items-center pb-2 mb-5">
        <div className="text-text font-medium text-lg inline-block">
          BÀI VIẾT PHỔ BIẾN 
        </div>
      </div>

      <div className="relative">
        {renderContent()}
        {!isLoading && !isError && popularPosts?.content?.length > 4 && (<>
          <div className="absolute top-20 z-10 left-[-20px]">
            <button
              onClick={handlePrev}
              disabled={isBeginning}
              className="p-2 rounded-full bg-white/70 shadow-md border border-gray-200 text-gray-600 hover:bg-pblue hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="absolute top-20 z-10 right-[-20px]">
            <button
              onClick={handleNext}
              disabled={isEnd}
              className="p-2 rounded-full bg-white/70 shadow-md border border-gray-200 text-gray-600 hover:bg-pblue hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
        )}
      </div>
    </section>
  );
}

export default PopularSection;
