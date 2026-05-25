import { Bookmark, BookMarked, Eye, Pencil, ThumbsUp } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import formatDate from "../../../utils/formatDate";
import { navToDetail } from "../../../utils/navToDetail";

export default function Post({ post }) {
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
      <div className="mb-2 w-full overflow-hidden rounded-sm group-hover:scale-105">
        <img
          src={imageUrl || "/defaultImage.png"}
          alt={post?.title}
          className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
