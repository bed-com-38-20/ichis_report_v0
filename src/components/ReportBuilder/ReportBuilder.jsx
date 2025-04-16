import React from 'react';
import { useDrop } from 'react-dnd';
import { DataTable, DataTableRow, DataTableCell } from '@dhis2/ui';
import TableCellDropTarget from './TableCellDropTarget';
import './styles.css';

const ReportBuilder = ({ columns, items, onAddColumn, onAddItem }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['COLUMN', 'ITEM'],
    drop: (item, monitor) => {
      monitor.getItemType() === 'COLUMN' 
        ? onAddColumn(item) 
        : onAddItem(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`report-builder ${isOver ? 'drag-active' : ''}`}>
      <DataTable>
        {columns.length > 0 && (
          <DataTableRow header>
            {columns.map(column => (
              <DataTableCell key={column.id} header>
                {column.name}
              </DataTableCell>
            ))}
          </DataTableRow>
        )}
        
        {items.map((item, rowIndex) => (
          <DataTableRow key={item.id || rowIndex}>
            {columns.map(column => (
              <TableCellDropTarget
                key={`${item.id}-${column.id}`}
                rowId={item.id}
                columnId={column.id}
                value={item[column.id] || '-'}
              />
            ))}
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
};

export default ReportBuilder;