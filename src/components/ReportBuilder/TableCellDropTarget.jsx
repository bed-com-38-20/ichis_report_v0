import React from 'react';
import { useDrop } from 'react-dnd';
import { DataTableCell } from '@dhis2/ui';

const TableCellDropTarget = ({ rowId, columnId, value }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'DATA_VALUE',
    drop: (item) => {
      // Handle cell drop logic
      console.log(`Dropped ${item.value} at ${rowId}-${columnId}`);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <DataTableCell
      ref={drop}
      className={isOver ? 'cell-drop-active' : ''}
    >
      {value}
    </DataTableCell>
  );
};

export default TableCellDropTarget;