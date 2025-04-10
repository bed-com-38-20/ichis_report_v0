import React from 'react';
import { useDrop } from 'react-dnd';
import { DataTableCell } from '@dhis2/ui';

const TableCellDropTarget = ({ rowId, columnId, onDrop, canDrop, children }) => {
    const [{ isOver, canDrop: isDropAllowed }, drop] = useDrop(() => ({
        accept: ['indicator', 'dataElement'],
        drop: (item, monitor) => {
            if (canDrop && !canDrop(item)) {
                return;
            }
            onDrop(item, rowId, columnId);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
        canDrop: (item) => {
            return canDrop ? canDrop(item) : true;
        }
    }));

    return (
        <DataTableCell
            ref={drop}
            style={{
                backgroundColor: isOver && isDropAllowed ? '#f0f7ff' : 
                                isOver && !isDropAllowed ? '#ffebee' : 
                                'transparent',
                minWidth: '120px',
                border: isOver && isDropAllowed ? '1px solid #0064d5' : 
                       isOver && !isDropAllowed ? '1px solid #d32f2f' : 
                       '1px solid transparent',
            }}
            title={isOver && !isDropAllowed ? "This item can't be dropped here" : ""}
        >
            {children}
        </DataTableCell>
    );
};

export default TableCellDropTarget;