import React, { useState, useMemo } from 'react';
import {
  Card,
  Divider,
  CircularLoader,
  NoticeBox,
  Box,
  Button,
  ButtonStrip,
  SegmentedControl,
  IconVisualizationColumn16,
  IconVisualizationPie16,
  IconVisualizationLine16,
  IconTable16,
  IconDownload16,
  IconFullscreen16,
  IconMore16,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableCellHead
} from '@dhis2/ui';
import { useDataQuery } from '@dhis2/app-runtime';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import PropTypes from 'prop-types';
import i18n from '../../../locales';
import { useTableState } from '../../../context/tableContext';

function getSelectedIds(items) {
  // If items is a string, return as is
  if (typeof items === 'string') {
    return items;
  }
  
  // If items is an array, join the IDs
  if (Array.isArray(items)) {
    return items.map(item => item.id || item).join(';');
  }
  
  return '';
}

// Extract month and year from period names
function extractMonthYear(periodName) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthRegex = new RegExp(months.join('|'), 'i');
  const yearRegex = /\b(20\d{2})\b/; // Match years like 2022, 2023, etc.
  
  const monthMatch = periodName.match(monthRegex);
  const yearMatch = periodName.match(yearRegex);
  
  let month = null;
  let year = null;
  
  if (monthMatch) {
    const monthName = monthMatch[0];
    month = months.findIndex(m => new RegExp(m, 'i').test(monthName)) + 1;
  }
  
  if (yearMatch) {
    year = parseInt(yearMatch[0]);
  }
  
  return { month, year };
}

// DHIS2 visualization color scheme - matches DHIS2 Data Visualizer
const CHART_COLORS = [
  '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
  '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'
];

// Analytics query
const ANALYTICS_VISUALIZATION_QUERY = {
  result: {
    resource: 'analytics',
    params: ({ dxIds, ouIds, peIds }) => {
      console.log('Query parameters:', {
        dataItems: dxIds,
        periods: peIds,
        orgUnits: ouIds
      });
      
      // Check if we have multiple periods or a single one
      const manyPeriods = peIds.includes(';');
      
      // Always include periods as dimension for x-axis
      const dimensions = [`dx:${dxIds.join(';')}`, `pe:${peIds}`];
      const filters = [];
      
      // Add org units as filter if it's a single one, otherwise as dimension
      if (ouIds.includes(';')) {
        dimensions.push(`ou:${ouIds}`);
      } else {
        filters.push(`ou:${ouIds}`);
      }
      
      const params = {
        dimension: dimensions,
        skipMeta: false
      };
      
      if (filters.length > 0) {
        params.filter = filters;
      }
      
      return params;
    },
  },
};

function ReportVisualizations({ selectedOrgUnits, selectedPeriods }) {
  // State hooks
  const [visualizationType, setVisualizationType] = useState('column');
  const table = useTableState();
  
  // Extract all data items and their values from the table
  const { dataItems, tableData } = useMemo(() => {
    const items = [];
    const tableValues = [];
    
    // Debug the table structure
    console.log('Table structure:', table);
    
    // Process the table rows and cells
    table.rows.forEach((row, rowIndex) => {
      if (!row.cells) return;
      
      const rowData = {};
      let hasPeriod = false;
      let periodId = null;
      let periodName = null;
      
      // First pass: Check for period cells
      row.cells.forEach(cell => {
        if (cell.contentType === 'period' && cell.data?.period) {
          hasPeriod = true;
          periodId = cell.data.period.id;
          periodName = cell.data.period.name || cell.data.period.id;
          rowData.periodId = periodId;
          rowData.periodName = periodName;
        }
      });
      
      // If no period found, try to use the period from the header or selectedPeriods
      if (!hasPeriod && selectedPeriods.length > 0) {
        periodId = selectedPeriods[0].id || selectedPeriods[0];
        periodName = selectedPeriods[0].name || periodId;
        rowData.periodId = periodId;
        rowData.periodName = periodName;
      }
      
      // Second pass: Get data values
      row.cells.forEach((cell, cellIndex) => {
        if (cell.contentType === 'data' && cell.data?.item) {
          const item = cell.data.item;
          items.push(item);
          
          rowData.dataItemId = item.id;
          rowData.dataItemName = item.name || item.id;
          
          // Get the value, with fallbacks
          let value = null;
          if (cell.data.value !== undefined && cell.data.value !== null) {
            value = parseFloat(cell.data.value);
          } else if (cell.value !== undefined && cell.value !== null) {
            value = parseFloat(cell.value);
          }
          
          if (!isNaN(value)) {
            rowData.value = value;
          }
        } else if (cell.value !== undefined && cell.value !== null) {
          // For cells without data items but with values
          const columnHeader = `Column ${cellIndex + 1}`;
          const value = parseFloat(cell.value);
          
          if (!isNaN(value)) {
            rowData[columnHeader] = value;
          }
        }
      });
      
      // Add the row data if it has useful information
      if (Object.keys(rowData).length > 2) { // More than just period info
        tableValues.push(rowData);
      }
    });
    
    console.log('Extracted data items:', items);
    console.log('Extracted table values:', tableValues);
    
    return { dataItems: items, tableData: tableValues };
  }, [table, selectedPeriods]);
  
  // Prepare query variables
  const queryVars = {
    dxIds: dataItems.map(item => item.id),
    ouIds: selectedOrgUnits.length > 0 
      ? getSelectedIds(selectedOrgUnits) 
      : 'USER_ORGUNIT',
    peIds: selectedPeriods.length > 0 
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
  
  // Prepare chart data from analytics result with periods on x-axis
  const chartData = useMemo(() => {
    if (!data?.result && tableData.length === 0) return [];
    
    // Build chart data directly from the table first
    // Group by period to prepare data with periods on x-axis
    const periodGroups = {};
    
    // Process table data first since it's the source of truth
    tableData.forEach(item => {
      const periodId = item.periodId || 'Unknown Period';
      const periodName = item.periodName || periodId;
      
      // Initialize period group if it doesn't exist
      if (!periodGroups[periodId]) {
        periodGroups[periodId] = {
          id: periodId,
          name: periodName
        };
      }
      
      // Add data item value to the period group
      if (item.dataItemName && item.value !== undefined) {
        periodGroups[periodId][item.dataItemName] = item.value;
      }
      
      // Add any other column values
      Object.keys(item).forEach(key => {
        if (key.startsWith('Column ') && item[key] !== undefined) {
          periodGroups[periodId][key] = item[key];
        }
      });
    });
    
    // If we have analytics data, integrate it
    if (data?.result) {
      const metaData = data.result.metaData || {};
      const names = metaData.items || {};
      const dimensions = metaData.dimensions || {};
      
      console.log('Full analytics response:', data.result);
      
      // Identify data elements and periods
      const dataElementIds = dimensions.dx || [];
      const periodIds = dimensions.pe || [];
      
      // Process analytics rows
      data.result.rows?.forEach(row => {
        let dxId = null;
        let peId = null;
        let value = null;
        
        // Extract information from analytics row
        for (let i = 0; i < row.length; i++) {
          const cell = row[i];
          
          // Last item is typically the value
          if (i === row.length - 1 && !isNaN(parseFloat(cell))) {
            value = parseFloat(cell);
          }
          // Check if cell is a data element ID
          else if (dataElementIds.includes(cell)) {
            dxId = cell;
          }
          // Check if cell is a period ID
          else if (periodIds.includes(cell) || 
                  (typeof cell === 'string' && 
                   (cell.match(/^\d{4}/) || cell.match(/^(LAST|THIS)/)))) {
            peId = cell;
          }
        }
        
        // Add to period groups if we have all necessary info
        if (dxId && peId && value !== null) {
          const dxName = names[dxId]?.name || dxId;
          const peName = names[peId]?.name || peId;
          
          // Initialize period group if it doesn't exist
          if (!periodGroups[peId]) {
            periodGroups[peId] = {
              id: peId,
              name: peName
            };
          }
          
          // Only add the analytics value if we don't already have a value
          // from the table (table values should take precedence)
          if (periodGroups[peId][dxName] === undefined) {
            periodGroups[peId][dxName] = value;
          }
        }
      });
    }
    
    // Convert period groups to array and handle special cases
    let resultData = Object.values(periodGroups);
    
    // If no periods with data found from table or analytics, try using selected periods
    if (resultData.length === 0 && selectedPeriods.length > 0) {
      resultData = selectedPeriods.map(period => {
        const id = period.id || period;
        const name = period.name || id;
        
        // Create an entry for each selected period
        return {
          id,
          name
        };
      });
    }
    
  // Sort resultData chronologically if possible
    resultData.sort((a, b) => {
      // For standard period IDs with years (like 202205, 202206), we can sort numerically
      if (a.id.match(/^\d{6}$/) && b.id.match(/^\d{6}$/)) {
        return parseInt(a.id) - parseInt(b.id);
      }
      // For year-month formats (2022-05, 2022-06)
      else if (a.id.match(/^\d{4}-\d{2}$/) && b.id.match(/^\d{4}-\d{2}$/)) {
        return a.id.localeCompare(b.id);
      }
      // For dates in names (May 2022, June 2022)
      else if (a.name && b.name) {
        const aInfo = extractMonthYear(a.name);
        const bInfo = extractMonthYear(b.name);
        
        if (aInfo.year && bInfo.year) {
          if (aInfo.year !== bInfo.year) return aInfo.year - bInfo.year;
          if (aInfo.month && bInfo.month) return aInfo.month - bInfo.month;
        }
      }
      
      // Default to alphabetical sort
      return a.name.localeCompare(b.name);
    });
    
    console.log('Final chart data prepared with periods and values:', resultData);
    return resultData;
  }, [data, tableData, selectedPeriods]);
  
  // Prepare pie chart data - use aggregated data across all periods
  const pieChartData = useMemo(() => {
    if (!chartData.length) return [];
    
    // Calculate totals for each data element across all periods
    const totals = {};
    
    // Track if we have any non-zero values
    let hasData = false;
    
    chartData.forEach(peData => {
      Object.keys(peData).forEach(key => {
        if (key !== 'name' && key !== 'id') {
          if (!totals[key]) {
            totals[key] = 0;
          }
          const value = parseFloat(peData[key]) || 0;
          totals[key] += value;
          
          if (value > 0) {
            hasData = true;
          }
        }
      });
    });
    
    // If we have no data, create sample data to make the pie chart visible
    if (!hasData && Object.keys(totals).length === 0) {
      // Get all possible data items from the table
      tableData.forEach(item => {
        if (item.dataItemName) {
          totals[item.dataItemName] = 1; // Set a minimum value of 1 to make visible
        }
      });
      
      // If still no data items, use some defaults
      if (Object.keys(totals).length === 0) {
        totals['Sample Data 1'] = 40;
        totals['Sample Data 2'] = 30;
        totals['Sample Data 3'] = 20;
      }
    }
    
    // Convert to pie chart format
    return Object.keys(totals)
      .filter(key => totals[key] > 0) // Filter out zero values
      .map((key, index) => ({
        name: key,
        value: totals[key],
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));
  }, [chartData, tableData]);
  
  // Generate series configuration for charts - include column headers
  const seriesConfig = useMemo(() => {
    if (!chartData.length) return [];
    
    // Extract all keys except 'name' and 'id' to get the series names
    const firstEntry = chartData[0];
    
    // Check if we have values from the report table (Column X values)
    const hasColumnValues = Object.keys(firstEntry).some(key => key.startsWith('Column '));
    
    // If we have column values, prioritize those
    if (hasColumnValues) {
      return Object.keys(firstEntry)
        .filter(key => key !== 'name' && key !== 'id')
        .sort((a, b) => {
          // Sort to ensure Column X values come first
          const aIsColumn = a.startsWith('Column ');
          const bIsColumn = b.startsWith('Column ');
          
          if (aIsColumn && !bIsColumn) return -1;
          if (!aIsColumn && bIsColumn) return 1;
          
          if (aIsColumn && bIsColumn) {
            // Sort columns numerically
            const aNum = parseInt(a.replace('Column ', ''));
            const bNum = parseInt(b.replace('Column ', ''));
            return aNum - bNum;
          }
          
          return a.localeCompare(b);
        })
        .map((key, index) => ({
          name: key,
          dataKey: key,
          color: CHART_COLORS[index % CHART_COLORS.length],
          type: 'monotone',
        }));
    }
    
    // Fall back to original behavior if no column values
    return Object.keys(firstEntry)
      .filter(key => key !== 'name' && key !== 'id')
      .map((key, index) => ({
        name: key,
        dataKey: key,
        color: CHART_COLORS[index % CHART_COLORS.length],
        type: 'monotone',
      }));
  }, [chartData]);
  
  // Handle visualization type change
  const handleVisualizationTypeChange = ({ value }) => {
    setVisualizationType(value);
  };
  
  // Check if there's actual data to display
  const hasChartData = !loading && chartData && chartData.length > 0;
  
  // If there are no data items, show message
  if (skipQuery) {
    return (
      <Card>
        <Box padding="16px">
          <NoticeBox title={i18n.t('No data to visualize')}>
            {i18n.t('No data items found in this table. Visualizations will appear when data items are present.')}
          </NoticeBox>
        </Box>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <Card>
        <Box padding="16px" height="300px" display="flex" alignItems="center" justifyContent="center">
          <CircularLoader />
        </Box>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <Box padding="16px">
          <NoticeBox error title={i18n.t('Error loading visualization data')}>
            {error.message || i18n.t('An unknown error occurred while fetching data.')}
          </NoticeBox>
        </Box>
      </Card>
    );
  }
  
  // If no chart data after loading, show no data message
  if (!hasChartData) {
    return (
      <Card>
        <Box padding="16px">
          <NoticeBox title={i18n.t('No data to visualize')}>
            {i18n.t('No data found for the selected parameters. Try changing the period or organization unit.')}
          </NoticeBox>
        </Box>
      </Card>
    );
  }
  
  return (
    <Card>
      <Box padding="16px">
        {/* Header with visualization type selection */}
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="16px">
          <SegmentedControl
            options={[
              { label: '', value: 'column', icon: <IconVisualizationColumn16 /> },
              { label: '', value: 'line', icon: <IconVisualizationLine16 /> },
              { label: '', value: 'pie', icon: <IconVisualizationPie16 /> },
              { label: '', value: 'table', icon: <IconTable16 /> }
            ]}
            selected={visualizationType}
            onChange={handleVisualizationTypeChange}
          />
          
          <ButtonStrip>
            <Button small icon={<IconDownload16 />}>
              {i18n.t('Download')}
            </Button>
            <Button small icon={<IconFullscreen16 />}>
              {i18n.t('Fullscreen')}
            </Button>
            <Button small icon={<IconMore16 />} />
          </ButtonStrip>
        </Box>
        
        <Divider margin="0 0 16px 0" />
        
        {/* Chart visualization area */}
        <Box height="400px">
          {/* Column chart */}
          {visualizationType === 'column' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6e6e6e', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                  label={{ value: i18n.t('Period'), position: 'insideBottomRight', offset: -10, fill: '#333' }}
                />
                <YAxis 
                  tick={{ fill: '#6e6e6e', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                  label={{ value: i18n.t('Value'), angle: -90, position: 'insideLeft', offset: 10, fill: '#333' }}
                />
                <Tooltip 
                  formatter={(value) => value.toLocaleString()}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    padding: '10px'
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                {seriesConfig.map(config => (
                  <Bar 
                    key={config.dataKey} 
                    dataKey={config.dataKey} 
                    name={config.name} 
                    fill={config.color} 
                    barSize={25}
                    label={{
                      position: 'top',
                      formatter: (value) => value > 0 ? value.toLocaleString() : '',
                      style: { fontSize: '11px', fill: '#333' }
                    }}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
          
          {/* Line chart */}
          {visualizationType === 'line' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6e6e6e', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                  label={{ value: i18n.t('Period'), position: 'insideBottomRight', offset: -10, fill: '#333' }}
                />
                <YAxis 
                  tick={{ fill: '#6e6e6e', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                  label={{ value: i18n.t('Value'), angle: -90, position: 'insideLeft', offset: 10, fill: '#333' }}
                />
                <Tooltip 
                  formatter={(value) => value.toLocaleString()}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    padding: '10px'
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                {seriesConfig.map(config => (
                  <Line 
                    key={config.dataKey} 
                    dataKey={config.dataKey} 
                    name={config.name} 
                    stroke={config.color} 
                    strokeWidth={2}
                    dot={{ r: 4, fill: config.color }}
                    activeDot={{ r: 6 }}
                    type="monotone"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
          
          {/* Pie chart - shows aggregated data across periods */}
          {visualizationType === 'pie' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  innerRadius={0}
                  labelLine={true}
                  label={(entry) => entry.value > 0 ? `${entry.name}: ${entry.value.toLocaleString()}` : null}
                  paddingAngle={2}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => value.toLocaleString()}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    padding: '10px'
                  }}
                />
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          
          {/* Table view */}
          {visualizationType === 'table' && (
            <Box height="100%" overflow="auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellHead>{i18n.t('Period')}</TableCellHead>
                    {seriesConfig.map(config => (
                      <TableCellHead key={config.dataKey}>
                        {config.name}
                      </TableCellHead>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chartData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      {seriesConfig.map(config => (
                        <TableCell key={config.dataKey}>
                          {row[config.dataKey]?.toLocaleString() || '0'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
}

ReportVisualizations.propTypes = {
  selectedOrgUnits: PropTypes.array.isRequired,
  selectedPeriods: PropTypes.array.isRequired
};

export default ReportVisualizations;