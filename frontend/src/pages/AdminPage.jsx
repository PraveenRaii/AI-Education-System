import React, { useEffect, useState } from 'react';
import { apiRequest } from '../shared/api';

function ContactInbox() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { apiRequest('/admin/contacts').then((data) => setContacts(data.contacts)).catch((requestError) => setError(requestError.message)); }, []);
  async function updateStatus(id, status) {
    try {
      const data = await apiRequest(`/admin/contacts/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
      setContacts(contacts.map((contact) => contact._id === id ? data.contact : contact));
    } catch (requestError) { setError(requestError.message); }
  }
  return <section className="panel contact-inbox"><div className="panel-heading"><div><h2>Contact requests</h2><p>Messages submitted from the public About and Contact page</p></div><span className="todo-date">{contacts.filter((contact) => contact.status === 'new').length} new</span></div>{error && <p className="form-error">{error}</p>}{contacts.length === 0 ? <p className="empty-state">No contact requests yet.</p> : <div className="contact-records">{contacts.map((contact) => <article key={contact._id}><div><strong>{contact.subject}</strong><small>ID: {contact._id}</small><p>{contact.message}</p><span>{contact.name} · {contact.email}{contact.phone ? ` · ${contact.phone}` : ''}</span></div><select value={contact.status} onChange={(event) => updateStatus(contact._id, event.target.value)}><option value="new">New</option><option value="read">Read</option><option value="resolved">Resolved</option></select></article>)}</div>}</section>;
}

function AdminPanel() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', dueDate: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const load = async () => {
    try {
      const [taskData, userData] = await Promise.all([apiRequest('/admin/tasks'), apiRequest('/admin/users')]);
      setTasks(taskData.tasks); setUsers(userData.users);
    } catch (requestError) { setError(requestError.message); }
  };
  useEffect(() => { load(); }, []);
  async function saveTask(event) {
    event.preventDefault(); setError('');
    try {
      const data = await apiRequest(editingId ? `/admin/tasks/${editingId}` : '/admin/tasks', { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(form) });
      setTasks(editingId ? tasks.map((task) => task._id === editingId ? data.task : task) : [data.task, ...tasks]);
      setForm({ title: '', description: '', status: 'todo', dueDate: '' }); setEditingId(null);
    } catch (requestError) { setError(requestError.message); }
  }
  async function deleteTask(id) {
    try { await apiRequest(`/admin/tasks/${id}`, { method: 'DELETE' }); setTasks(tasks.filter((task) => task._id !== id)); } catch (requestError) { setError(requestError.message); }
  }
  return <div className="admin-view"><div className="welcome-row"><div><span className="section-kicker">ADMIN CONSOLE</span><h1>Manage Neural Academy.</h1><p>Create, update, and delete tasks while viewing every record ID.</p></div></div><div className="admin-metrics"><div><span>TOTAL LEARNERS</span><strong>{users.length}</strong><b>Live MongoDB count</b></div><div><span>ACTIVE COURSES</span><strong>248</strong><b>↑ 12 new</b></div><div><span>MANAGED TASKS</span><strong>{tasks.length}</strong><b>CRUD enabled</b></div><div><span>SUPPORT TICKETS</span><strong>24</strong><b className="warning">6 urgent</b></div></div><div className="admin-crud-grid"><section className="panel admin-task-form"><div className="panel-heading"><div><h2>{editingId ? 'Edit task' : 'Add task'}</h2><p>All task fields are stored in MongoDB.</p></div></div><form onSubmit={saveTask}><label>Task title<input value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} /></label><label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><div className="admin-form-row"><label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="todo">To do</option><option value="in-progress">In progress</option><option value="done">Done</option></select></label><label>Due date<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label></div>{error && <p className="form-error">{error}</p>}<div className="admin-form-actions"><button className="primary-small" type="submit">{editingId ? 'Update task' : 'Create task'}</button>{editingId && <button type="button" className="outline-btn" onClick={() => { setEditingId(null); setForm({ title: '', description: '', status: 'todo', dueDate: '' }); }}>Cancel</button>}</div></form></section><section className="panel admin-tasks"><div className="panel-heading"><div><h2>Task records</h2><p>Full CRUD data with record IDs</p></div></div><div className="admin-record-list">{tasks.length === 0 && <p className="empty-state">No tasks yet. Create the first task.</p>}{tasks.map((task) => <div className="admin-record" key={task._id}><div><strong>{task.title}</strong><small>ID: {task._id}</small><span>{task.status} {task.dueDate ? `· due ${new Date(task.dueDate).toLocaleDateString()}` : ''}</span></div><div><button onClick={() => { setEditingId(task._id); setForm({ title: task.title, description: task.description || '', status: task.status, dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '' }); }}>Edit</button><button className="danger-text" onClick={() => deleteTask(task._id)}>Delete</button></div></div>)}</div></section></div><section className="panel table-panel admin-users-table"><div className="panel-heading"><div><h2>All user records</h2><p>Name, email, role, track, and MongoDB ID</p></div></div><table><thead><tr><th>ID</th><th>USER</th><th>EMAIL</th><th>TRACK</th><th>ROLE</th><th>JOINED</th></tr></thead><tbody>{users.map((record) => <tr key={record._id}><td className="record-id">{record._id}</td><td><strong>{record.name}</strong></td><td>{record.email}</td><td>{record.track}</td><td><span className="status active-status">{record.role}</span></td><td>{new Date(record.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></section></div>;
}

export { ContactInbox };
export { AdminPanel };
