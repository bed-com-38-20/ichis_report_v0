import { useDataQuery } from "@dhis2/app-runtime";
import { useMemo } from "react";

export const useDhis2Data = (dataSource) => {
  const query = useMemo(() => ({
    analytics: {
      resource: "analytics",
      params: {
        dimension: `dx:${dataSource.indicator}`,
        filter: `pe:LAST_12_MONTHS`,
      },
    },
  }), [dataSource.indicator]);

  const { loading, error, data } = useDataQuery(query);

  return { loading, error, data: data?.analytics };
};