import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
} from '@dhis2/ui'
import i18n from '../../../locales'

import { GeneratedTableCell } from './GeneratedTableCell'
import { useTableState } from '../../../context/tableContext'
import { useFootnotes } from '../../../context/footnotesContext'
import Footnotes from './Footnotes'

export function getSelectedIds(selectedItems) {
    return selectedItems.map(({ id }) => id).join(';')
}

export function getSelectedNames(selectedItems) {
    return selectedItems.map(({ name }) => name).join(', ')
}

function populateFootnotes(table, footnotes) {
    const { setOrgUnitFootnotes, setPeriodFootnotes } = footnotes
    const orgUnitFootnotes = new Map()
    const periodFootnotes = new Map()

    table.rows.forEach(row => {
        row.cells.forEach(cell => {
            if (cell.data.orgUnits.length > 0) {
                const key = getSelectedIds(cell.data.orgUnits)
                if (orgUnitFootnotes.get(key) === undefined) {
                    orgUnitFootnotes.set(key, {
                        id: `ou${orgUnitFootnotes.size + 1}`,
                        description: getSelectedNames(cell.data.orgUnits),
                    })
                }
            }

            if (cell.data.periods.length > 0) {
                const key = getSelectedIds(cell.data.periods)
                if (periodFootnotes.get(key) === undefined) {
                    periodFootnotes.set(key, {
                        id: `p${periodFootnotes.size + 1}`,
                        description: getSelectedNames(cell.data.periods),
                    })
                }
            }
        })
    })

    setOrgUnitFootnotes(orgUnitFootnotes)
    setPeriodFootnotes(periodFootnotes)
}

export function TableWithData({
    periodParamNeeded,
    selectedOrgUnits,
    selectedPeriods,
}) {
    const table = useTableState()
    const footnotes = useFootnotes()

    useEffect(() => {
        populateFootnotes(table, footnotes)
    }, [])

    if (periodParamNeeded && !selectedPeriods.length)
        return <p>Waiting for parameters...</p>

    function tableHeader() {
        return (
            <TableRowHead>
                <TableCellHead />
                {table.columns.map((col, idx) => (
                    <TableCellHead key={idx}>{col.name}</TableCellHead>
                ))}
            </TableRowHead>
        )
    }

    function mapCellValues(cell, idx) {
        return (
            <GeneratedTableCell
                key={idx}
                cell={cell}
                selectedOrgUnits={selectedOrgUnits}
                selectedPeriods={selectedPeriods}
            />
        )
    }

    function tableBody() {
        return table.rows.map((row, idx) => (
            <TableRow key={idx}>
                <TableCellHead>{row.name}</TableCellHead>
                {row.cells.map(mapCellValues)}
            </TableRow>
        ))
    }

    return (
        <>
            <div className="report-header">
                <h2 className="report-title">{table.name}</h2>

                {selectedOrgUnits.length > 0 && (
                    <div className="meta-block">
                        <span className="meta-label">
                            {i18n.t('Organisation Unit(s)')}:
                        </span>
                        <span className="meta-value">
                            {getSelectedNames(selectedOrgUnits)}
                        </span>
                    </div>
                )}

                {selectedPeriods.length > 0 && (
                    <div className="meta-block">
                        <span className="meta-label">
                            {i18n.t('Period(s)')}:
                        </span>
                        <span className="meta-value">
                            {getSelectedNames(selectedPeriods)}
                        </span>
                    </div>
                )}

                <div className="meta-block">
                    <span className="meta-label">{i18n.t('Date')}:</span>
                    <span className="meta-value">
                        {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            <Table>
                <TableHead>{tableHeader()}</TableHead>
                <TableBody>{tableBody()}</TableBody>
            </Table>

            <Footnotes />

            <style jsx>{`
                .report-header {
                    margin-bottom: 24px;
                    padding: 16px;
                    background: #f5f8fa;
                    border-radius: 8px;
                    border: 1px solid #dde6ed;
                }

                .report-title {
                    font-size: 1.6rem;
                    font-weight: 700;
                    margin-bottom: 16px;
                    color: #1c3d5a;
                }

                .meta-block {
                    margin-bottom: 10px;
                }

                .meta-label {
                    font-weight: 600;
                    color: #333;
                    margin-right: 4px;
                }

                .meta-value {
                    font-weight: 400;
                    color: #555;
                }
            `}</style>
        </>
    )
}

TableWithData.propTypes = {
    periodParamNeeded: PropTypes.bool.isRequired,
    selectedOrgUnits: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
    selectedPeriods: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
}

export default TableWithData
