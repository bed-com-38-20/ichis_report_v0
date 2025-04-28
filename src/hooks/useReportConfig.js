// import { useState, useEffect } from 'react';
// import { useDataQuery } from '@dhis2/app-runtime';

// export const useReportCigonf = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
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

//   const { data: metadata, loading: metadataLoading } = useDataQuery({
//     orgUnits: {
//       resource: 'organisationUnits',
//       params: {
//         paging: false,
//         fields: 'id,displayName,level',
//         level: 3
//       }
//     },
//     systemSettings: {
//       resource: 'systemSettings',
//       params: {
//         key: ['applicationTitle']
//       }
//     },
//     user: {
//       resource: 'me',
//       params: {
//         fields: 'organisationUnits[id,displayName]'
//       }
//     }
//   });

//   const handlers = {
//     handlePrint: () => window.print(),
//     handleTitleChange: ({ value }) => setReportConfig(prev => ({ ...prev, title: value })),
//     handleSubtitleChange: ({ value }) => setReportConfig(prev => ({ ...prev, subtitle: value })),
//     handleLogoUpload: (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setReportConfig(prev => ({ ...prev, logo: reader.result }));
//         };
//         reader.readAsDataURL(file);
//       }
//     },
//     handleOrgUnitChange: (orgUnitId) => {
//       const selectedOrgUnit = metadata?.orgUnits?.organisationUnits?.find(ou => ou.id === orgUnitId);
//       setReportConfig(prev => ({
//         ...prev,
//         orgUnit: orgUnitId,
//         facility: selectedOrgUnit?.displayName || ''
//       }));
//     },
//     handlePeriodChange: ({ selected }) => {
//       setReportConfig(prev => ({ ...prev, periodSelection: selected }));
//     },
//     handleAddColumn: (column) => {
//       setReportConfig(prev => ({
//         ...prev,
//         columns: [...prev.columns, column]
//       }));
//     },
//     handleAddItem: (item) => {
//       setReportConfig(prev => ({
//         ...prev,
//         items: [...prev.items, item]
//       }));
//     },
//     setReportData: (data) => {
//       setReportConfig(prev => ({
//         ...prev,
//         data
//       }));
//     }
//   };

//   useEffect(() => {
//     if (!metadataLoading && metadata) {
//       setReportConfig(prev => ({
//         ...prev,
//         title: metadata.systemSettings.applicationTitle || 'DHIS2 Report',
//         facility: metadata.user.organisationUnits[0]?.displayName || '',
//         orgUnit: metadata.user.organisationUnits[0]?.id || null
//       }));
//       setIsLoading(false);
//     }
//   }, [metadataLoading, metadata]);

//   return {
//     reportConfig,
//     handlers,
//     isLoading,
//     error,
//     metadata,
//     metadataLoading,
//     setReportConfig
//   };
// };

import { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const METADATA_QUERY = {
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
  const [reportConfig, setReportConfig] = useState({
    title: '',
    subtitle: '',
    logo: null,
    orgUnit: null,
    orgUnitName: '',
    periods: [],
    columns: [],
    items: [],
    data: {}
  });

  const { data: metadata, loading: metadataLoading, error } = useDataQuery(METADATA_QUERY);

  useEffect(() => {
    if (!metadataLoading && metadata) {
      const defaultOrgUnit = metadata.user.organisationUnits[0];
      setReportConfig(prev => ({
        ...prev,
        title: metadata.systemSettings.applicationTitle || 'DHIS2 Report',
        orgUnit: defaultOrgUnit?.id || null,
        orgUnitName: defaultOrgUnit?.displayName || ''
      }));
    }
  }, [metadataLoading, metadata]);

  const handlers = {
    setReportConfig,
    handleTitleChange: (title) => setReportConfig(prev => ({ ...prev, title })),
    handleSubtitleChange: (subtitle) => setReportConfig(prev => ({ ...prev, subtitle })),
    handleLogoUpload: (logo) => setReportConfig(prev => ({ ...prev, logo })),
    handleOrgUnitChange: (orgUnitId) => {
      const orgUnit = metadata?.orgUnits?.organisationUnits?.find(ou => ou.id === orgUnitId);
      setReportConfig(prev => ({
        ...prev,
        orgUnit: orgUnitId,
        orgUnitName: orgUnit?.displayName || ''
      }));
    },
    handlePeriodChange: (periods) => setReportConfig(prev => ({ ...prev, periods })),
    handleAddColumn: (column) => {
      setReportConfig(prev => ({
        ...prev,
        columns: [...prev.columns, column]
      }));
    },
    handleRemoveColumn: (id) => {
      setReportConfig(prev => ({
        ...prev,
        columns: prev.columns.filter(c => c.id !== id)
      }));
    },
    handlePrint: () => window.print()
  };

  return {
    reportConfig,
    handlers,
    isLoading: metadataLoading,
    error,
    metadata
  };
};