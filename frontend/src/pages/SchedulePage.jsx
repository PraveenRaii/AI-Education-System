import React, { useState } from 'react';
import Icon from '../components/Icon';

function ScheduleView() {
  const [todos, setTodos] = useState([
    { text: 'Complete Algebra: Quadratic Equations', meta: 'Mathematics · 25 min', done: true },
    { text: "Review Newton's Laws", meta: 'Physics · 15 min', done: true },
    { text: 'Read: The Great Gatsby, Ch. 4', meta: 'English Literature · 30 min', done: false },
    { text: 'Practice speaking exercises', meta: 'Communication · 20 min', done: false }
  ]);
  const [newTask, setNewTask] = useState('');
  const toggleTodo = (index) =>
    setTodos(todos.map((todo, i) => (i === index ? { ...todo, done: !todo.done } : todo)));
  const addTodo = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTodos([...todos, { text: newTask.trim(), meta: 'Personal · Self-paced', done: false }]);
    setNewTask('');
  };

  const now = new Date();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayLabel = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  const monthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  const todayShort = `${monthNames[now.getMonth()].slice(0,3).toUpperCase()} ${now.getDate()}`;

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  // Adjust so Monday=0
  const startOffset = (firstDay + 6) % 7;
  const eventDays = [3, 8, 14, now.getDate(), now.getDate() + 3];

  return (
    <section className="workspace-view">
      <div className="welcome-row">
        <div>
          <span className="section-kicker">PLAN YOUR WEEK</span>
          <h1>My schedule.</h1>
          <p>Stay organized with lessons, classes, and personal goals.</p>
        </div>
        <form onSubmit={addTodo} className="inline-add-form">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a task…"
            className="inline-task-input"
          />
          <button type="submit" className="outline-btn"><span>＋</span> Add task</button>
        </form>
      </div>
      <div className="schedule-layout">
        <section className="panel calendar-panel">
          <div className="panel-heading">
            <div>
              <h2>{monthLabel}</h2>
              <p>{todayLabel}</p>
            </div>
            <div className="calendar-controls">
              <button>‹</button>
              <button>›</button>
            </div>
          </div>
          <div className="calendar-week">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-days">
            {Array.from({ length: startOffset }).map((_, i) => (
              <button key={`prev-${i}`} className="muted" disabled>
                {new Date(now.getFullYear(), now.getMonth(), 0).getDate() - startOffset + i + 1}
              </button>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                className={`${day === now.getDate() ? 'current' : ''}`}
              >
                {day}
                {eventDays.includes(day) && <i />}
              </button>
            ))}
          </div>
        </section>
        <section className="panel todo-panel">
          <div className="panel-heading">
            <div>
              <h2>Today&apos;s to-do list</h2>
              <p>{todos.filter((t) => t.done).length} of {todos.length} completed</p>
            </div>
            <span className="todo-date">{todayShort}</span>
          </div>
          <div className="todo-list">
            {todos.map((todo, index) => (
              <button
                className={`todo-item ${todo.done ? 'done' : ''}`}
                onClick={() => toggleTodo(index)}
                key={index}
              >
                <span className="todo-check">{todo.done ? '✓' : ''}</span>
                <span>
                  <strong>{todo.text}</strong>
                  <small>{todo.meta}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="todo-progress">
            <div>
              <span>Daily progress</span>
              <strong>{Math.round((todos.filter((t) => t.done).length / todos.length) * 100)}%</strong>
            </div>
            <div className="progress-bar">
              <i style={{ width: `${(todos.filter((t) => t.done).length / todos.length) * 100}%` }} />
            </div>
          </div>
        </section>
      </div>
      <section className="panel upcoming-panel">
        <div className="panel-heading">
          <div>
            <h2>Upcoming lessons</h2>
            <p>Your next live and scheduled sessions</p>
          </div>
          <button className="text-btn">View all <Icon name="arrow" size={15} /></button>
        </div>
        <div className="upcoming-list">
          <div>
            <span className="upcoming-time">TODAY · 4:30 PM</span>
            <strong>Introduction to Electromagnetism</strong>
            <small>Physics · Live with Dr. Mehta</small>
            <button>Join lesson</button>
          </div>
          <div>
            <span className="upcoming-time purple-time">WEDNESDAY · 5:00 PM</span>
            <strong>Essay writing workshop</strong>
            <small>English Literature · Group session</small>
            <button className="secondary-join">View details</button>
          </div>
          <div>
            <span className="upcoming-time green-time">FRIDAY · 6:30 PM</span>
            <strong>Weekly AI assessment</strong>
            <small>Mathematics · 20 questions</small>
            <button className="secondary-join">View details</button>
          </div>
        </div>
      </section>
    </section>
  );
}

export default ScheduleView;
