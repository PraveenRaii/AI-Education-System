import React from 'react';
import Icon from './Icon';
import Brand from './Brand';

function Sidebar({ active, setActive, onLogout, user }) {
  const items = [['overview', 'Overview', 'grid'], ['courses', 'My courses', 'book'], ['progress', 'My progress', 'chart'], ['schedule', 'Schedule', 'calendar']];
  return <aside className="sidebar"><Brand /><div className="side-label">LEARN</div><nav>{items.map(([id, label, icon]) => <button className={active === id ? 'active' : ''} onClick={() => setActive(id)} key={id}><Icon name={icon} />{label}</button>)}</nav>{user?.role === 'admin' && <><div className="side-label manage-label">MANAGE</div><button className={active === 'admin' ? 'active' : ''} onClick={() => setActive('admin')}><Icon name="users" />Admin panel</button></>}<div className="sidebar-bottom"><button className={`sidebar-link ${active === 'settings' ? 'active' : ''}`} onClick={() => setActive('settings')}><Icon name="settings" />Settings</button><button className="sidebar-link" onClick={onLogout}><Icon name="logout" />Log out</button><div className="mini-profile"><div className="avatar">{user?.name?.slice(0, 2).toUpperCase()}</div><div><strong>{user?.name}</strong><small>{user?.track || 'Student'} · {user?.role || 'student'}</small></div><span>•••</span></div></div></aside>;
}

export default Sidebar;
