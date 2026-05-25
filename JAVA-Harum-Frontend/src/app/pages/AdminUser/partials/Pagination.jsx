// src/pages/admin/components/Pagination.jsx

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pageInfo, onPageChange }) => {
  if (!pageInfo || pageInfo.totalPages <= 1) return null;

  const {
    number: pageIndexFromApi,
    totalPages,
    totalElements,
    size,
    first,
    last,
  } = pageInfo;
  const currentPageForDisplay = pageIndexFromApi + 1;
  const startItem = pageIndexFromApi * size + 1;
  const endItem = Math.min(startItem + size - 1, totalElements);

  return (
    <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t">
      <span className="text-sm text-gray-600">
        Hiển thị {startItem}-{endItem} trên {totalElements} kết quả
      </span>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPageForDisplay - 1)}
          disabled={first}
          className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-medium">
          Trang {currentPageForDisplay} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPageForDisplay + 1)}
          disabled={last}
          className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
