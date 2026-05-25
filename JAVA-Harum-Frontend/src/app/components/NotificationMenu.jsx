/* eslint-disable no-unused-vars */
// NotificationMenu.jsx

import React, { useState, useMemo, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { service } from "../service";
import formatTimeAgo from "../utils/formatTimeAgo";

// --- Component con: NotificationItem (Không thay đổi) ---
const NotificationItem = React.memo(({ noti, onClick, onDelete }) => (
  <div
    className={`p-3 rounded-md mb-2 cursor-pointer transition-all hover:bg-gray-100 ${
      !noti.isRead ? "bg-blue-50" : "bg-white"
    }`}
    onClick={() => onClick(noti)}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-start gap-3">
        <span className="mt-1 text-lg">
          {noti.type === "COMMENT" && "💬"}
          {noti.type === "FOLLOW" && "👤"}
          {noti.type === "POST" && "📝"}
        </span>
        <div className="flex-1">
          <p className="text-sm text-gray-800">{noti.message}</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">
            {formatTimeAgo(noti.createdAt)}
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ div cha
          onDelete(noti.id);
        }}
        className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors"
        aria-label="Xóa thông báo"
      >
        <X size={16} />
      </button>
    </div>
  </div>
));
NotificationItem.displayName = "NotificationItem";

// --- Component chính: NotificationMenu ---
export default function NotificationMenu({
  notifications = [],
  isLoading,
  onClose,
}) {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    notiId: null,
  });
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("user_id");
  const queryKey = useMemo(() => ["notifications", userId], [userId]);

  // --- Logic WebSocket (Không thay đổi) ---
  useEffect(() => {
    if (!userId) return;

    const handleNewNotification = (newNotification) => {
      toast.info(`🔔 ${newNotification.message}`);
      queryClient.setQueryData(queryKey, (oldData = []) => {
        // Tránh thêm thông báo trùng lặp
        if (oldData.some((n) => n.id === newNotification.id)) return oldData;
        return [newNotification, ...oldData];
      });
    };

    const cleanup = service.initializeWebSocket(userId, handleNewNotification);
    return cleanup;
  }, [userId, queryClient, queryKey]);

  // --- Custom Hook được cải tiến ---
  // Hook này bây giờ chỉ tập trung vào việc xử lý optimistic updates và lỗi chung
  // Nó không cần biết về logic onSuccess cụ thể của từng trường hợp nữa.
  const useOptimisticMutation = (mutationFn, action) => {
    return useMutation({
      mutationFn,
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey });
        const previousNotifications = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(queryKey, (oldData = []) => {
          if (action === "delete") {
            return oldData.filter((n) => n.id !== variables);
          }
          if (action === "markRead") {
            return oldData.map((n) =>
              n.id === variables ? { ...n, isRead: true } : n
            );
          }
          return oldData;
        });

        return { previousNotifications };
      },
      onError: (err, variables, context) => {
        // Hiển thị lỗi và khôi phục lại trạng thái cũ
        console.error("Mutation failed:", err);
        const errorMessage =
          err.response?.data?.message || "Không thể thực hiện hành động.";
        toast.error(`Lỗi! ${errorMessage}`);

        if (context?.previousNotifications) {
          queryClient.setQueryData(queryKey, context.previousNotifications);
        }
      },
      onSettled: () => {
        // Dù thành công hay thất bại, luôn làm mới lại dữ liệu từ server
        // để đảm bảo tính nhất quán.
        queryClient.invalidateQueries({ queryKey });
      },
    });
  };

  const markAsReadMutation = useOptimisticMutation(
    service.setReadNotification,
    "markRead"
  );
  const deleteMutation = useOptimisticMutation(
    service.deleteNotification,
    "delete"
  );

  // --- Logic phân loại thông báo (Không thay đổi) ---
  const { unread, read } = useMemo(() => {
    const unreadItems = notifications
      .filter((n) => !n.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const readItems = notifications
      .filter((n) => n.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { unread: unreadItems, read: readItems };
  }, [notifications]);

  // --- Các hàm xử lý sự kiện (Đã được sửa lại) ---
  const navigateToDestination = (noti) => {
    if (!noti) return;
    onClose(); // Đóng menu thông báo trước khi điều hướng
    try {
      switch (noti.type) {
        case "POST":
        case "COMMENT":
          if (noti.postId) {
            nav(`/post-detail/${noti.postId}`);
          }
          break;
        case "FOLLOW":
          if (noti.followId) {
            nav(`/profile/${noti.followId}`);
          }
          break;
        default:
          // Không làm gì nếu không có loại thông báo hợp lệ
          break;
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Không thể điều hướng đến nội dung.");
    }
  };

  // SỬA LẠI LOGIC CHÍNH Ở ĐÂY
  const handleClickNotification = async (noti) => {
    // Nếu đã đọc, chỉ cần điều hướng
    if (noti.isRead) {
      navigateToDestination(noti);
      return;
    }

    // Nếu chưa đọc, sử dụng async/await với mutateAsync
    try {
      // Gọi API để đánh dấu đã đọc.
      // Dấu ... trong UI đã được cập nhật "lạc quan" nhờ onMutate.
      await markAsReadMutation.mutateAsync(noti.id);

      // CHỈ KHI API thành công, chúng ta mới điều hướng.
      navigateToDestination(noti);
    } catch (error) {
      // Lỗi đã được tự động xử lý bởi `onError` trong `useOptimisticMutation`.
      // Chúng ta không cần làm gì thêm ở đây, nhưng có thể log lại nếu muốn.
      console.log("Mark as read failed, navigation cancelled.");
    }
  };

  const handleDeleteClick = (notiId) => {
    setConfirmModal({ isOpen: true, notiId });
  };

  const confirmDelete = () => {
    if (confirmModal.notiId) {
      // Logic này đã đúng, không cần thay đổi
      toast
        .promise(deleteMutation.mutateAsync(confirmModal.notiId), {
          pending: "Đang xóa...",
          success: "Đã xóa thông báo!",
          error: "Xóa thất bại!",
        })
        .finally(() => setConfirmModal({ isOpen: false, notiId: null }));
    }
  };

  // --- Phần render JSX (Không thay đổi) ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-gray-500 text-sm">
        Chưa có thông báo nào
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {unread.length > 0 && (
        <section>
          <h3 className="px-3 py-1 text-xs font-semibold text-gray-500">Mới</h3>
          {unread.map((noti) => (
            <NotificationItem
              key={noti.id}
              noti={noti}
              onClick={handleClickNotification}
              onDelete={handleDeleteClick}
            />
          ))}
        </section>
      )}

      {unread.length > 0 && read.length > 0 && (
        <hr className="my-2 border-gray-200" />
      )}

      {read.length > 0 && (
        <section>
          <h3 className="px-3 py-1 text-xs font-semibold text-gray-500">
            Trước đó
          </h3>
          {read.map((noti) => (
            <NotificationItem
              key={noti.id}
              noti={noti}
              onClick={handleClickNotification}
              onDelete={handleDeleteClick}
            />
          ))}
        </section>
      )}

      {/* Modal xác nhận */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Xác nhận xóa
            </h3>
            <p className="text-sm text-center text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa thông báo này không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, notiId: null })}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded w-28 flex items-center justify-center disabled:bg-red-300"
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Xác nhận"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
