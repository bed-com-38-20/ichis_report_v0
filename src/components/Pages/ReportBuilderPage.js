import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    metadataLoading,
    setReportConfig
  } = useReportConfig();

  const [activeTab, setActiveTab] = useState("design");
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [templateLoading, setTemplateLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('templateId');

  useDhis2Data(reportConfig, handlers.setReportData);
  const { saveTemplates, loadTemplates } = useTemplateStore();

  // Load template data if editing
  useEffect(() => {
    const preloadTemplate = async () => {
      if (templateId) {
        setTemplateLoading(true);
        try {
          const templates = await loadTemplates()
          const selected = templates.find(t => t.id === templateId)

          if (selected) {
            setReportConfig(selected.config)
            setSuccessMessage(`Template "${selected.name}" loaded successfully!`);
          } else {
            setSuccessMessage(`Template not found.`);
          }
        } catch (err) {
          console.error('Failed to preload template:', err)
          setSuccessMessage('Failed to load template.');
        } finally {
          setTemplateLoading(false);
        }
      }
    };

    preloadTemplate()
  }, [templateId, loadTemplates, setReportConfig])

  // Load saved templates to populate dropdown
  useEffect(() => {
    const fetchTemplates = async () => {
      const templates = await loadTemplates()
      setSavedTemplates(templates)
    }

    fetchTemplates()
  }, [loadTemplates])

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

        {/* {successMessage && (
          <AlertBar duration={4000} onHidden={() => setSuccessMessage('')}>
            {successMessage}
          </AlertBar>
        )} */}

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
