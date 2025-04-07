import { useDataQuery } from "@dhis2/app-runtime";

export const useDhis2Data = (dataSource) => {
  const query = {
    analytics: {
      resource: "analytics",
      params: {
        dimension: `dx:${dataSource.indicator}`,
        filter: `pe:LAST_12_MONTHS`,
      },
    },
  };

  const { loading, error, data } = useDataQuery(query);

  return { loading, error, data: data?.analytics };
};