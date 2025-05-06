import React, { useState } from 'react';
import  { 
  SingleSelectOption ,
  Button,
  SingleSelect,
  Field,
  Radio,
  Help
} from '@dhis2/ui';

const PeriodStage = ({ config, onChange }) => {
  const [periodType, setPeriodType] = useState('fixed');
  const [selectedPeriods, setSelectedPeriods] = useState(config.periods || []);

  // Example periods - in a real app, fetch these from DHIS2
  const availablePeriods = [
    { id: '202401', name: 'January 2024' },
    { id: '202402', name: 'February 2024' },
    { id: '202403', name: 'March 2024' },
    { id: '202404', name: 'April 2024' },
    { id: '202405', name: 'May 2024' }
  ];

  const handleConfirm = () => {
    onChange({
      ...config,
      periods: selectedPeriods
    });
  };

  return (
    <div className="stage">
      <h2>Select Reporting Periods</h2>
      
      <Field label="Period Type">
        <Radio
          checked={periodType === 'fixed'}
          label="Fixed Periods"
          name="periodType"
          onChange={() => setPeriodType('fixed')}
          value="fixed"
        />
        <Radio
          checked={periodType === 'relative'}
          label="Relative Periods"
          name="periodType"
          onChange={() => setPeriodType('relative')}
          value="relative"
        />
      </Field>

      {periodType === 'fixed' && (
        <SingleSelect
          multiple
          selected={selectedPeriods}
          onChange={({ selected }) => setSelectedPeriods(selected)}
          filterable
          placeholder="Select periods"
        >
          {availablePeriods.map(period => (
            <SingleSelectOption 
              key={period.id}
              value={period.id}
              label={period.name}
            />
          ))}
        </SingleSelect>
      )}

      {periodType === 'relative' && (
        <SingleSelect
          multiple
          selected={selectedPeriods}
          onChange={({ selected }) => setSelectedPeriods(selected)}
          placeholder="Select relative periods"
        >
          <SingleSelectOption  value="THIS_MONTH" label="This month" />
          <SingleSelectOption  value="LAST_3_MONTHS" label="Last 3 months" />
          <SingleSelectOption  value="LAST_6_MONTHS" label="Last 6 months" />
          <SingleSelectOption  value="THIS_YEAR" label="This year" />
        </SingleSelect>
      )}

      <Help>
        Selected: {selectedPeriods.length} periods
      </Help>

      <div className="stage-actions">
        <Button
          primary
          onClick={handleConfirm}
          disabled={selectedPeriods.length === 0}
        >
          Confirm Periods
        </Button>
      </div>
    </div>
  );
};

export default PeriodStage;