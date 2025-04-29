import React, {useState, useEffect} from 'react';
import { InputField, Help } from '@dhis2/ui';

const TemplateStage = ({ config, onChange }) => (
  <div className="stage">
    <h2>Create Table Template</h2>
    <InputField
      label="Table Name"
      value={config.name || ''}
      onChange={({ value }) => onChange({ ...config, name: value })}
      required
      placeholder="e.g., ANC Coverage Report - Sierra Leone"
    />
    <Help>
      Give your report a descriptive name that identifies its purpose and scope.
    </Help>
  </div>
);

export default TemplateStage;