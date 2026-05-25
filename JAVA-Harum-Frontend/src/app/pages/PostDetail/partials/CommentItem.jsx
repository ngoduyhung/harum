// src/features/postDetail/components/CommentItem.jsx

import React from "react";
import { Flag, Reply, ChevronDown, Send, ShieldAlert } from "lucide-react";
import formatDate from "../../../utils/formatDate";

// Component con để hiển thị nội dung bình luận bị vô hiệu hóa
const DisabledComment = () => {
  return (
    <div className="flex items-center text-sm text-gray-500 italic bg-gray-50 rounded-2xl px-4 py-3">
      <ShieldAlert size={18} className="mr-3 flex-shrink-0 text-gray-400" />
      <span>Nội dung này đã bị xóa vì vi phạm tiêu chuẩn cộng đồng.</span>
    </div>
  );
};

const CommentItem = ({
  commentGroup,
  index,
  onChooseParentComment,
  onToggleReplies,
  onLoadMoreReplies,
  commentState,
  isReplyInputVisible,
  replyContent,
  onReplyContentChange,
  onPostReply,
  onReport,
}) => {
  const parentComment = commentGroup[0];
  const replies = commentGroup.slice(1);
  const totalReplies = replies.length;
  const { repliesVisible, visibleReplyCount } = commentState;

  // Kiểm tra trạng thái của bình luận cha
  const isParentDisabled = parentComment?.status === "DISABLE";

  // --- BẮT ĐẦU PHẦN THAY ĐỔI ---
  // Hàm xử lý khi nhấn phím trên ô input
  const handleKeyDown = (event) => {
    // Kiểm tra nếu phím được nhấn là "Enter"
    if (event.key === "Enter") {
      // Ngăn hành vi mặc định của phím Enter (ví dụ: submit form)
      event.preventDefault();
      // Gọi hàm gửi phản hồi đã có
      onPostReply();
    }
  };
  // --- KẾT THÚC PHẦN THAY ĐỔI ---

  return (
    <div className="py-4 border-b-gray-300 border-b">
      {/* --- Parent Comment --- */}
      <div className="px-4">
        {isParentDisabled ? (
          <DisabledComment />
        ) : (
          // Hiển thị bình luận bình thường nếu không bị DISABLE
          <div className="flex">
            <div className="h-9 w-9 mr-3 flex-shrink-0">
              <img
                src={parentComment?.avatarUrl || "/defaultAvatar.jpg"}
                className="h-full w-full rounded-full object-cover border border-gray-200"
                alt="Commenter avatar"
              />
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-2xl px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-text">
                    {parentComment?.username || "Anonymous"}
                  </span>
                  <Flag
                    size={16}
                    onClick={() => onReport(parentComment)}
                    className="hover:text-pblue text-gray-400 cursor-pointer"
                  />
                </div>
                <p className="mt-1 text-text text-sm">
                  {parentComment?.content}
                </p>
              </div>
              <div className="flex items-center mt-2 pl-2 text-xs text-gray-500 space-x-4">
                <span>
                  {formatDate(parentComment?.createdAt) || "Vừa xong"}
                </span>
                <button
                  className="flex items-center hover:text-pblue cursor-pointer"
                  onClick={() => onChooseParentComment(parentComment.id, index)}
                >
                  <Reply size={14} className="mr-1" />
                  <span>Phản hồi</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Replies Section --- */}
      {/* Chỉ hiển thị phần phản hồi nếu bình luận cha không bị vô hiệu hóa */}
      {!isParentDisabled && totalReplies > 0 && (
        <div className="pl-16 pr-4 mt-2">
          <button
            onClick={() => onToggleReplies(parentComment.id)}
            className="text-xs font-semibold cursor-pointer text-gray-600 hover:text-pblue flex items-center"
          >
            {repliesVisible ? "Ẩn phản hồi" : `Xem ${totalReplies} phản hồi`}
            <ChevronDown
              size={16}
              className={`ml-1 transition-transform ${
                repliesVisible ? "rotate-180" : ""
              }`}
            />
          </button>

          {repliesVisible && (
            <div className="mt-3 space-y-3">
              {replies.slice(0, visibleReplyCount).map((reply) => {
                // Kiểm tra trạng thái của từng phản hồi
                const isReplyDisabled = reply?.status === "DISABLE";

                return (
                  <div key={reply.id} className="flex">
                    {isReplyDisabled ? (
                      <div className="ml-10 w-full">
                        <DisabledComment />
                      </div>
                    ) : (
                      // Hiển thị phản hồi bình thường
                      <>
                        <div className="h-8 w-8 mr-2 flex-shrink-0">
                          <img
                            src={reply?.avatarUrl || "/defaultAvatar.jpg"}
                            className="h-full w-full rounded-full object-cover border border-gray-200"
                            alt="Replier avatar"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-2xl px-3 py-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-xs text-gray-900">
                                {reply?.username || "Anonymous"}
                              </span>
                              <Flag
                                size={14}
                                onClick={() => onReport(reply)}
                                className="hover:text-pblue text-gray-400 cursor-pointer"
                              />
                            </div>
                            <p className="mt-0.5 text-text text-xs">
                              {reply.content}
                            </p>
                          </div>
                          <div className="flex items-center mt-1 pl-2 text-xs text-gray-500 space-x-3">
                            <span className="text-xs">
                              {formatDate(reply?.createdAt) || "Vừa xong"}
                            </span>
                            <button
                              className="flex items-center hover:text-pblue cursor-pointer"
                              onClick={() =>
                                onChooseParentComment(parentComment.id, index)
                              }
                            >
                              <Reply size={12} className="mr-1" />
                              <span>Phản hồi</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              {visibleReplyCount < totalReplies && (
                <button
                  onClick={() => onLoadMoreReplies(parentComment.id)}
                  className="text-xs font-semibold cursor-pointer text-gray-600 hover:text-pblue ml-10"
                >
                  Xem thêm phản hồi
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- Reply Input --- */}
      {/* Chỉ hiển thị ô nhập phản hồi nếu bình luận cha không bị vô hiệu hóa */}
      {!isParentDisabled && (
        <div className="px-4">
          {isReplyInputVisible && (
            <div className="mt-3 flex items-center">
              <div className="h-8 w-8 mr-2 flex-shrink-0">
                <img
                  src={
                    localStorage.getItem("avatarUrl") &&
                    localStorage.getItem("avatarUrl") !== "null"
                      ? localStorage.getItem("avatarUrl")
                      : "/defaultAvatar.jpg"
                  }
                  className="h-full w-full rounded-full object-cover"
                  alt="Current user avatar"
                />
              </div>
              <input
                autoFocus
                spellCheck="false"
                type="text"
                value={replyContent}
                onChange={onReplyContentChange}
                // --- BẮT ĐẦU PHẦN THAY ĐỔI ---
                onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown vào đây
                // --- KẾT THÚC PHẦN THAY ĐỔI ---
                placeholder={`Phản hồi ${parentComment.username}...`}
                className="flex-1 bg-gray-100 rounded-full py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pblue"
              />
              <button className="ml-2 text-pblue mt-1" onClick={onPostReply}>
                <Send size={18} className={"text-pblue cursor-pointer"} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
