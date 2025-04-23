// hooks/useReportPersistence.js
import { useDataMutation } from '@dhis2/app-runtime';
import { useEffect } from 'react';

const SAVE_REPORT_MUTATION = {
  resource: 'dataStore/report-builder',
  id: ({ id }) => id,
  type: 'update',
  data: ({ report }) => report,
};

export const useReportPersistence = (reportConfig) => {
  const [saveReport, { loading, error }] = useDataMutation(SAVE_REPORT_MUTATION);
  
  const save = async (reportId) => {
    await saveReport({ id: reportId, report: reportConfig });
  };

  return { save, loading, error };
};