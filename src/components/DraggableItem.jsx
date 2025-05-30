import React from 'react';
import { useDrag } from 'react-dnd';
import { Button, Tooltip } from '@dhis2/ui';

const DraggableItem = ({ item }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        item: { 
            id: item.id, 
            name: item.displayName,
            type: item.indicatorType ? 'indicator' : 'dataElement'
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const itemType = item.indicatorType ? 'Indicator' : 'Data Element';
    const subText = item.indicatorType?.displayName || item.categoryCombo?.displayName;

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                marginBottom: '8px',
            }}
        >
            <Tooltip content={`${itemType}: ${subText}`}>
                <Button>{item.displayName}</Button>
            </Tooltip>
        </div>
    );
};

export default DraggableItem;