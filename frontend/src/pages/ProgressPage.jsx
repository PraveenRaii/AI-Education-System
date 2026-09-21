import React from 'react';

function ProgressView() {
  return <section className="workspace-view">
    <div className="welcome-row"><div><span className="section-kicker">LEARNING ANALYTICS</span><h1>My progress.</h1><p>See how your consistency is turning into real growth.</p></div><button className="period-btn">Last 30 days⌄</button></div>
    <div className="progress-summary-grid"><div className="progress-number panel"><span>OVERALL PROGRESS</span><strong>68<span>%</span></strong><div className="circle-progress"><i /></div><small>↑ 8.6% from last month</small></div><div className="progress-number panel"><span>AVERAGE SCORE</span><strong>87.4<span>%</span></strong><div className="score-bars"><i /><i /><i /><i /><i /><i /><i /></div><small>Top 12% of your track</small></div><div className="progress-number panel"><span>LEARNING STREAK</span><strong>12<span> days</span></strong><div className="streak-dots">{Array.from({ length: 12 }, (_, index) => <i className={index < 9 ? 'filled' : ''} key={index} />)}</div><small>3 days longer than last week</small></div></div>
    <section className="panel progress-chart-panel"><div className="panel-heading"><div><h2>Learning activity</h2><p>Hours studied across the last 7 days</p></div><span className="chart-legend"><i /> Hours learned</span></div><div className="large-chart"><div className="large-chart-y"><span>8h</span><span>6h</span><span>4h</span><span>2h</span><span>0h</span></div><div className="large-chart-area"><div className="large-grid">{[1, 2, 3, 4, 5].map(item => <i key={item} />)}</div><svg viewBox="0 0 760 220" preserveAspectRatio="none"><path className="large-fill" d="M0 177 C47 170 66 105 111 133 S170 177 216 91 S271 119 327 78 S378 159 433 66 S490 120 542 52 S602 94 652 39 S712 77 760 18 L760 220 L0 220Z" /><path className="large-line" d="M0 177 C47 170 66 105 111 133 S170 177 216 91 S271 119 327 78 S378 159 433 66 S490 120 542 52 S602 94 652 39 S712 77 760 18" /></svg><div className="large-chart-x"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div></section>
  </section>;
}

export default ProgressView;
