import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DataTableColumnHeader } from '@dhis2/ui';

const ColumnGroupHeader = ({ group, index, moveGroup, children }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'COLUMN_GROUP',
        item: { index, groupId: group.id },
        canDrag: () => group.type !== 'fixed', // Only allow dragging non-fixed groups
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'COLUMN_GROUP',
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveGroup(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div 
            ref={group.type !== 'fixed' ? (node) => drag(drop(node)) : null}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: group.type !== 'fixed' ? 'move' : 'default',
                backgroundColor: isDragging ? '#f0f7ff' : 'transparent',
                transition: 'all 0.2s ease',
            }}
            colSpan={group.columns.length}
        >
            <DataTableColumnHeader>
                {React.Children.map(children, (child, i) => (
                    <div key={i} style={{ 
                        padding: '8px 12px',
                        borderRight: i < React.Children.count(children) - 1 ? '1px solid #e0e0e0' : 'none'
                    }}>
                        {child}
                    </div>
                ))}
            </DataTableColumnHeader>
        </div>
    );
};

export default ColumnGroupHeader;