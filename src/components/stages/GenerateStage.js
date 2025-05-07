import React, {useState, useEffect} from 'react';
import { 
  Button,
  AlertBar,
  Help
} from '@dhis2/ui';

const GenerateStage = ({ config, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      onGenerate();
    }, 1500);
  };

  return (
    <div className="stage">
      <h2>Generate Report</h2>
      
      <AlertBar info>
        Review your configuration before generating the final report
      </AlertBar>

      <div className="config-summary">
        <h4>Configuration Summary</h4>
        <p><strong>Table Name:</strong> {config.name || 'Not set'}</p>
        <p><strong>Indicators:</strong> {config.columns.length}</p>
        <p><strong>Health Facilities:</strong> {config.orgUnits.length}</p>
        <p><strong>Periods:</strong> {config.periods.length}</p>
      </div>

      <Help>
        Click "Generate Report" to create your table with the selected parameters
      </Help>

      <div className="stage-actions">
        <Button
          primary
          loading={isGenerating}
          onClick={handleGenerate}
          disabled={!config.name || 
                   config.columns.length === 0 || 
                   config.orgUnits.length === 0 || 
                   config.periods.length === 0}
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default GenerateStage;