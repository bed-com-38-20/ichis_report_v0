import React from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui';
import './PeriodSelector.css'

const PeriodSelector = ({ reportConfig, setReportConfig }) => {
  const getPeriodOptions = () => {
    const currentYear = new Date().getFullYear();
    return [
      { label: 'Last 3 months', value: 'LAST_3_MONTHS' },
      { label: 'Last 6 months', value: 'LAST_6_MONTHS' },
      { label: 'Last 12 months', value: 'LAST_12_MONTHS' },
      { label: `This year (${currentYear})`, value: 'THIS_YEAR' },
      { label: `Last year (${currentYear-1})`, value: 'LAST_YEAR' }
    ];
  };

  return (
    <div className="period-selector">
      <label>Reporting Period:</label>
      <SingleSelect
        selected={reportConfig.periodSelection}
        onChange={({ selected }) => setReportConfig(prev => ({
          ...prev,
          periodSelection: selected
        }))}
        placeholder="Select period"
      >
        {getPeriodOptions().map(option => (
          <SingleSelectOption 
            key={option.value} 
            value={option.value} 
            label={option.label} 
          />
        ))}
      </SingleSelect>
    </div>
  );
};

export default PeriodSelector;