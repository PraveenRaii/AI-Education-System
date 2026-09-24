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
  const [monthOffset, setMonthOffset] = useState(0);
  const toggleTodo = (index) =>
    setTodos(todos.map((todo, i) => (i === index ? { ...todo, done: !todo.done } : todo)));
  const addTodo = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTodos([...todos, { text: newTask.trim(), meta: 'Personal · Self-paced', done: false }]);
    setNewTask('');
  };
  const deleteTodo = (e, index) => {
    e.stopPropagation();
    setTodos(todos.filter((_, i) => i !== index));
  };

  const now = new Date();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayLabel = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  const todayShort = `${monthNames[now.getMonth()].slice(0,3).toUpperCase()} ${now.getDate()}`;

  const displayedDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const displayedYear = displayedDate.getFullYear();
  const displayedMonth = displayedDate.getMonth();
  const monthLabel = `${monthNames[displayedMonth]} ${displayedYear}`;
  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
  const firstDay = new Date(displayedYear, displayedMonth, 1).getDay();
  // Adjust so Monday=0
  const startOffset = (firstDay + 6) % 7;
  const isCurrentMonth = displayedYear === now.getFullYear() && displayedMonth === now.getMonth();
  const eventDays = isCurrentMonth ? [3, 8, 14, now.getDate(), now.getDate() + 3] : [5, 12, 20];

  const completedCount = todos.filter((t) => t.done).length;
  const progressPercent = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

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
              <button
                type="button"
                onClick={() => setMonthOffset((prev) => prev - 1)}
                aria-label="Previous month"
                title="Previous month"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setMonthOffset((prev) => prev + 1)}
                aria-label="Next month"
                title="Next month"
              >
                ›
              </button>
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
                {new Date(displayedYear, displayedMonth, 0).getDate() - startOffset + i + 1}
              </button>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                className={`${isCurrentMonth && day === now.getDate() ? 'current' : ''}`}
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
              <p>{completedCount} of {todos.length} completed</p>
            </div>
            <span className="todo-date">{todayShort}</span>
          </div>
          <div className="todo-list">
            {todos.length === 0 ? (
              <p className="empty-state">No tasks yet. Add one above.</p>
            ) : (
              todos.map((todo, index) => (
                <div
                  className={`todo-item ${todo.done ? 'done' : ''}`}
                  onClick={() => toggleTodo(index)}
                  key={index}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleTodo(index)}
                >
                  <span className="todo-check">{todo.done ? '✓' : ''}</span>
                  <span>
                    <strong>{todo.text}</strong>
                    <small>{todo.meta}</small>
                  </span>
                  <button
                    type="button"
                    className="todo-delete"
                    onClick={(e) => deleteTodo(e, index)}
                    aria-label="Delete task"
                    title="Delete task"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="todo-progress">
            <div>
              <span>Daily progress</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="progress-bar">
              <i style={{ width: `${progressPercent}%` }} />
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
