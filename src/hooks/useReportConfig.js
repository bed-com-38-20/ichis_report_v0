// import { useState, useEffect } from 'react';
// import { useConfig } from '@dhis2/app-runtime';
// import { useDataQuery } from '@dhis2/app-runtime';

// const useReportConfig = () => {
//   const [reportConfig, setReportConfig] = useState({
//     title: '',
//     subtitle: '',
//     logo: null,
//     date: new Date().toLocaleDateString(),
//     facility: '',
//     period: '',
//     data: {},
//     orgUnit: null,
//     periodSelection: null,
//     columns: [],
//     items: []
//   });

//   const { baseUrl } = useConfig();

//   const fetchReportData = async () => {
//     if (!reportConfig.orgUnit || !reportConfig.periodSelection) return;

//     try {
//       const response = await fetch(
//         `${baseUrl}/api/dataValueSets?orgUnit=${reportConfig.orgUnit}&period=${reportConfig.periodSelection}`
//       );
//       const data = await response.json();
//       setReportConfig(prev => ({
//         ...prev,
//         data: transformDHIS2Data(data),
//         period: formatPeriodLabel(reportConfig.periodSelection)
//       }));
//     } catch (error) {
//       console.error('Failed to fetch report data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, [reportConfig.orgUnit, reportConfig.periodSelection]);

//   return { reportConfig, setReportConfig };
// };

// export default useReportConfig;

// hooks/useReportConfig.js
// hooks/useReportConfig.js
import { useState, useEffect, useCallback } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

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

  // Define the metadata query outside the component render
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

  const handlePrint = () => {
    window.print();
  };

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

  // Fetch metadata and set reportConfig when it's available
  useEffect(() => {
    if (!metadataLoading && metadata) {
      try {
        setReportConfig(prev => ({
          ...prev,
          title: metadata.systemSettings?.applicationTitle || 'DHIS2 Report',
          facility: metadata.user.organisationUnits[0]?.displayName || '',
          orgUnit: metadata.user.organisationUnits[0]?.id || null
        }));
      } catch (e) {
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
    metadataLoading
  };
};
