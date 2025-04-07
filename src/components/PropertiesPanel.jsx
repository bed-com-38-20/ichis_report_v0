import React from 'react';
import { 
  InputField,
  SingleSelect,
  SingleSelectOption,
  MenuItem
} from '@dhis2/ui';

const PropertiesPanel = ({ element, onUpdate }) => {
  if (!element) {
    return (
      <div className="properties-panel">
        <p>No element selected</p>
      </div>
    );
  }

  const handleChange = (key, value) => {
    onUpdate({ ...element, [key]: value });
  };

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      
      {element.type === 'text' && (
        <InputField
          label="Text Content"
          value={element.data.text || ''}
          onChange={({ value }) => handleChange('data', { text: value })}
        />
      )}

      {element.type === 'table' && (
        <Select
          label="Data Source"
          selected={element.data.source || ''}
          onChange={({ selected }) => handleChange('data', { source: selected })}
        >
          <MenuItem value="indicator" label="Indicator Data" />
          <MenuItem value="dataset" label="Dataset" />
        </Select>
      )}

      {element.type === 'chart' && (
        <SingleSelect
          label="Chart Type"
          selected={element.data.chartType || 'bar'}
          onChange={({ selected }) => handleChange('data', { chartType: selected })}
        >
          <SingleSelectOption value="bar" label="Bar Chart" />
          <SingleSelectOption value="line" label="Line Chart" />
          <SingleSelectOption value="pie" label="Pie Chart" />
        </SingleSelect>
      )}
    </div>
  );
};

export default PropertiesPanel;