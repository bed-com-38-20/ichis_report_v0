import { useState, useEffect } from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { useDataQuery } from '@dhis2/app-runtime';

const useReportConfig = () => {
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

  const { baseUrl } = useConfig();

  const fetchReportData = async () => {
    if (!reportConfig.orgUnit || !reportConfig.periodSelection) return;

    try {
      const response = await fetch(
        `${baseUrl}/api/dataValueSets?orgUnit=${reportConfig.orgUnit}&period=${reportConfig.periodSelection}`
      );
      const data = await response.json();
      setReportConfig(prev => ({
        ...prev,
        data: transformDHIS2Data(data),
        period: formatPeriodLabel(reportConfig.periodSelection)
      }));
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportConfig.orgUnit, reportConfig.periodSelection]);

  return { reportConfig, setReportConfig };
};

export default useReportConfig;