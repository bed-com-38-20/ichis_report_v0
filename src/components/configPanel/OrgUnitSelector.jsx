// components/configPanel/OrgUnitSelector.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui';
import './OrgUnitSelector.css';

const OrgUnitSelector = ({
  loading = false,
  orgUnits = [],
  selected = null,
  onChange = () => {},
  label = "Health Facility:"
}) => {
  // Safely handle undefined/null orgUnits
  const options = Array.isArray(orgUnits) ? orgUnits : [];
  
  return (
    <div className="org-unit-selector">
      <label>{label}</label>
      <SingleSelect
        selected={selected}
        onChange={({ selected }) => onChange(selected)}
        loading={loading}
        disabled={loading || options.length === 0}
      >
        {options.map(ou => (
          <SingleSelectOption 
            key={ou.id} 
            value={ou.id} 
            label={ou.displayName} 
          />
        ))}
        {options.length === 0 && (
          <SingleSelectOption 
            value="none" 
            label="No facilities available" 
            disabled
          />
        )}
      </SingleSelect>
    </div>
  );
};

OrgUnitSelector.propTypes = {
  loading: PropTypes.bool,
  orgUnits: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired
    })
  ),
  selected: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string
};

OrgUnitSelector.defaultProps = {
  loading: false,
  orgUnits: [],
  selected: null,
  onChange: () => {},
  label: "Health Facility:"
};

export default OrgUnitSelector;