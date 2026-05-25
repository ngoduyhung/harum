// src/pages/admin/AdminPostPage.jsx

import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostReport,
  updatePostReportStatus,
  updatePostStatus,
} from "./AdminPostService";
import Pagination from "./partials/Pagination";
import PostReportFilters from "./partials/PostReportFilters";
import PostReportList from "./partials/PostReportList"; // Component sẽ được sửa ở bước 2
import ConfirmationModal from "./partials/ConfirmationModal";
import { toast } from "react-toastify";

const PAGE_SIZE = 5;

export default function AdminPost() {
  // Các state và hooks useQuery, useMutation giữ nguyên
  const [filters, setFilters] = useState({ searchTerm: "", status: "ALL" });
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: null,
    data: null,
  });
  const queryClient = useQueryClient();
  const {
    data: allReports = [],
    isLoading,
    isError,
    error,
    isFetching, // Sử dụng cờ này
  } = useQuery({
    queryKey: ["allPostReports"],
    queryFn: getPostReport,
    staleTime: 1000 * 60 * 5,
  });
  const dismissMutation = useMutation({
    mutationFn: (reportId) => updatePostReportStatus(reportId, "REVIEWED"),
    onSuccess: () => {
      toast.info("Đã bỏ qua báo cáo bài viết.");
      queryClient.invalidateQueries({ queryKey: ["allPostReports"] });
    },
    onError: () => toast.error("Lỗi khi bỏ qua báo cáo!"),
    onSettled: () => handleCloseModal(),
  });
  const deleteMutation = useMutation({
    mutationFn: async ({ postId, reportId }) => {
      await updatePostStatus(postId);
      await updatePostReportStatus(reportId, "RESOLVED");
    },
    onSuccess: () => {
      toast.success("Đã ẩn bài viết và giải quyết báo cáo.");
      queryClient.invalidateQueries({ queryKey: ["allPostReports"] });
    },
    onError: () => toast.error("Lỗi khi ẩn bài viết!"),
    onSettled: () => handleCloseModal(),
  });

  // Toàn bộ logic lọc và phân trang giữ nguyên
  const filteredData = useMemo(() => {
    let data = [...allReports];
    if (filters.status !== "ALL") {
      data = data.filter((report) => report.status === filters.status);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      data = data.filter(
        (report) =>
          report.reporterName.toLowerCase().includes(term) ||
          report.reason.toLowerCase().includes(term)
      );
    }
    return data.sort((a, b) => {
      if (a.status === "PENDING" && b.status !== "PENDING") return -1;
      if (a.status !== "PENDING" && b.status === "PENDING") return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [allReports, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const pageInfo = useMemo(() => {
    const totalElements = filteredData.length;
    const totalPages = Math.ceil(totalElements / PAGE_SIZE);
    return {
      number: currentPage - 1,
      totalPages: totalPages,
      totalElements,
      size: PAGE_SIZE,
      first: currentPage === 1,
      last: currentPage === totalPages,
    };
  }, [filteredData, currentPage]);

  // Các hàm handlers giữ nguyên
  const handleFilterChange = useCallback((newFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  }, []);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleCloseModal = () => {
    setModalState({ isOpen: false, action: null, data: null });
  };
  const handleConfirmAction = () => {
    if (modalState.action === "dismiss") {
      dismissMutation.mutate(modalState.data.reportId);
    } else if (modalState.action === "delete") {
      deleteMutation.mutate(modalState.data);
    }
  };
  const handleRequestDismiss = (reportId) => {
    setModalState({ isOpen: true, action: "dismiss", data: { reportId } });
  };
  const handleRequestDelete = (postId, reportId) => {
    setModalState({
      isOpen: true,
      action: "delete",
      data: { postId, reportId },
    });
  };
  const isSubmitting = dismissMutation.isPending || deleteMutation.isPending;

  return (
    <div className="p-6 relative  bg-gray-100 min-h-full">
      <div className="bg-white rounded-lg shadow-md">
        <PostReportFilters onFilterChange={handleFilterChange} />

        <PostReportList
          reports={paginatedData}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onDismiss={handleRequestDismiss}
          onDeletePost={handleRequestDelete}
          // === TRUYỀN PROP isFetching XUỐNG ===
          isFetching={isFetching}
        />

        <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        isLoading={isSubmitting}
        title={
          modalState.action === "delete"
            ? "Xác nhận Ẩn Bài viết"
            : "Xác nhận Bỏ qua Báo cáo"
        }
        message={
          modalState.action === "delete"
            ? "Hành động này sẽ ẩn bài viết khỏi tất cả người dùng. Bạn có chắc chắn không?"
            : "Bạn có chắc muốn bỏ qua báo cáo này vì không vi phạm tiêu chuẩn?"
        }
        confirmText={modalState.action === "delete" ? "Ẩn bài viết" : "Bỏ qua"}
        variant={modalState.action === "delete" ? "danger" : "success"}
      />
    </div>
  );
}
