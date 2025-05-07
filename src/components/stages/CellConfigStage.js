import React, { useState } from 'react';
import { 
  DataTable,
  DataTableRow,
  DataTableCell,
  SingleSelect,
  SingleSelectOption,
  InputField,
  Button,
  Help
} from '@dhis2/ui';

const CellConfigStage = ({ config, onChange, metadata }) => {
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [targetValue, setTargetValue] = useState('');

  const addIndicator = () => {
    const indicator = metadata.indicators.indicators
      .find(i => i.id === selectedIndicator);
    
    if (!indicator) return;

    onChange({
      ...config,
      columns: [
        ...config.columns,
        {
          id: indicator.id,
          name: indicator.displayName,
          type: indicator.indicatorType?.name || 'indicator'
        }
      ],
      targets: {
        ...config.targets,
        [indicator.id]: targetValue
      }
    });

    setSelectedIndicator('');
    setTargetValue('');
  };

  return (
    <div className="stage">
      <h2>Configure Indicators and Targets</h2>
      <div className="config-controls">
        <SingleSelect
          selected={selectedIndicator}
          onChange={({ selected }) => setSelectedIndicator(selected)}
          placeholder="Select indicator"
          loading={!metadata?.indicators}
          filterable
        >
          {metadata?.indicators?.indicators?.map(indicator => (
            <SingleSelectOption
              key={indicator.id}
              value={indicator.id}
              label={indicator.displayName}
              disabled={config.columns.some(c => c.id === indicator.id)}
            />
          ))}
        </SingleSelect>

        <InputField
          label="Target Value"
          value={targetValue}
          onChange={({ value }) => setTargetValue(value)}
          type="number"
          min="0"
          max="100"
          disabled={!selectedIndicator}
          placeholder="Enter target percentage"
        />

        <Button
          primary
          disabled={!selectedIndicator}
          onClick={addIndicator}
        >
          Add Indicator
        </Button>
      </div>

      <Help>
        Selected indicators will appear as columns in your report
      </Help>

      <DataTable>
        <DataTableRow header>
          <DataTableCell>Indicator</DataTableCell>
          <DataTableCell>Type</DataTableCell>
          <DataTableCell>Target Value</DataTableCell>
          <DataTableCell>Action</DataTableCell>
        </DataTableRow>
        {config.columns.map(column => (
          <DataTableRow key={column.id}>
            <DataTableCell>{column.name}</DataTableCell>
            <DataTableCell>{column.type}</DataTableCell>
            <DataTableCell>
              {config.targets[column.id] || 'Not set'}
            </DataTableCell>
            <DataTableCell>
              <Button
                small
                destructive
                onClick={() => {
                  const newColumns = config.columns.filter(c => c.id !== column.id);
                  const newTargets = { ...config.targets };
                  delete newTargets[column.id];
                  onChange({
                    ...config,
                    columns: newColumns,
                    targets: newTargets
                  });
                }}
              >
                Remove
              </Button>
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
};

export default CellConfigStage;