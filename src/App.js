import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDataQuery, useConfig } from '@dhis2/app-runtime';
import ConfigPanel from './components/configPanel/ConfigPanel';
import ReportPreview from './components/ReportPreview/ReportPreview';
import FontStyleControls from './components/visual_customazation/font_style_control';
import ColorThemeSelector from './components/visual_customazation/color_theming';
import ConditionalFormatting from './components/visual_customazation/formating';
import ChartIntegration from './components/visual_customazation/charts';
import './App.css';

const App = () => {
  const { baseUrl } = useConfig();
  const [reportConfig, setReportConfig] = useState({
    title: '',
    subtitle: '',
    logo: null,
    date: new Date().toLocaleDateString(),
    facility: '',
    period: '',
    data: {},
    orgUnit: null,
    periodSelection: null,
    columns: [],
    items: []
  });

  // we are handling Visual customization states here
  const [styleSettings, setStyleSettings] = useState({
    fontSize: '14px',
    fontFamily: 'Arial',
    fontWeight: 'normal'
  });
  
  const [colorTheme, setColorTheme] = useState({
    primary: '#2196F3',
    secondary: '#FF9800',
    background: '#FFFFFF',
    text: '#333333'
  });
  
  const [formatRules, setFormatRules] = useState([]);
  const [chartSettings, setChartSettings] = useState({});
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'style', 'format', 'charts'

  // Data fetching logic[ichis]
  const { data: metadata, loading: metadataLoading } = useDataQuery({
    orgUnits: {
      resource: 'organisationUnits',
      params: {
        paging: false,
        fields: 'id,displayName,level',
        level: 3
      }
    },
    systemSettings: {
      resource: 'systemSettings',
      params: {
        key: ['applicationTitle']
      }
    },
    user: {
      resource: 'me',
      params: {
        fields: 'organisationUnits[id,displayName]'
      }
    }
  });

  // we are Updating report configuration with visual settings here
  const updateReportConfig = (newConfig) => {
    setReportConfig({
      ...reportConfig,
      ...newConfig,
      visualSettings: {
        style: styleSettings,
        theme: colorTheme,
        formatting: formatRules,
        charts: chartSettings
      }
    });
  };

  //we are also Handling style changes here
  const handleStyleChange = (newStyles) => {
    setStyleSettings(newStyles);
    updateReportConfig({ ...reportConfig });
  };

  //we are Handling theme changes here
  const handleThemeChange = (newTheme) => {
    setColorTheme(newTheme);
    updateReportConfig({ ...reportConfig });
  };

  // we are Handling formatting rule changes here
  const handleFormatChange = (newRules) => {
    setFormatRules(newRules);
    updateReportConfig({ ...reportConfig });
  };

  //we are Handling chart settings changes here
  const handleChartChange = (newChartSettings) => {
    setChartSettings(newChartSettings);
    updateReportConfig({ ...reportConfig });
  };

  //we are Exporting report function here
  const exportReport = () => {
    //and also the Implementation for exporting the report (PDF, Excel) its hwe
    console.log('Exporting report with settings:', {
      reportConfig,
      style: styleSettings,
      theme: colorTheme,
      formatting: formatRules,
      chart: chartSettings
    });
    alert('Report export functionality to be implemented');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container" style={styles.container}>
        <div className="config-side-panel" style={styles.sidePanel}>
          <div className="tab-navigation" style={styles.tabNavigation}>
            <button 
              style={{
                ...styles.tabButton, 
                ...(activeTab === 'content' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button 
              style={{
                ...styles.tabButton, 
                ...(activeTab === 'style' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('style')}
            >
              Styling
            </button>
            <button 
              style={{
                ...styles.tabButton, 
                ...(activeTab === 'format' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('format')}
            >
              Formatting
            </button>
            <button 
              style={{
                ...styles.tabButton, 
                ...(activeTab === 'charts' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('charts')}
            >
              Charts
            </button>
          </div>
          
          <div className="tab-content" style={styles.tabContent}>
            {activeTab === 'content' && (
              <ConfigPanel 
                reportConfig={reportConfig}
                setReportConfig={updateReportConfig}
                metadata={metadata}
                loading={metadataLoading}
              />
            )}
            
            {activeTab === 'style' && (
              <div className="style-customization" style={styles.configContent}>
                <h3 style={styles.sectionTitle}>Font & Style Settings</h3>
                <FontStyleControls onStyleChange={handleStyleChange} />
                
                <h3 style={styles.sectionTitle}>Color Theme</h3>
                <ColorThemeSelector onThemeChange={handleThemeChange} />
              </div>
            )}
            
            {activeTab === 'format' && (
              <div className="formatting-customization" style={styles.configContent}>
                <h3 style={styles.sectionTitle}>Conditional Formatting</h3>
                <ConditionalFormatting onFormatChange={handleFormatChange} />
              </div>
            )}
            
            {activeTab === 'charts' && (
              <div className="chart-customization" style={styles.configContent}>
                <h3 style={styles.sectionTitle}>Chart Integration</h3>
                <ChartIntegration 
                  data={reportConfig.data} 
                  onChartChange={handleChartChange} 
                />
              </div>
            )}
            
            <div className="export-actions" style={styles.buttonGroup}>
              <button 
                onClick={exportReport}
                style={styles.exportButton}
              >
                Export Report
              </button>
            </div>
          </div>
        </div>
        
        <div className="report-preview-container" style={styles.reportPreview}>
          <ReportPreview 
            reportConfig={{
              ...reportConfig,
              styleSettings,
              colorTheme,
              formatRules,
              chartSettings
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
    fontFamily: 'Roboto, sans-serif',
    color: '#333',
  },
  sidePanel: {
    width: '350px',
    backgroundColor: '#ffffff',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '0 8px 8px 0',
  },
  tabNavigation: {
    display: 'flex',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f7f9fc',
  },
  tabButton: {
    flex: 1,
    padding: '14px 8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    color: '#6e6e6e',
    outline: 'none',
  },
  activeTab: {
    borderBottom: '3px solid #2196F3',
    color: '#2196F3',
    backgroundColor: '#ffffff',
  },
  tabContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 0 20px 0',
  },
  configContent: {
    padding: '16px 20px',
  },
  sectionTitle: {
    margin: '20px 0 12px 0',
    color: '#212934',
    fontSize: '16px',
    fontWeight: '600',
    borderBottom: '1px solid #eee',
    paddingBottom: '8px',
  },
  buttonGroup: {
    margin: '10px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  exportButton: {
    padding: '12px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
  },
  reportPreview: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f5f5f5',
    overflowY: 'auto',
    display: 'flex',
    justifyContent: 'center',
  },
  printableArea: {
    width: '210mm',
    minHeight: '297mm',
    backgroundColor: 'white',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    padding: '20mm',
    margin: '0 auto',
    borderRadius: '4px',
  },
};

export default App;