import React from 'react';
import { useDrop } from 'react-dnd';
import { DataTableCell } from '@dhis2/ui';

const TableCellDropTarget = ({ rowId, columnId, onDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'ITEM',
        drop: (item) => onDrop(item, rowId, columnId),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <DataTableCell
            ref={drop}
            style={{
                backgroundColor: isOver ? '#f0f7ff' : 'transparent',
                minWidth: '120px',
            }}
        >
            {/* Content would go here */}
        </DataTableCell>
    );
};

export default TableCellDropTarget;