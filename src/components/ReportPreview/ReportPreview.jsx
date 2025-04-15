import React from 'react';
import { DataTable, DataTableRow, DataTableCell } from '@dhis2/ui';
import ReportHeader from '../../ReportHeader';
import ReportBuilder from '../../ReportBuilder';
import StockManagementTable from '../../StockManagementTable';
import useReportConfig from '../../hook/useReportConfig';
import './ReportPreview.css'

const ReportPreview = () => {
  const { reportConfig } = useReportConfig();

  return (
    <div className="report-preview">
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
            columns={reportConfig.columns}
            items={reportConfig.items}
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