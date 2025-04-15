import { useDataQuery, useDataMutation } from '@dhis2/app-runtime';

export const useMetadata = () => {
  const { loading, error, data } = useDataQuery({
    dataElements: {
      resource: 'dataElements',
      params: {
        paging: false,
        fields: 'id,displayName,code,valueType,categoryCombo[id,displayName]'
      }
    },
    indicators: {
      resource: 'indicators',
      params: {
        paging: false,
        fields: 'id,displayName,code,numerator,denominator'
      }
    }
  });

  return { loading, error, data };
};

export const saveReportTemplate = (template) => {
  return useDataMutation({
    resource: 'reportTables',
    type: 'create',
    data: {
      ...template,
      publicAccess: 'r-------' // Set appropriate sharing settings
    }
  });
};