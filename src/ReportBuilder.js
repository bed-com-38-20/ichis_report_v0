import React from 'react';
import { useDrop } from 'react-dnd';
import { DataTable, DataTableRow, DataTableCell } from '@dhis2/ui';

const ReportBuilder = ({ report, onAddColumn, onAddItem }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ['COLUMN', 'ITEM'],
    drop: (item) => {
      if (item.type === 'COLUMN') {
        onAddColumn(item);
      } else {
        onAddItem(item);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  return (
    <div ref={drop} style={{
      border: isOver ? '2px dashed #0064d5' : '1px dashed #ccc',
      minHeight: '300px',
      padding: '20px',
      backgroundColor: isOver ? '#f0f7ff' : 'white'
    }}>
      {report.columns.length === 0 ? (
        <p>Drag columns here to start building your report</p>
      ) : (
        <DataTable>
          <DataTableRow header>
            <DataTableCell>Item</DataTableCell>
            <DataTableCell>Unit</DataTableCell>
            {report.columns.map(col => (
              <DataTableCell key={col.id}>{col.name}</DataTableCell>
            ))}
          </DataTableRow>
          
          {report.items.map(item => (
            <DataTableRow key={item.id}>
              <DataTableCell>{item.name}</DataTableCell>
              <DataTableCell>{item.unit}</DataTableCell>
              {report.columns.map(col => (
                <DataTableCell key={`${item.id}-${col.id}`}>
                  <input type="text" style={styles.input} />
                </DataTableCell>
              ))}
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const styles = {
  input: {
    width: '100%',
    border: '1px solid #ccc',
    padding: '8px',
    borderRadius: '4px'
  }
};

export default ReportBuilder;