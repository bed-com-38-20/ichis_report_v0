import { useState, useEffect, useCallback } from 'react';
import { useConfig } from '@dhis2/app-runtime';

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

  const fetchReportData = useCallback(async () => {
    const { orgUnit, periodSelection } = reportConfig;

    if (!orgUnit || !periodSelection) return;

    try {
      const response = await fetch(
        `${baseUrl}/api/dataValueSets?orgUnit=${orgUnit}&period=${periodSelection}`
      );
      const data = await response.json();
      setReportConfig(prev => ({
        ...prev,
        data: transformDHIS2Data(data),
        period: formatPeriodLabel(periodSelection)
      }));
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    }
  }, [baseUrl, reportConfig.orgUnit, reportConfig.periodSelection]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return { reportConfig, setReportConfig };
};

export default useReportConfig;