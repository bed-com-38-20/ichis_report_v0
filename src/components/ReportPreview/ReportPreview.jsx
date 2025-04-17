import React, {useState, useEffect} from 'react';
import { useDrop } from 'react-dnd';
import { Card } from '@dhis2/ui';
import ReportHeader from '../ReportHeader/ReportHeader';
import { useCellData } from '../../hooks/useCellData';
import ReportBuilder from '../ReportBuilder/ReportBuilder';
import StockManagementTable from '../StockManagementTable/StockManagementTable';
import './ReportPreview.css';

const ReportPreview = ({ reportConfig, onAddColumn, onAddItem }) => {
  
  const { fetchCellData } = useCellData(reportConfig);
  const [cellValues, setCellValues] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      const values = {};
      for (const period of reportConfig.periods) {
        for (const orgUnit of reportConfig.orgUnits) {
          for (const column of reportConfig.columns) {
            if (column.type === 'dataElement') {
              const key = `${period}-${orgUnit}-${column.id}`;
              values[key] = await fetchCellData(period, orgUnit, column.id);
            }
          }
        }
      }
      setCellValues(values);
    };
    
    fetchAllData();
  }, [reportConfig]);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const tableElement = document.querySelector('.stock-management-table');
      if (tableElement && offset) {
        const tableRect = tableElement.getBoundingClientRect();
        const relativeX = offset.x - tableRect.left;
        const relativeY = offset.y - tableRect.top;
        
        // Calculate approximate cell position
        const columnIndex = Math.floor(relativeX / 150); // Approximate column width
        const rowIndex = Math.floor(relativeY / 40); // Approximate row height
        
        if (columnIndex >= 2) { // Skip period and org unit columns
          onAddItem(item, {
            columnIndex,
            rowIndex,
            columnId: reportConfig.columns[columnIndex]?.id
          });
        } else {
          // If dropped outside specific cells, add as a new column
          onAddColumn(item);
        }
      } else {
        // If dropped outside the table, add as a new column
        onAddColumn(item);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      style={{
        border: isOver ? '2px dashed #0064d5' : '2px dashed transparent',
        minHeight: '100vh',
      }}
    >
      <div className="printable-area">
        <ReportHeader 
          title={reportConfig.title}
          subtitle={reportConfig.subtitle}
          facility={reportConfig.facility}
          date={reportConfig.date}
          period={reportConfig.period}
          logo={reportConfig.logo}
        />
        <div className="main-area">
          <ReportBuilder 
            columns={reportConfig.columns || []} 
            items={reportConfig.items || []}
            onAddColumn={onAddColumn}
            onAddItem={onAddItem}
          />
          <StockManagementTable 
            data={reportConfig.data}
            columns={reportConfig.columns}
            items={reportConfig.items}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;