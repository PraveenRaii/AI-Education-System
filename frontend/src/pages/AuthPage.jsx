import React, { useState } from 'react';
import Icon from '../components/Icon';
import Brand from '../components/Brand';
import { tracks } from '../shared/data';
import { apiRequest } from '../shared/api';

function Auth({ onLogin, initialMode = 'login', onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [selectedTrack, setSelectedTrack] = useState('secondary');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return <main className="auth-page min-h-screen font-sans antialiased">
    <section className="auth-visual">
      <div className="visual-top"><Brand /><span className="pill">AI-powered learning</span></div>
      <div className="visual-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> THE SMARTER WAY TO LEARN</div>
        <h1>AI-powered learning.<br /><em>Unlock your potential.</em></h1>
        <p>A personalized education system that evolves with you, from Class 1 to graduation.</p>
        <div className="visual-stats"><div><strong>50k<span>+</span></strong><small>Active learners</small></div><div><strong>4.9<span>/5</span></strong><small>Learner rating</small></div><div><strong>92<span>%</span></strong><small>Completion rate</small></div></div>
      </div>
      <div className="abstract-shape shape-one" /><div className="abstract-shape shape-two" />
      <div className="quote-card"><div className="quote-avatar">AI</div><div><p>“Neural Academy made every lesson feel personal, visual, and genuinely exciting.”</p><small>— Aanya Sharma · Class 10</small></div></div>
    </section>
    <section className="auth-panel">
      <div className="auth-panel-inner">
        <button className="back-home" onClick={onBack}>← Back to home</button>
        <div className="mobile-brand"><Brand /></div>
        <div className="auth-heading"><span className="auth-kicker">{mode === 'login' ? 'WELCOME BACK' : 'START YOUR JOURNEY'}</span><h2>{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h2><p>{mode === 'login' ? 'Continue where you left off.' : 'Your personalized learning journey starts here.'}</p></div>
        <div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Log in</button><button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Sign up</button></div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          setLoading(true);
          const fields = new FormData(e.currentTarget);
          try {
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
            const data = await apiRequest(endpoint, {
              method: 'POST',
              body: JSON.stringify({
                name: fields.get('name'),
                email: fields.get('email'),
                password: fields.get('password'),
                track: selectedTrack
              })
            });
            localStorage.setItem('neural_academy_token', data.token);
            onLogin(data.user);
          } catch (requestError) {
            setError(requestError.message);
          } finally {
            setLoading(false);
          }
        }}>
          {mode === 'signup' && <label>Full name<input name="name" required placeholder="e.g. Aanya Sharma" /></label>}
          <label>Email address<input name="email" required type="email" placeholder="you@example.com" /></label>
          <label>Password<div className="password-wrap"><input name="password" required type={showPassword ? 'text' : 'password'} placeholder="••••••••" minLength="6" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
          {mode === 'signup' && <div className="track-picker"><div className="label-row"><label>What are you learning for?</label><span>Optional</span></div><div className="track-options">{tracks.map(track => <button type="button" key={track.id} className={selectedTrack === track.id ? 'selected' : ''} onClick={() => setSelectedTrack(track.id)}><b className={`track-icon ${track.color}`}>{track.icon}</b><span>{track.label}</span>{selectedTrack === track.id && <i>✓</i>}</button>)}</div></div>}
          {mode === 'login' && <div className="form-row"><label className="check"><input type="checkbox" /> <span>Remember me</span></label><a href="#forgot">Forgot password?</a></div>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-btn" type="submit" disabled={loading}>{loading ? 'Connecting securely…' : mode === 'login' ? 'Log in to Neural Academy' : 'Create my account'} {!loading && <Icon name="arrow" size={17} />}</button>
        </form>
        <div className="secure-note"><span>✓</span> Your data is private and secure</div>
        <div className="auth-switch">{mode === 'login' ? <>New to Neural Academy? <button onClick={() => setMode('signup')}>Create an account</button></> : <>Already have an account? <button onClick={() => setMode('login')}>Log in</button></>}</div>
      </div>
    </section>
  </main>;
}

export default Auth;
