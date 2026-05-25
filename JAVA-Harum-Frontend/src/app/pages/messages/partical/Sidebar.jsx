import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { messageService } from "../MessageService";
import { debounce } from "lodash";

export default function Sidebar({ onSelectUser, selectedUserId }) {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const currentUserId = localStorage.getItem("user_id");
    if (!currentUserId) {
      navigate("/login");
      return;
    }

    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const contacts = await messageService.getContacts(currentUserId);
        setConversations(contacts);
      } catch (error) {
        console.error("Lỗi khi tải danh sách cuộc trò chuyện:", error);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [navigate]);

  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term) {
        setLoadingSearch(true);
        const results = await messageService.searchUsers(term);
        const currentUserId = localStorage.getItem("user_id");
        setSearchResults(results.filter((user) => user.id !== currentUserId));
        setLoadingSearch(false);
      } else {
        setSearchResults([]);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (isSearching) {
      debouncedSearch(searchTerm);
    }
    return () => debouncedSearch.cancel();
  }, [searchTerm, isSearching, debouncedSearch]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsSearching(term.length > 0);
    if (term.length === 0) {
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    handleClearSearch();
  };

  return (
    <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 overflow-y-auto bg-white h-full flex flex-col">
      {/* Header */}
      <div
        className="p-4 border-b border-gray-200 cursor-pointer flex items-center justify-center sticky top-0 bg-white z-10"
        onClick={() => navigate("/")}
      >
        <img src="/logoFull.svg" alt="Logo" className="w-32 h-auto" />
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-200 sticky top-16 bg-white z-10">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pblue focus:bg-white"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {isSearching && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div>
            <h3 className="p-3 text-sm font-semibold text-gray-600">
              Kết quả tìm kiếm
            </h3>
            {loadingSearch ? (
              <p className="p-4 text-center text-gray-500">Đang tìm...</p>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 transition-colors"
                >
                  <img
                    src={user.avatarUrl || "/defaultAvatar.jpg"}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-500">Bắt đầu trò chuyện</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500">
                Không tìm thấy người dùng nào.
              </p>
            )}
          </div>
        ) : (
          <div>
            {loadingConversations ? (
              <p className="p-4 text-center text-gray-500">
                Đang tải cuộc trò chuyện...
              </p>
            ) : conversations.length > 0 ? (
              conversations.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 transition-colors ${
                    user.id === selectedUserId ? "bg-blue-50" : ""
                  }`}
                >
                  <img
                    src={user.avatarUrl || "/defaultAvatar.jpg"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      Nhấn để xem tin nhắn
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500">
                Không có cuộc trò chuyện nào. Hãy tìm kiếm để bắt đầu!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
