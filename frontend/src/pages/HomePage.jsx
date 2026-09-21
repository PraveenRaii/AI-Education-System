import React, { useState } from 'react';
import Icon from '../components/Icon';
import Brand from '../components/Brand';
import { tracks } from '../shared/data';
import { apiRequest } from '../shared/api';

function Home({ onOpenAuth, onOpenAdmin, theme, setTheme }) {
  const socialLinks = [
    { label: 'Instagram', icon: '◎', href: 'https://www.instagram.com/_pra__913?stkn=MjVsdWs0bTBlMjBk', className: 'instagram' },
    { label: 'LinkedIn', icon: 'in', href: 'https://www.linkedin.com/in/praveen-rai-9r13', className: 'linkedin' },
    { label: 'WhatsApp', icon: '◌', href: 'https://wa.me/qr/KJQPFK4NE4G4K1', className: 'whatsapp' }
  ];
  return <main className={`home-page home-${theme}`}>
    <header className="home-nav"><Brand /><nav><a href="#features">Platform</a><a href="#tracks">Learning tracks</a><a href="#about">About us</a><a href="#contact">Contact</a></nav><div className="home-actions"><button className="home-theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? '☼ Light' : '☾ Dark'}</button><button className="home-login" onClick={() => onOpenAdmin()}>Admin sign in</button><button className="home-login" onClick={() => onOpenAuth('login')}>Log in</button><button className="home-signup" onClick={() => onOpenAuth('signup')}>Get started <Icon name="arrow" size={15} /></button></div></header>
    <section className="home-hero"><div className="hero-copy"><span className="home-kicker">THE FUTURE OF LEARNING IS HERE</span><h1>Learn smarter.<br /><em>Go further.</em></h1><p>AI-powered education that adapts to your pace, your goals, and your potential — from Class 1 to graduation.</p><div className="hero-actions"><button className="home-cta" onClick={() => onOpenAuth('signup')}>Start learning free <Icon name="arrow" size={16} /></button><button className="play-link" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}><span>▶</span> See how it works</button></div><div className="home-proof"><div className="proof-avatars"><i>AS</i><i>RK</i><i>AM</i><i>+</i></div><span><strong>50,000+</strong> learners growing every day</span></div></div><div className="hero-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="brain-core">✦<strong>AI</strong><small>YOUR LEARNING<br />COMPANION</small></div><div className="orbit-card card-top">◈<span>Adaptive<br /><b>Curriculum</b></span></div><div className="orbit-card card-right">⌁<span>Real-time<br /><b>Skill mapping</b></span></div><div className="orbit-card card-bottom">◎<span>Personalized<br /><b>pathways</b></span></div></div></section>
    <section className="home-features" id="features"><div><span className="home-kicker">WHY NEURAL ACADEMY</span><h2>Education that<br /><em>thinks with you.</em></h2></div><div className="feature-list"><article><span>✦</span><h3>Personalized pathways</h3><p>Every lesson adjusts to how you learn best.</p></article><article><span>◈</span><h3>Intelligent feedback</h3><p>Get instant guidance from your AI tutor.</p></article><article><span>◎</span><h3>One connected campus</h3><p>Learn, collaborate, and grow in one place.</p></article></div></section>
    <section className="home-about" id="about"><div><span className="home-kicker">ABOUT NEURAL ACADEMY</span><h2>Built for curious minds<br /><em>at every stage.</em></h2></div><div><p>Neural Academy brings adaptive AI tutoring, expert-designed curriculum, and a supportive learning community into one focused platform. From foundational concepts to graduation goals, every learner gets a path that grows with them.</p><div className="about-points"><span>✦ AI-guided learning</span><span>◈ Expert curriculum</span><span>◎ Human connection</span></div></div></section>
    <section className="home-contact" id="contact"><div><span className="home-kicker">LET'S CONNECT</span><h2>Have a question?<br /><em>We’re here to help.</em></h2><p>Talk to the Neural Academy team about admissions, partnerships, or your learning journey.</p><strong>coder4986@gmail.com</strong><div className="home-social-links" aria-label="Neural Academy social links">{socialLinks.map((social) => <a className={`home-social-link ${social.className}`} href={social.href} target="_blank" rel="noreferrer" key={social.label}><span>{social.icon}</span>{social.label}</a>)}</div></div><ContactForm /></section>
    <section className="home-tracks" id="tracks"><span className="home-kicker">FOR EVERY STAGE</span><h2>One platform. <em>Every ambition.</em></h2><div className="home-track-grid">{tracks.map(track => <button key={track.id} onClick={() => onOpenAuth('signup')}><b className={`track-icon ${track.color}`}>{track.icon}</b><strong>{track.label}</strong><small>{track.description}</small><Icon name="arrow" size={15} /></button>)}</div></section>
  </main>;
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [state, setState] = useState({ loading: false, message: '', error: '' });
  async function submit(event) {
    event.preventDefault(); setState({ loading: true, message: '', error: '' });
    try {
      const data = await apiRequest('/contact', { method: 'POST', body: JSON.stringify(form) });
      setState({ loading: false, message: data.message, error: '' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) { setState({ loading: false, message: '', error: error.message }); }
  }
  return <form className="contact-form" onSubmit={submit}><div className="contact-form-row"><input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div><div className="contact-form-row"><input placeholder="Phone number (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div><textarea required placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /><button className="home-cta" disabled={state.loading} type="submit">{state.loading ? 'Sending…' : 'Send message'} <Icon name="arrow" size={15} /></button>{state.message && <p className="contact-success">{state.message}</p>}{state.error && <p className="contact-error">{state.error}</p>}</form>;
}

export default Home;
export { ContactForm };
