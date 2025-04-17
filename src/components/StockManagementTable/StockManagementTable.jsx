import React from 'react';
import { DataTable, DataTableRow, DataTableCell } from '@dhis2/ui';
import './styles.css';

const StockManagementTable = ({ data, columns, items }) => {
  return (
    <div className="stock-table">
      <DataTable>
        <DataTableRow header>
          <DataTableCell header>Item</DataTableCell>
          {columns.slice(2).map(col => (
            <DataTableCell key={col.id} header>{col.name}</DataTableCell>
          ))}
        </DataTableRow>
        
        {items.map(item => (
          <DataTableRow key={item.id}>
            <DataTableCell>{item.name}</DataTableCell>
            {columns.slice(2).map(col => (
              <DataTableCell key={`${item.id}-${col.id}`}>
                {data[`${item.id}-${col.id}`] || '-'}
              </DataTableCell>
            ))}
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
};

export default StockManagementTable;