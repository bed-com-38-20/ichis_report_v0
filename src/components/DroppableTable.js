import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { DataTable, DataTableRow, DataTableCell, DataTableColumnHeader } from '@dhis2/ui';
import TableCellDropTarget from './TableCellDropTarget';

const DroppableTable = () => {
    const [tableData, setTableData] = useState({});
    const [columns, setColumns] = useState([
        { id: 'period', name: 'Period', type: 'system' },
        { id: 'orgUnit', name: 'Organisation Unit', type: 'system' }
    ]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'ITEM',
        drop: (item) => {
            // Add the dropped item as a new column if it's not already there
            const columnExists = columns.some(col => col.id === item.id);
            if (!columnExists) {
                setColumns([...columns, {
                    id: item.id,
                    name: item.name,
                    type: item.type || 'dataElement'
                }]);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Sample data
    const periods = ['2023Q1', '2023Q2'];
    const orgUnits = ['Facility A', 'Facility B'];

    const handleCellDrop = (item, period, orgUnit, columnId) => {
        setTableData(prev => ({
            ...prev,
            [`${period}-${orgUnit}-${columnId}`]: {
                value: item.name,
                type: item.type
            }
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
                        <DataTableColumnHeader key={column.id}>
                            {column.name}
                            {column.type !== 'system' && (
                                <div style={{ fontSize: '0.8em', color: '#666' }}>
                                    {column.type}
                                </div>
                            )}
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
                                    key={column.id}
                                    rowId={`${period}-${orgUnit}`}
                                    columnId={column.id}
                                    onDrop={(item) => handleCellDrop(item, period, orgUnit, column.id)}
                                >
                                    {tableData[`${period}-${orgUnit}-${column.id}`]?.value || '-'}
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