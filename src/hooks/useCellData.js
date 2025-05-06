import { useDataQuery } from '@dhis2/app-runtime';

const ANALYTICS_QUERY = {
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
};

export const useCellData = (reportConfig) => {
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