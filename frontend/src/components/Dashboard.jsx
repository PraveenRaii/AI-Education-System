import React, { useEffect, useState } from 'react';
import Icon from './Icon';
import Brand from './Brand';
import Sidebar from './Sidebar';
import TutorChat from './TutorChat';
import SettingsView from '../pages/SettingsPage';
import MyCourses from '../pages/CoursesPage';
import ProgressView from '../pages/ProgressPage';
import ScheduleView from '../pages/SchedulePage';
import ProfileOverview from '../pages/ProfilePage';
import { AdminPanel, ContactInbox } from '../pages/AdminPage';

function Dashboard({ onLogout, user, onUserUpdate }) {
  const [active, setActive] = useState(user?.role === 'admin' ? 'admin' : 'overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('neural_academy_theme') || 'dark');
  useEffect(() => localStorage.setItem('neural_academy_theme', theme), [theme]);
  const greeting = active === 'admin' ? 'Admin overview.' : active === 'courses' ? 'Your learning space.' : active === 'progress' ? 'Your progress.' : active === 'schedule' ? 'Your schedule.' : `Good morning, ${user?.name?.split(' ')[0] || 'learner'}.`;
  const activeView = active === 'settings' ? <SettingsView user={user} onUserUpdate={onUserUpdate} theme={theme} setTheme={setTheme} /> : active === 'courses' ? <MyCourses /> : active === 'progress' ? <ProgressView /> : active === 'schedule' ? <ScheduleView /> : <><div className="welcome-row"><div><span className="section-kicker">MONDAY, 21 SEPTEMBER 2026</span><h1>{greeting}</h1><p>Your account and learning activity at a glance.</p></div><button className="outline-btn" onClick={() => setActive('courses')}><span>＋</span> Explore courses</button></div><ProfileOverview user={user} /></>;
  return <><main className={`app-shell min-h-screen font-sans antialiased theme-${theme}`}><Sidebar active={active} setActive={setActive} onLogout={onLogout} user={user} /><section className="dashboard"><header className="dash-header"><div className="mobile-dash-brand"><Brand /></div><div className="header-spacer" /><div className="header-search">{searchOpen && <input autoFocus placeholder="Search courses, lessons…" onKeyDown={(e) => e.key === 'Enter' && setSearchOpen(false)} />}<button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)}><Icon name="search" /></button></div><div className="header-notifications"><button className="icon-btn notification" onClick={() => setNotificationOpen(!notificationOpen)}><Icon name="bell" /><i /></button>{notificationOpen && <div className="notification-popover"><strong>Notifications</strong><p>✦ Your Physics lesson starts today at 4:30 PM.</p><p>✓ You completed 2 learning goals.</p><small>All caught up</small></div>}</div><div className="header-profile"><div className="avatar">{user?.avatarUrl ? <img src={user.avatarUrl} alt="" /> : user?.name?.slice(0, 2).toUpperCase()}</div><div><strong>{user?.name}</strong><span>{user?.email}</span></div><button className="chevron" onClick={() => setMenuOpen(!menuOpen)}>⌄</button>{menuOpen && <div className="profile-menu"><button onClick={onLogout}>Log out</button></div>}</div></header><div className="dashboard-content">{active === 'admin' ? <><AdminPanel user={user} /><ContactInbox /></> : activeView}</div></section></main><TutorChat /></>;
}

export default Dashboard;
