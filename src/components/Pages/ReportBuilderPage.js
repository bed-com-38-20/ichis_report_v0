import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AlertBar, CircularLoader } from '@dhis2/ui';
import { useReportConfig } from '../../hooks/useReportConfig';
import { useDhis2Data } from '../../hooks/useDhis2Data';
import ConfigPanel from '../configPanel/ConfigPanel';
import ReportPreview from '../ReportPreview/ReportPreview';
import HeaderActions from '../HeaderActions/HeaderActions';
import { useTemplateStore } from '../../hooks/useTemplateStore';
//import './ReportBuilderPage.css';

const ReportBuilderPage = () => {
  const {
    reportConfig,
    handlers,
    isLoading,
    error,
    metadata,
    metadataLoading
  } = useReportConfig();

  const [activeTab, setActiveTab] = useState("design");
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useDhis2Data(reportConfig, handlers.setReportData);
  const { saveTemplates, loadTemplates } = useTemplateStore();

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    const templateId = `template-${Date.now()}`;
    const newTemplate = {
        id: templateId,
        name: reportConfig.title,
        config: { ...reportConfig },
        createdAt: new Date().toISOString(),
    };

    try {
        const existingTemplates = await loadTemplates();
        const updatedTemplates = [...existingTemplates, newTemplate];
        await saveTemplates(updatedTemplates);
        alert("Template saved to DHIS2 DataStore!");
    } catch (error) {
        console.error("Error saving template to DHIS2 DataStore:", error);
        alert("Failed to save template. Check the console for details.");
    } finally {
        setIsSaving(false);
    }
  };

  // Handler for saving templates
  // const handleSaveTemplate = () => {
  //   setIsSaving(true);
  //   const templateId = `template-${Date.now()}`;
  //   const newTemplate = {
  //     id: templateId,
  //     name: reportConfig.title,
  //     config: { ...reportConfig },
  //     createdAt: new Date().toISOString(),
  //   };

  //   setSavedTemplates([...savedTemplates, newTemplate]);

  //   try {
  //     const existingTemplates = JSON.parse(
  //       localStorage.getItem("reportTemplates") || "[]"
  //     );
  //     localStorage.setItem(
  //       "reportTemplates",
  //       JSON.stringify([...existingTemplates, newTemplate])
  //     );
  //     alert("Template saved successfully!");
  //   } catch (error) {
  //     console.error("Error saving template:", error);
  //     alert("Failed to save template. Please try again.");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  // Handler for loading templates
  const handleLoadTemplate = (templateId) => {
    const template = savedTemplates.find((t) => t.id === templateId);
    if (template) {
      handlers.setReportConfig(template.config);
    }
  };

  if (isLoading && !metadata) return <CircularLoader />;
  if (error) return <AlertBar critical>{error.message}</AlertBar>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        {/* Header Actions Component */}
        <HeaderActions
          onPrint={handlers.handlePrint}
          onSave={handleSaveTemplate}
          onLoadTemplate={handleLoadTemplate}
          savedTemplates={savedTemplates}
          isSaving={isSaving}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="main-content">
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
  sidePanel: {
    width: '350px',
    backgroundColor: '#ffffff',
    boxShadow: '1px 0 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
};

export default ReportBuilderPage;
