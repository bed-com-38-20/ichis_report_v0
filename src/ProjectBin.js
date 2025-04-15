// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { Button, InputField, Card } from '@dhis2/ui';
// import ReportHeader from './ReportHeader';
// import StockManagementTable from './StockManagementTable';
// import ItemPanel from './ItemPanel';
// import './print.css';

// const DEFAULT_REPORT = {
//   title: "ICHIS Demo (ICT Projects)",
//   subtitle: "Stock Management Report",
//   logo: null,
//   date: new Date().toLocaleDateString(),
//   facility: "Health Facility Name",
//   period: "Monthly Report - " + new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' }),
//   columns: [
//     "Number of Drug/Supply",
//     "Unit of Issue",
//     "(A) Quantity on hand at the beginning of the month",
//     "(B) Quantity dispensed",
//     "(C) Losses",
//     "(D) Adjustment",
//     "(E) Quantity received",
//     "(F) New stock on hand",
//     "(G) No. of days out of stock in the month",
//     "(H) Did the Stock out last 7 continuous days or more (7 or N)"
//   ],
//   items: [
//     { id: 'item1', name: 'LA 6-1', unit: 'Tablet' },
//     { id: 'item2', name: 'LA 6-2', unit: 'Tablet' },
//     { id: 'item3', name: 'Recall Attesturele', unit: 'Supp.' },
//     { id: 'item4', name: 'RDT', unit: 'Kits' },
//     { id: 'item5', name: 'Paracetamol', unit: 'Tablet' },
//     { id: 'item6', name: 'ORS', unit: 'Sachet' },
//     { id: 'item7', name: 'Zinc', unit: 'Tablet' },
//     { id: 'item8', name: 'Amoxicillin', unit: 'Tablets' },
//     { id: 'item9', name: 'Eye ointment', unit: 'Tube' },
//     { id: 'item10', name: 'Glove disposable', unit: 'Pair' }
//   ],
//   data: {}
// };

// const App = () => {
//   const [reportConfig, setReportConfig] = useState(DEFAULT_REPORT);
//   const [logoPreview, setLogoPreview] = useState(null);

//   const handlePrint = () => {
//     window.print();
//   };

//   // Fixed handlers for DHIS2 InputField components
//   const handleTitleChange = ({ value }) => {
//     setReportConfig(prev => ({ ...prev, title: value }));
//   };

//   const handleSubtitleChange = ({ value }) => {
//     setReportConfig(prev => ({ ...prev, subtitle: value }));
//   };

//   const handleFacilityChange = ({ value }) => {
//     setReportConfig(prev => ({ ...prev, facility: value }));
//   };

//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setLogoPreview(reader.result);
//         setReportConfig(prev => ({ ...prev, logo: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCellValueChange = (itemId, columnId, value) => {
//     setReportConfig(prev => ({
//       ...prev,
//       data: {
//         ...prev.data,
//         [`${itemId}-${columnId}`]: value
//       }
//     }));
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div style={styles.appContainer}>
//         {/* Configuration Panel */}
//         <div style={styles.configPanel} className="no-print">
//           <Card>
//             <div style={styles.configContent}>
//               <h3>Report Configuration</h3>
              
//               <InputField
//                 label="Report Title"
//                 value={reportConfig.title}
//                 onChange={handleTitleChange}
//                 style={styles.inputField}
//               />

//               <InputField
//                 label="Report Subtitle"
//                 value={reportConfig.subtitle}
//                 onChange={handleSubtitleChange}
//                 style={styles.inputField}
//               />

//               <InputField
//                 label="Facility Name"
//                 value={reportConfig.facility}
//                 onChange={handleFacilityChange}
//                 style={styles.inputField}
//               />

//               <div style={styles.logoUpload}>
//                 <label style={styles.uploadLabel}>
//                   Upload Logo
//                   <input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={handleLogoUpload}
//                     style={{ display: 'none' }}
//                   />
//                 </label>
//                 {logoPreview && (
//                   <img 
//                     src={logoPreview} 
//                     alt="Logo Preview" 
//                     style={styles.logoPreview}
//                   />
//                 )}
//               </div>

//               <div style={styles.buttonGroup}>
//                 <Button primary onClick={handlePrint}>
//                   Print Report
//                 </Button>
//               </div>
//             </div>
//           </Card>

//           <ItemPanel />
//         </div>

//         {/* Report Preview */}
//         <div style={styles.reportPreview}>
//           <div className="printable-area" style={styles.printableArea}>
//             <ReportHeader 
//               title={reportConfig.title}
//               subtitle={reportConfig.subtitle}
//               facility={reportConfig.facility}
//               date={reportConfig.date}
//               logo={logoPreview}
//             />
//             <StockManagementTable 
//               config={reportConfig}
//               onCellValueChange={handleCellValueChange}
//             />
//           </div>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// const styles = {
//   appContainer: {
//     display: 'flex',
//     minHeight: '100vh',
//     backgroundColor: '#f0f2f5'
//   },
//   configPanel: {
//     width: '350px',
//     padding: '16px',
//     backgroundColor: '#fff',
//     borderRight: '1px solid #e0e0e0',
//     overflowY: 'auto'
//   },
//   configContent: {
//     padding: '16px'
//   },
//   inputField: {
//     marginBottom: '16px'
//   },
//   logoUpload: {
//     margin: '16px 0',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px'
//   },
//   uploadLabel: {
//     padding: '8px 12px',
//     backgroundColor: '#f0f0f0',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     textAlign: 'center'
//   },
//   logoPreview: {
//     width: '100px',
//     height: '100px',
//     objectFit: 'contain',
//     border: '1px solid #ddd'
//   },
//   buttonGroup: {
//     marginTop: '24px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px'
//   },
//   reportPreview: {
//     flex: 1,
//     padding: '24px',
//     backgroundColor: '#f9f9f9',
//     overflowY: 'auto'
//   },
//   printableArea: {
//     width: '210mm',
//     minHeight: '297mm',
//     margin: '0 auto',
//     padding: '20mm',
//     backgroundColor: 'white',
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)'
//   }
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Button, 
  InputField, 
  Card,
  AlertBar,
  CircularLoader,
  Layer
} from '@dhis2/ui';
import { AuthProvider, init, useDataQuery } from '@dhis2/app-runtime';
import ReportHeader from './ReportHeader';
import ReportBuilder from './ReportBuilder';
import StockManagementTable from './StockManagementTable';
import ItemPanel from './ItemPanel';
import ComponentsPanel from './ComponentsPanel';
import './print.css';

// Configuration for DHIS2 instance
const dhis2Config = {
  baseUrl: 'https://play.im.dhis2.org/stable-2-41-3-1/api',
  apiVersion: 41,
  auth: {
    username: 'admin',
    password: 'district'
  }
};

// Initialize DHIS2 app runtime
init({
  baseUrl: dhis2Config.baseUrl,
  apiVersion: dhis2Config.apiVersion
});

const DEFAULT_REPORT = {
  title: "ICHIS Demo (ICT Projects)",
  subtitle: "Stock Management Report",
  logo: null,
  date: new Date().toLocaleDateString(),
  facility: "Health Facility Name",
  period: "Monthly Report - " + new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' }),
  data: {}
};

// Wrapper component for DHIS2 auth
const DHIS2AppWrapper = ({ children }) => {
  const [initError, setInitError] = useState(null);

  return (
    <AuthProvider 
      config={{ 
        baseUrl: dhis2Config.baseUrl,
        auth: dhis2Config.auth
      }}
      onAuthError={error => setInitError(error)}
    >
      {initError ? (
        <Layer translucent>
          <AlertBar critical>
            Failed to authenticate: {initError.message}
          </AlertBar>
        </Layer>
      ) : (
        children
      )}
    </AuthProvider>
  );
};

// Data query component
const OrgUnitSelector = ({ onSelect }) => {
  const { loading, error, data } = useDataQuery({
    orgUnits: {
      resource: 'organisationUnits',
      params: {
        paging: false,
        fields: 'id,displayName,path',
        level: 3
      }
    }
  });

  if (loading) return <CircularLoader small />;
  if (error) return <AlertBar critical>{error.message}</AlertBar>;

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      {data.orgUnits.organisationUnits.map(ou => (
        <option key={ou.id} value={ou.id}>
          {ou.displayName}
        </option>
      ))}
    </select>
  );
};

const App = () => {
  const [reportConfig, setReportConfig] = useState(DEFAULT_REPORT);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedOrgUnit, setSelectedOrgUnit] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Example of fetching actual data from DHIS2
  const fetchReportData = async () => {
    setIsLoadingData(true);
    try {
      // This would be replaced with your actual data query
      const response = await fetch(
        `${dhis2Config.baseUrl}/dataValueSets?orgUnit=${selectedOrgUnit}&period=2023`
      );
      const data = await response.json();
      setReportConfig(prev => ({
        ...prev,
        data: transformDHIS2Data(data) // You'd implement this
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (selectedOrgUnit) {
      fetchReportData();
    }
  }, [selectedOrgUnit]);

  const handlePrint = () => {
    window.print();
  };

  // ... (keep all your existing handlers)

  return (
    <DHIS2AppWrapper>
      <DndProvider backend={HTML5Backend}>
        <div style={styles.container}>
          <div style={styles.sidePanel}>
            {/* Configuration Panel */}
            <div style={styles.configPanel} className="no-print">
              <Card>
                <div style={styles.configContent}>
                  <h3>DHIS2 Integration</h3>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label>Select Health Facility:</label>
                    <OrgUnitSelector onSelect={setSelectedOrgUnit} />
                  </div>

                  {isLoadingData && <CircularLoader small />}

                  <h3>Report Configuration</h3>
                  {/* Keep all your existing config inputs */}
                  <InputField
                    label="Report Title"
                    value={reportConfig.title}
                    onChange={handleTitleChange}
                    style={styles.inputField}
                  />
                  {/* ... other existing config inputs ... */}
                </div>
              </Card>
            </div>
            <ComponentsPanel />
          </div>

          {/* Report Preview */}
          <div style={styles.reportPreview}>
            <div className="printable-area" style={styles.printableArea}>
              <ReportHeader 
                title={reportConfig.title}
                subtitle={reportConfig.subtitle}
                facility={selectedOrgUnit || reportConfig.facility}
                date={reportConfig.date}
                logo={logoPreview}
              />
              {/* ... rest of your existing preview ... */}
            </div>
          </div>
        </div>
      </DndProvider>
    </DHIS2AppWrapper>
  );
};

// ... keep your existing styles ...

export default App;



 // "start": "d2-app-scripts start --allowJsxInJs --proxy https://project.ccdev.org/ictprojects",