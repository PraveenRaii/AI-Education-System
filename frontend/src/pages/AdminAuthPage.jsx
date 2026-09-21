import React, { useState } from 'react';
import Icon from '../components/Icon';
import Brand from '../components/Brand';
import { apiRequest } from '../shared/api';

export default function AdminAuth({ onLogin, onBack }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const fields = new FormData(event.currentTarget);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: fields.get('email'),
          password: fields.get('password')
        })
      });
      if (data.user.role !== 'admin') {
        throw new Error('This account does not have administrator access.');
      }
      localStorage.setItem('neural_academy_token', data.token);
      onLogin(data.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-page min-h-screen font-sans antialiased">
    <section className="auth-visual">
      <div className="visual-top"><Brand /><span className="pill">Administrator access</span></div>
      <div className="visual-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> NEURAL ACADEMY ADMIN</div>
        <h1>Manage learning.<br /><em>Grow the campus.</em></h1>
        <p>Sign in to manage learners, tasks, and contact requests securely.</p>
      </div>
      <div className="abstract-shape shape-one" /><div className="abstract-shape shape-two" />
    </section>
    <section className="auth-panel">
      <div className="auth-panel-inner">
        <button className="back-home" onClick={onBack}>← Back to home</button>
        <div className="mobile-brand"><Brand /></div>
        <div className="auth-heading"><span className="auth-kicker">SECURE ADMIN SIGN IN</span><h2>Welcome, admin.</h2><p>Use your administrator account to continue.</p></div>
        <form onSubmit={submit}>
          <label>Email address<input name="email" required type="email" autoComplete="username" placeholder="Admin email" /></label>
          <label>Password<input name="password" required type="password" autoComplete="current-password" placeholder="Password" /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-btn" type="submit" disabled={loading}>{loading ? 'Signing in securely…' : 'Sign in as administrator'} {!loading && <Icon name="arrow" size={17} />}</button>
        </form>
        <div className="secure-note"><span>✓</span> Administrator access is protected</div>
      </div>
    </section>
  </main>;
}
