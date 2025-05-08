import React, { useState, useEffect, useMemo } from 'react';
import { Card, TabBar, Tab, Divider, CircularLoader, NoticeBox } from '@dhis2/ui';
import { useDataQuery } from '@dhis2/app-runtime';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import PropTypes from 'prop-types';
import i18n from '../../../locales';
import { useTableState } from '../../../context/tableContext';
import { getSelectedIds } from './TableWithData';
import classes from './ReportVisualizations.module.css'

// Colors for charts
const CHART_COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

// Analytics query to get all data for visualization
const ANALYTICS_VISUALIZATION_QUERY = {
  result: {
    resource: 'analytics',
    params: ({ dxIds, ouId, peId }) => ({
      dimension: `dx:${dxIds.join(';')}`,
      filter: [
        `ou:${ouId}`,
        `pe:${peId}`
      ],
      skipMeta: false
    }),
  },
};

function ReportVisualizations({ selectedOrgUnits, selectedPeriods }) {
  const [activeTab, setActiveTab] = useState('bar');
  const table = useTableState();
  
  // Extract all data items from the table
  const dataItems = useMemo(() => {
    const items = [];
    table.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.contentType === 'data' && cell.data?.item) {
          items.push(cell.data.item);
        }
      });
    });
    return items;
  }, [table]);
  
  // Prepare query variables
  const queryVars = {
    dxIds: dataItems.map(item => item.id),
    ouId: selectedOrgUnits.length > 0 
      ? getSelectedIds(selectedOrgUnits) 
      : 'USER_ORGUNIT',
    peId: selectedPeriods.length > 0 
      ? getSelectedIds(selectedPeriods) 
      : 'THIS_MONTH'
  };
  
  // Skip query if we don't have any data items
  const skipQuery = dataItems.length === 0;
  
  // Fetch data
  const { data, loading, error } = useDataQuery(ANALYTICS_VISUALIZATION_QUERY, {
    variables: queryVars,
    skip: skipQuery
  });
  
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data?.result) return [];
    
    // Get metadata mappings
    const metaData = data.result.metaData || {};
    const names = metaData.items || {};
    
    // Format data for charts
    return data.result.rows.map(row => {
      const [dxId, period, orgUnit, value] = row;
      return {
        name: names[dxId]?.name || dxId,
        value: parseFloat(value) || 0,
        period: names[period]?.name || period,
        orgUnit: names[orgUnit]?.name || orgUnit
      };
    });
  }, [data]);
  
  // If there are no data items or not enough periods/org units selected, show message
  if (skipQuery || (!loading && chartData.length === 0)) {
    return (
      <Card className={classes.visualizationCard}>
        <NoticeBox title={i18n.t('No data to visualize')}>
          {selectedPeriods.length === 0 ? (
            i18n.t('Please select at least one period to generate visualizations.')
          ) : dataItems.length === 0 ? (
            i18n.t('No data items found in this table. Visualizations will appear when data items are present.')
          ) : (
            i18n.t('No data found for the selected parameters. Try changing the period or organization unit.')
          )}
        </NoticeBox>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <Card className={classes.visualizationCard}>
        <div className={classes.loader}>
          <CircularLoader />
          <p>{i18n.t('Loading visualization data...')}</p>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className={classes.visualizationCard}>
        <NoticeBox error title={i18n.t('Error loading visualization data')}>
          {error.message || i18n.t('An unknown error occurred while fetching data.')}
        </NoticeBox>
      </Card>
    );
  }
  
  return (
    <Card className={classes.visualizationCard}>
      <h3 className={classes.vizTitle}>{i18n.t('Data Visualizations')}</h3>
      
      <TabBar>
        <Tab 
          selected={activeTab === 'bar'} 
          onClick={() => setActiveTab('bar')}
        >
          {i18n.t('Bar Chart')}
        </Tab>
        <Tab 
          selected={activeTab === 'pie'} 
          onClick={() => setActiveTab('pie')}
        >
          {i18n.t('Pie Chart')}
        </Tab>
      </TabBar>
      
      <Divider />
      
      <div className={classes.chartContainer}>
        {activeTab === 'bar' && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
              />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="value" fill="#1f77b4" name={i18n.t('Value')} />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {activeTab === 'pie' && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

ReportVisualizations.propTypes = {
  selectedOrgUnits: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  selectedPeriods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

ReportVisualizations.defaultProps = {
  selectedOrgUnits: [],
  selectedPeriods: []
};

export default ReportVisualizations;