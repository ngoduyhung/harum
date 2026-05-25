import { Bookmark, BookMarked, Eye, ThumbsUp } from "lucide-react";
import React from "react";
import formatDate from "../../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { navToDetail } from "../../../utils/navToDetail";

export default function PostH({ post }) {
  const nav = useNavigate();
  const userId = localStorage.getItem("user_id");

  const imageUrl = post?.contentBlock.find(
    (block) => block.type === "image"
  )?.value;
  return (
    <div
      className=" flex flex-col cursor-pointer w-full "
      onClick={() => navToDetail(nav, userId, post?.id)}
    >
      <div className="mb-2 w-full">
        <img
          src={imageUrl || "/defaultImage.png"}
          className="rounded-sm h-[172px] w-full object-cover"
        />
      </div>
      <div className="">
        <div className="flex mb-2 justify-between">
          <div className="font-medium line-clamp-1 min-h-6">{post?.title}</div>
          <div>{/* <Bookmark className="h-6" /> */}</div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mr-2">
                <img
                  src={post?.userImage || "/defaultAvatar.jpg"}
                  className="h-8 w-8 object-cover rounded-full "
                />
              </div>
              <div className="font-semibold line-clamp-1 w-20 text-[14px]">
                {post?.username}
              </div>
            </div>
            <div className="text-[12px] ml-2 text-text2">
              {" "}
              {formatDate(post?.createdAt)}
            </div>
          </div>
          <div className="flex  items-center">
            <ThumbsUp className="h-4" />
            <p className="4 ml-1 text-sm"> {post?.countLike}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
