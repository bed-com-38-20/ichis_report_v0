// import { useDataQuery } from "@dhis2/app-runtime";

// export const useDhis2Data = (dataSource) => {
//   const query = {
//     analytics: {
//       resource: "analytics",
//       params: {
//         dimension: `dx:${dataSource.indicator}`,
//         filter: `pe:LAST_12_MONTHS`,
//       },
//     },
//   };

//   const { loading, error, data } = useDataQuery(query);

//   return { loading, error, data: data?.analytics };
// };

// hooks/useDhis2Data.js



import { useEffect } from 'react';
import { useConfig } from '@dhis2/app-runtime';

export const useDhis2Data = (reportConfig, setReportData) => {
  const { baseUrl } = useConfig();

  const transformDHIS2Data = (dataValueSet) => {
    return dataValueSet?.dataValues?.reduce((acc, dv) => ({
      ...acc,
      [dv.dataElement]: dv.value
    }), {}) || {};
  };

  const formatPeriodLabel = (periodType) => {
    const format = (date) => date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    const now = new Date();
    
    switch(periodType) {
      case 'LAST_3_MONTHS':
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return `Last 3 months (${format(threeMonthsAgo)} - ${format(now)})`;
      case 'LAST_6_MONTHS':
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        return `Last 6 months (${format(sixMonthsAgo)} - ${format(now)})`;
      case 'LAST_12_MONTHS':
        const twelveMonthsAgo = new Date(now);
        twelveMonthsAgo.setMonth(now.getMonth() - 12);
        return `Last 12 months (${format(twelveMonthsAgo)} - ${format(now)})`;
      case 'THIS_YEAR':
        return `This year (${now.getFullYear()})`;
      case 'LAST_YEAR':
        return `Last year (${now.getFullYear()-1})`;
      default:
        return format(now);
    }
  };

  const fetchReportData = async () => {
    if (!reportConfig.orgUnit || !reportConfig.periodSelection) return;

    try {
      const response = await fetch(
        `${baseUrl}/api/dataValueSets?orgUnit=${reportConfig.orgUnit}&period=${reportConfig.periodSelection}`
      );
      const data = await response.json();
      setReportData({
        data: transformDHIS2Data(data),
        period: formatPeriodLabel(reportConfig.periodSelection)
      });
    } catch (err) {
      console.error('Failed to fetch DHIS2 data:', err);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportConfig.orgUnit, reportConfig.periodSelection]);
};