import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Button, Card } from '@dhis2/ui';
import Toolbox from "../components/ToolBox";s
import PropertiesPanel from './PropertiesPanel';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './ReportDesigner.css';

const ResponsiveGrid = WidthProvider(Responsive);

const ReportDesigner = ({ mode }) => {
  const [layout, setLayout] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);

  // Define breakpoints and columns
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
  const defaultItemProps = {
    isDraggable: true,
    isResizable: true,
  };

  const onDrop = (layout, layoutItem, event) => {
    const type = event.dataTransfer.getData("type");
    const newElement = {
      i: `element-${Date.now()}`,
      x: layoutItem.x,
      y: layoutItem.y,
      w: layoutItem.w || (type === 'table' ? 12 : 6),
      h: layoutItem.h || (type === 'chart' ? 6 : 3),
      type,
      data: {},
    };
    setLayout([...layout, newElement]);
  };

  const updateElement = (id, updates) => {
    setLayout(layout.map(el => el.i === id ? {...el, ...updates} : el));
  };

  const renderElement = (item) => {
    switch(item.type) {
      case 'table': return <div className="element-content">Table Element</div>;
      case 'chart': return <div className="element-content">Chart Element</div>;
      case 'text': return <div className="element-content">Text Element</div>;
      default: return <div className="element-content">Unknown Element</div>;
    }
  };

  return (
    <div className="report-designer">
      <div className="designer-header">
        <h2>{mode === 'tables' ? 'Custom Tables Designer' : 'Custom Reports Designer'}</h2>
        <div className="designer-actions">
          <Button small>Save {mode === 'tables' ? 'Table' : 'Report'}</Button>
          <Button small>Export PDF</Button>
          <Button small>Export Excel</Button>
        </div>
      </div>

      <div className="designer-container">
        <Card className="toolbox-card">
          <Toolbox mode={mode} />
        </Card>

        <div className="canvas-area">
          <ResponsiveGrid
            className="layout"
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={30}
            onDrop={onDrop}
            isDroppable={true}
            draggableCancel=".element-content"
            layouts={{ lg: layout }}
            onLayoutChange={(newLayout) => setLayout(newLayout)}
            {...defaultItemProps}
          >
            {layout.map(item => (
              <div 
                key={item.i} 
                data-grid={item}
                className={`grid-item ${selectedElementId === item.i ? 'selected' : ''}`}
              >
                {renderElement(item)}
              </div>
            ))}
          </ResponsiveGrid>
        </div>

        <Card className="properties-card">
          <PropertiesPanel 
            element={layout.find(el => el.i === selectedElementId)} 
            onUpdate={updateElement}
          />
        </Card>
      </div>
    </div>
  );
};

export default ReportDesigner;