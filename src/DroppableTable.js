import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { DataTable, DataTableRow, DataTableCell, DataTableColumnHeader } from '@dhis2/ui';
import TableCellDropTarget from './TableCellDropTarget';

const DroppableTable = () => {
    const [tableData, setTableData] = useState({});
    const [columns, setColumns] = useState(['Period', 'Organisation Unit']);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'ITEM',
        drop: (item) => {
            if (!columns.includes(item.name)) {
                setColumns([...columns, item.name]);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Sample data
    const periods = ['2023Q1', '2023Q2'];
    const orgUnits = ['Facility A', 'Facility B'];

    const handleCellDrop = (item, period, orgUnit, column) => {
        setTableData(prev => ({
            ...prev,
            [`${period}-${orgUnit}-${column}`]: item.name
        }));
    };

    return (
        <div 
            ref={drop}
            style={{
                border: isOver ? '2px dashed #0064d5' : '2px dashed transparent',
                padding: '10px',
            }}
        >
            <DataTable>
                <DataTableRow>
                    {columns.map(column => (
                        <DataTableColumnHeader key={column}>
                            {column}
                        </DataTableColumnHeader>
                    ))}
                </DataTableRow>
                
                {periods.flatMap(period => 
                    orgUnits.map(orgUnit => (
                        <DataTableRow key={`${period}-${orgUnit}`}>
                            <DataTableCell>{period}</DataTableCell>
                            <DataTableCell>{orgUnit}</DataTableCell>
                            {columns.slice(2).map(column => (
                                <TableCellDropTarget
                                    key={column}
                                    rowId={`${period}-${orgUnit}`}
                                    columnId={column}
                                    onDrop={(item) => handleCellDrop(item, period, orgUnit, column)}
                                >
                                    {tableData[`${period}-${orgUnit}-${column}`] || '-'}
                                </TableCellDropTarget>
                            ))}
                        </DataTableRow>
                    ))
                )}
            </DataTable>
        </div>
    );
};

export default DroppableTable;