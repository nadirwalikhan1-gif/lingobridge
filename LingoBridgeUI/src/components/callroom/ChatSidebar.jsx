import { useState, useRef, useEffect } from "react";

export default function ChatSidebar({ open, messages = [], onSend }) {
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className={`chat-sidebar ${open ? "chat-sidebar--open" : ""}`}>
      <div className="chat-sidebar__header">
        <span>In-call chat</span>
      </div>

      <div className="chat-sidebar__messages">
        {messages.length === 0 && (
          <p className="chat-sidebar__empty">No messages yet</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.isLocal ? "chat-msg--local" : ""}`}>
            <span className="chat-msg__author">{msg.author}</span>
            <p className="chat-msg__text">{msg.text}</p>
            <span className="chat-msg__time">{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-sidebar__input-row">
        <textarea
          className="chat-sidebar__input"
          rows={2}
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="chat-sidebar__send" onClick={handleSend}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </aside>
  );
}