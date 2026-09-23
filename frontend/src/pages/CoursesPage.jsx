import React from 'react';
import Icon from '../components/Icon';
import { courses } from '../shared/data';

const allCourses = [
  ...courses,
  { title: 'Computer Science', meta: '18 lessons left', progress: 34, color: 'teal-card', icon: '⌨' },
  { title: 'Organic Chemistry', meta: '14 lessons left', progress: 21, color: 'orange-card', icon: '⚗' },
  { title: 'Communication Skills', meta: '3 lessons left', progress: 91, color: 'pink-card', icon: 'Aa' }
];

function MyCourses() {
  return (
    <section className="workspace-view">
      <div className="welcome-row">
        <div>
          <span className="section-kicker">YOUR LEARNING LIBRARY</span>
          <h1>My courses.</h1>
          <p>Pick up where you left off and keep building momentum.</p>
        </div>
        <button className="outline-btn"><span>＋</span> Browse catalog</button>
      </div>
      <div className="course-summary-grid">
        <div className="course-summary-card">
          <span>ENROLLED COURSES</span>
          <strong>6</strong>
          <small>Across 3 subjects</small>
        </div>
        <div className="course-summary-card blue-summary">
          <span>COMPLETED</span>
          <strong>2</strong>
          <small>Great progress this month</small>
        </div>
        <div className="course-summary-card purple-summary">
          <span>HOURS LEARNED</span>
          <strong>18.4h</strong>
          <small>↑ 12% from last week</small>
        </div>
      </div>
      <div className="course-library-grid">
        {allCourses.map((course) => (
          <article className="library-course panel" key={course.title}>
            <div className={`library-thumb ${course.color}`}>
              <span>{course.icon}</span>
              <button aria-label={`Play ${course.title}`}>
                <Icon name="play" size={15} />
              </button>
            </div>
            <div className="library-course-body">
              <div className="course-title">
                <strong>{course.title}</strong>
                <span>{course.progress}%</span>
              </div>
              <p>AI-guided course · Self-paced</p>
              <div className="progress-bar">
                <i style={{ width: `${course.progress}%` }} />
              </div>
              <div className="library-footer">
                <small>{course.meta}</small>
                <button>Continue <Icon name="arrow" size={13} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MyCourses;
