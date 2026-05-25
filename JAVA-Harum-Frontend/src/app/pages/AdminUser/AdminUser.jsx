// src/pages/admin/AdminUserPage.jsx

import React, { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserStatus } from "./AdminUserService";
import Pagination from "./partials/Pagination";
import UserFilters from "./partials/UserFilters";
import UserTable from "./partials/UserTable";
import ConfirmationModal from "./partials/ConfirmationModal";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

export default function AdminUserPage() {
  const [filters, setFilters] = useState({ searchTerm: "", role: "ALL" });
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const [isSubmitting, setIsSubmitting] = useState(false); // State để quản lý loading trong modal

  const queryClient = useQueryClient();

  // useQuery giờ phụ thuộc vào cả currentPage và filters
  const {
    data: pageData,
    isLoading,
    isError,
    error,
    isFetching,
    isPreviousData,
  } = useQuery({
    queryKey: ["adminUsers", currentPage, filters],
    queryFn: () =>
      getUsers({
        page: currentPage,
        size: PAGE_SIZE,
        ...filters,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  // HANDLERS
  const handleFilterChange = useCallback((newFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  }, []);

  const handlePageChange = (newPage) => {
    if (!isPreviousData && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, data: null });
  };

  const handleRequestChangeStatus = (userId, status) => {
    setModalState({ isOpen: true, data: { userId, status } });
  };

  // Hàm xử lý chính khi xác nhận - Sử dụng async/await và useState
  const handleConfirmStatusChange = async () => {
    if (!modalState.data) return;

    setIsSubmitting(true); // BẮT ĐẦU LOADING

    const { userId, status } = modalState.data;
    const body =
      status === "ENABLE"
        ? {
            status: "DISABLE",
            emailContent:
              "Tài khoản của bạn đã bị quản trị viên vô hiệu hóa...",
          }
        : {
            status: "ENABLE",
            emailContent: "Tài khoản của bạn đã được kích hoạt lại.",
          };

    try {
      const res = await updateUserStatus(userId, body);
      if (res.status === 200) {
        toast.info(
          status === "ENABLE"
            ? "Đã vô hiệu hóa tài khoản."
            : "Đã kích hoạt lại tài khoản."
        );
        // Làm mới lại query hiện tại để cập nhật UI
        queryClient.invalidateQueries(["adminUsers", currentPage, filters]);
      } else {
        toast.error("Có lỗi xảy ra, không thể cập nhật.");
      }
    } catch (err) {
      toast.error(err.message || "Lỗi máy chủ.");
    } finally {
      setIsSubmitting(false); // KẾT THÚC LOADING
      handleCloseModal(); // Đóng modal
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Người dùng</h1>
        {isFetching && !isLoading && (
          <div className="text-sm text-pblue animate-pulse">
            Đang làm mới...
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <UserFilters onFilterChange={handleFilterChange} />

        <UserTable
          users={pageData?.content || []}
          onRequestChangeStatus={handleRequestChangeStatus}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />

        <Pagination pageInfo={pageData} onPageChange={handlePageChange} />
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStatusChange}
        isLoading={isSubmitting} // Truyền state loading xuống
        title={
          modalState.data?.status === "ENABLE"
            ? "Xác nhận Vô hiệu hóa"
            : "Xác nhận Kích hoạt"
        }
        message={`Bạn có chắc chắn muốn ${
          modalState.data?.status === "ENABLE" ? "vô hiệu hóa" : "kích hoạt lại"
        } tài khoản này không?`}
        confirmText={
          modalState.data?.status === "ENABLE" ? "Vô hiệu hóa" : "Kích hoạt"
        }
        variant={modalState.data?.status === "ENABLE" ? "danger" : "success"}
      />
    </div>
  );
}
