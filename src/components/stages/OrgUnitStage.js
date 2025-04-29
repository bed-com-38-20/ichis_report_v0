import React, { useState, useEffect } from 'react';
import { 
  MultiSelect,
  MultiSelectOption,
  Button,
  Help,
  CircularLoader,
  AlertBar
} from '@dhis2/ui';

const OrgUnitStage = ({ config, onChange, metadata }) => {
  const [selected, setSelected] = useState(config.orgUnits || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orgUnits, setOrgUnits] = useState([]);

  useEffect(() => {
    // Debugging: Check what metadata contains
    console.log('Metadata:', metadata);
    
    if (metadata?.orgUnits) {
      setOrgUnits(metadata.orgUnits.organisationUnits || []);
      setLoading(false);
    } else {
      setError(new Error('Organization units data not available'));
      setLoading(false);
    }
  }, [metadata]);

  const handleConfirm = () => {
    onChange({
      ...config,
      orgUnits: selected
    });
  };

  if (loading) {
    return (
      <div className="stage">
        <h2>Select Health Facilities</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CircularLoader small />
          <span>Loading facilities...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stage">
        <h2>Select Health Facilities</h2>
        <AlertBar critical>
          Failed to load facilities: {error.message}
        </AlertBar>
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  if (!orgUnits.length) {
    return (
      <div className="stage">
        <h2>Select Health Facilities</h2>
        <Help error>
          No facilities available. Please check your permissions or try again later.
        </Help>
      </div>
    );
  }

  return (
    <div className="stage">
      <h2>Select Health Facilities</h2>
      <MultiSelect
        selected={selected}
        onChange={({ selected }) => setSelected(selected)}
        filterable
        placeholder="Type to search facilities"
        dataTest="org-unit-multiselect"
      >
        {orgUnits.map(ou => (
          <MultiSelectOption
            key={ou.id}
            value={ou.id}
            label={ou.displayName}
            dataTest={`org-unit-option-${ou.id}`}
          />
        ))}
      </MultiSelect>

      <Help>
        Selected: {selected.length} organization units
      </Help>

      <div className="stage-actions">
        <Button
          primary
          onClick={handleConfirm}
          disabled={selected.length === 0}
          dataTest="confirm-org-units"
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

export default OrgUnitStage;