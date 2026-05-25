/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SendHorizonal } from "lucide-react";
import { messageService } from "../MessageService";

export default function ChatWindow({ user }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [conversationId, setConversationId] = useState(null);

  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
      return;
    }
    if (!user?.id) {
      setLoading(false);
      setMessages([]);
      setConversationId(null);
      return;
    }

    const setupChat = async () => {
      setLoading(true);
      setError(null);
      setMessages([]);

      try {
        const history = await messageService.getConversation(
          currentUserId,
          user.id
        );
        setMessages(history);

        if (history.length > 0) {
          const convId = history[0].conversationId;
          setConversationId(convId);
        } else {
          setConversationId(null);
        }
      } catch (err) {
        setError("Không thể tải cuộc trò chuyện.");
      } finally {
        setLoading(false);
      }
    };

    setupChat();
  }, [user?.id, currentUserId, navigate]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (conversationId) {
      unsubscribe = messageService.subscribeToConversation(
        conversationId,
        (newMessage) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      );
    }
    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentUserId || !user?.id) return;

    const content = message;
    setMessage("");

    if (!conversationId) {
      try {
        const savedMessage = await messageService.sendFirstMessage(
          currentUserId,
          user.id,
          content
        );

        setMessages((prev) => [...prev, savedMessage]);

        setConversationId(savedMessage.conversationId);
      } catch (error) {
        setError("Gửi tin nhắn thất bại. Vui lòng thử lại.");
      }
    } else {
      messageService.sendMessage(currentUserId, user.id, content);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* Header */}
      <div
        className="p-4 border-b border-gray-200 bg-white flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors sticky top-0 z-10"
        onClick={() => navigate(`/profile/${user.id}`)}
      >
        <img
          src={user.avatarUrl || "/defaultAvatar.jpg"}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div>
          <h2 className="font-semibold text-gray-800">{user.name}</h2>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#f5f5f5]">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id || `${msg.senderId}-${msg.sendAt}`}
              className={`flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex ${
                  msg.senderId === currentUserId ? "flex-row-reverse" : ""
                }`}
              >
                {msg.senderId !== currentUserId && (
                  <img
                    src={user.avatarUrl || "/defaultAvatar.jpg"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2 mb-1 flex-shrink-0"
                  />
                )}
                <div
                  className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                    msg.senderId === currentUserId
                      ? "bg-pblue text-white rounded-tr-none ml-12"
                      : "bg-white text-gray-800 rounded-tl-none shadow-sm mr-12"
                  }`}
                >
                  <p className="text-base">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-gray-200 bg-white sticky bottom-0"
      >
        <div className="flex items-center relative ">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-1 focus:ring-pblue focus:border-transparent"
            placeholder="Nhập tin nhắn..."
          />
          <button
            type="submit"
            className="bg-pblue hover:bg-bgblue text-white rounded-r-full p-[15px] transition-colors absolute right-0"
            disabled={!message.trim()}
          >
            <SendHorizonal size={20} weight="fill" />
          </button>
        </div>
      </form>
    </div>
  );
}
