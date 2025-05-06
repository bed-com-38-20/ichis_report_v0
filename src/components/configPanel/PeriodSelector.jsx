import React from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui';
import './PeriodSelector.css';
import PropTypes from 'prop-types';

// const PeriodSelector = ({
//   options = [],
//   selected = null,
//   onChange = () => {},
//   placeholder = "Select period"
// }) => (
//   <div className="period-selector">
//     <label>Reporting Period:</label>
//     <SingleSelect
//       selected={selected}
//       onChange={onChange}
//       placeholder={placeholder}
//     >
//       {options.map(option => (
//         <SingleSelectOption 
//           key={option.value} 
//           value={option.value} 
//           label={option.label} 
//         />
//       ))}
//     </SingleSelect>
//   </div>
// );
const PeriodSelector = ({ periods, onChange }) => (
  <div className="period-selector">
    <Field label="Period Type">
      <RadioGroup
        name="periodType"
        options={[
          { label: "Fixed", value: "fixed" },
          { label: "Relative", value: "relative" }
        ]}
        onChange={({ value }) => onChange({ ...periods, type: value })}
      />
    </Field>
    
    {periods.type === "fixed" && (
      <MonthPicker 
        selected={periods.months}
        onChange={months => onChange({ ...periods, months })}
      />
    )}
    
    {periods.type === "relative" && (
      <Select
        multiple
        items={[
          { label: "Last 3 months", value: "LAST_3_MONTHS" },
          { label: "This year", value: "THIS_YEAR" }
        ]}
      />
    )}
  </div>
);


// Adding PropTypes for better validation
PeriodSelector.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  selected: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};

PeriodSelector.defaultProps = {
  options: [],
  selected: null,
  onChange: () => {},
  placeholder: "Select period"
};

export default PeriodSelector;