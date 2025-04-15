import React from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@dhis2/ui';

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.type || 'ITEM',
    item: { 
      id: item.id, 
      name: item.name,
      type: item.type || 'generic'
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        marginBottom: '8px'
      }}
    >
      <Button small>{item.name}</Button>
    </div>
  );
};

export default DraggableItem;