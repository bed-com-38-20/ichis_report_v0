// hooks/useReportPersistence.js
import { useDataMutation } from '@dhis2/app-runtime';
import { useCallback } from 'react';

export const useReportPersistence = (reportConfig) => {
  // Define mutation outside the component render
  const SAVE_REPORT_MUTATION = {
    resource: 'dataStore/report-builder',
    id: ({ id }) => id,
    type: 'update',
    data: ({ report }) => report,
  };

  const [saveReport, { loading, error }] = useDataMutation(SAVE_REPORT_MUTATION);
  
  const save = useCallback(async (reportId) => {
    await saveReport({ id: reportId, report: reportConfig });
  }, [saveReport, reportConfig]);

  return { save, loading, error };
};