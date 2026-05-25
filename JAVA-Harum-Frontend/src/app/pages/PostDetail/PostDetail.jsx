/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from "react"; // 1. Thêm useCallback
import ContactPart from "./partials/ContactPart";
import PostContent from "./partials/PostContent";
import CommentSection from "./partials/CommentSection";
import { useParams } from "react-router-dom";
import { getPosticbyId, createPostInteractionAndCompareElo } from "./postDetailService";
import { Loader2 } from "lucide-react";

// Component con PostDetailSkeleton không đổi
const PostDetailSkeleton = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <Loader2 className="animate-spin text-pblue mx-auto" size={48} />
        <p className="mt-4 text-lg text-gray-600">Đang tải bài viết...</p>
      </div>
    </div>
  );
};

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isHidden, setIsHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const commentRef = useRef(null);
  const postRef = useRef(null);

  // Tracking state for post interaction
  const [startTime, setStartTime] = useState(null);
  const [readTime, setReadTime] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [commented, setCommented] = useState(false);
  const interactionRef = useRef({
    liked: false,
    disliked: false,
    commented: false,
    startTime: null,
  });
  const userID = localStorage.getItem("user_id");

  // 2. Dùng useCallback để định nghĩa hàm fetchPost
  // Hàm này sẽ được tạo lại mỗi khi `id` thay đổi.
  const fetchPost = useCallback(async () => {
    if (!id) return; // Không làm gì nếu không có id

    setIsLoading(true); // Bắt đầu loading mỗi khi fetch
    try {
      const res = await getPosticbyId(id);
      if (res.status === 200) {
        setPost(res.data);
        postRef.current = res.data;

      } else {
        console.error("Lỗi: Không lấy được bài viết, status:", res.status);
        setPost(null);
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      setPost(null);
    } finally {
      setIsLoading(false); // Luôn kết thúc loading
    }
  }, [id]); // Phụ thuộc vào `id`

  // 3. useEffect để gọi fetchPost khi component mount hoặc id thay đổi
  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0); // Scroll lên đầu trang khi có bài viết mới
  }, [fetchPost]); // Bây giờ dependency là hàm `fetchPost` ổn định

  // useEffect cho việc ẩn/hiện ContactPart không đổi
  useEffect(() => {
    const handleScroll = () => {
      if (commentRef.current) {
        const commentTop = commentRef.current.getBoundingClientRect().top;
        setIsHidden(commentTop <= 300);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Dependency rỗng là đúng ở đây

  // --- KẾT THÚC PHẦN SỬA LẠI ---

  // --- BẮT ĐẦU PHẦN THEO DÕI POST INTERACTION ---

  // useEffect để bắt đầu theo dõi thời gian khi component mount
  useEffect(() => {
    if (userID && post) {
      const start = Date.now();
      setStartTime(start);
      interactionRef.current.startTime = start;
    }
  }, [userID, post]);

  // useEffect cleanup để gọi backend khi user thoát khỏi bài viết
  useEffect(() => {
    return () => {
      if (!userID) return;

      const postData = postRef.current; // 👈 THAY post bằng ref
      const startTime = interactionRef.current.startTime;

      if (!postData || !startTime) return;

      const endTime = Date.now();
      const timeSpent = Math.floor((endTime - startTime) / 1000);

      const postInteraction = {
        userId: userID,
        postId: postData.id,          // 👈 SỬA
        topicId: postData.topicId,    // 👈 SỬA
        readTime: timeSpent,
        liked: interactionRef.current.liked,
        disliked: interactionRef.current.disliked,
        commented: interactionRef.current.commented,
      };

      createPostInteractionAndCompareElo(postInteraction)
        .catch(console.error);
    };
  }, [id]);

  // Callback để cập nhật trạng thái like/dislike từ ContactPart
  const handleLikeDislikeChange = useCallback((isLiked, isDisliked) => {
    setLiked(isLiked);
    setDisliked(isDisliked);

    interactionRef.current.liked = isLiked;
    interactionRef.current.disliked = isDisliked;
  }, []);

  // Callback để cập nhật trạng thái comment từ CommentSection
  const handleCommentAdded = useCallback(() => {
    setCommented(true);
    interactionRef.current.commented = true;
  }, []);
  // --- KẾT THÚC PHẦN THEO DÕI POST INTERACTION ---

  // Logic render JSX không đổi, nhưng giờ đã an toàn
  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return (
      <p className="text-center mt-10 text-xl font-semibold text-gray-700">
        Bài viết không còn khả dụng hoặc đã bị xóa.
      </p>
    );
  }

  return (
    <div>
      <div className="flex mx-auto flex-col max-w-7xl">
        {/* ContactPart bây giờ nhận được prop `refreshPost` hợp lệ */}
        <div
          className={`fixed top-1/3 left-50 transition-opacity duration-300 ${isHidden ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
          {/* 4. Truyền hàm fetchPost vào đây, bây giờ đã đúng */}
          <ContactPart
            post={post}
            onLikeDislikeChange={handleLikeDislikeChange}
          />
        </div>

        {/* Nội dung bài viết */}
        <PostContent post={post} />

        {/* Phần bình luận */}
        <div ref={commentRef} className="mb-10">
          <CommentSection
            postId={post?.id}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      </div>
    </div>
  );
}
