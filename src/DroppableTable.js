import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { DataTable, DataTableRow, DataTableCell, Button } from '@dhis2/ui';
import ColumnHeader from './ColumnHeader';
import TableCellDropTarget from './TableCellDropTarget';
import './DroppableTable.css';

const DroppableTable = ({ config = {}, orgUnits = [], periods = [], onConfigChange, reportName, reportLogo }) => {
    const { columns = [{ name: 'Organisation Unit' }, { name: 'Period' }], data = {} } = config;

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ['indicator', 'dataElement'],
        drop: (item) => {
            if (!columns.some(c => c.name === item.name)) {
                onConfigChange({
                    ...config,
                    columns: [...columns, { name: item.name }]
                });
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));

    const moveColumn = useCallback((fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;
        const newColumns = [...columns];
        const [movedColumn] = newColumns.splice(fromIndex, 1);
        newColumns.splice(toIndex, 0, movedColumn);
        onConfigChange({ ...config, columns: newColumns });
    }, [columns, config, onConfigChange]);

    const handleCellDrop = (item, period, orgUnit, columnName) => {
        const newKey = `${period.id}-${orgUnit.id}-${columnName}`;
        onConfigChange({
            ...config,
            data: {
                ...data,
                [newKey]: {
                    value: item.name,
                    id: item.id,
                    type: item.type
                }
            }
        });
    };

    const removeColumn = (columnName) => {
        if (['Organisation Unit', 'Period'].includes(columnName)) return;
        const newColumns = columns.filter(col => col.name !== columnName);
        const newData = { ...data };
        Object.keys(newData).forEach(key => {
            if (key.endsWith(`-${columnName}`)) delete newData[key];
        });
        onConfigChange({ columns: newColumns, data: newData });
    };

    const evaluateFormula = (formula, periodId, orgUnitId) => {
        if (!formula) return '-';
        try {
            const vars = {};
            columns.forEach(col => {
                const key = `${periodId}-${orgUnitId}-${col.name}`;
                const value = parseFloat(data[key]?.value || 0);
                vars[col.name] = isNaN(value) ? 0 : value;
            });
            const safeExpr = formula.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, match =>
                vars.hasOwnProperty(match) ? `(${vars[match]})` : '0'
            );
            const result = eval(safeExpr);
            return isNaN(result) ? '-' : result.toFixed(2);
        } catch (e) {
            return 'Err';
        }
    };

    return (
        <div ref={drop} style={styles.dropArea(isOver)}>
            <div className="report-header">
                {reportLogo && <img src={reportLogo} alt="Logo" className="report-logo" />}
                <h2>{reportName}</h2>
            </div>
            <DataTable>
                <DataTableRow>
                    {columns.map((column, index) => (
                        <ColumnHeader
                            key={column.name}
                            column={column.name}
                            index={index}
                            moveColumn={moveColumn}
                        >
                            <div style={styles.columnContent}>
                                {column.name}
                                {!['Organisation Unit', 'Period'].includes(column.name) && (
                                    <Button
                                        small
                                        destructive
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeColumn(column.name);
                                        }}
                                        style={styles.removeButton}
                                    >
                                        ×
                                    </Button>
                                )}
                            </div>
                        </ColumnHeader>
                    ))}
                </DataTableRow>
                {(orgUnits || []).flatMap(orgUnit =>
                    (periods || []).map(period => (
                        <DataTableRow key={`${orgUnit.id}-${period.id}`}>
                            {columns.map(column => {
                                const columnName = column.name;
                                const isFormula = !!column.formula;

                                if (columnName === 'Organisation Unit') {
                                    return <DataTableCell key="orgUnit">{orgUnit.displayName}</DataTableCell>;
                                }

                                if (columnName === 'Period') {
                                    return <DataTableCell key="period">{period.displayName}</DataTableCell>;
                                }

                                if (isFormula) {
                                    return (
                                        <DataTableCell key={columnName}>
                                            {evaluateFormula(column.formula, period.id, orgUnit.id)}
                                        </DataTableCell>
                                    );
                                }

                                return (
                                    <TableCellDropTarget
                                        key={columnName}
                                        column={columnName}
                                        onDrop={(item) =>
                                            handleCellDrop(item, period, orgUnit, columnName)
                                        }
                                    >
                                        {data[`${period.id}-${orgUnit.id}-${columnName}`]?.value || '-'}
                                    </TableCellDropTarget>
                                );
                            })}
                        </DataTableRow>
                    ))
                )}
            </DataTable>
        </div>
    );
};

const styles = {
    dropArea: (isOver) => ({
        border: isOver ? '2px dashed #0064d5' : '2px dashed transparent',
        borderRadius: '4px',
        padding: '8px',
        transition: 'all 0.2s'
    }),
    columnContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    removeButton: {
        marginLeft: '8px'
    }
};

export default DroppableTable;
