import { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const METADATA_QUERY = {
  indicators: {
    resource: 'indicators',
    params: {
      fields: 'id,displayName,indicatorType[name]',
      paging: false
    }
  },
  orgUnits: {
    resource: 'organisationUnits',
    params: {
      fields: 'id,displayName',
      //level: 3,
      paging: false
    }
  }
};

export const useReportConfig = () => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    columns: [],
    orgUnits: [],
    periods: [],
    targets: {}
  });

  const { data: metadata, loading, error } = useDataQuery(METADATA_QUERY);

  const handlers = {
    setReportConfig,
    handlePrint: () => window.print(),
    handleSaveTemplate: async () => {
      // save logic
    },
    handleTitleChange: (title) => {
      setReportConfig(prev => ({ ...prev, name: title }));
    }
  };

  return {
    reportConfig,
    handlers,
    isLoading: loading,
    error,
    metadata 
  };
};