import React from 'react';
import { colors } from '@dhis2/ui';

const ReportHeader = ({ title, subtitle, facility, date, logo }) => {
  return (
    <div style={styles.header}>
      <div style={styles.leftSection}>
        {logo && (
          <img 
            src={logo} 
            alt="Facility Logo" 
            style={styles.logo}
          />
        )}
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>{title}</h1>
          <h2 style={styles.subtitle}>{subtitle}</h2>
        </div>
      </div>
      
      <div style={styles.rightSection}>
        <p style={styles.facility}>{facility}</p>
        <p style={styles.date}>Date: {date}</p>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: `2px solid ${colors.grey300}`
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  logo: {
    width: '80px',
    height: '80px',
    objectFit: 'contain'
  },
  titleContainer: {
    flex: 1
  },
  title: {
    margin: 0,
    fontSize: '20px',
    color: colors.grey900
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '16px',
    color: colors.grey700,
    fontWeight: 'normal'
  },
  rightSection: {
    textAlign: 'right'
  },
  facility: {
    margin: 0,
    fontSize: '14px',
    color: colors.grey700
  },
  date: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: colors.grey600
  }
};

export default ReportHeader;