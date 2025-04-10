import React from 'react';
import { useDrop } from 'react-dnd';
import { DataTable, DataTableRow, DataTableCell, InputField } from '@dhis2/ui';

const DroppableTableArea = ({ config, onAddColumn, onAddItem, onCellValueChange }) => {
  const { columns, items, data } = config;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['COLUMN', 'ITEM'],
    drop: (item, monitor) => {
      if (!monitor.didDrop()) { // Prevent nested drop events
        if (item.type === 'COLUMN' && !columns.some(col => col.id === item.id)) {
          onAddColumn(item);
        } 
        else if (item.type === 'ITEM' && !items.some(it => it.id === item.id)) {
          onAddItem(item);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleCellChange = (itemId, columnId, value) => {
    onCellValueChange(itemId, columnId, value);
  };

  return (
    <div 
      ref={drop}
      style={{
        border: isOver ? '2px dashed #0064d5' : '2px dashed transparent',
        minHeight: '300px',
        padding: '16px',
        backgroundColor: isOver ? '#f0f7ff' : 'transparent',
        transition: 'all 0.2s',
        position: 'relative'
      }}
    >
      {columns.length === 0 && items.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Drag columns and items here to build your report</p>
        </div>
      ) : (
        <>
          <DataTable>
            <DataTableRow header>
              <DataTableCell>Item</DataTableCell>
              <DataTableCell>Unit</DataTableCell>
              {columns.map((column) => (
                <DataTableCell key={`header-${column.id}`}>
                  {column.name}
                </DataTableCell>
              ))}
            </DataTableRow>
            
            {items.map(item => (
              <DataTableRow key={`row-${item.id}`}>
                <DataTableCell>{item.name}</DataTableCell>
                <DataTableCell>{item.unit}</DataTableCell>
                
                {columns.map((column) => {
                  const cellKey = `${item.id}-${column.id}`;
                  const cellValue = data[cellKey] || '';

                  return (
                    <DataTableCell key={`cell-${item.id}-${column.id}`}>
                      <InputField
                        dense
                        value={cellValue}
                        onChange={({ value }) => handleCellChange(item.id, column.id, value)}
                        style={styles.cellInput}
                      />
                    </DataTableCell>
                  );
                })}
              </DataTableRow>
            ))}
          </DataTable>

          {/* Empty row for adding new items */}
          {items.length === 0 && columns.length > 0 && (
            <div style={styles.dropHint}>
              Drag drugs/supplies here to add rows
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  emptyState: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    border: '2px dashed #ccc',
    borderRadius: '4px',
    color: '#666'
  },
  dropHint: {
    padding: '16px',
    textAlign: 'center',
    color: '#666',
    border: '1px dashed #ccc',
    marginTop: '16px'
  },
  cellInput: {
    width: '100%'
  }
};

export default DroppableTableArea;