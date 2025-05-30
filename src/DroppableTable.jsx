import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { DataTable, DataTableRow, DataTableCell, Button } from '@dhis2/ui';
import ColumnHeader from './ColumnHeader';
import TableCellDropTarget from './TableCellDropTarget';

const DroppableTable = ({ config, orgUnits, periods, onConfigChange }) => {
  const { columns = ['Period', 'Organisation Unit'], data = {} } = config;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['indicator', 'dataElement'],
    drop: (item) => {
      if (!columns.includes(item.name)) {
        onConfigChange({
          ...config,
          columns: [...columns, item.name]
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  const moveColumn = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    
    onConfigChange({
      ...config,
      columns: newColumns
    });
  }, [columns, config, onConfigChange]);

  const handleCellDrop = (item, period, orgUnit, column) => {
    onConfigChange({
      ...config,
      data: {
        ...data,
        [`${period.id}-${orgUnit.id}-${column}`]: {
          value: item.name,
          id: item.id,
          type: item.type
        }
      }
    });
  };

  const removeColumn = (column) => {
    if (['Period', 'Organisation Unit'].includes(column)) return;
    
    const newColumns = columns.filter(col => col !== column);
    const newData = {...data};
    Object.keys(newData).forEach(key => {
      if (key.endsWith(`-${column}`)) delete newData[key];
    });

    onConfigChange({
      columns: newColumns,
      data: newData
    });
  };

  return (
    <div ref={drop} style={styles.dropArea(isOver)}>
      <DataTable>
        <DataTableRow>
          {columns.map((column, index) => (
            <ColumnHeader
              key={column}
              column={column}
              index={index}
              moveColumn={moveColumn}
            >
              <div style={styles.columnContent}>
                {column}
                {!['Period', 'Organisation Unit'].includes(column) && (
                  <Button
                    small
                    destructive
                    onClick={(e) => {
                      e.stopPropagation();
                      removeColumn(column);
                    }}
                    style={styles.removeButton}
                  >
                    ×
                  </Button>
                )}
              </div>
            </ColumnHeader>
          ))}
        </DataTableRow>

        {periods.flatMap(period => (
          orgUnits.map(orgUnit => (
            <DataTableRow key={`${period.id}-${orgUnit.id}`}>
              {columns.map(column => {
                if (column === 'Period') {
                  return <DataTableCell key="period">{period.displayName}</DataTableCell>;
                }
                if (column === 'Organisation Unit') {
                  return <DataTableCell key="orgUnit">{orgUnit.displayName}</DataTableCell>;
                }
                return (
                  <TableCellDropTarget
                    key={column}
                    column={column}
                    onDrop={(item) => handleCellDrop(item, period, orgUnit, column)}
                  >
                    {data[`${period.id}-${orgUnit.id}-${column}`]?.value || '-'}
                  </TableCellDropTarget>
                );
              })}
            </DataTableRow>
          ))
        ))}
      </DataTable>
    </div>
  );
};

const styles = {
  dropArea: (isOver) => ({
    border: isOver ? '2px dashed #0064d5' : '2px dashed transparent',
    borderRadius: '4px',
    padding: '8px',
    transition: 'all 0.2s'
  }),
  columnContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  removeButton: {
    marginLeft: '8px'
  }
};

export default DroppableTable;