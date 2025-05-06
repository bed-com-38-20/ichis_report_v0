import React from 'react';
import { useDrag } from 'react-dnd';
import { Button, Card } from '@dhis2/ui';
import './styles.css';

const ComponentsPanel = ({ onAddColumn, onAddItem }) => {
  const [{ isDragging: isColDragging }, colDrag] = useDrag(() => ({
    type: 'COLUMN',
    item: { id: `col-${Date.now()}`, name: 'New Column' },
    end: (item, monitor) => monitor.didDrop() && onAddColumn(item),
  }));

  const [{ isDragging: isItemDragging }, itemDrag] = useDrag(() => ({
    type: 'ITEM',
    item: { id: `item-${Date.now()}`, name: 'New Item' },
    end: (item, monitor) => monitor.didDrop() && onAddItem(item),
  }));

  return (
    <Card className="components-panel">
      <div className="panel-content">
        <h3>Components</h3>
        <div
          ref={colDrag}
          className={`drag-item ${isColDragging ? 'dragging' : ''}`}
        >
          <Button>Add Column</Button>
        </div>
        <div
          ref={itemDrag}
          className={`drag-item ${isItemDragging ? 'dragging' : ''}`}
        >
          <Button>Add Data Item</Button>
        </div>
      </div>
    </Card>
  );
};

export default ComponentsPanel;