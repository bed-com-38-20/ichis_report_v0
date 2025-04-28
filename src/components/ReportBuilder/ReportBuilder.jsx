// import React from 'react';
// import { useDrop } from 'react-dnd';
// import { DataTable, DataTableRow, DataTableCell } from '@dhis2/ui';
// import TableCellDropTarget from './TableCellDropTarget';
// import './styles.css';

// const ReportBuilder = ({ columns, items, onAddColumn, onAddItem }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: ['COLUMN', 'ITEM'],
//     drop: (item, monitor) => {
//       monitor.getItemType() === 'COLUMN' 
//         ? onAddColumn(item) 
//         : onAddItem(item);
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <div ref={drop} className={`report-builder ${isOver ? 'drag-active' : ''}`}>
//       <DataTable>
//         {columns.length > 0 && (
//           <DataTableRow header>
//             {columns.map(column => (
//               <DataTableCell key={column.id} header>
//                 {column.name}
//               </DataTableCell>
//             ))}
//           </DataTableRow>
//         )}
        
//         {items.map((item, rowIndex) => (
//           <DataTableRow key={item.id || rowIndex}>
//             {columns.map(column => (
//               <TableCellDropTarget
//                 key={`${item.id}-${column.id}`}
//                 rowId={item.id}
//                 columnId={column.id}
//                 value={item[column.id] || '-'}
//               />
//             ))}
//           </DataTableRow>
//         ))}
//       </DataTable>
//     </div>
//   );
// };

// export default ReportBuilder;

import React from 'react';
import { useDrop } from 'react-dnd';
import { 
  DataTable, 
  DataTableRow, 
  DataTableCell,
  CircularLoader,
  AlertBar
} from '@dhis2/ui';
import TableCellDropTarget from './TableCellDropTarget';
//import './ReportBuilder.css';

const ReportBuilder = ({ 
  reportConfig = {}, 
  reportData = [], 
  loading = false, 
  error = null,
  onAddColumn = () => {}
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item) => onAddColumn(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  if (loading) return <CircularLoader />;
  if (error) return <AlertBar critical>{error.message}</AlertBar>;

  return (
    <div ref={drop} className={`report-builder ${isOver ? 'drag-active' : ''}`}>
      <DataTable>
        <DataTableRow header>
          <DataTableCell header>Period</DataTableCell>
          <DataTableCell header>Org Unit</DataTableCell>
          {reportConfig.columns?.map(column => (
            <DataTableCell key={column.id} header>
              {column.name}
            </DataTableCell>
          ))}
        </DataTableRow>

        {reportData.length > 0 ? (
          reportData.map((row, index) => (
            <DataTableRow key={index}>
              <DataTableCell>{row.period}</DataTableCell>
              <DataTableCell>{row.orgUnit}</DataTableCell>
              {reportConfig.columns?.map(column => (
                <DataTableCell key={`${row.period}-${column.id}`}>
                  {row[column.id] || '-'}
                </DataTableCell>
              ))}
            </DataTableRow>
          ))
        ) : (
          <DataTableRow>
            <DataTableCell colSpan={(reportConfig.columns?.length || 0) + 2}>
              {reportConfig.orgUnit && reportConfig.periods?.length && reportConfig.columns?.length
                ? "No data available for selected criteria"
                : "Please configure organization unit, periods and data elements"}
            </DataTableCell>
          </DataTableRow>
        )}
      </DataTable>
    </div>
  );
};

export default ReportBuilder;