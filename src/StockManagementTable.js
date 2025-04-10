import React from 'react';
import { DataTable, DataTableRow, DataTableCell, InputField } from '@dhis2/ui';

const StockManagementTable = ({ config, onCellValueChange }) => {
  const { columns, items, data } = config;

  const handleCellChange = (itemId, columnId, value) => {
    onCellValueChange(itemId, columnId, value);
  };

  return (
    <div style={styles.tableContainer}>
      {/* Interactive Table, enables the user to enter daata (hidden when printing) */}
      <DataTable className="no-print">
        <DataTableRow header>
          {columns.map((column, index) => (
            <DataTableCell key={`header-${index}`} bordered>
              {column}
            </DataTableCell>
          ))}
        </DataTableRow>
        
        {items.map(item => (
          <DataTableRow key={`row-${item.id}`}>
            <DataTableCell bordered>{item.name}</DataTableCell>
            <DataTableCell bordered>{item.unit}</DataTableCell>
            
            {columns.slice(2).map((column, colIndex) => {
              const columnId = column.split(' ')[0].replace(/[()]/g, '');
              const cellKey = `${item.id}-${columnId}`;
              const cellValue = data[cellKey] || '';

              return (
                <DataTableCell key={`cell-${item.id}-${colIndex}`} bordered>
                  <InputField
                    dense
                    value={cellValue}
                    onChange={({ value }) => handleCellChange(item.id, columnId, value)}
                    style={styles.cellInput}
                  />
                </DataTableCell>
              );
            })}
          </DataTableRow>
        ))}
      </DataTable>

      {/* Printable Table, fixed line tables  (visible only when printing) */}
      <table className="print-only" style={styles.printTable}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={`print-header-${index}`} style={styles.printHeader}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={`print-row-${item.id}`}>
              <td style={styles.printCell}>{item.name}</td>
              <td style={styles.printCell}>{item.unit}</td>
              
              {columns.slice(2).map((column, colIndex) => {
                const columnId = column.split(' ')[0].replace(/[()]/g, '');
                const cellKey = `${item.id}-${columnId}`;
                const cellValue = data[cellKey] || '';

                return (
                  <td key={`print-cell-${item.id}-${colIndex}`} style={styles.printCell}>
                    {cellValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: {
    marginTop: '20px'
  },
  cellInput: {
    width: '100%'
  },
  printTable: {
    width: '100%',
    borderCollapse: 'collapse',
    display: 'none',
    marginTop: '20px',
    fontSize: '12px'
  },
  printHeader: {
    backgroundColor: '#f0f0f0',
    padding: '8px',
    border: '1px solid #ddd',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  printCell: {
    padding: '8px',
    border: '1px solid #ddd',
    textAlign: 'center'
  }
};

export default StockManagementTable;