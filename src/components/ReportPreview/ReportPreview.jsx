import React from 'react';
import { useDrop } from 'react-dnd';
import { DataTable, DataTableRow, DataTableCell, DataTableColumnHeader } from '@dhis2/ui';
import ReportHeader from '../ReportHeader/ReportHeader';
import './ReportPreview.css';

const ReportPreview = ({ reportConfig = {}, onAddColumn, onAddItem }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const tableElement = document.querySelector('.report-table');
      
      if (tableElement && offset) {
        const tableRect = tableElement.getBoundingClientRect();
        const relativeX = offset.x - tableRect.left;
        const columnIndex = Math.floor(relativeX / 150); // Approximate column width
        
        if (columnIndex >= 2) { // Skip system columns
          const columnId = reportConfig.columns?.[columnIndex]?.id;
          if (columnId) {
            onAddItem(item, `${columnId}-${Date.now()}`);
          }
        } else {
          onAddColumn(item);
        }
      } else {
        onAddColumn(item);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  // Safely get columns with default empty array
  const columns = reportConfig.columns || [
    { id: "period", name: "Period", type: "system" },
    { id: "orgUnit", name: "Facility", type: "system" }
  ];

  // Get periods and orgUnits from reportConfig
  const periods = reportConfig.periodSelection 
    ? [reportConfig.periodSelection] 
    : ['2023Q1', '2023Q2'];
  const orgUnits = reportConfig.orgUnit 
    ? [reportConfig.facility] 
    : ['Facility A', 'Facility B'];

  return (
    <div className="report-preview">
      <div 
        ref={drop}
        className="printable-area"
        style={{
          border: isOver ? '2px dashed #0064d5' : 'none',
          padding: '10px'
        }}
      >
        <ReportHeader
          title={reportConfig.titl || 'DHIS2 Report 222'}
          subtitle={reportConfig.subtitle || ''}
          facility={reportConfig.facility || ''}
          date={reportConfig.date || new Date().toLocaleDateString()}
          period={reportConfig.periodSelection || ''}
          logo={reportConfig.logo}
        />

        <div className="main-area">
          <DataTable className="report-table">
            <DataTableRow>
              {columns.map(column => (
                <DataTableColumnHeader key={column.id}>
                  {column.name}
                  {column.type !== 'system' && (
                    <div style={{ fontSize: '0.8em', color: '#666' }}>
                      {column.type}
                    </div>
                  )}
                </DataTableColumnHeader>
              ))}
            </DataTableRow>

            {periods.map(period => 
              orgUnits.map(orgUnit => (
                <DataTableRow key={`${period}-${orgUnit}`}>
                  <DataTableCell>{period}</DataTableCell>
                  <DataTableCell>{orgUnit}</DataTableCell>
                  {columns.slice(2).map(column => {
                    const dataKey = `${column.id}-${period}-${orgUnit}`;
                    const cellData = reportConfig.data?.[dataKey];
                    
                    return (
                      <DataTableCell 
                        key={dataKey}
                        style={{
                          backgroundColor: cellData ? '#f0f7ff' : 'transparent'
                        }}
                      >
                        {cellData?.name || '-'}
                      </DataTableCell>
                    );
                  })}
                </DataTableRow>
              ))
            )}
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;