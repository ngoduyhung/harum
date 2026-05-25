import { Bookmark, BookMarked, Eye, Pencil, ThumbsUp } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import formatDate from "../../../utils/formatDate";

export default function Post({ post }) {
  const nav = useNavigate();
  const imageUrl = post?.contentBlock.find(
    (block) => block.type === "image"
  )?.value;
  const handleCLickEdit = (event, postId) => {
    event.stopPropagation();
    nav(`/edit-post/${postId}`);
  };
  return (
    <div
      className="w-full  flex flex-col cursor-pointer group"
      onClick={() => nav(`/post-detail/${post?.id}`)}
    >
      <div className="mb-2">
        <img
          src={imageUrl || "/defaultImage.png"}
          className="h-36 w-full object-cover rounded-md group-hover:scale-105"
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <div className="font-medium line-clamp-1 min-h-6">{post?.title}</div>
          <Pencil
            className="h-5 pb-1 hover:text-pblue  cursor-pointer text-text2"
            onClick={(e) => handleCLickEdit(e, post?.id)}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className=" flex items-center ">
            <div className="text-ssm text-text2 font-medium">
              {formatDate(post?.createdAt)}
            </div>
          </div>
          <div className=" flex mr-1">
            <div className="text-ssm flex items-center mr-2.5">
              <ThumbsUp className="h-4  text-text2" />
              {post?.countLike}
            </div>
            <div className="text-ssm flex items-center">
              <Eye className="h-4  text-text2" />
              {post?.countView}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
