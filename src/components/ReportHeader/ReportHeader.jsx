import React from 'react';
import './styles.css';

const ReportHeader = ({ title, subtitle, facility, date, period, logo }) => {
  return (
    <header className="report-header">
      {logo && <img src={logo} alt="Organization Logo" className="logo" />}
      <div className="header-content">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        <div className="metadata">
          <span>{facility}</span>
          <span>{date}</span>
          <span>{period}</span>
        </div>
      </div>
    </header>
  );
};

export default ReportHeader;