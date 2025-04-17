import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useMetadata } from '../../services/api';
import { 
  Box, 
  Typography,
  Button
} from '@mui/material';
import './ConfigPanel.css';

// Draggable Column Item Component
const DraggableColumn = ({ column, index, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN',
    item: { id: column.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div 
      ref={drag}
      className={`draggable-column ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="column-name">{column.displayName}</span>
      <span className="column-type">{column.valueType}</span>
    </div>
  );
};

// Droppable Area Component
const DroppableArea = ({ children, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'COLUMN',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop}
      className={`droppable-area ${isOver ? 'over' : ''}`}
    >
      {children}
    </div>
  );
};

const ConfigPanel = ({ 
  reportConfig, 
  setReportConfig, 
  metadata, 
  loading,
  availableColumns,
  onAddColumn,
  onRemoveColumn,
  onReorderColumns,
  generatePeriods,
  activeTab
}) => {
  const [selectedPeriodType, setSelectedPeriodType] = useState('MONTHLY');
  const [periods, setPeriods] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    design: true,
    orgUnits: false,
    periods: false,
    programs: false,
    dataElements: false
  });

  useEffect(() => {
    if (selectedPeriodType) {
      setPeriods(generatePeriods(selectedPeriodType));
    }
  }, [selectedPeriodType]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleTitleChange = (e) => {
    setReportConfig({
      ...reportConfig,
      title: e.target.value
    });
  };

  const handleSubtitleChange = (e) => {
    setReportConfig({
      ...reportConfig,
      subtitle: e.target.value
    });
  };

  const handleOrgUnitChange = (e) => {
    const selectedOrgUnit = metadata?.orgUnits?.organisationUnits.find(
      unit => unit.id === e.target.value
    );
    
    setReportConfig({
      ...reportConfig,
      orgUnit: selectedOrgUnit ? {
        id: selectedOrgUnit.id,
        name: selectedOrgUnit.displayName
      } : null
    });
  };

  const handlePeriodChange = (e) => {
    const selectedPeriod = periods.find(
      period => period.id === e.target.value
    );
    
    setReportConfig({
      ...reportConfig,
      period: selectedPeriod ? {
        id: selectedPeriod.id,
        name: selectedPeriod.name
      } : ''
    });
  };

  const handleProgramChange = (e) => {
    setReportConfig({
      ...reportConfig,
      programId: e.target.value,
      selectedColumns: [] // Reset columns when program changes
    });
  };

  const handleDrop = (column) => {
    onAddColumn(column);
  };

  const handleRemoveSelectedColumn = (columnId) => {
    onRemoveColumn(columnId);
  };

  const handlePageSizeChange = (e) => {
    setReportConfig({
      ...reportConfig,
      pageSize: e.target.value
    });
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

  const handleOrientationChange = (e) => {
    setReportConfig({
      ...reportConfig,
      orientation: e.target.value
    });
  };

  if (loading) {
    return <div className="config-panel loading">Loading configuration...</div>;
  }

  return (
    <div className={`config-panel ${activeTab === 'preview' ? 'hidden' : ''}`}>
      {activeTab === 'design' && (
        <div className="config-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('design')}
          >
            <h3>Report Design</h3>
            <span className={`arrow ${expandedSections.design ? 'down' : 'right'}`}></span>
          </div>
          
          {expandedSections.design && (
            <div className="section-content">
              <div className="form-group">
                <label htmlFor="reportTitle">Report Title</label>
                <input
                  id="reportTitle"
                  type="text"
                  value={reportConfig.title}
                  onChange={handleTitleChange}
                  placeholder="Enter report title"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reportSubtitle">Report Subtitle</label>
                <input
                  id="reportSubtitle"
                  type="text"
                  value={reportConfig.subtitle}
                  onChange={handleSubtitleChange}
                  placeholder="Enter report subtitle"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pageSize">Page Size</label>
                <select
                  id="pageSize"
                  value={reportConfig.pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                  <option value="A3">A3</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="orientation">Orientation</label>
                <select
                  id="orientation"
                  value={reportConfig.orientation}
                  onChange={handleOrientationChange}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

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
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'data' && (
        <>
          <div className="config-section">
            <div 
              className="section-header" 
              onClick={() => toggleSection('orgUnits')}
            >
              <h3>Organization Units</h3>
              <span className={`arrow ${expandedSections.orgUnits ? 'down' : 'right'}`}></span>
            </div>
            
            {expandedSections.orgUnits && (
              <div className="section-content">
                <div className="form-group">
                  <label htmlFor="orgUnit">Select Organization Unit</label>
                  <select
                    id="orgUnit"
                    value={reportConfig.orgUnit?.id || ''}
                    onChange={handleOrgUnitChange}
                  >
                    <option value="">Select an Organization Unit</option>
                    {metadata?.orgUnits?.organisationUnits.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          
          <div className="config-section">
            <div 
              className="section-header" 
              onClick={() => toggleSection('periods')}
            >
              <h3>Period Selection</h3>
              <span className={`arrow ${expandedSections.periods ? 'down' : 'right'}`}></span>
            </div>
            
            {expandedSections.periods && (
              <div className="section-content">
                <div className="form-group">
                  <label htmlFor="periodType">Period Type</label>
                  <select
                    id="periodType"
                    value={selectedPeriodType}
                    onChange={(e) => setSelectedPeriodType(e.target.value)}
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="period">Select Period</label>
                  <select
                    id="period"
                    value={reportConfig.period?.id || ''}
                    onChange={handlePeriodChange}
                  >
                    <option value="">Select a Period</option>
                    {periods.map(period => (
                      <option key={period.id} value={period.id}>
                        {period.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          
          <div className="config-section">
            <div 
              className="section-header" 
              onClick={() => toggleSection('programs')}
            >
              <h3>Program Selection</h3>
              <span className={`arrow ${expandedSections.programs ? 'down' : 'right'}`}></span>
            </div>
            
            {expandedSections.programs && (
              <div className="section-content">
                <div className="form-group">
                  <label htmlFor="program">Select Program</label>
                  <select
                    id="program"
                    value={reportConfig.programId || ''}
                    onChange={handleProgramChange}
                  >
                    <option value="">Select a Program</option>
                    {metadata?.programs?.programs.map(program => (
                      <option key={program.id} value={program.id}>
                        {program.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          
          <div className="config-section">
            <div 
              className="section-header" 
              onClick={() => toggleSection('dataElements')}
            >
              <h3>Data Elements</h3>
              <span className={`arrow ${expandedSections.dataElements ? 'down' : 'right'}`}></span>
            </div>
            
            {expandedSections.dataElements && (
              <div className="section-content">
                <div className="elements-container">
                  <div className="available-elements">
                    <h4>Available Elements</h4>
                    <div className="search-box">
                      <input 
                        type="text" 
                        placeholder="Search elements..." 
                      />
                    </div>
                    <div className="elements-list">
                      {availableColumns.map((column, index) => (
                        <DraggableColumn 
                          key={column.id} 
                          column={column}
                          index={index}
                        />
                      ))}
                      
                      {availableColumns.length === 0 && reportConfig.programId && (
                        <p className="no-elements">No data elements found for this program.</p>
                      )}
                      
                      {!reportConfig.programId && (
                        <p className="no-elements">Please select a program first.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="selected-elements">
                    <h4>Selected Columns</h4>
                    <DroppableArea onDrop={handleDrop}>
                      {reportConfig.selectedColumns.length === 0 ? (
                        <p className="drag-placeholder">Drag elements here to add columns to your report</p>
                      ) : (
                        <div className="selected-columns-list">
                          {reportConfig.selectedColumns.map((column, index) => (
                            <div key={column.id} className="selected-column">
                              <span className="handle">≡</span>
                              <span className="column-name">{column.displayName}</span>
                              <button 
                                className="remove-button"
                                onClick={() => handleRemoveSelectedColumn(column.id)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </DroppableArea>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ConfigPanel;