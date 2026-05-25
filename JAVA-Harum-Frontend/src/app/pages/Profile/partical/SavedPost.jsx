import React from "react";
import { Bookmark, ThumbsUp } from "lucide-react";
import formatDate from "../../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { unSave } from "../ProfileService";
import { toast } from "react-toastify";
export default function SavedPost({ post, refresh }) {
  const nav = useNavigate();

  const imageUrl = post?.post?.contentBlock?.find(
    (block) => block.type === "image"
  )?.value;
  const handleUnsaved = async (e, id) => {
    e.stopPropagation();
    const save = {
      userId: localStorage.getItem("user_id"),
      id: id,
    };
    const res = await unSave(save);
    if (res?.status === 200) {
      toast.success(`Đã bỏ lưu bài viết!`);
      refresh();
    } else toast.warn("Lỗi khi bỏ lưu bài viết!");
  };
  return (
    <div
      className=" flex flex-col cursor-pointer w-full group "
      onClick={() => nav(`/post-detail/${post?.post?.id}`)}
    >
      <div className="mb-2 w-full">
        <img
          src={imageUrl || "/defaultImage.png"}
          className="rounded-sm h-40 w-full object-cover group-hover:scale-105"
        />
      </div>
      <div className="">
        <div className="flex mb-2 justify-between">
          <div className="font-medium line-clamp-1 min-h-6">
            {post?.post?.title}
          </div>
          <div>
            <Bookmark
              className="h-5 text-pblue hover:stroke-3  "
              onClick={(e) => handleUnsaved(e, post?.post.id)}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mr-2">
                <img
                  src={post?.user?.avatarUrl || "/defaultAvatar.jpg"}
                  className="h-8 w-8 object-cover rounded-full "
                />
              </div>
              <div className="font-semibold text-[14px]">
                {post?.user?.username}
              </div>
            </div>
            <div className="text-[12px] ml-5 text-text2">
              {" "}
              {formatDate(post?.post?.createdAt)}
            </div>
          </div>
          <div className="flex  items-center">
            <ThumbsUp className="h-4" />
            <p className="4 ml-1 text-sm"> {post?.post?.countLike}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
