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
        const columnIndex = Math.floor(relativeX / 150);
        if (columnIndex >= 2) {
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
      isOver: !!monitor.isOver(),
    }),
  }));

  const columns = reportConfig.columns || [
    { id: 'period', name: 'Period', type: 'system' },
    { id: 'orgUnit', name: 'Facility', type: 'system' },
  ];

  const periods = Array.isArray(reportConfig.periods)
    ? reportConfig.periods
    : reportConfig.periods
    ? [reportConfig.periods]
    : [{ id: '2023Q1', name: '2023 Q1' }, { id: '2023Q2', name: '2023 Q2' }];

  const orgUnits = Array.isArray(reportConfig.orgUnits)
    ? reportConfig.orgUnits
    : reportConfig.orgUnits
    ? [reportConfig.orgUnits]
    : [{ id: 'facilityA', name: 'Facility A' }, { id: 'facilityB', name: 'Facility B' }];

  return (
    <div className="report-preview">
      <div
        ref={drop}
        className="printable-area"
        style={{
          border: isOver ? '2px dashed #0064d5' : 'none',
          padding: '10px',
        }}
      >
        <ReportHeader
          title={reportConfig.title || 'DHIS2 Report 222'}
          subtitle={reportConfig.subtitle || ''}
          facility={reportConfig.facility || ''}
          date={reportConfig.date || new Date().toLocaleDateString()}
          period={periods.map(p => p.name || p.id).join(', ') || ''}
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
                <DataTableRow key={`${period.id}-${orgUnit.id}`}>
                  <DataTableCell>{period.name || period.id}</DataTableCell>
                  <DataTableCell>{orgUnit.name || orgUnit.id}</DataTableCell>
                  {columns.slice(2).map(column => {
                    const dataKey = `${column.id}-${period.id}-${orgUnit.id}`;
                    const cellData = reportConfig.data?.[dataKey];
                    return (
                      <DataTableCell
                        key={dataKey}
                        style={{
                          backgroundColor: cellData ? '#f0f7ff' : 'transparent',
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