import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DataTableColumnHeader } from '@dhis2/ui';

const ColumnHeader = ({ column, index, moveColumn, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'COLUMN',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveColumn(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  return (
    <div ref={(node) => drag(drop(node))}>
      <DataTableColumnHeader
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          backgroundColor: isDragging ? '#f0f7ff' : 'transparent',
          transition: 'all 0.2s ease'
        }}
      >
        {children}
      </DataTableColumnHeader>
    </div>
  );
};

export default ColumnHeader;