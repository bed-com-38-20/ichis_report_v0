import React, { useState } from 'react';
import { 
  LineChart, BarChart, PieChart, AreaChart, 
  Line, Bar, Pie, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import './chartIntegration.css'; 

const ChartIntegration = ({ data, onChartChange }) => {
  const [chartType, setChartType] = useState('bar');
  const [chartTitle, setChartTitle] = useState('ICHIS Data Report');
  const [xAxisField, setXAxisField] = useState('');
  const [yAxisField, setYAxisField] = useState('');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [chartColors, setChartColors] = useState(['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE']);

  //testing testing
  const sampleData = data || [
    { name: 'Jan', value: 400, value2: 240 },
    { name: 'Feb', value: 300, value2: 139 },
    { name: 'Mar', value: 200, value2: 980 },
    { name: 'Apr', value: 278, value2: 390 },
    { name: 'May', value: 189, value2: 480 },
  ];

  const handleChartTypeChange = (e) => {
    const type = e.target.value;
    setChartType(type);
    onChartChange({ type, title: chartTitle, xAxis: xAxisField, yAxis: yAxisField });
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setChartTitle(title);
    onChartChange({ type: chartType, title, xAxis: xAxisField, yAxis: yAxisField });
  };

  const renderChart = () => {
    switch(chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Bar dataKey="value" fill={chartColors[0]} name="Value 1" />
              <Bar dataKey="value2" fill={chartColors[1]} name="Value 2" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Line type="monotone" dataKey="value" stroke={chartColors[0]} name="Value 1" />
              <Line type="monotone" dataKey="value2" stroke={chartColors[1]} name="Value 2" />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sampleData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Area type="monotone" dataKey="value" fill={chartColors[0]} stroke={chartColors[0]} name="Value 1" />
              <Area type="monotone" dataKey="value2" fill={chartColors[1]} stroke={chartColors[1]} name="Value 2" />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sampleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {sampleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Select a chart type</div>;
    }
  };

  return (
    <div className="chart-integration">
      <h3>Chart Configuration</h3>
      <div className="chart-controls">
        <div className="control-item">
          <label>Chart Type:</label>
          <select value={chartType} onChange={handleChartTypeChange}>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
        
        <div className="control-item">
          <label>Chart Title:</label>
          <input
            type="text"
            value={chartTitle}
            onChange={handleTitleChange}
            placeholder="Enter chart title"
          />
        </div>
        
        <div className="control-item">
          <label>X-Axis Field:</label>
          <input
            type="text"
            value={xAxisField}
            onChange={(e) => setXAxisField(e.target.value)}
            placeholder="Field for X-Axis"
          />
        </div>
        
        <div className="control-item">
          <label>Y-Axis Field:</label>
          <input
            type="text"
            value={yAxisField}
            onChange={(e) => setYAxisField(e.target.value)}
            placeholder="Field for Y-Axis"
          />
        </div>
        
        <div className="control-item checkbox">
          <label>
            <input
              type="checkbox"
              checked={showLegend}
              onChange={(e) => setShowLegend(e.target.checked)}
            />
            Show Legend
          </label>
        </div>
        
        <div className="control-item checkbox">
          <label>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            Show Grid
          </label>
        </div>
      </div>
      
      <div className="chart-preview">
        <h4>{chartTitle}</h4>
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartIntegration;