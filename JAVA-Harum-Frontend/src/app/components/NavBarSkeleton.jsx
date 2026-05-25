// src/components/NavbarSkeleton.jsx
import React from "react";
import { Menu } from "lucide-react";

export default function NavbarSkeleton() {
  // Tạo một mảng giả để lặp, số lượng bằng số mục menu chính
  const fakeItems = Array.from({ length: 5 });

  return (
    <div className="w-full bg-white h-hnavbar shadow-sm">
      <div className="mx-auto max-w-6xl h-full">
        <div className="w-full flex justify-between items-center h-full relative">
          {/* Khung xương cho các mục menu chính */}
          <div className="flex animate-pulse">
            {fakeItems.map((_, index) => (
              <div key={index} className="flex items-center h-14 px-8">
                <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
              </div>
            ))}
          </div>

          {/* Khung xương cho icon menu (nếu có) */}
          <div className="animate-pulse">
            <div className="h-7 w-7 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
