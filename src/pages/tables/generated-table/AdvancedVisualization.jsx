import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, TabBar, Tab, Divider, CircularLoader, NoticeBox, 
  SingleSelect, SingleSelectOption, InputField, Button
} from '@dhis2/ui';
import { useDataQuery } from '@dhis2/app-runtime';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  ComposedChart, Area
} from 'recharts';
import PropTypes from 'prop-types';
import i18n from '../../locales';
import classes from './styles/ReportVisualizations.module.css';
import { DATA } from '../../modules/contentTypes';

// Colors for charts
const CHART_COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

// Analytics query for time series data
const ANALYTICS_TIME_SERIES_QUERY = {
  result: {
    resource: 'analytics',
    params: ({ dxId, ouId, periodType, periodCount }) => {
      // Calculate relative periods based on type and count
      const periods = [];
      if (periodType === 'months') {
        for (let i = 0; i < periodCount; i++) {
          periods.push(`LAST_${i+1}_MONTHS`);
        }
      } else {
        for (let i = 0; i < periodCount; i++) {
          periods.push(`LAST_${i+1}_${periodType.toUpperCase()}`);
        }
      }
      
      return {
        dimension: [
          `dx:${dxId}`,
          `pe:${periods.join(';')}`
        ],
        filter: `ou:${ouId}`,
        skipMeta: false
      };
    },
  },
};

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={classes.customTooltip}>
        <p className={classes.tooltipLabel}>{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${parseFloat(entry.value).toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function AdvancedVisualization({ table, selectedOrgUnits, selectedPeriods }) {
  const [activeTab, setActiveTab] = useState('trend');
  const [selectedDataItem, setSelectedDataItem] = useState(null);
  const [periodType, setPeriodType] = useState('months');
  const [periodCount, setPeriodCount] = useState(6);
  
  // Extract all data items from the table
  const dataItems = useMemo(() => {
    const items = [];
    if (!table || !table.rows) return items;
    
    table.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.contentType === DATA && cell.data?.item) {
          const exists = items.some(item => item.id === cell.data.item.id);
          if (!exists) {
            items.push(cell.data.item);
          }
        }
      });
    });
    return items;
  }, [table]);
  
  // Set first data item as default selected
  useEffect(() => {
    if (dataItems.length > 0 && !selectedDataItem) {
      setSelectedDataItem(dataItems[0].id);
    }
  }, [dataItems, selectedDataItem]);
  
  // Prepare query variables for time series data
  const queryVars = useMemo(() => {
    // Default to first org unit if available
    const orgUnit = selectedOrgUnits.length > 0 
      ? selectedOrgUnits[0].id 
      : 'USER_ORGUNIT';
    
    return {
      dxId: selectedDataItem || (dataItems[0]?.id || ''),
      ouId: orgUnit,
      periodType: periodType,
      periodCount: periodCount
    };
  }, [selectedDataItem, selectedOrgUnits, periodType, periodCount, dataItems]);
  
  // Fetch time series data
  const { data: timeSeriesData, loading, error } = useDataQuery(ANALYTICS_TIME_SERIES_QUERY, {
    variables: queryVars,
    skip: !selectedDataItem
  });
  
  // Format time series data for charts
  const formattedTimeSeriesData = useMemo(() => {
    if (!timeSeriesData?.result) return [];
    
    const metaData = timeSeriesData.result.metaData || {};
    const names = metaData.items || {};
    const periodNames = {};
    
    // Organize periods for proper ordering
    if (metaData.dimensions && metaData.dimensions.pe) {
      metaData.dimensions.pe.forEach((period, index) => {
        periodNames[period] = {
          name: names[period]?.name || period,
          order: index
        };
      });
    }
    
    // Format and sort data
    const formattedData = {};
    timeSeriesData.result.rows.forEach(row => {
      const [dxId, period, value] = row;
      
      if (!formattedData[period]) {
        formattedData[period] = {
          periodId: period,
          name: periodNames[period]?.name || period,
          order: periodNames[period]?.order || 0,
          value: parseFloat(value) || 0,
          item: names[dxId]?.name || dxId
        };
      }
    });
    
    // Convert to array and sort by order
    return Object.values(formattedData).sort((a, b) => a.order - b.order);
  }, [timeSeriesData]);
  
  // Handler for updating period settings
  const handleUpdatePeriodSettings = () => {
    // The query will automatically re-run when periodType or periodCount changes
  };
  
  // If no data items are available
  if (dataItems.length === 0) {
    return (
      <Card className={classes.visualizationCard}>
        <NoticeBox title={i18n.t('No data items available')}>
          {i18n.t('Add data items to your table to enable advanced visualizations.')}
        </NoticeBox>
      </Card>
    );
  }
  
  return (
    <Card className={classes.visualizationCard}>
      <h3 className={classes.vizTitle}>{i18n.t('Advanced Visualizations')}</h3>
      
      <TabBar>
        <Tab 
          selected={activeTab === 'trend'} 
          onClick={() => setActiveTab('trend')}
        >
          {i18n.t('Trend Analysis')}
        </Tab>
        <Tab 
          selected={activeTab === 'comparison'} 
          onClick={() => setActiveTab('comparison')}
        >
          {i18n.t('Data Comparison')}
        </Tab>
      </TabBar>
      
      <Divider />
      
      <div className={classes.controlPanel}>
        <div className={classes.controlRow}>
          <SingleSelect
            label={i18n.t('Select data item')}
            selected={selectedDataItem}
            onChange={({ selected }) => setSelectedDataItem(selected)}
            className={classes.select}
          >
            {dataItems.map(item => (
              <SingleSelectOption key={item.id} value={item.id} label={item.name} />
            ))}
          </SingleSelect>
          
          {activeTab === 'trend' && (
            <>
              <SingleSelect
                label={i18n.t('Period type')}
                selected={periodType}
                onChange={({ selected }) => setPeriodType(selected)}
                className={classes.select}
              >
                <SingleSelectOption value="days" label={i18n.t('Days')} />
                <SingleSelectOption value="weeks" label={i18n.t('Weeks')} />
                <SingleSelectOption value="months" label={i18n.t('Months')} />
                <SingleSelectOption value="quarters" label={i18n.t('Quarters')} />
                <SingleSelectOption value="years" label={i18n.t('Years')} />
              </SingleSelect>
              
              <InputField
                label={i18n.t('Number of periods')}
                type="number"
                value={periodCount}
                onChange={({ value }) => setPeriodCount(Math.min(12, Math.max(1, parseInt(value) || 1)))}
                className={classes.input}
                min={1}
                max={12}
              />
              
              <Button
                small
                primary
                onClick={handleUpdatePeriodSettings}
                className={classes.updateButton}
              >
                {i18n.t('Update')}
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className={classes.chartContainer}>
        {loading && (
          <div className={classes.loader}>
            <CircularLoader />
            <p>{i18n.t('Loading visualization data...')}</p>
          </div>
        )}
        
        {error && (
          <NoticeBox error title={i18n.t('Error loading visualization data')}>
            {error.message || i18n.t('An unknown error occurred while fetching data.')}
          </NoticeBox>
        )}
        
        {!loading && !error && activeTab === 'trend' && (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={formattedTimeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
              />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" fillOpacity={0.3} />
              <Line type="monotone" dataKey="value" stroke="#ff7300" activeDot={{ r: 8 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
        
        {!loading && !error && activeTab === 'comparison' && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={formattedTimeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
              />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="value" 
                name={dataItems.find(item => item.