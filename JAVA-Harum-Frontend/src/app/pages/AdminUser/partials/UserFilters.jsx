// src/pages/admin/components/UserFilters.jsx

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";

const UserFilters = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("ALL");

  // Debounce searchTerm 500ms
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Gọi onFilterChange khi các giá trị đã ổn định
  useEffect(() => {
    onFilterChange({
      searchTerm: debouncedSearchTerm,
      role: role,
    });
  }, [debouncedSearchTerm, role, onFilterChange]);

  return (
    <div className="p-4 border-b flex flex-col md:flex-row items-center gap-4">
      <div className="relative w-full md:w-1/3">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          name="searchTerm"
          placeholder="Tìm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-pblue"
        />
      </div>
      <select
        name="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full md:w-auto bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pblue"
      >
        <option value="ALL">Tất cả vai trò</option>
        <option value="ADMIN">Admin</option>
        <option value="USER">User</option>
      </select>
    </div>
  );
};

export default UserFilters;
