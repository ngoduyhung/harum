// Search.jsx
import React from "react";
import TabSection from "./partials/TabSection";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-8 px-4">
      {" "}
      <div className="w-full max-w-5xl">
        {" "}
        <div className="text-center mb-8">
          {query?.trim() ? (
            <>
              <h1 className="font-semibold text-3xl md:text-4xl text-gray-800">
                Kết quả tìm kiếm cho:
              </h1>
              <p className="text-2xl text-pblue font-medium mt-2">"{query}"</p>
            </>
          ) : (
            <div className="flex flex-col items-center text-gray-600">
              <SearchIcon size={64} className="mb-4 text-sblue" />
              <h1 className="font-semibold text-3xl md:text-4xl">
                Tìm kiếm nội dung
              </h1>
              <p className="mt-2 text-lg">
                Nhập từ khóa vào thanh tìm kiếm phía trên để bắt đầu.
              </p>
            </div>
          )}
        </div>
        <TabSection query={query} />
      </div>
    </div>
  );
}
