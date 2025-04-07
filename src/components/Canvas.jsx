import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import TextElement from "./elements/TextElement";
import TableElement from "./elements/TableElement";
import ChartElement from "./elements/ChartElement";

const ResponsiveGrid = WidthProvider(Responsive);

const Canvas = ({ 
  layout, 
  onLayoutChange,
  selectedElementId,
  updateElement 
}) => {
  const renderElement = (item) => {
    switch (item.type) {
      case "table":
        return <TableElement data={item.data} />;
      case "chart":
        return <ChartElement data={item.data} />;
      case "text":
        return (
          <TextElement
            text={item.data.text}
            isEditing={selectedElementId === item.i}
            onUpdate={(newText) => 
              updateElement(item.i, { data: { text: newText } })
            }
          />
        );
      default:
        return <div>Unknown element type: {item.type}</div>;
    }
  };

  return (
    <ResponsiveGrid
      className="canvas"
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200 }}
      cols={{ lg: 12 }}
      rowHeight={30}
      onLayoutChange={onLayoutChange}
      isDraggable
      isResizable
    >
      {layout.map((item) => (
        <div 
          key={item.i} 
          data-grid={item}
          className={`grid-item ${selectedElementId === item.i ? 'selected' : ''}`}
        >
          {renderElement(item)}
        </div>
      ))}
    </ResponsiveGrid>
  );
};

export default Canvas;