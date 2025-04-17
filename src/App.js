import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AlertBar, CircularLoader } from '@dhis2/ui';
import { useReportConfig } from './hooks/useReportConfig';
import { useDhis2Data } from './hooks/useDhis2Data';
import ConfigPanel from './components/configPanel/ConfigPanel';
import ReportPreview from './components/ReportPreview/ReportPreview';
import './App.css';
import './print.css';

const App = () => {
  const {
    reportConfig, handlers, isLoading,
    error, metadata, metadataLoading
  } = useReportConfig();

  useDhis2Data(reportConfig, handlers.setReportData);

  if (isLoading && !metadata) return <CircularLoader />;
  if (error) return <AlertBar critical>{error.message}</AlertBar>;

  return (
    <DndProvider backend={HTML5Backend}> 
     <div style={styles.container}>
        <div className="app-container">
          <div style={styles.sidePanel}>
            <ConfigPanel 
              reportConfig={reportConfig}
              metadata={metadata}
              loading={metadataLoading}
              handlers={{
                ...handlers,
                handleSelectDataElement: (item) => {
                  if (!reportConfig.items.some(i => i.id === item.id)) {
                    handlers.setReportConfig({
                      ...reportConfig,
                      items: [...reportConfig.items, {
                        id: item.id,
                        name: item.displayName,
                        type: item.indicatorType ? 'indicator' : 'dataElement',
                        metadata: item
                      }]
                    });
                  }
                },
                handleRemoveItem: (id) => {
                  handlers.setReportConfig({
                    ...reportConfig,
                    items: reportConfig.items.filter(i => i.id !== id),
                    columns: reportConfig.columns.filter(c => c.id !== id)
                  });
                }
              }}
            />
          </div>  
          <ReportPreview 
            reportConfig={reportConfig} 
            onAddColumn={(item) => {
              handlers.setReportConfig({
                ...reportConfig,
                columns: [...reportConfig.columns, {
                  id: item.id,
                  name: item.name,
                  type: item.type || 'dataElement',
                  metadata: item.metadata
                }]
              });
            }}
            onAddItem={(item, position) => {
              handlers.setReportConfig({
                ...reportConfig,
                data: {
                  ...reportConfig.data,
                  [position]: item
                }
              });
            }}
          />
        </div>
      </div>
    </DndProvider>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Roboto, sans-serif'
  },
  sidePanel: {
    width: '350px',
    backgroundColor: '#ffffff',
    boxShadow: '1px 0 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
};

export default App;