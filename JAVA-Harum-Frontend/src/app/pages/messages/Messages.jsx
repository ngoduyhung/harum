import Sidebar from "./partical/Sidebar";
import ChatWindow from "./partical/ChatWindow";
import React, { useState, useEffect } from "react";
import { LayoutDashboard } from "lucide-react";
import { messageService } from "./MessageService";

export default function Message() {
  const [selectedUser, setSelectedUser] = useState(null); 
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    messageService.initialize();

    return () => {
      messageService.disconnect();
    };
  }, []); 

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (window.innerWidth < 768) { 
      setShowSidebar(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <button 
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-20"
      >
        <LayoutDashboard size={24} />
      </button>


      <div className={`
        ${showSidebar ? 'block' : 'hidden'} 
        md:block w-full md:w-80 lg:w-96 h-full transition-all duration-300
      `}>
        <Sidebar
          onSelectUser={handleSelectUser}
          selectedUserId={selectedUser?.id}
        />
      </div>

      <div className={`
        ${!showSidebar && window.innerWidth < 768 ? 'block' : 'hidden md:flex'} 
        flex-1 h-full
      `}>
        {selectedUser ? (

          <ChatWindow key={selectedUser.id} user={selectedUser} /> 
        ) : (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
            <div className="text-center p-6 max-w-md">
              <img src="/logo.svg" alt="Harum Logo" className="w-24 h-24 mx-auto mb-4 text-gray-400"/>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Chào mừng đến với Harum Chat</h2>
              <p className="text-gray-500">Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}