import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './ReportPreview.css';

// Draggable Column Header Component
const DraggableColumnHeader = ({ column, index, onReorderColumns }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'HEADER',
    item: { id: column.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'HEADER',
    drop: (draggedItem) => {
      if (draggedItem.index !== index) {
        onReorderColumns(draggedItem.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <th 
      ref={(node) => drag(drop(node))}
      className={`table-header ${isDragging ? 'dragging' : ''} ${isOver ? 'over' : ''}`}
    >
      <div className="header-content">
        <span className="column-name">{column.displayName}</span>
        <span className="drag-handle">≡</span>
      </div>
    </th>
  );
};

const ReportPreview = ({ reportConfig, onReorderColumns }) => {
  // Generate sample data based on selected columns
  const generateSampleData = (columns, rowCount = 5) => {
    const sampleData = [];
    
    for (let i = 0; i < rowCount; i++) {
      const row = {};
      columns.forEach(column => {
        // Generate appropriate sample data based on value type
        switch (column.valueType) {
          case 'NUMBER':
            row[column.id] = Math.floor(Math.random() * 100);
            break;
          case 'INTEGER':
            row[column.id] = Math.floor(Math.random() * 100);
            break;
          case 'BOOLEAN':
            row[column.id] = Math.random() > 0.5 ? 'Yes' : 'No';
            break;
          case 'DATE':
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            row[column.id] = date.toLocaleDateString();
            break;
          case 'TEXT':
          default:
            row[column.id] = `Sample ${column.displayName} ${i+1}`;
            break;
        }
      });
      sampleData.push(row);
    }
    
    return sampleData;
  };

  const sampleData = generateSampleData(reportConfig.selectedColumns);

  return (
    <div className="report-preview">
      <div 
        id="report-preview" 
        className={`report-page ${reportConfig.pageSize.toLowerCase()} ${reportConfig.orientation}`}
      >
        <div className="report-header">
          <div className="logo-title-container">
            {reportConfig.logo && (
              <img 
                src={reportConfig.logo} 
                alt="Report Logo" 
                className="report-logo"
              />
            )}
            <div className="report-titles">
              <h1>{reportConfig.title}</h1>
              <h2>{reportConfig.subtitle}</h2>
            </div>
          </div>
          
          <div className="report-metadata">
            {reportConfig.orgUnit && (
              <div className="metadata-item">
                <span className="metadata-label">Organization Unit:</span>
                <span className="metadata-value">{reportConfig.orgUnit.name}</span>
              </div>
            )}
            
            {reportConfig.period && reportConfig.period.name && (
              <div className="metadata-item">
                <span className="metadata-label">Period:</span>
                <span className="metadata-value">{reportConfig.period.name}</span>
              </div>
            )}
            
            <div className="metadata-item">
              <span className="metadata-label">Date Generated:</span>
              <span className="metadata-value">{reportConfig.date}</span>
            </div>
          </div>
        </div>
        
        <div className="report-content">
          {reportConfig.selectedColumns.length > 0 ? (
            <table className="report-table">
              <thead>
                <tr>
                  {reportConfig.selectedColumns.map((column, index) => (
                    <DraggableColumnHeader 
                      key={column.id}
                      column={column}
                      index={index}
                      onReorderColumns={onReorderColumns}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {reportConfig.selectedColumns.map(column => (
                      <td key={column.id}>{row[column.id]}</td>
                    ))}
                  </tr>
                ))}
                
                {sampleData.length === 0 && (
                  <tr>
                    <td colSpan={reportConfig.selectedColumns.length} className="no-data">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="empty-report">
              <p>No columns selected. Please add columns to your report from the Data tab.</p>
            </div>
          )}
        </div>
        
        <div className="report-footer">
          <p>Generated by Community Health Register - DHIS2 Application</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;