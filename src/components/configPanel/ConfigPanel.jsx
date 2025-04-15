import React from 'react';
import { Card } from '@dhis2/ui';
import OrgUnitSelector from "./OrgUnitSelector";
import PeriodSelector from './PeriodSelector';
import ReportConfigForm from './ReportConfigForm';
import './ConfigPanel.css'

const ConfigPanel = ({ reportConfig, setReportConfig, metadata, loading }) => {
  return (
    <div className="config-panel">
      <Card>
        <div className="config-content">
          <h3>DHIS2 Integration</h3>
          
          <OrgUnitSelector 
            reportConfig={reportConfig}
            setReportConfig={setReportConfig}
            metadata={metadata}
            loading={loading}
          />

          <PeriodSelector 
            reportConfig={reportConfig}
            setReportConfig={setReportConfig}
          />

          <ReportConfigForm 
            reportConfig={reportConfig}
            setReportConfig={setReportConfig}
          />
        </div>
      </Card>
    </div>
  );
};

export default ConfigPanel;