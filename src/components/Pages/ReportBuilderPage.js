// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { AlertBar, CircularLoader } from '@dhis2/ui';
// import { useReportConfig } from '../../hooks/useReportConfig';
// import { useDhis2Data } from '../../hooks/useDhis2Data';
// import ConfigPanel from '../configPanel/ConfigPanel';
// import ReportPreview from '../ReportPreview/ReportPreview';
// import HeaderActions from '../HeaderActions/HeaderActions';
// import CalculatedFieldButton from '../ReportBuilder/CalculatedField/CalculatedFieldButton';
// import DynamicTextButton from '../ReportBuilder/DynamicText/DynamicTextButton';
// import { useTemplateStore } from '../../hooks/useTemplateStore';
// //import './ReportBuilderPage.css';
// import { Stepper, Step, StepLabel, Button } from '@dhis2/ui';
// import {
//   TemplateStage,
//   CellConfigStage,
//   OrgUnitStage,
//   PeriodStage,
//   GenerateStage,
//   ReportStage
// } from '../stages';

// const steps = [
//   '1. Table Template',
//   '2. Configure Cells',
//   '3. Select Org Units',
//   '4. Set Periods',
//   '5. Generate',
//   '6. Report'
// ];

// const ReportBuilderPage = () => {
//   const {
//     reportConfig = {},
//     handlers = {},
//     isLoading,
//     error,
//     metadata = {},
//     metadataLoading
//   } = useReportConfig();

//   const [activeStep, setActiveStep] = useState(0);
//   const { data: reportData, loading: dataLoading } = useDhis2Data(reportConfig);
//   const handleNext = () => setActiveStep(prev => prev + 1);
//   const handleBack = () => setActiveStep(prev => prev - 1);

//   const [activeTab, setActiveTab] = useState("design");
//   const [savedTemplates, setSavedTemplates] = useState([]);
//   const [isSaving, setIsSaving] = useState(false);

//   useDhis2Data(reportConfig, handlers.setReportData);
//   const { saveTemplates, loadTemplates } = useTemplateStore();

//   const handleSaveTemplate = async () => {
//     setIsSaving(true);
//     const templateId = `template-${Date.now()}`;
//     const newTemplate = {
//         id: templateId,
//         name: reportConfig.title,
//         config: { ...reportConfig },
//         createdAt: new Date().toISOString(),
//     };

//     try {
//         const existingTemplates = await loadTemplates();
//         const updatedTemplates = [...existingTemplates, newTemplate];
//         await saveTemplates(updatedTemplates);
//         alert("Template saved to DHIS2 DataStore!");
//     } catch (error) {
//         console.error("Error saving template to DHIS2 DataStore:", error);
//         alert("Failed to save template. Check the console for details.");
//     } finally {
//         setIsSaving(false);
//     }
//   };

//   // Handler for saving templates
//   // const handleSaveTemplate = () => {
//   //   setIsSaving(true);
//   //   const templateId = `template-${Date.now()}`;
//   //   const newTemplate = {
//   //     id: templateId,
//   //     name: reportConfig.title,
//   //     config: { ...reportConfig },
//   //     createdAt: new Date().toISOString(),
//   //   };

//   //   setSavedTemplates([...savedTemplates, newTemplate]);

//   //   try {
//   //     const existingTemplates = JSON.parse(
//   //       localStorage.getItem("reportTemplates") || "[]"
//   //     );
//   //     localStorage.setItem(
//   //       "reportTemplates",
//   //       JSON.stringify([...existingTemplates, newTemplate])
//   //     );
//   //     alert("Template saved successfully!");
//   //   } catch (error) {
//   //     console.error("Error saving template:", error);
//   //     alert("Failed to save template. Please try again.");
//   //   } finally {
//   //     setIsSaving(false);
//   //   }
//   // };
//   // Handler for loading template

//   const handleLoadTemplate = (templateId) => {
//     const template = savedTemplates.find((t) => t.id === templateId);
//     if (template) {
//       handlers.setReportConfig(template.config);
//     }
//   };


//   if (isLoading && !metadata) return <CircularLoader />;
//   if (error) return <AlertBar critical>{error.message}</AlertBar>;

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="app-container">
//         <HeaderActions
//           onPrint={handlers.handlePrint}
//           onSave={handleSaveTemplate}
//           onLoadTemplate={handleLoadTemplate}
//           savedTemplates={savedTemplates}
//           isSaving={isSaving}
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//         />

//         <div className="main-content">
//           <div style={styles.sidePanel}>
//             <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
//               <CalculatedFieldButton />
//               <DynamicTextButton />
//             </div>

//             <ConfigPanel
//               reportConfig={reportConfig}
//               metadata={metadata}
//               loading={metadataLoading}
//               handlers={{
//                 ...handlers,
//                 handleSelectDataElement: (item) => {
//                   const items = reportConfig.items || [];
//                   if (!items.some(i => i.id === item.id)) {
//                     handlers.setReportConfig({
//                       ...reportConfig,
//                       items: [
//                         ...items,
//                         {
//                           id: item.id,
//                           name: item.displayName,
//                           type: item.indicatorType ? 'indicator' : 'dataElement',
//                           metadata: item
//                         }
//                       ]
//                     });
//                   }
//                 },
//                 handleRemoveItem: (id) => {
//                   const items = reportConfig.items || [];
//                   const columns = reportConfig.columns || [];
//                   handlers.setReportConfig({
//                     ...reportConfig,
//                     items: items.filter(i => i.id !== id),
//                     columns: columns.filter(c => c.id !== id)
//                   });
//                 }
//               }}
//             />
//           </div>

//           <ReportPreview
//             reportConfig={reportConfig}
//             onAddColumn={(item) => {
//               const columns = reportConfig.columns || [];
//               handlers.setReportConfig({
//                 ...reportConfig,
//                 columns: [
//                   ...columns,
//                   {
//                     id: item.id,
//                     name: item.name,
//                     type: item.type || 'dataElement',
//                     metadata: item.metadata
//                   }
//                 ]
//               });
//             }}
//             onAddItem={(item, position) => {
//               handlers.setReportConfig({
//                 ...reportConfig,
//                 data: {
//                   ...reportConfig.data,
//                   [position]: item
//                 }
//               });
//             }}
//           />
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// const styles = {
//   sidePanel: {
//     width: '350px',
//     backgroundColor: '#ffffff',
//     boxShadow: '1px 0 3px rgba(0,0,0,0.1)',
//     display: 'flex',
//     flexDirection: 'column',
//     overflow: 'hidden',
//   },
// };

// export default ReportBuilderPage;


// // import React, { useState, useEffect } from 'react';
// // import { DndProvider } from 'react-dnd';
// // import { HTML5Backend } from 'react-dnd-html5-backend';
// // import { AlertBar, CircularLoader } from '@dhis2/ui';
// // import { useReportConfig } from '../../hooks/useReportConfig';
// // import { useDhis2Data } from '../../hooks/useDhis2Data';
// // import ConfigPanel from '../configPanel/ConfigPanel';
// // import ReportBuilder from '../ReportBuilder/ReportBuilder';
// // import HeaderActions from '../HeaderActions/HeaderActions';
// // import { useTemplateStore } from '../../hooks/useTemplateStore';
// // //import './ReportBuilderPage.css';

// // const ReportBuilderPage = () => {
// //   const {
// //     reportConfig,
// //     handlers,
// //     isLoading,
// //     error,
// //     metadata
// //   } = useReportConfig();

// //   const { data: reportData, loading: dataLoading, error: dataError } = useDhis2Data(reportConfig);
// //   const { saveTemplate, loadTemplates } = useTemplateStore();
// //   const [savedTemplates, setSavedTemplates] = useState([]);
// //   const [isSaving, setIsSaving] = useState(false);
// //   const [activeTab, setActiveTab] = useState("design");

// //   useEffect(() => {
// //     const fetchTemplates = async () => {
// //       try {
// //         const templates = await loadTemplates();
// //         setSavedTemplates(templates);
// //       } catch (error) {
// //         console.error("Failed to load templates:", error);
// //       }
// //     };
// //     fetchTemplates();
// //   }, []);

// //   const handleSaveTemplate = async () => {
// //     setIsSaving(true);
// //     try {
// //       const templateId = `template-${Date.now()}`;
// //       const newTemplate = {
// //         id: templateId,
// //         name: reportConfig.title,
// //         config: reportConfig,
// //         createdAt: new Date().toISOString()
// //       };
// //       await saveTemplate(newTemplate);
// //       setSavedTemplates(prev => [...prev, newTemplate]);
// //     } catch (error) {
// //       console.error("Failed to save template:", error);
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   const handleLoadTemplate = async (templateId) => {
// //     try {
// //       const template = savedTemplates.find(t => t.id === templateId);
// //       if (template) {
// //         handlers.setReportConfig(template.config);
// //       }
// //     } catch (error) {
// //       console.error("Failed to load template:", error);
// //     }
// //   };

// //   if (isLoading) return <CircularLoader />;
// //   if (error) return <AlertBar critical>{error.message}</AlertBar>;

// //   return (
// //     <DndProvider backend={HTML5Backend}>
// //       <div className="report-builder-page">
// //         <HeaderActions
// //           reportTitle={reportConfig.title}
// //           onPrint={handlers.handlePrint}
// //           onSave={handleSaveTemplate}
// //           onLoadTemplate={handleLoadTemplate}
// //           savedTemplates={savedTemplates}
// //           isSaving={isSaving}
// //           activeTab={activeTab}
// //           setActiveTab={setActiveTab}
// //         />

// //         <div className="main-content">
// //           <div className="config-panel">
// //             <ConfigPanel
// //               reportConfig={reportConfig}
// //               metadata={metadata}
// //               loading={isLoading}
// //               handlers={handlers}
// //             />
// //           </div>

// //           <div className="report-preview">
// //             <h2>{reportConfig.title}</h2>
// //             {reportConfig.subtitle && <h4>{reportConfig.subtitle}</h4>}
// //             {reportConfig.logo && (
// //               <img 
// //                 src={reportConfig.logo} 
// //                 alt="Report Logo" 
// //                 className="report-logo"
// //               />
// //             )}

// //             <ReportBuilder
// //               reportConfig={reportConfig}
// //               reportData={reportData}
// //               loading={dataLoading}
// //               error={dataError}
// //               onAddColumn={handlers.handleAddColumn}
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </DndProvider>
// //   );
// // };

// // export default ReportBuilderPage;


import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, CircularLoader, AlertBar } from '@dhis2/ui';
import { useReportConfig } from '../../hooks/useReportConfig';
import { useDhis2Data } from '../../hooks/useDhis2Data';
import HeaderActions from '../HeaderActions/HeaderActions';
import CellConfigStage from '../stages/CellConfigStage';
import TemplateStage from '../stages/TemplateStage';
import OrgUnitStage from '../stages/OrgUnitStage';
import PeriodStage from '../stages/PeriodStage';
import GenerateStage from '../stages/GenerateStage';
import ReportStage from '../stages/ReportStage';
import './ReportBuilderPage.css';

const steps = [
    '1. Table Template',
    '2. Configure Cells',
    '3. Select Org Units',
    '4. Set Periods',
    '5. Generate',
    '6. Report'
];

const ReportBuilderPage = () => {
    const {
        reportConfig,
        handlers,
        isLoading,
        error,
        metadata
    } = useReportConfig();

    const [activeStep, setActiveStep] = useState(0);
    const { data: reportData, loading: dataLoading } = useDhis2Data(reportConfig);

    const handleNext = () => setActiveStep(prev => prev + 1);
    const handleBack = () => setActiveStep(prev => prev - 1);

    if (isLoading) return <CircularLoader />;
    if (error) return <AlertBar critical>{error.message}</AlertBar>;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="report-builder-page">
                <HeaderActions
                    onPrint={handlers.handlePrint}
                    onSave={handlers.handleSaveTemplate}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                />

                {/* Custom Stepper */}
                <div className="custom-stepper">
                    {steps.map((label, index) => (
                        <div
                            key={index}
                            className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
                            onClick={() => setActiveStep(index)}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <div className="stage-container">
                    {activeStep === 0 && (
                        <TemplateStage
                            config={reportConfig}
                            onChange={handlers.setReportConfig}
                        />
                    )}
                    {activeStep === 1 && (
                        <CellConfigStage
                            config={reportConfig}
                            onChange={handlers.setReportConfig}
                            metadata={metadata}
                        />
                    )}
                    {activeStep === 2 && (
                        <OrgUnitStage
                            config={reportConfig}
                            onChange={handlers.setReportConfig}
                        />
                    )}
                    {activeStep === 3 && (
                        <PeriodStage
                            config={reportConfig}
                            onChange={handlers.setReportConfig}
                        />
                    )}
                    {activeStep === 4 && (
                        <GenerateStage
                            config={reportConfig}
                            onGenerate={handleNext}
                        />
                    )}
                    {activeStep === 5 && (
                        <ReportStage
                            config={reportConfig}
                            data={reportData}
                            loading={dataLoading}
                        />
                    )}
                </div>

                <div className="navigation-buttons">
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    {activeStep < steps.length - 1 ? (
                        <Button
                            primary
                            onClick={handleNext}
                            disabled={!validateStep(activeStep, reportConfig)}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            primary
                            onClick={() => handlers.handlePrint()}
                        >
                            Print Report
                        </Button>
                    )}
                </div>
            </div>
        </DndProvider>
    );
};

const validateStep = (step, config) => {
    switch (step) {
        case 0: return config.name?.trim() !== '';
        case 1: return config.columns?.length > 0;
        case 2: return config.orgUnits?.length > 0;
        case 3: return config.periods?.length > 0;
        default: return true;
    }
};

export default ReportBuilderPage;
