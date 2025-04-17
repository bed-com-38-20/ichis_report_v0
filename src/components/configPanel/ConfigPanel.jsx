// import React from 'react';
// import { Card } from '@dhis2/ui';
// import OrgUnitSelector from "./OrgUnitSelector";
// import PeriodSelector from './PeriodSelector';
// import ReportConfigForm from './ReportConfigForm';
// import './ConfigPanel.css'

// const ConfigPanel = ({ reportConfig, setReportConfig, metadata, loading }) => {
//   return (
//     <div className="config-panel">
//       <Card>
//         <div className="config-content">
//           <h3>DHIS2 Integration</h3>
          
//           <OrgUnitSelector 
//             reportConfig={reportConfig}
//             setReportConfig={setReportConfig}
//             metadata={metadata}
//             loading={loading}
//           />

//           <PeriodSelector 
//             reportConfig={reportConfig}
//             setReportConfig={setReportConfig}
//           />

//           <ReportConfigForm 
//             reportConfig={reportConfig}
//             setReportConfig={setReportConfig}
//           />
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default ConfigPanel;

import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import LayoutControls from './LayoutControls';
import ItemLibrary from '../items/ItemLibrary';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ height: '100%', overflowY: 'auto' }}
    >
      {value === index && (
        <Box sx={{ p: 2, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ConfigPanel = ({ reportConfig, setReportConfig, metadata, loading }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReportConfig({
          ...reportConfig,
          logo: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field) => (event) => {
    setReportConfig({
      ...reportConfig,
      [field]: event.target.value
    });
  };

  const handleOrgUnitChange = (event) => {
    const selectedOrgUnitId = event.target.value;
    const selectedOrgUnit = metadata?.orgUnits?.organisationUnits.find(
      unit => unit.id === selectedOrgUnitId
    );
    
    setReportConfig({
      ...reportConfig,
      orgUnit: selectedOrgUnitId,
      facility: selectedOrgUnit?.displayName || ''
    });
  };

  const handlePeriodChange = (event) => {
    setReportConfig({
      ...reportConfig,
      periodSelection: event.target.value,
      period: event.target.value // For display purposes
    });
  };

  // General Settings Tab
  const renderGeneralTab = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Report Title"
        variant="outlined"
        fullWidth
        value={reportConfig.title}
        onChange={handleChange('title')}
      />
      
      <TextField
        label="Subtitle"
        variant="outlined"
        fullWidth
        value={reportConfig.subtitle}
        onChange={handleChange('subtitle')}
      />
      
      <Box>
        <Typography variant="subtitle2" gutterBottom>Logo</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {reportConfig.logo && (
            <img 
              src={reportConfig.logo} 
              alt="Logo preview" 
              style={{ height: '40px', maxWidth: '80px' }} 
            />
          )}
          <Button
            variant="outlined"
            component="label"
            size="small"
          >
            {reportConfig.logo ? 'Change Logo' : 'Upload Logo'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </Button>
          {reportConfig.logo && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setReportConfig({...reportConfig, logo: null})}
            >
              Remove
            </Button>
          )}
        </Box>
      </Box>
      
      <FormControl fullWidth>
        <InputLabel>Organization Unit</InputLabel>
        <Select
          value={reportConfig.orgUnit || ''}
          label="Organization Unit"
          onChange={handleOrgUnitChange}
          disabled={loading}
        >
          {loading ? (
            <MenuItem value="">
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            metadata?.orgUnits?.organisationUnits.map(unit => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.displayName}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
      
      <FormControl fullWidth>
        <InputLabel>Reporting Period</InputLabel>
        <Select
          value={reportConfig.periodSelection || ''}
          label="Reporting Period"
          onChange={handlePeriodChange}
        >
          <MenuItem value="Jan-Mar 2025">Jan-Mar 2025</MenuItem>
          <MenuItem value="Apr-Jun 2025">Apr-Jun 2025</MenuItem>
          <MenuItem value="Jul-Sep 2025">Jul-Sep 2025</MenuItem>
          <MenuItem value="Oct-Dec 2025">Oct-Dec 2025</MenuItem>
          <MenuItem value="Annual 2025">Annual 2025</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        width: '350px', 
        height: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        borderRight: '1px solid #e0e0e0',
        backgroundColor: '#ffffff'
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<SettingsIcon />} label="General" />
          <Tab icon={<ViewQuiltIcon />} label="Layout" />
          <Tab icon={<ViewModuleIcon />} label="Items" />
          <Tab icon={<DataObjectIcon />} label="Data" />
        </Tabs>
      </Box>
      
      <TabPanel value={activeTab} index={0}>
        {renderGeneralTab()}
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        <LayoutControls reportConfig={reportConfig} setReportConfig={setReportConfig} />
      </TabPanel>
      
      <TabPanel value={activeTab} index={2}>
        <ItemLibrary />
      </TabPanel>
      
      <TabPanel value={activeTab} index={3}>
        <Typography variant="h6" gutterBottom>Data Configuration</Typography>
        <Typography variant="body2" color="textSecondary">
          Configure the data elements and indicators to display in your report.
        </Typography>
        {/* Data configuration components will be added here */}
      </TabPanel>
    </Box>
  );
};

export default ConfigPanel;