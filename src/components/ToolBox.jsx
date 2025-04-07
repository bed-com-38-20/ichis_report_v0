import React from 'react';
import { IconTable, IconVisualizationBar, IconText } from '@dhis2/ui-icons';


const Toolbox = ({ mode }) => {
  const elements = [
    { type: 'table', label: 'Pivot Table', icon: <IconTable /> },
    { type: 'chart', label: 'Chart', icon: <IconVisualizationBar /> },
    { type: 'text', label: 'Text Box', icon: <IconText /> },
  ];

  return (
    <div className="toolbox">
      <h3>Report Elements</h3>
      <div className="toolbox-section">
        <h4>Data Visualizations</h4>
        {elements.slice(0,2).map(el => (
          <div 
            key={el.type}
            draggable
            className="toolbox-item"
            onDragStart={(e) => {
              e.dataTransfer.setData("type", el.type);
              e.dataTransfer.effectAllowed = "copy";
            }}
          >
            {el.icon}
            <span>{el.label}</span>
          </div>
        ))}
      </div>
      <div className="toolbox-section">
        <h4>Text & Media</h4>
        {elements.slice(2).map(el => (
          <div 
            key={el.type}
            draggable
            className="toolbox-item"
            onDragStart={(e) => {
              e.dataTransfer.setData("type", el.type);
              e.dataTransfer.effectAllowed = "copy";
            }}
          >
            {el.icon}
            <span>{el.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toolbox;