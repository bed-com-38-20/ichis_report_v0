// hooks/useReportConfig.js

import { useState, useEffect, useCallback } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

// ✅ Move the query OUTSIDE the hook
const metadataQuery = {
  orgUnits: {
    resource: 'organisationUnits',
    params: {
      paging: false,
      fields: 'id,displayName,level',
      level: 3
    }
  },
  systemSettings: {
    resource: 'systemSettings',
    params: {
      key: ['applicationTitle']
    }
  },
  user: {
    resource: 'me',
    params: {
      fields: 'organisationUnits[id,displayName]'
    }
  }
};

export const useReportConfig = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportConfig, setReportConfig] = useState({
    title: '',
    subtitle: '',
    logo: null,
    date: new Date().toLocaleDateString(),
    facility: '',
    period: '',
    data: {},
    orgUnit: null,
    periodSelection: null,
    columns: [],
    items: []
  });

  const { data: metadata, loading: metadataLoading } = useDataQuery(metadataQuery);

  const handleTitleChange = useCallback(({ value }) => {
    setReportConfig(prev => ({ ...prev, title: value }));
  }, []);

  const handleSubtitleChange = useCallback(({ value }) => {
    setReportConfig(prev => ({ ...prev, subtitle: value }));
  }, []);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportConfig(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleOrgUnitChange = useCallback((orgUnitId) => {
    setReportConfig(prev => {
      const selectedOrgUnit = metadata?.orgUnits?.organisationUnits?.find(ou => ou.id === orgUnitId);
      return {
        ...prev,
        orgUnit: orgUnitId,
        facility: selectedOrgUnit?.displayName || ''
      };
    });
  }, [metadata]);

  const handlePeriodChange = useCallback(({ selected }) => {
    setReportConfig(prev => ({ ...prev, periodSelection: selected }));
  }, []);

  const handleAddColumn = useCallback((column) => {
    setReportConfig(prev => ({
      ...prev,
      columns: [...prev.columns, column]
    }));
  }, []);

  const handleAddItem = useCallback((item) => {
    setReportConfig(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  }, []);

  const setReportData = useCallback((data) => {
    setReportConfig(prev => ({
      ...prev,
      data
    }));
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handlers = {
    handlePrint,
    handleTitleChange,
    handleSubtitleChange,
    handleLogoUpload,
    handleOrgUnitChange,
    handlePeriodChange,
    handleAddColumn,
    handleAddItem,
    setReportData
  };

  useEffect(() => {
    if (!metadataLoading && metadata) {
      try {
        setReportConfig(prev => ({
          ...prev,
          title: metadata.systemSettings?.applicationTitle || 'DHIS2 Report',
          facility: metadata.user?.organisationUnits?.[0]?.displayName || '',
          orgUnit: metadata.user?.organisationUnits?.[0]?.id || null
        }));
      } catch (e) {
        console.error('Error processing metadata:', e);
        setError('Error processing metadata');
      }
      setIsLoading(false);
    }
  }, [metadata, metadataLoading]);

  return {
    reportConfig,
    handlers,
    isLoading,
    error,
    metadata,
    metadataLoading,
    setReportConfig
  };
};
