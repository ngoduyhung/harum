import { Eye, MessageCircleMore, ThumbsUp } from "lucide-react";
import React from "react";
import formatDate from "../../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { navToDetail } from "../../../utils/navToDetail";

export default function PostV({ post }) {
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
          className="h-40 w-72 object-cover rounded-sm group-hover:scale-105"
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
