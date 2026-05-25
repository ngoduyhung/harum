// src/features/postDetail/components/CommentSection.jsx

import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import {
  doReportComment,
  getComment,
  postComment,
  postReply,
} from "../postDetailService";
import groupCommentsFlat from "../../../utils/groupComment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoginRequiredModal } from "../../../components/LoginRequiredModal";
import { ReportModal } from "./ReportModal";
import CommentItem from "./CommentItem"; // Import component đã tách

const PARENT_COMMENTS_PER_PAGE = 10;
const REPLIES_PER_PAGE = 10;

const CommentSection = ({ postId, onCommentAdded }) => {
  const [number, setNumber] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(-1);

  // State cho các modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // State mới để quản lý bình luận đang được báo cáo
  const [reportingComment, setReportingComment] = useState(null);

  const navigate = useNavigate();

  const [visibleParentCount, setVisibleParentCount] = useState(
    PARENT_COMMENTS_PER_PAGE
  );
  const [commentStates, setCommentStates] = useState({}); // { [commentId]: { repliesVisible, visibleReplyCount } }

  const fetchComment = async () => {
    try {
      const res = await getComment(postId);
      if (res.status === 200) {
        setComments(groupCommentsFlat(res?.data));
        setNumber(res?.data.length);
      } else {
        console.error("Lỗi: Không lấy được comment");
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const chooseParentComment = (commentId, index) => {
    setReplyContent("");
    setCommentContent("");
    setCurrentCommentIndex(index);
    setCurrentCommentId(commentId);
  };

  const handleComment = async (content, isReply = false) => {
    const userID = localStorage.getItem("user_id");
    if (!userID) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!content.trim()) {
      toast.warn("Vui lòng nhập nội dung!");
      return;
    }

    const data = {
      userId: userID,
      postId: postId,
      content: content,
    };

    try {
      if (isReply && currentCommentId) {
        await postReply(currentCommentId, data);
        toast.success("Bạn đã phản hồi một bình luận");
      } else {
        await postComment(data);
        toast.success("Bạn đã bình luận bài viết");
        // Notify parent component about comment added
        if (onCommentAdded) {
          onCommentAdded();
        }
      }

      setCommentContent("");
      setReplyContent("");
      setCurrentCommentIndex(-1);
      setCurrentCommentId(null);
      fetchComment(); // Tải lại toàn bộ bình luận
    } catch (error) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Lỗi khi gửi bình luận/phản hồi:", error);
    }
  };

  const handleLoginRedirect = () => {
    setIsLoginModalOpen(false);
    navigate("/login");
  };

  const toggleReplies = (commentId) => {
    setCommentStates((prev) => {
      const currentState = prev[commentId] || {};
      return {
        ...prev,
        [commentId]: {
          ...currentState,
          repliesVisible: !currentState.repliesVisible,
          visibleReplyCount: currentState.visibleReplyCount || REPLIES_PER_PAGE,
        },
      };
    });
  };

  const loadMoreReplies = (commentId) => {
    setCommentStates((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        visibleReplyCount:
          (prev[commentId]?.visibleReplyCount || 0) + REPLIES_PER_PAGE,
      },
    }));
  };

  const handleOpenReportModal = (commentToReport) => {
    const userID = localStorage.getItem("user_id");
    if (!userID) {
      setIsLoginModalOpen(true);
      return;
    }

    if (userID === commentToReport.userId) {
      toast.warn("Không thể báo cáo bình luận của bản thân!");
      return;
    }

    setReportingComment(commentToReport);
    setIsReportModalOpen(true);
  };

  const handleReportComment = async (reason) => {
    const userID = localStorage.getItem("user_id");

    if (!reportingComment || !userID) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
      setIsReportModalOpen(false);
      return;
    }

    const report = {
      reporterId: userID,
      commentId: reportingComment.id,
      reason: reason,
      status: "PENDING",
    };

    try {
      const res = await doReportComment(report);
      if (res?.status === 200) {
        if (res?.data === "Already reported") {
          toast.info("Bạn đã từng báo cáo bình luận này!");
        } else if (res?.data === "Report submitted") {
          toast.success("Báo cáo thành công!");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Báo cáo thất bại, vui lòng thử lại.");
    } finally {
      setIsReportModalOpen(false);
      setReportingComment(null);
    }
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportingComment(null);
  };

  // --- BẮT ĐẦU PHẦN THAY ĐỔI ---
  // Hàm xử lý khi nhấn phím trên ô nhập bình luận chính
  const handleKeyDown = (event) => {
    // Kiểm tra nếu phím được nhấn là "Enter"
    if (event.key === "Enter") {
      // Ngăn hành vi mặc định (như xuống dòng trong textarea hoặc submit form)
      event.preventDefault();
      // Gọi hàm gửi bình luận chính (isReply = false)
      handleComment(commentContent, false);
    }
  };
  // --- KẾT THÚC PHẦN THAY ĐỔI ---

  return (
    <>
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginRedirect}
      />

      <ReportModal
        type={"bình luận"}
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        onConfirm={handleReportComment}
      />

      <div className="w-[800px] mx-auto mt-10 bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-b-gray-300">
          <h2 className="text-lg font-semibold text-text">
            Bình luận ({number})
          </h2>
        </div>

        <div className="p-4 flex items-center border-b border-b-gray-300">
          <div className="h-8 w-8 mr-3">
            <img
              src={
                localStorage.getItem("avatarUrl") &&
                localStorage.getItem("avatarUrl") !== "null"
                  ? localStorage.getItem("avatarUrl")
                  : "/defaultAvatar.jpg"
              }
              className="h-full w-full rounded-full object-cover"
              alt="User avatar"
            />
          </div>
          <input
            spellCheck="false"
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onFocus={() => chooseParentComment(null, -1)}
            // --- BẮT ĐẦU PHẦN THAY ĐỔI ---
            onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown vào đây
            // --- KẾT THÚC PHẦN THAY ĐỔI ---
            placeholder="Hãy chia sẻ cảm nghĩ của bạn về bài viết"
            className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pblue"
          />
          <button
            className="ml-2"
            onClick={() => handleComment(commentContent, false)}
          >
            <Send size={18} className={"text-pblue cursor-pointer"} />
          </button>
        </div>

        {/* Danh sách bình luận */}
        <div>
          {comments.slice(0, visibleParentCount).map((commentGroup, index) => (
            <CommentItem
              key={commentGroup[0]?.id || index}
              commentGroup={commentGroup}
              index={index}
              onChooseParentComment={chooseParentComment}
              onToggleReplies={toggleReplies}
              onLoadMoreReplies={loadMoreReplies}
              commentState={
                commentStates[commentGroup[0]?.id] || {
                  repliesVisible: false,
                  visibleReplyCount: REPLIES_PER_PAGE,
                }
              }
              isReplyInputVisible={currentCommentIndex === index}
              replyContent={currentCommentIndex === index ? replyContent : ""}
              onReplyContentChange={(e) => setReplyContent(e.target.value)}
              onPostReply={() => handleComment(replyContent, true)}
              onReport={handleOpenReportModal}
            />
          ))}
        </div>

        {/* Nút xem thêm bình luận gốc */}
        {visibleParentCount < comments.length && (
          <div className="p-4 text-center">
            <button
              onClick={() =>
                setVisibleParentCount((prev) => prev + PARENT_COMMENTS_PER_PAGE)
              }
              className="font-semibold cursor-pointer text-pblue hover:underline"
            >
              Xem thêm bình luận
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CommentSection;
