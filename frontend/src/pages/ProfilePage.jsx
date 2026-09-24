import React from 'react';
import { tracks } from '../shared/data';

function ProfileOverview({ user }) {
  const track = tracks.find((item) => item.id === user?.track);
  return <section className="profile-overview">
    <div className="profile-hero panel"><div className="profile-avatar">{user?.avatarUrl ? <img src={user.avatarUrl} alt={user?.name || 'User avatar'} /> : user?.name?.slice(0, 2).toUpperCase()}</div><div><span className="section-kicker">YOUR NEURAL ACADEMY PROFILE</span><h2>{user?.name}</h2><p>{user?.email}</p></div><span className="profile-role">{user?.role || 'student'}</span></div>
    <div className="profile-details panel"><div className="panel-heading"><div><h2>Account overview</h2><p>Information from your Neural Academy account</p></div></div><div className="profile-detail-grid"><div><span>FULL NAME</span><strong>{user?.name || 'Not available'}</strong></div><div><span>EMAIL ADDRESS</span><strong>{user?.email || 'Not available'}</strong></div><div><span>LEARNING TRACK</span><strong>{track?.label || 'Not selected'}</strong><small>{track?.description || 'Choose a track to personalize your learning.'}</small></div><div><span>ACCOUNT TYPE</span><strong>{user?.role === 'admin' ? 'Administrator' : 'Student account'}</strong><small>Secure account connected to MongoDB</small></div></div></div>
    <div className="profile-overview-grid"><div className="panel overview-stat"><span>LEARNING STREAK</span><strong>12 days</strong><small>Keep your momentum going</small></div><div className="panel overview-stat"><span>COURSES IN PROGRESS</span><strong>3 courses</strong><small>Continue where you left off</small></div><div className="panel overview-stat"><span>PROFILE STATUS</span><strong className="status-ready">Complete</strong><small>Your account is ready to learn</small></div></div>
  </section>;
}

export default ProfileOverview;
