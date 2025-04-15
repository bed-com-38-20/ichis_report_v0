import React, { useEffect } from 'react';
import { SingleSelect, SingleSelectOption, CircularLoader } from '@dhis2/ui';
import './OrgUnitSelector.css'

const OrgUnitSelector = ({ reportConfig, setReportConfig, metadata, loading }) => {
  const handleOrgUnitChange = (selected) => {
    const selectedOrgUnit = metadata.orgUnits.organisationUnits.find(ou => ou.id === selected);
    setReportConfig(prev => ({
      ...prev,
      orgUnit: selected,
      facility: selectedOrgUnit?.displayName || ''
    }));
  };

  useEffect(() => {
    if (metadata?.orgUnits?.organisationUnits && reportConfig.orgUnit) {
      const isValid = metadata.orgUnits.organisationUnits.some(
        ou => ou.id === reportConfig.orgUnit
      );
      if (!isValid) {
        setReportConfig(prev => ({ ...prev, orgUnit: null }));
      }
    }
  }, [metadata, reportConfig.orgUnit]);

  const isValidSelection = metadata?.orgUnits?.organisationUnits?.some(
    ou => ou.id === reportConfig.orgUnit
  );

  return (
    <div className="org-unit-selector">
      <label>Health Facility:</label>
      {loading ? (
        <CircularLoader small />
      ) : (
        <SingleSelect
          selected={isValidSelection ? reportConfig.orgUnit : null}
          onChange={({ selected }) => handleOrgUnitChange(selected)}
          loading={loading}
        >
          {metadata?.orgUnits?.organisationUnits?.map(ou => (
            <SingleSelectOption 
              key={ou.id} 
              value={ou.id} 
              label={ou.displayName} 
            />
          ))}
        </SingleSelect>
      )}
    </div>
  );
};

export default OrgUnitSelector;