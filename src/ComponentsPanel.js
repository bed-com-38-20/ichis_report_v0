import React from 'react';
import { useDrag } from 'react-dnd';
import { Button, Card } from '@dhis2/ui';

const ComponentsPanel = ({ onAddColumn, onAddItem }) => {
  const [{ isDragging: isColumnDragging }, columnDrag] = useDrag(() => ({
    type: 'COLUMN',
    item: { id: `col-${Date.now()}`, name: 'New Column' },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        onAddColumn(item);
      }
    }
  }));

  const [{ isDragging: isItemDragging }, itemDrag] = useDrag(() => ({
    type: 'ITEM',
    item: { id: `item-${Date.now()}`, name: 'New Item' },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        onAddItem(item);
      }
    }
  }));

  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <h3>Report Components</h3>
        <div
          ref={columnDrag}
          style={{
            opacity: isColumnDragging ? 0.5 : 1,
            cursor: 'move',
            marginBottom: '8px'
          }}
        >
          <Button>Add Column</Button>
        </div>
        <div
          ref={itemDrag}
          style={{
            opacity: isItemDragging ? 0.5 : 1,
            cursor: 'move'
          }}
        >
          <Button>Add Item</Button>
        </div>
      </div>
    </Card>
  );
};

export default ComponentsPanel;