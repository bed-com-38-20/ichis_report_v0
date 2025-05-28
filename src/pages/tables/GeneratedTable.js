import React, { useRef, useState } from 'react'
import {
    Button,
    ButtonStrip,
    Card,
    Help,
    IconInfo16,
    colors
} from '@dhis2/ui'
import i18n from '../../locales'
import { useReactToPrint } from 'react-to-print'
import { useNavigate, useParams } from 'react-router-dom'

import BackButton from '../../components/BackButton'
import Icon from '../../components/Icon'
import classes from './styles/GeneratedTable.module.css'
import utils from '../../styles/utils.module.css'
import { ReportParameters, TableWithData } from './generated-table'
import { EDIT_TABLE, getPath, TABLES } from '../../modules/paths'
import { DATA } from '../../modules/contentTypes'
import { useTableState } from '../../context/tableContext'
import HelpButton from '../../components/HelpButton'
import { FootnotesProvider } from '../../context/footnotesContext'

export function isAllPopulatedInTable(key, table) {
    return table.rows.every(row =>
        row.cells.every(cell => {
            if (cell.contentType !== DATA || !cell.data.item) return true
            return cell.data[key].length > 0
        })
    )
}

export function GeneratedTable() {
    const navigate = useNavigate()
    const { id } = useParams()
    const table = useTableState()

    const [reportParams, setReportParams] = useState({
        selectedOrgUnits: [],
        selectedPeriods: [],
    })
    const [reportParamsDialogOpen, setReportParamsDialogOpen] = useState(true)
    const [reportParamsErrors, setReportParamsErrors] = useState([])

    const printRef = useRef()
    const handlePrint = useReactToPrint({ content: () => printRef.current })

    const toggleReportParamsDialog = () =>
        setReportParamsDialogOpen((state) => !state)

    const orgUnitParamNeeded = !isAllPopulatedInTable('orgUnits', table)
    const periodParamNeeded = !isAllPopulatedInTable('periods', table)

    function onGenerate(params) {
        const errors = []
        if (periodParamNeeded && params.selectedPeriods.length === 0) {
            errors.push(
                i18n.t(
                    'One or more periods are required to query data for this table.'
                )
            )
            setReportParamsDialogOpen(true)
        }
        setReportParamsErrors(errors)
        setReportParams(params)
    }

    return (
        <div id="generated-table" className={classes.container}>
            {(orgUnitParamNeeded || periodParamNeeded) && (
                <ReportParameters
                    open={reportParamsDialogOpen}
                    errors={reportParamsErrors}
                    pickOrgUnits={orgUnitParamNeeded}
                    pickPeriods={periodParamNeeded}
                    toggleModal={toggleReportParamsDialog}
                    onGenerate={onGenerate}
                />
            )}

            <header className={classes.header}>
                <div className={classes.headerContent}>
                    <BackButton
                        to={TABLES}
                        text={i18n.t('Back to Saved Reports')}
                    />
                    <div className={classes.titleRow}>
                        <h1 className={classes.reportTitle}>
                            {i18n.t('Generated Report')}
                        </h1>
                        <HelpButton subsection="#generating-a-table-from-a-template" />
                    </div>
                    <Help>
                        <div style={{ display: 'flex', alignItems: 'center', color: colors.grey800 }}>
                            <IconInfo16 style={{ marginRight: 8 }} />
                            {i18n.t('Hover over a cell to see more information.')}
                        </div>
                    </Help>
                </div>

                <ButtonStrip end className={classes.buttonStrip}>
                    <Button
                        large
                        primary
                        icon={<Icon name="edit" />}
                        onClick={toggleReportParamsDialog}
                    >
                        {i18n.t('Change Parameters')}
                    </Button>
                    <Button
                        large
                        secondary
                        icon={<Icon name="table_chart" />}
                        onClick={() => navigate(getPath(EDIT_TABLE, id))}
                    >
                        {i18n.t('View Template')}
                    </Button>
                    <Button
                        large
                        destructive
                        icon={<Icon name="print" />}
                        onClick={handlePrint}
                    >
                        {i18n.t('Print Report')}
                    </Button>
                </ButtonStrip>
            </header>

            <main>
                <Card className={classes.card}>
                    <div ref={printRef} className={classes.printSection}>
                        <FootnotesProvider>
                            <TableWithData
                                {...reportParams}
                                periodParamNeeded={periodParamNeeded}
                            />
                        </FootnotesProvider>
                    </div>
                </Card>
            </main>
        </div>
    )
}

export default GeneratedTable
