import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ item }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: item.type || 'calculated',
        item,
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }), [item]);

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                padding: '8px',
                marginBottom: '4px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                cursor: 'move'
            }}
        >
            {item.name}
        </div>
    );
};

export default DraggableItem;
