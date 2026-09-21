import React, { useState } from 'react';
import { apiRequest } from '../shared/api';

function TutorChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('Hi! I’m your Neural Academy tutor. Ask me anything about your lessons.');
  const [loading, setLoading] = useState(false);

  async function askTutor(event) {
    event.preventDefault();
    if (!message.trim() || loading) return;
    setLoading(true);
    try {
      const data = await apiRequest('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) });
      setReply(data.reply);
      setMessage('');
    } catch (error) {
      setReply(error.message);
    } finally {
      setLoading(false);
    }
  }

  return <div className="tutor-widget">
    {open && <div className="tutor-card">
      <div className="tutor-card-header"><div><strong>Neural Tutor</strong><small>Powered by Gemini AI</small></div><button onClick={() => setOpen(false)}>×</button></div>
      <p className="tutor-reply">{reply}</p>
      <form onSubmit={askTutor}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask your tutor…" maxLength={2000} /><button type="submit">{loading ? '…' : '↑'}</button></form>
    </div>}
    <button className="tutor-launcher" onClick={() => setOpen(!open)} aria-label="Open AI tutor">✦<span>AI tutor</span></button>
  </div>;
}

export default TutorChat;
