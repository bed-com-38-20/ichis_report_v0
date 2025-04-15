import React from 'react';
import { useDrop } from 'react-dnd';
import { DataTable, DataTableRow, DataTableCell } from '@dhis2/ui';
import PropTypes from 'prop-types';

const ReportBuilder = ({ columns = [], items = [], onAddColumn, onAddItem }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['COLUMN', 'ITEM'],
    drop: (item, monitor) => {
      if (monitor.getItemType() === 'COLUMN') {
        onAddColumn(item);
      } else {
        onAddItem(item);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} style={{ 
      border: isOver ? '2px dashed #0064d5' : '2px dashed transparent',
      minHeight: '200px',
      padding: '16px'
    }}>
      <DataTable>
        {columns.length > 0 && (
          <DataTableRow header>
            {columns.map((column) => (
              <DataTableCell key={column.id} header>
                {column.name}
              </DataTableCell>
            ))}
          </DataTableRow>
        )}
        
        {items.map((item, index) => (
          <DataTableRow key={item.id || index}>
            {columns.map((column) => (
              <DataTableCell key={`${item.id}-${column.id}`}>
                {item[column.id] || '-'}
              </DataTableCell>
            ))}
          </DataTableRow>
        ))}
        
        {items.length === 0 && (
          <DataTableRow>
            <DataTableCell colSpan={columns.length || 1}>
              No items added yet
            </DataTableCell>
          </DataTableRow>
        )}
      </DataTable>
    </div>
  );
};

ReportBuilder.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  items: PropTypes.arrayOf(PropTypes.object),
  onAddColumn: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired
};

ReportBuilder.defaultProps = {
  columns: [],
  items: []
};

export default ReportBuilder;