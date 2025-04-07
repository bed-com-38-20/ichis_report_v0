// FieldTypesPanel.js
import React from 'react';
import { Button } from '@dhis2/ui';

const FIELD_TYPES = [
  { type: 'text', label: 'Text Input' },
  { type: 'select', label: 'Dropdown' },
  { type: 'checkbox', label: 'Checkbox' }
];

export const FieldTypesPanel = React.memo(({ onAddField }) => {
  return (
    <div className="field-types-panel">
      <h3>Field Types</h3>
      {FIELD_TYPES.map(({ type, label }) => (
        <Button
          key={type}
          onClick={() => onAddField(type)}
          className="field-type"
        >
          {label}
        </Button>
      ))}
    </div>
  );
});

export default FieldTypesPanel;
