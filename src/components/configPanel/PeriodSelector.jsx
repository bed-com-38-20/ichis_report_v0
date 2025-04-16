// components/configPanel/PeriodSelector.jsx
import React from 'react';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui';
import './PeriodSelector.css';
import PropTypes from 'prop-types';

const PeriodSelector = ({
  options = [],
  selected = null,
  onChange = () => {},
  placeholder = "Select period"
}) => (
  <div className="period-selector">
    <label>Reporting Period:</label>
    <SingleSelect
      selected={selected}
      onChange={onChange}
      placeholder={placeholder}
    >
      {options.map(option => (
        <SingleSelectOption 
          key={option.value} 
          value={option.value} 
          label={option.label} 
        />
      ))}
    </SingleSelect>
  </div>
);

// Add PropTypes for better validation
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