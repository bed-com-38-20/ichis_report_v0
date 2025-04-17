// import React, { useState, useEffect } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { 
//   Button, 
//   InputField, 
//   Card,
//   AlertBar,
//   CircularLoader,
//   SingleSelect,
//   SingleSelectOption
// } from '@dhis2/ui';
// import { useDataQuery, useConfig } from '@dhis2/app-runtime';
// import ReportHeader from './ReportHeader';
// import ReportBuilder from './ReportBuilder';
// import StockManagementTable from './StockManagementTable';
// import ItemPanel from './ItemPanel';
// import ComponentsPanel from './ComponentsPanel';
// import './print.css';

// const App = () => {
//   const { baseUrl } = useConfig();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reportConfig, setReportConfig] = useState({
//     title: '',
//     subtitle: '',
//     logo: null,
//     date: new Date().toLocaleDateString(),
//     facility: '',
//     period: '',
//     data: {},
//     orgUnit: null,
//     periodSelection: null,
//     columns: [],
//     items: []
//   });

//   // Handler functions declared first
//   const handlePrint = () => window.print();

//   const handleTitleChange = ({ value }) => {
//     setReportConfig(prev => ({ ...prev, title: value }));
//   };

//   const handleSubtitleChange = ({ value }) => {
//     setReportConfig(prev => ({ ...prev, subtitle: value }));
//   };

//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setReportConfig(prev => ({ ...prev, logo: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleOrgUnitChange = (orgUnitId) => {
//     const selectedOrgUnit = metadata?.orgUnits?.organisationUnits?.find(ou => ou.id === orgUnitId);
//     setReportConfig(prev => ({
//       ...prev,
//       orgUnit: orgUnitId,
//       facility: selectedOrgUnit?.displayName || ''
//     }));
//   };

//   const handlePeriodChange = ({ selected }) => {
//     setReportConfig(prev => ({ ...prev, periodSelection: selected }));
//   };

//   const handleAddColumn = (column) => {
//     setReportConfig(prev => ({
//       ...prev,
//       columns: [...prev.columns, column]
//     }));
//   };

//   const handleAddItem = (item) => {
//     setReportConfig(prev => ({
//       ...prev,
//       items: [...prev.items, item]
//     }));
//   };

//   // Data fetching and transformation functions
//   const { data: metadata, loading: metadataLoading } = useDataQuery({
//     orgUnits: {
//       resource: 'organisationUnits',
//       params: {
//         paging: false,
//         fields: 'id,displayName,level',
//         level: 3
//       }
//     },
//     systemSettings: {
//       resource: 'systemSettings',
//       params: {
//         key: ['applicationTitle']
//       }
//     },
//     user: {
//       resource: 'me',
//       params: {
//         fields: 'organisationUnits[id,displayName]'
//       }
//     }
//   });

//   const transformDHIS2Data = (dataValueSet) => {
//     return dataValueSet?.dataValues?.reduce((acc, dv) => ({
//       ...acc,
//       [dv.dataElement]: dv.value
//     }), {}) || {};
//   };

//   const formatPeriodLabel = (periodType) => {
//     const format = (date) => date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
//     const now = new Date();
    
//     switch(periodType) {
//       case 'LAST_3_MONTHS':
//         const threeMonthsAgo = new Date(now);
//         threeMonthsAgo.setMonth(now.getMonth() - 3);
//         return `Last 3 months (${format(threeMonthsAgo)} - ${format(now)})`;
//       case 'LAST_6_MONTHS':
//         const sixMonthsAgo = new Date(now);
//         sixMonthsAgo.setMonth(now.getMonth() - 6);
//         return `Last 6 months (${format(sixMonthsAgo)} - ${format(now)})`;
//       case 'LAST_12_MONTHS':
//         const twelveMonthsAgo = new Date(now);
//         twelveMonthsAgo.setMonth(now.getMonth() - 12);
//         return `Last 12 months (${format(twelveMonthsAgo)} - ${format(now)})`;
//       case 'THIS_YEAR':
//         return `This year (${now.getFullYear()})`;
//       case 'LAST_YEAR':
//         return `Last year (${now.getFullYear()-1})`;
//       default:
//         return format(now);
//     }
//   };

//   const getPeriodOptions = () => {
//     const currentYear = new Date().getFullYear();
//     return [
//       { label: 'Last 3 months', value: 'LAST_3_MONTHS' },
//       { label: 'Last 6 months', value: 'LAST_6_MONTHS' },
//       { label: 'Last 12 months', value: 'LAST_12_MONTHS' },
//       { label: `This year (${currentYear})`, value: `THIS_YEAR` },
//       { label: `Last year (${currentYear-1})`, value: 'LAST_YEAR' }
//     ];
//   };

//   const fetchReportData = async () => {
//     if (!reportConfig.orgUnit || !reportConfig.periodSelection) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `${baseUrl}/api/dataValueSets?orgUnit=${reportConfig.orgUnit}&period=${reportConfig.periodSelection}`
//       );
//       const data = await response.json();
//       setReportConfig(prev => ({
//         ...prev,
//         data: transformDHIS2Data(data),
//         period: formatPeriodLabel(reportConfig.periodSelection)
//       }));
//     } catch (err) {
//       setError(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Effects
//   useEffect(() => {
//     if (!metadataLoading && metadata) {
//       setReportConfig(prev => ({
//         ...prev,
//         title: metadata.systemSettings.applicationTitle || 'DHIS2 Report',
//         facility: metadata.user.organisationUnits[0]?.displayName || '',
//         orgUnit: metadata.user.organisationUnits[0]?.id || null
//       }));
//       setIsLoading(false);
//     }
//   }, [metadataLoading, metadata]);

//   useEffect(() => {
//     fetchReportData();
//   }, [reportConfig.orgUnit, reportConfig.periodSelection]);

//   useEffect(() => {
//     if (metadata?.orgUnits?.organisationUnits && reportConfig.orgUnit) {
//       const isValid = metadata.orgUnits.organisationUnits.some(
//         ou => ou.id === reportConfig.orgUnit
//       );
//       if (!isValid) {
//         setReportConfig(prev => ({ ...prev, orgUnit: null }));
//       }
//     }
//   }, [metadata, reportConfig.orgUnit]);

//   // Modify your SingleSelect render
//   const orgUnitOptions = metadata?.orgUnits?.organisationUnits || [];
//   const isValidSelection = orgUnitOptions.some(ou => ou.id === reportConfig.orgUnit);


//   if (isLoading && !metadata) return <CircularLoader />;
//   if (error) return <AlertBar critical>{error.message}</AlertBar>;

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div style={styles.container}>
//         <div style={styles.sidePanel}>
//           <div style={styles.configPanel} className="no-print">
//             <Card>
//               <div style={styles.configContent}>
//                 <h3>DHIS2 Integration</h3>
                
//                 <div style={{ marginBottom: 16 }}>
//                   <label>Health Facility:</label>
//                       <SingleSelect
//                           selected={isValidSelection ? reportConfig.orgUnit : null}
//                           onChange={({ selected }) => handleOrgUnitChange(selected)}
//                           loading={metadataLoading}
//                         >
//                           {orgUnitOptions.map(ou => (
//                             <SingleSelectOption 
//                               key={ou.id} 
//                               value={ou.id} 
//                               label={ou.displayName} 
//                             />
//                           ))}
//                     </SingleSelect>
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label>Reporting Period:</label>
//                   <SingleSelect
//                     selected={reportConfig.periodSelection}
//                     onChange={handlePeriodChange}
//                     placeholder="Select period"
//                   >
//                     {getPeriodOptions().map(option => (
//                       <SingleSelectOption 
//                         key={option.value} 
//                         value={option.value} 
//                         label={option.label} 
//                       />
//                     ))}
//                   </SingleSelect>
//                 </div>

//                 {isLoading && <CircularLoader small />}

//                 <h3>Report Configuration</h3>
//                 <InputField
//                   label="Report Title"
//                   value={reportConfig.title}
//                   onChange={handleTitleChange}
//                   style={styles.inputField}
//                 />

//                 <InputField
//                   label="Report Subtitle"
//                   value={reportConfig.subtitle}
//                   onChange={handleSubtitleChange}
//                   style={styles.inputField}
//                 />

//                 <div style={styles.logoUpload}>
//                   <label style={styles.uploadLabel}>
//                     Upload Logo
//                     <input 
//                       type="file" 
//                       accept="image/*" 
//                       onChange={handleLogoUpload}
//                       style={{ display: 'none' }}
//                     />
//                   </label>
//                   {reportConfig.logo && (
//                     <img 
//                       src={reportConfig.logo} 
//                       alt="Logo Preview" 
//                       style={styles.logoPreview}
//                     />
//                   )}
//                 </div>

//                 <div style={styles.buttonGroup}>
//                   <Button primary onClick={handlePrint}>
//                     Print Report
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//           <ComponentsPanel onAddColumn={handleAddColumn} onAddItem={handleAddItem} />          
//         </div>

//         <div style={styles.reportPreview}>
//           <div className="printable-area" style={styles.printableArea}>
//             <ReportHeader 
//               title={reportConfig.title}
//               subtitle={reportConfig.subtitle}
//               facility={reportConfig.facility}
//               date={reportConfig.date}
//               period={reportConfig.period}
//               logo={reportConfig.logo}
//             />
//             <div style={styles.mainArea}>
//               <ReportBuilder 
//                   columns={reportConfig.columns || []} 
//                   items={reportConfig.items || []}
//                   onAddColumn={handleAddColumn}
//                   onAddItem={handleAddItem}
//               />
//             </div>
//             <StockManagementTable 
//               data={reportConfig.data}
//               columns={reportConfig.columns}
//               items={reportConfig.items}
//             />
//           </div>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };


// export default App;

// import React, { useState, useEffect } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { useDataQuery, useConfig } from '@dhis2/app-runtime';
// import ConfigPanel from './components/configPanel/ConfigPanel';
// import ReportPreview from './components/ReportPreview/ReportPreview';
// import './App.css';

// const App = () => {
//   const { baseUrl } = useConfig();
//   const [reportConfig, setReportConfig] = useState({
//     title: '',
//     subtitle: '',
//     logo: null,
//     date: new Date().toLocaleDateString(),
//     facility: '',
//     period: '',
//     data: {},
//     orgUnit: null,
//     periodSelection: null,
//     columns: [],
//     items: []
//   });

//   // Data fetching logic remains here
//   const { data: metadata, loading: metadataLoading } = useDataQuery({
//     orgUnits: {
//       resource: 'organisationUnits',
//       params: {
//         paging: false,
//         fields: 'id,displayName,level',
//         level: 3
//       }
//     },
//     systemSettings: {
//       resource: 'systemSettings',
//       params: {
//         key: ['applicationTitle']
//       }
//     },
//     user: {
//       resource: 'me',
//       params: {
//         fields: 'organisationUnits[id,displayName]'
//       }
//     }
//   });
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="app-container">
//         <ConfigPanel 
//           reportConfig={reportConfig}
//           setReportConfig={setReportConfig}
//           metadata={metadata}
//           loading={metadataLoading}
//         />
//         <ReportPreview reportConfig={reportConfig} />
//       </div>
//     </DndProvider>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     minHeight: '100vh',
//     backgroundColor: '#f0f2f5',
//     fontFamily: 'Roboto, sans-serif'
//   },
//   sidePanel: {
//     width: '350px',
//     backgroundColor: '#ffffff',
//     boxShadow: '1px 0 3px rgba(0,0,0,0.1)',
//     display: 'flex',
//     flexDirection: 'column',
//     overflow: 'hidden'
//   },
//   configPanel: {
//     padding: '16px',
//     borderBottom: '1px solid #e0e0e0'
//   },
//   configContent: {
//     padding: '8px',
//     '& h3': {
//       margin: '0 0 16px 0',
//       color: '#212934',
//       fontSize: '16px',
//       fontWeight: '500'
//     },
//     '& label': {
//       display: 'block',
//       marginBottom: '8px',
//       fontSize: '14px',
//       color: '#565656'
//     }
//   },
//   inputField: {
//     marginBottom: '16px',
//     '& input': {
//       backgroundColor: '#f9f9f9',
//       border: '1px solid #ccc',
//       borderRadius: '4px'
//     }
//   },
//   logoUpload: {
//     margin: '16px 0',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//     alignItems: 'center'
//   },
//   uploadLabel: {
//     padding: '8px 16px',
//     backgroundColor: '#f0f7ff',
//     color: '#0064d5',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     textAlign: 'center',
//     fontSize: '14px',
//     transition: 'background-color 0.2s',
//     '&:hover': {
//       backgroundColor: '#e0f0ff'
//     }
//   },
//   logoPreview: {
//     width: '80px',
//     height: '80px',
//     objectFit: 'contain',
//     border: '1px solid #ddd',
//     borderRadius: '4px'
//   },
//   buttonGroup: {
//     marginTop: '24px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//     '& button': {
//       width: '100%'
//     }
//   },
//   reportPreview: {
//     flex: 1,
//     padding: '24px',
//     backgroundColor: '#f5f5f5',
//     overflowY: 'auto',
//     display: 'flex',
//     justifyContent: 'center'
//   },
//   printableArea: {
//     width: '210mm',
//     minHeight: '297mm',
//     backgroundColor: 'white',
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//     padding: '20mm',
//     margin: '0 auto'
//   },
//   mainArea: {
//     margin: '20px 0',
//     padding: '20px',
//     backgroundColor: '#f9f9f9',
//     border: '1px dashed #ddd',
//     borderRadius: '4px'
//   }
// };


// export default App;

import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDataQuery, useConfig } from '@dhis2/app-runtime';
import ConfigPanel from './components/configPanel/ConfigPanel';
import ReportPreview from './components/ReportPreview/ReportPreview';
import HeaderActions from './components/HeaderActions/HeaderActions';
import './App.css';

const App = () => {
  const { baseUrl } = useConfig();
  const [reportConfig, setReportConfig] = useState({
    title: 'DHIS2 Report',
    subtitle: 'Generated Report',
    logo: null,
    date: new Date().toLocaleDateString(),
    facility: '',
    period: '',
    data: {},
    orgUnit: null,
    programId: null,
    periodSelection: null,
    pageSize: 'A4',
    orientation: 'portrait',
    header: null,
    footer: null,
    sections: [],
    selectedColumns: []
  });

  const [availableColumns, setAvailableColumns] = useState([]);
  const [activeTab, setActiveTab] = useState('design');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Data fetching logic
  const { data: metadata, loading: metadataLoading, refetch } = useDataQuery({
    orgUnits: {
      resource: 'organisationUnits',
      params: {
        paging: false,
        fields: 'id,displayName,level,path',
        level: [1, 2, 3, 4, 5]
      }
    },
    programs: {
      resource: 'programs',
      params: {
        paging: false,
        fields: 'id,displayName,programStages[id,displayName,programStageDataElements[id,displayName,dataElement[id,displayName,valueType]]]'
      }
    },
    periodTypes: {
      resource: 'periodTypes',
      params: {}
    },
    user: {
      resource: 'me',
      params: {
        fields: 'organisationUnits[id,displayName]'
      }
    }
  });

  // Fetch program data elements when a program is selected
  useEffect(() => {
    if (reportConfig.programId && metadata?.programs) {
      const selectedProgram = metadata.programs.programs.find(
        program => program.id === reportConfig.programId
      );
      
      if (selectedProgram) {
        // Extract data elements from the selected program
        const dataElements = [];
        
        selectedProgram.programStages.forEach(stage => {
          stage.programStageDataElements.forEach(element => {
            dataElements.push({
              id: element.dataElement.id,
              displayName: element.dataElement.displayName,
              valueType: element.dataElement.valueType,
              stageId: stage.id,
              stageName: stage.displayName
            });
          });
        });
        
        setAvailableColumns(dataElements);
      }
    }
  }, [reportConfig.programId, metadata]);

  // Initialize with a default section if none exists
  useEffect(() => {
    if (reportConfig.sections.length === 0) {
      setReportConfig({
        ...reportConfig,
        sections: [
          {
            id: 'section-default',
            title: 'Main Content',
            columns: 12,
            items: [],
            style: { padding: '16px', marginBottom: '16px' }
          }
        ]
      });
    }
  }, []);

  // Handler for printing the report
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const previewContent = document.getElementById('report-preview').innerHTML;
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${reportConfig.title}</title>
            <style>
              @media print {
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                }
                .page-break {
                  page-break-after: always;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
              }
            </style>
          </head>
          <body>
            ${previewContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  // Handler for saving the template
  const handleSaveTemplate = () => {
    setIsSaving(true);
    // Create a unique ID for the template
    const templateId = `template-${Date.now()}`;
    
    // Create a new template object
    const newTemplate = {
      id: templateId,
      name: reportConfig.title,
      config: { ...reportConfig },
      createdAt: new Date().toISOString()
    };
    
    // Add the new template to the saved templates list
    setSavedTemplates([...savedTemplates, newTemplate]);
    
    // TODO: In a real application, you would save this to a database or storage
    // For now, save to localStorage as a demo
    try {
      const existingTemplates = JSON.parse(localStorage.getItem('reportTemplates') || '[]');
      localStorage.setItem('reportTemplates', JSON.stringify([...existingTemplates, newTemplate]));
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler for loading a saved template
  const handleLoadTemplate = (templateId) => {
    const template = savedTemplates.find(t => t.id === templateId);
    if (template) {
      setReportConfig(template.config);
    }
  };

  // Generate periods based on DHIS2 period types
  const generatePeriods = (periodType) => {
    const periods = [];
    const now = new Date();
    const year = now.getFullYear();
    
    switch (periodType) {
      case 'DAILY':
        // Generate last 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          periods.push({
            id: `${date.toISOString().split('T')[0]}`,
            name: date.toLocaleDateString()
          });
        }
        break;
      case 'WEEKLY':
        // Generate last 12 weeks
        for (let i = 0; i < 12; i++) {
          periods.push({
            id: `${year}W${i + 1}`,
            name: `Week ${i + 1}, ${year}`
          });
        }
        break;
      case 'MONTHLY':
        // Generate months for the current year
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        months.forEach((month, index) => {
          periods.push({
            id: `${year}${(index + 1).toString().padStart(2, '0')}`,
            name: `${month} ${year}`
          });
        });
        break;
      case 'QUARTERLY':
        // Generate quarters for the current year
        for (let i = 1; i <= 4; i++) {
          periods.push({
            id: `${year}Q${i}`,
            name: `Q${i} ${year}`
          });
        }
        break;
      case 'YEARLY':
        // Generate last 5 years
        for (let i = 0; i < 5; i++) {
          const yearValue = year - i;
          periods.push({
            id: `${yearValue}`,
            name: `${yearValue}`
          });
        }
        break;
      default:
        break;
    }
    
    return periods;
  };

  // Handler for adding a column to the report
  const handleAddColumn = (column) => {
    setReportConfig({
      ...reportConfig,
      selectedColumns: [...reportConfig.selectedColumns, column]
    });
  };

  // Handler for removing a column from the report
  const handleRemoveColumn = (columnId) => {
    setReportConfig({
      ...reportConfig,
      selectedColumns: reportConfig.selectedColumns.filter(col => col.id !== columnId)
    });
  };

  // Handler for reordering columns in the report
  const handleReorderColumns = (startIndex, endIndex) => {
    const result = Array.from(reportConfig.selectedColumns);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    setReportConfig({
      ...reportConfig,
      selectedColumns: result
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <HeaderActions 
          onPrint={handlePrint}
          onSave={handleSaveTemplate}
          onLoadTemplate={handleLoadTemplate}
          savedTemplates={savedTemplates}
          isSaving={isSaving}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <div className="main-content" style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
          <ConfigPanel 
            reportConfig={reportConfig}
            setReportConfig={setReportConfig}
            metadata={metadata}
            loading={metadataLoading}
            availableColumns={availableColumns}
            onAddColumn={handleAddColumn}
            onRemoveColumn={handleRemoveColumn}
            onReorderColumns={handleReorderColumns}
            generatePeriods={generatePeriods}
            activeTab={activeTab}
          />
          <ReportPreview 
            reportConfig={reportConfig}
            onReorderColumns={handleReorderColumns}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;