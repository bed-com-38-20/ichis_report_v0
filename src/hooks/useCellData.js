// hooks/useCellData.js
import { useDataQuery } from '@dhis2/app-runtime';
import { useMemo } from 'react';

export const useCellData = (reportConfig) => {
  // Define the query outside the component render
  const ANALYTICS_QUERY = useMemo(() => ({
    analytics: {
      resource: 'analytics',
      params: ({ dimensionParams, filterParams }) => ({
        dimension: dimensionParams,
        filter: filterParams,
        skipMeta: true,
        skipData: false,
        skipRounding: true,
      }),
    },
  }), []);

  const { loading, error, data, refetch } = useDataQuery(ANALYTICS_QUERY, {
    lazy: true,
  });

  const fetchCellData = async (period, orgUnit, dataElementId) => {
    const response = await refetch({
      dimensionParams: [
        `dx:${dataElementId}`,
        `pe:${period}`,
        `ou:${orgUnit}`,
      ],
      filterParams: [],
    });
    return response?.analytics?.rows?.[0]?.[3] || null;
  };

  return { fetchCellData, loading, error };
};
