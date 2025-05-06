import React, {useState, useEffect} from 'react';
import { 
  DataTable,
  DataTableRow,
  DataTableCell,
  DataTableColumnHeader,
  CircularLoader,
  Tooltip,
  
  colors
} from '@dhis2/ui';

const ReportStage = ({ config, data, loading }) => {
  const getCellStyle = (value, dataElementId) => {
    const target = config.targets[dataElementId];
    if (!target || value == null) return {};
    
    const percentage = (parseFloat(value) / parseFloat(target)) * 100;
    
    return {
      backgroundColor: percentage >= 100 ? colors.green100 : 
                      percentage >= 80 ? colors.yellow100 : colors.red100,
      fontWeight: 'bold',
      textAlign: 'center'
    };
  };

  if (loading) return <CircularLoader />;

  return (
    <div className="report-stage">
      <h2>{config.name}</h2>
      <DataTable>
        <DataTableRow header>
          <DataTableColumnHeader>Health Facility</DataTableColumnHeader>
          {config.columns.map(col => (
            <DataTableColumnHeader key={col.id}>
              {col.name}
            </DataTableColumnHeader>
          ))}
        </DataTableRow>

        {/* National Targets Row */}
        <DataTableRow>
          <DataTableCell bordered>National Targets</DataTableCell>
          {config.columns.map(col => (
            <DataTableCell 
              key={`target-${col.id}`}
              bordered
              style={{ backgroundColor: colors.grey100 }}
            >
              {config.targets[col.id] || '-'}
            </DataTableCell>
          ))}
        </DataTableRow>

        {/* Data Rows */}
        {data?.rows?.map(row => {
          const [orgUnit, period, dataElement, value] = row;
          const ouName = data.metaData.items[orgUnit]?.name || orgUnit;
          
          return (
            <DataTableRow key={`${orgUnit}-${period}`}>
              <DataTableCell bordered>{ouName}</DataTableCell>
              {config.columns.map(col => {
                const cellValue = dataElement === col.id ? value : '-';
                return (
                  <Tooltip
                    key={`${orgUnit}-${col.id}`}
                    content={`${col.name}: ${cellValue}`}
                  >
                    <DataTableCell
                      bordered
                      style={getCellStyle(cellValue, col.id)}
                    >
                      {cellValue}
                    </DataTableCell>
                  </Tooltip>
                );
              })}
            </DataTableRow>
          );
        })}
      </DataTable>
    </div>
  );
};

export default ReportStage;