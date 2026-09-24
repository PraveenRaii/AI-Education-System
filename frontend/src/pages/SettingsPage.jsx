import React, { useState, useEffect } from 'react';
import { apiRequest } from '../shared/api';
import { tracks } from '../shared/data';

function SettingsView({ user, onUserUpdate, theme, setTheme }) {
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '', track: user?.track || 'secondary',
    socials: { linkedin: '', github: '', leetcode: '', instagram: '', whatsapp: '', ...(user?.socials || {}) },
    preferences: { emailUpdates: true, lessonReminders: true, weeklyReport: false, ...(user?.preferences || {}) }
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        track: user.track || 'secondary',
        socials: { linkedin: '', github: '', leetcode: '', instagram: '', whatsapp: '', ...(user.socials || {}) },
        preferences: { emailUpdates: true, lessonReminders: true, weeklyReport: false, ...(user.preferences || {}) }
      }));
    }
  }, [user]);

  const updateSocial = (key, value) => setForm({ ...form, socials: { ...form.socials, [key]: value } });
  const updatePreference = (key) => setForm({ ...form, preferences: { ...form.preferences, [key]: !form.preferences[key] } });

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const data = await apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(form) });
      onUserUpdate(data.user);
      localStorage.setItem('neural_academy_user', JSON.stringify(data.user));
      setMessage('Profile updated successfully.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('image', file);
    setError('');
    setMessage('');
    try {
      const data = await apiRequest('/uploads/avatar', { method: 'POST', body });
      const updated = { ...user, avatarUrl: data.url };
      onUserUpdate(updated);
      localStorage.setItem('neural_academy_user', JSON.stringify(updated));
      setMessage('Profile photo updated.');
    } catch (uploadError) {
      setError(uploadError.message);
    }
  }
  return <section className="settings-view workspace-view"><div className="welcome-row"><div><span className="section-kicker">PERSONALIZE YOUR EXPERIENCE</span><h1>Settings.</h1><p>Manage your profile, connections, and learning preferences.</p></div><div className="theme-switch"><button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>☼ Light</button><button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>☾ Dark</button></div></div><form onSubmit={saveProfile} className="settings-grid"><section className="panel settings-card profile-edit-card"><div className="settings-card-heading"><div><h2>Edit profile</h2><p>Keep your personal details up to date.</p></div></div><div className="avatar-editor"><div className="settings-avatar">{user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : user?.name?.slice(0, 2).toUpperCase()}</div><label className="upload-photo">Change photo<input type="file" accept="image/*" onChange={uploadAvatar} /></label><span>JPG, PNG up to 5MB</span></div><div className="settings-fields"><label>Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label><label>Email address<input value={user?.email || ''} disabled /></label><label>Phone number<input value={form.phone} placeholder="+91 98765 43210" onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label>Learning track<select value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}>{tracks.map((track) => <option value={track.id} key={track.id}>{track.label}</option>)}</select></label><label className="full-field">About you<textarea value={form.bio} maxLength={240} placeholder="Tell your learning community a little about yourself…" onChange={(e) => setForm({ ...form, bio: e.target.value })} /></label></div></section><section className="panel settings-card"><div className="settings-card-heading"><div><h2>Connect your profiles</h2><p>Share your professional and learning links.</p></div></div><div className="social-fields">{[['linkedin', 'LinkedIn', 'in'], ['github', 'GitHub', '◉'], ['leetcode', 'LeetCode', '⌘'], ['instagram', 'Instagram', '◎'], ['whatsapp', 'WhatsApp', '◌']].map(([key, label, icon]) => <label key={key}><span className={`social-icon ${key}`}>{icon}</span><div><b>{label}</b><input value={form.socials[key]} placeholder={`https://${key}.com/your-profile`} onChange={(e) => updateSocial(key, e.target.value)} /></div></label>)}</div></section><section className="panel settings-card preferences-card"><div className="settings-card-heading"><div><h2>Preferences</h2><p>Choose how Neural Academy keeps you informed.</p></div></div>{[['emailUpdates', 'Email updates', 'Receive product news and learning tips.'], ['lessonReminders', 'Lesson reminders', 'Get notified before a scheduled lesson.'], ['weeklyReport', 'Weekly progress report', 'Receive your learning summary every Sunday.']].map(([key, label, description]) => <label className="preference-row" key={key}><span><b>{label}</b><small>{description}</small></span><input type="checkbox" checked={form.preferences[key]} onChange={() => updatePreference(key)} /></label>)}</section><div className="settings-actions">{error && <span className="settings-error">{error}</span>}{message && <span className="settings-success">{message}</span>}<button className="primary-small" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div></form></section>;
}

export default SettingsView;
