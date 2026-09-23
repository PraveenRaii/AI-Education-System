import React, { useState, useRef, useEffect } from 'react';
import { apiRequest } from '../shared/api';

function TutorChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your Neural Academy AI tutor. Ask me anything about your lessons." }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function askTutor(event) {
    event.preventDefault();
    const text = message.trim();
    if (!text || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setMessage('');
    setLoading(true);
    try {
      const data = await apiRequest('/ai/chat', { method: 'POST', body: JSON.stringify({ message: text }) });
      setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: `Sorry, I could not connect: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tutor-widget">
      {open && (
        <div className="tutor-card">
          <div className="tutor-card-header">
            <div className="tutor-header-info">
              <div className="tutor-avatar-icon">✦</div>
              <div>
                <strong>Neural Tutor</strong>
                <small>Powered by Gemini AI</small>
              </div>
            </div>
            <button className="tutor-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>
          <div className="tutor-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`tutor-msg tutor-msg-${msg.role}`}>
                {msg.role === 'ai' && <span className="tutor-msg-icon">✦</span>}
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="tutor-msg tutor-msg-ai">
                <span className="tutor-msg-icon">✦</span>
                <p className="tutor-typing"><span /><span /><span /></p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form className="tutor-form" onSubmit={askTutor}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask your tutor anything…"
              maxLength={2000}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !message.trim()} aria-label="Send">
              {loading ? '…' : '↑'}
            </button>
          </form>
        </div>
      )}
      <button
        className={`tutor-launcher ${open ? 'tutor-open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Open AI tutor"
      >
        <span className="tutor-launcher-icon">✦</span>
        <span>AI tutor</span>
      </button>
    </div>
  );
}

export default TutorChat;
