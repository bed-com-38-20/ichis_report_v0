// import React, { useState } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { Button, InputField } from '@dhis2/ui';
// import DraggableItem from './DraggableItem';
// import DroppableTable from './DroppableTable';

// const DEFAULT_CONFIG = {
//   reportTitle: 'My Custom Report',
//   columns: ['Period', 'Organisation Unit'],
//   data: {}
// };

// const MOCK_INDICATORS = [
//   { id: 'ind1', name: 'ANC 1st Visit', type: 'indicator' },
//   { id: 'ind2', name: 'ANC 4th Visit', type: 'indicator' },
//   { id: 'ind3', name: 'Delivery at Facility', type: 'indicator' }
// ];

// const MOCK_DATA_ELEMENTS = [
//   { id: 'de1', name: 'BCG Doses', type: 'dataElement' },
//   { id: 'de2', name: 'Measles Doses', type: 'dataElement' },
//   { id: 'de3', name: 'OPV Doses', type: 'dataElement' }
// ];

// const MOCK_ORG_UNITS = [
//   { id: 'ou1', displayName: 'Facility A' },
//   { id: 'ou2', displayName: 'Facility B' },
//   { id: 'ou3', displayName: 'Facility C' }
// ];

// const MOCK_PERIODS = [
//   { id: '2023Q1', displayName: '2023 Q1' },
//   { id: '2023Q2', displayName: '2023 Q2' },
//   { id: '2023Q3', displayName: '2023 Q3' }
// ];

// const App = () => {
//   const [tableConfig, setTableConfig] = useState(DEFAULT_CONFIG);
//   const [items] = useState([...MOCK_INDICATORS, ...MOCK_DATA_ELEMENTS]);
//   const [orgUnits] = useState(MOCK_ORG_UNITS);
//   const [periods] = useState(MOCK_PERIODS);

//   const handleSave = () => {
//     console.log('Report configuration:', tableConfig);
//     alert('Report saved! (Check console for data)');
//   };

//   const handleTitleChange = (newTitle) => {
//     setTableConfig(prev => ({
//       ...prev,
//       reportTitle: newTitle
//     }));
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div style={styles.container}>
//         {/* Report Header Section */}
//         <div style={styles.headerSection}>
//           <InputField
//             label="Report Title"
//             value={tableConfig.reportTitle}
//             onChange={({ value }) => handleTitleChange(value)}
//             style={styles.titleInput}
//           />
//         </div>
        
//         <div style={styles.mainLayout}>
//           {/* Left sidebar */}
//           <div style={styles.sidebar}>
//             <div style={styles.sidebarHeader}>
//               <h2 style={styles.sidebarTitle}>Available Items</h2>
//               <Button 
//                 onClick={handleSave} 
//                 primary 
//                 style={styles.saveButton}
//               >
//                 Save Report
//               </Button>
//             </div>
            
//             <div style={styles.section}>
//               <h3 style={styles.sectionTitle}>Indicators</h3>
//               <div style={styles.itemsContainer}>
//                 {items.filter(i => i.type === 'indicator').map(item => (
//                   <DraggableItem key={`ind-${item.id}`} item={item} />
//                 ))}
//               </div>
//             </div>
            
//             <div style={styles.section}>
//               <h3 style={styles.sectionTitle}>Data Elements</h3>
//               <div style={styles.itemsContainer}>
//                 {items.filter(i => i.type === 'dataElement').map(item => (
//                   <DraggableItem key={`de-${item.id}`} item={item} />
//                 ))}
//               </div>
//             </div>
//           </div>
          
//           {/* Main table area */}
//           <div style={styles.mainContent}>
//             <h2 style={styles.tableTitle}>{tableConfig.reportTitle}</h2>
//             <p style={styles.tableDescription}>
//               Drag items from the left to add columns or cells. Drag column headers to reorder.
//             </p>
            
//             <DroppableTable 
//               config={tableConfig}
//               orgUnits={orgUnits}
//               periods={periods}
//               onConfigChange={setTableConfig}
//             />
//           </div>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     minHeight: '100vh',
//     backgroundColor: '#f8f9fa'
//   },
//   headerSection: {
//     padding: '16px 24px',
//     backgroundColor: 'white',
//     borderBottom: '1px solid #e0e0e0',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//   },
//   titleInput: {
//     width: '100%',
//     maxWidth: '600px',
//     fontSize: '18px',
//     fontWeight: '500'
//   },
//   mainLayout: {
//     display: 'grid',
//     gridTemplateColumns: '300px 1fr',
//     gap: '24px',
//     padding: '24px',
//     flex: 1
//   },
//   sidebar: {
//     backgroundColor: 'white',
//     borderRadius: '8px',
//     padding: '20px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//   },
//   sidebarHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '24px',
//     paddingBottom: '16px',
//     borderBottom: '1px solid #e9ecef'
//   },
//   sidebarTitle: {
//     margin: 0,
//     fontSize: '18px',
//     fontWeight: '600',
//     color: '#212529'
//   },
//   saveButton: {
//     fontWeight: '500'
//   },
//   section: {
//     marginBottom: '24px'
//   },
//   sectionTitle: {
//     margin: '0 0 12px 0',
//     fontSize: '15px',
//     fontWeight: '500',
//     color: '#495057',
//     paddingBottom: '8px',
//     borderBottom: '1px solid #e9ecef'
//   },
//   itemsContainer: {
//     maxHeight: '300px',
//     overflowY: 'auto',
//     paddingRight: '4px'
//   },
//   mainContent: {
//     backgroundColor: 'white',
//     borderRadius: '8px',
//     padding: '24px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//   },
//   tableTitle: {
//     margin: '0 0 12px 0',
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#212529'
//   },
//   tableDescription: {
//     color: '#6c757d',
//     marginBottom: '24px',
//     fontSize: '14px'
//   }
// };

// export default App;


import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, InputField, Card } from '@dhis2/ui';
import ReportHeader from './ReportHeader';
import StockManagementTable from './StockManagementTable';
import  ItemPanel  from './ItemPanel';
import './print.css';

const DEFAULT_REPORT = {
  title: "ICHIS Demo (ICT Projects)",
  subtitle: "Stock Management Report",
  logo: null,
  date: new Date().toLocaleDateString(),
  facility: "Health Facility Name",
  period: "Monthly Report - " + new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' }),
  columns: [
    "Number of Drug/Supply",
    "Unit of Issue",
    "(A) Quantity on hand at the beginning of the month",
    "(B) Quantity dispensed",
    "(C) Losses",
    "(D) Adjustment",
    "(E) Quantity received",
    "(F) New stock on hand",
    "(G) No. of days out of stock in the month",
    "(H) Did the Stock out last 7 continuous days or more (7 or N)"
  ],
  items: [
    { id: 'item1', name: 'LA 6-1', unit: 'Tablet' },
    { id: 'item2', name: 'LA 6-2', unit: 'Tablet' },
    { id: 'item3', name: 'Recall Attesturele', unit: 'Supp.' },
    { id: 'item4', name: 'RDT', unit: 'Kits' },
    { id: 'item5', name: 'Paracetamol', unit: 'Tablet' },
    { id: 'item6', name: 'ORS', unit: 'Sachet' },
    { id: 'item7', name: 'Zinc', unit: 'Tablet' },
    { id: 'item8', name: 'Amoxicillin', unit: 'Tablets' },
    { id: 'item9', name: 'Eye ointment', unit: 'Tube' },
    { id: 'item10', name: 'Glove disposable', unit: 'Pair' }
  ],
  data: {}
};

const App = () => {
  const [reportConfig, setReportConfig] = useState(DEFAULT_REPORT);
  const [logoPreview, setLogoPreview] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  // Fixed handlers for DHIS2 InputField components
  const handleTitleChange = ({ value }) => {
    setReportConfig(prev => ({ ...prev, title: value }));
  };

  const handleSubtitleChange = ({ value }) => {
    setReportConfig(prev => ({ ...prev, subtitle: value }));
  };

  const handleFacilityChange = ({ value }) => {
    setReportConfig(prev => ({ ...prev, facility: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setReportConfig(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCellValueChange = (itemId, columnId, value) => {
    setReportConfig(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [`${itemId}-${columnId}`]: value
      }
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={styles.appContainer}>
        {/* Configuration Panel */}
        <div style={styles.configPanel} className="no-print">
          <Card>
            <div style={styles.configContent}>
              <h3>Report Configuration</h3>
              
              <InputField
                label="Report Title"
                value={reportConfig.title}
                onChange={handleTitleChange}
                style={styles.inputField}
              />

              <InputField
                label="Report Subtitle"
                value={reportConfig.subtitle}
                onChange={handleSubtitleChange}
                style={styles.inputField}
              />

              <InputField
                label="Facility Name"
                value={reportConfig.facility}
                onChange={handleFacilityChange}
                style={styles.inputField}
              />

              <div style={styles.logoUpload}>
                <label style={styles.uploadLabel}>
                  Upload Logo
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {logoPreview && (
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    style={styles.logoPreview}
                  />
                )}
              </div>

              <div style={styles.buttonGroup}>
                <Button primary onClick={handlePrint}>
                  Print Report
                </Button>
              </div>
            </div>
          </Card>

          <ItemPanel />
        </div>

        {/* Report Preview */}
        <div style={styles.reportPreview}>
          <div className="printable-area" style={styles.printableArea}>
            <ReportHeader 
              title={reportConfig.title}
              subtitle={reportConfig.subtitle}
              facility={reportConfig.facility}
              date={reportConfig.date}
              logo={logoPreview}
            />
            <StockManagementTable 
              config={reportConfig}
              onCellValueChange={handleCellValueChange}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  configPanel: {
    width: '350px',
    padding: '16px',
    backgroundColor: '#fff',
    borderRight: '1px solid #e0e0e0',
    overflowY: 'auto'
  },
  configContent: {
    padding: '16px'
  },
  inputField: {
    marginBottom: '16px'
  },
  logoUpload: {
    margin: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  uploadLabel: {
    padding: '8px 12px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center'
  },
  logoPreview: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    border: '1px solid #ddd'
  },
  buttonGroup: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  reportPreview: {
    flex: 1,
    padding: '24px',
    backgroundColor: '#f9f9f9',
    overflowY: 'auto'
  },
  printableArea: {
    width: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    padding: '20mm',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  }
};

export default App;