import formatDate from "../../../utils/formatDate";
import { sFollow } from "../followStore";
import { doFollow } from "../postDetailService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginRequiredModal } from "../../../components/LoginRequiredModal";
export default function PostContent({ post }) {
  const isFollowing = sFollow.use();
  const userID = localStorage.getItem("user_id");
  const nav = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleFollow = async () => {
    if (userID === post?.userId) {
      toast.warn("Không thể theo dõi bản thân!");
      return;
    }
    if (userID) {
      const res = await doFollow(userID, post?.userId);
      if (res?.status === 200) {
        toast.success(isFollowing ? "Đã bỏ theo dõi!" : "Đã theo dõi!");
        sFollow.set((pre) => (pre.value = !pre.value));
        console.log("done: ", res);
      }
    } else setIsLoginModalOpen(true);
  };
  return (
    <div className="mx-auto w-[800px]">
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => nav("/login")}
      />
      <div className="mt-4">
        <p className="text-sm text-text">{post?.topicName?.toUpperCase()}</p>
        <p className="text-[40px] leading-tight my-4 text-text font-semibold">
          {post?.title}
        </p>
        <div className="flex justify-between mt-4 items-center">
          <div className="flex  items-center">
            <img
              className="w-14 h-14  object-cover rounded-full mr-2.5 cursor-pointer hover:scale-105 shadow-sm"
              onClick={() => nav(`/profile/${post?.userId}`)}
              src={post?.avatarUrl || "/defaultAvatar.jpg"}
            />
            <div className="text-sm font-semibold">
              <p className="text-text">{post?.username || "Người dùng A"}</p>
              <p className="text-text2">
                {formatDate(post?.createdAt) || "01-01-2025"}
              </p>
            </div>
          </div>
          {localStorage.getItem("user_id") === post?.userId ? (
            <></>
          ) : isFollowing ? (
            <div
              className="border border-pblue  cursor-pointer text-pblue px-8 py-2 font-semibold text-sm rounded-3xl flex items-center justify-center"
              onClick={() => handleFollow()}
            >
              Đang theo dõi
            </div>
          ) : (
            <div
              className="border border-text2  cursor-pointer text-text2 px-8 py-2 font-semibold text-sm rounded-3xl flex items-center justify-center"
              onClick={() => handleFollow()}
            >
              Theo dõi
            </div>
          )}
        </div>
      </div>

      <div className=" mt-7 ">
        <div className="space-y-4">
          {post?.contentBlock?.map((block, index) => {
            switch (block?.type) {
              case "paragraph":
                return (
                  <p
                    key={index}
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: block?.value }}
                  />
                );
              case "text":
                return (
                  <p
                    key={index}
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: block?.value }}
                  />
                );
              case "quote":
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-gray-400 pl-4 italic text-gray-600"
                    dangerouslySetInnerHTML={{ __html: block?.value }}
                  />
                );
              case "image":
                return (
                  <div className="w-full flex justify-center">
                    <img
                      key={index}
                      src={block?.value || ""}
                      alt="Ảnh nội dung bài viết"
                      className="rounded-lg shadow-md w-full"
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
