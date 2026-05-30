import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageCircle, Minimize2 } from "lucide-react";
import { useSelector } from "react-redux";
import userService from "../Services/userServices";
import { useDispatch } from "react-redux";
import { updateFilter } from "../Stores/generalSlice";
export default function ChatBot({ setFilter, handleSearch }: any) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    [],
  );
  const auth = useSelector((state: any) => state.auth);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Clear unread when opened
  useEffect(() => {
    sendMessage("Search Properties");
    dispatch(
      updateFilter({
        Price: {
          min: 0,
          max: 500000000,
        },
        Area: {
          min: 0,
          max: 50000,
        },
      }),
    );
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);
  //   useEffect(() => {
  //     debugger;
  //     dispatch(
  //       updateFilter({
  //         Price: {
  //           min: 0,
  //           max: 500000000,
  //         },
  //         Area: {
  //           min: 0,
  //           max: 50000,
  //         },
  //       }),
  //     );
  //   }, []);

  // Send message
  const sendMessage = async (initialInput?: string) => {
    initialInput && setInput(initialInput);
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    !initialInput && setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response: any = await userService.chatApi(
        auth,
        currentInput,
        "search-prop-user",
      );
      const data = await response.data;
      const botReply = data.reply || "I found some matching properties.";
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);

      // If chat is closed, bump unread badge
      if (!isOpen) setUnreadCount((c) => c + 1);

      if (data.filters) {
        dispatch(updateFilter(data.filters));
        setTimeout(() => handleSearch(), 100);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-5 right-5 z-[99999] flex flex-col items-end gap-3">
      {/* ── Chat Panel ─────────────────────────────────────────────── */}
      <div
        className="flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden
                   transition-all duration-300 ease-in-out origin-bottom-right"
        style={{
          width: isOpen ? 350 : 0,
          height: isOpen ? 520 : 0,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div className="bg-primary text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bot size={20} />
            <div>
              <h2 className="font-semibold text-sm leading-tight">
                Search Prop AI
              </h2>
              <p className="text-xs opacity-75">Property Search Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 rounded-full p-1 transition"
            aria-label="Minimize chat"
          >
            <Minimize2 size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                }`}
              >
                <div className="flex items-start gap-2">
                  {msg.role === "bot" ? (
                    <Bot
                      size={14}
                      className="mt-0.5 flex-shrink-0 opacity-60"
                    />
                  ) : (
                    <User
                      size={14}
                      className="mt-0.5 flex-shrink-0 opacity-80"
                    />
                  )}
                  <span>{msg.text}</span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-2 rounded-2xl shadow-sm text-sm border border-gray-100 flex items-center gap-1.5">
                <Bot size={14} className="opacity-60" />
                <span className="flex gap-1">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full inline-block"
                      style={{ animation: `chatBounce 1s infinite ${delay}ms` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-white flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Search properties..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none
                       focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-primary text-white p-2 rounded-full hover:bg-primary-dark
                       transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* ── FAB Toggle Button ──────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="relative flex items-center justify-center rounded-full shadow-lg
                   bg-primary text-white transition-all duration-200
                   hover:scale-110 active:scale-95"
        style={{ width: 52, height: 52 }}
      >
        {/* Icon flips between chat and X */}
        <span
          className="absolute transition-all duration-200"
          style={{
            opacity: isOpen ? 0 : 1,
            transform: isOpen
              ? "rotate(90deg) scale(0.5)"
              : "rotate(0deg) scale(1)",
          }}
        >
          <MessageCircle size={22} />
        </span>
        <span
          className="absolute transition-all duration-200"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen
              ? "rotate(0deg) scale(1)"
              : "rotate(-90deg) scale(0.5)",
          }}
        >
          <X size={22} />
        </span>

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold
                       rounded-full flex items-center justify-center"
            style={{ width: 18, height: 18, fontSize: 10 }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <style>{`
        @keyframes chatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
