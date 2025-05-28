import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DataProvider } from '@dhis2/app-runtime'; // ✅ Import DataProvider
import ConfigPanel from './ConfigPanel';
import ReportPreview from '../ReportPreview/ReportPreview';
import DataEngine from './DataEngine'; // ✅ Still using your custom engine wrapper

const ReportBuilderPage = () => {
  const [reportConfig, setReportConfig] = useState({
    title: 'DHIS2 Report 222',
    subtitle: '',
    facility: 'Facility A',
    date: new Date().toLocaleDateString(),
    periods: [],
    items: [],
    orgUnits: [],
    columns: [
      { id: 'period', name: 'Period', type: 'system' },
      { id: 'orgUnit', name: 'Facility', type: 'system' },
    ],
    data: {},
  });

  const handlers = {
    handleItemsChange: (items) => {
      console.log('Handling items change:', items);
      setReportConfig(prev => ({
        ...prev,
        items,
        columns: [
          ...prev.columns.filter(c => c.type === 'system'),
          ...items.map(item => ({ id: item.id, name: item.name, type: item.type })),
        ],
      }));
    },
    handlePeriodsChange: (periods) => setReportConfig(prev => ({ ...prev, periods })),
    handleOrgUnitChange: (orgUnits) => setReportConfig(prev => ({ ...prev, orgUnits })),
    handleTitleChange: (title) => setReportConfig(prev => ({ ...prev, title })),
    handleSubtitleChange: (subtitle) => setReportConfig(prev => ({ ...prev, subtitle })),
    handleLogoUpload: (logo) => setReportConfig(prev => ({ ...prev, logo })),
    handlePrint: () => console.log('Generate report:', reportConfig),
    handleSave: () => console.log('Save configuration:', reportConfig),
  };

  const runtimeConfig = {
    baseUrl: 'https://play.dhis2.org/stable-2.41.3.1', // ✅ Customize for your DHIS2 instance
    apiVersion: 37,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DataProvider config={runtimeConfig}> {/* ✅ Wrap everything in DataProvider */}
        <DataEngine>
         
          {(engine) => {
            console.log('DataEngine provided engine:', engine);
            if (!engine) {
              console.log('DataEngine provided engine:', engine);
              return (
                <div style={{ padding: '20px', color: 'red' }}>
                  Loading DHIS2 data engine...
                </div>
              );
            }

            return (
              <>
                <ConfigPanel
                  reportConfig={reportConfig}
                  handlers={handlers}
                  engine={engine}
                />
                <ReportPreview
                  reportConfig={reportConfig}
                  onAddColumn={(item) =>
                    handlers.handleItemsChange([...reportConfig.items, item])
                  }
                  onAddItem={(item, dataKey) => {
                    setReportConfig(prev => ({
                      ...prev,
                      data: { ...prev.data, [dataKey]: item },
                    }));
                  }}
                  engine={engine}
                />
              </>
            );
          }}
        </DataEngine>
      </DataProvider>
    </DndProvider>
  );
};

export default ReportBuilderPage;
