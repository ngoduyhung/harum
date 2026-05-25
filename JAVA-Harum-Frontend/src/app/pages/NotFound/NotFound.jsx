import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bgblue text-gray-800 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl md:text-8xl font-bold text-sblue mb-4">404</h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-700 mb-6">
          Oops! Trang không tồn tại
        </h2>
        <p className="text-md md:text-lg text-gray-600 mb-8">
          Có vẻ như bạn đã đi lạc đường. Trang bạn đang tìm kiếm không có ở đây
          hoặc đã được di chuyển.
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-pblue text-white text-lg font-semibold rounded-lg shadow-md hover:bg-sblue transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pblue focus:ring-opacity-50"
        >
          Quay về Trang Chủ
        </Link>
        <p className="mt-12 text-sm text-gray-500">
          Nếu bạn nghĩ đây là một lỗi, vui lòng liên hệ chúng tôi qua email{" "}
          <a
            href="mailto:harumuit@gm.com"
            className="font-medium text-pblue hover:text-sblue hover:underline transition-colors duration-200"
            target="_blank" // Mở ứng dụng email trong tab/cửa sổ mới (tùy trình duyệt)
            rel="noopener noreferrer" // Bảo mật khi dùng target="_blank"
          >
            harumuit@gm.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default NotFound;
