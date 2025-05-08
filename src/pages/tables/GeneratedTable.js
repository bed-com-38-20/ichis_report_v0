import React, { useRef, useState } from 'react';
import { Button, ButtonStrip, Card, Help, Switch } from '@dhis2/ui';
import i18n from '../../locales';
import { useReactToPrint } from 'react-to-print';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import Icon from '../../components/Icon';
import classes from './styles/GeneratedTable.module.css';
import utils from '../../styles/utils.module.css';
import { ReportParameters, TableWithData } from './generated-table';
import { EDIT_TABLE, getPath, TABLES } from '../../modules/paths';
import { DATA } from '../../modules/contentTypes';
import { useTableState } from '../../context/tableContext';
import HelpButton from '../../components/HelpButton';
import { FootnotesProvider } from '../../context/footnotesContext';
import ReportVisualizations from './generated-table/ReportVisualization';

export function isAllPopulatedInTable(key, table) {
    return table.rows.every((row) =>
        row.cells.every((cell) => {
            if (cell.contentType !== DATA || !cell.data.item) return true;
            return cell.data[key].length > 0;
        })
    );
}

export function GeneratedTable() {
    const navigate = useNavigate();
    const { id } = useParams();
    const table = useTableState();

    const [reportParams, setReportParams] = useState({
        selectedOrgUnits: [],
        selectedPeriods: [],
    });
    const [reportParamsDialogOpen, setReportParamsDialogOpen] = useState(true);
    const [reportParamsErrors, setReportParamsErrors] = useState([]);
    const [showVisualizations, setShowVisualizations] = useState(true);

    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => {
            if (!printRef.current) {
                console.error('printRef is not attached to a valid DOM element');
                return null;
            }
            return printRef.current;
        },
        documentTitle: table.name || 'Table Report',
    });

    const toggleReportParamsDialog = () =>
        setReportParamsDialogOpen((state) => !state);

    const orgUnitParamNeeded = !isAllPopulatedInTable('orgUnits', table);
    const periodParamNeeded = !isAllPopulatedInTable('periods', table);

    function onGenerate(params) {
        const errors = [];
        if (periodParamNeeded && params.selectedPeriods.length === 0) {
            errors.push(
                i18n.t(
                    'One or more periods are required to query data for this table.'
                )
            );
            setReportParamsDialogOpen(true);
        }
        setReportParamsErrors(errors);
        setReportParams(params);
    }

    // Disable print button if parameters are not fully set
    const isPrintDisabled = periodParamNeeded && !reportParams.selectedPeriods.length;

    return (
        <div id="generated-table">
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
                <div>
                    <BackButton to={TABLES} text={i18n.t('Back to Saved Tables')} />
                    <div className={classes.title}>
                        <h1 className={classes.h1}>{i18n.t('Report')}</h1>
                        <HelpButton subsection="#generating-a-table-from-a-template" />
                    </div>
                    <Help>
                        {i18n.t(
                            'Tip - hover the mouse over a data cell to see its information.'
                        )}
                    </Help>
                </div>
                <ButtonStrip>
                    <Button
                        large
                        icon={<Icon name="edit" />}
                        onClick={toggleReportParamsDialog}
                    >
                        {i18n.t('Change Report Parameters')}
                    </Button>
                    <Button
                        large
                        icon={<Icon name="table_chart" />}
                        onClick={() => navigate(getPath(EDIT_TABLE, id))}
                    >
                        {i18n.t('View Template')}
                    </Button>
                    <Button
                        large
                        icon={<Icon name="print" />}
                        onClick={handlePrint}
                        disabled={isPrintDisabled}
                    >
                        {i18n.t('Print')}
                    </Button>
                </ButtonStrip>
            </header>
            <Card className={utils.card}>
                <div ref={printRef} className={classes.print}>
                    <FootnotesProvider>
                        <TableWithData
                            {...reportParams}
                            periodParamNeeded={periodParamNeeded}
                        />
                    </FootnotesProvider>
                    
                    {/* Visualization toggle switch */}
                    <div className={classes.visualizationToggle}>
                        <label className={classes.toggleLabel}>
                            <Switch
                                checked={showVisualizations}
                                onChange={() => setShowVisualizations(!showVisualizations)}
                                dense
                            />
                            <span className={classes.toggleText}>
                                {i18n.t('Show visualizations')}
                            </span>
                        </label>
                    </div>
                    
                    {/* Render visualizations if enabled */}
                    {showVisualizations && (
                        <ReportVisualizations 
                            selectedOrgUnits={reportParams.selectedOrgUnits}
                            selectedPeriods={reportParams.selectedPeriods}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
}

export default GeneratedTable;