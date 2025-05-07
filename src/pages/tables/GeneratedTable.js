import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, ButtonStrip, Card, Help } from '@dhis2/ui';
import i18n from '../../locales';
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
import { getSelectedNames } from './generated-table';

export function isAllPopulatedInTable(key, table) {
    return table.rows.every(row =>
        row.cells.every(cell => {
            if (cell.contentType !== DATA || !cell.data.item) return true;
            return cell.data[key].length > 0;
        })
    );
}

export function GeneratedTable() {
    const navigate = useNavigate();
    const { id } = useParams();
    const table = useTableState();
    const [isPrinting, setIsPrinting] = useState(false);

    const [logo, setLogo] = useState(null);

    const fileInputRef = useRef(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogo(e.target.result); // Store in logo state
                setReportParams(prev => ({
                    ...prev,
                    logo: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const [reportParams, setReportParams] = useState({
        selectedOrgUnits: [],
        selectedPeriods: [],
    });
    const [reportParamsDialogOpen, setReportParamsDialogOpen] = useState(true);
    const [reportParamsErrors, setReportParamsErrors] = useState([]);

    const printRef = useRef(null);
    const contentToPrintRef = useRef(null);

    const handlePrint = useCallback(() => {
        if (!printRef.current) {
            console.error("Nothing to print - ref not attached");
            return;
        }

        setIsPrinting(true);

        const printContent = printRef.current.cloneNode(true);

        // Force image dimensions for print
        const logos = printContent.querySelectorAll('.printLogo');
        logos.forEach(logo => {
            logo.style.maxWidth = '200px';
            logo.style.height = 'auto';
        });

        // Create a clone of the content to print
        const contentClone = printRef.current.cloneNode(true);
        contentClone.id = "print-content-clone";
        contentClone.style.position = "absolute";
        contentClone.style.left = "-9999px";
        document.body.appendChild(contentClone);

        // Create print window
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert(i18n.t('Pop-up blocked. Please allow pop-ups to print.'));
            setIsPrinting(false);
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${i18n.t('Report')}</title>
                <style>
                    @page { size: auto; margin: 10mm; }
                    body { font-family: Arial, sans-serif; }
                    ${classes.print} { width: 100%; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <div class="${classes.print}">
                    ${contentClone.innerHTML}
                </div>
                <script>
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 300);
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(contentClone);
            setIsPrinting(false);
        }, 1000);
    }, []);

    const toggleReportParamsDialog = () =>
        setReportParamsDialogOpen(state => !state);

    const orgUnitParamNeeded = !isAllPopulatedInTable('orgUnits', table);
    const periodParamNeeded = !isAllPopulatedInTable('periods', table);

    function onGenerate(params) {
        const errors = [];
        if (periodParamNeeded && params.selectedPeriods.length === 0) {
            errors.push(
                i18n.t('One or more periods are required to query data for this table.')
            );
            setReportParamsDialogOpen(true);
        }
        setReportParamsErrors(errors);
        setReportParams(params);
    }

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
                    <BackButton
                        to={TABLES}
                        text={i18n.t('Back to Saved Tables')}
                    />
                    <div className={classes.title}>
                        <h1 className={classes.h1}>{i18n.t('Report')}</h1>
                        <HelpButton subsection="#generating-a-table-from-a-template" />
                    </div>
                    <Help>
                        {i18n.t('Tip - hover the mouse over a data cell to see its information.')}
                    </Help>
                </div>
                <ButtonStrip>
                    <Button
                        large
                        icon={<Icon name="edit" />}
                        onClick={toggleReportParamsDialog}
                    >
                        {i18n.t('Change Parameters')}
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
                        icon={<Icon name="image" />}
                        onClick={triggerFileInput}
                    >
                        {i18n.t('Add Logo')}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ display: 'none' }}
                    />

                    <Button
                        large
                        icon={<Icon name="print" />}
                        onClick={handlePrint}
                        disabled={isPrinting}
                    >
                        {isPrinting ? i18n.t('Printing...') : i18n.t('Print')}
                    </Button>


                </ButtonStrip>
            </header>

            <Card className={utils.card}>
    <div ref={printRef} className={classes.print}>         
        <div className={classes.printHeader}>             
            {logo && (
                <div className={classes.logoContainer}>
                    <img 
                        src={logo} 
                        className={classes.printLogo} 
                        alt="Organization Logo" 
                    />
                </div>
            )}
            
            {/* Title & Date Section (Right) */}
            <div className={classes.titleContainer}>
                <h1 className={classes.reportTitle}>{table.name}</h1>
                <div className={classes.metadata}>
                    <p className={classes.reportDate}>
                        {new Date().toLocaleDateString()}
                    </p>
                    {reportParams.selectedOrgUnits?.length > 0 && (
                        <p className={classes.orgUnit}>
                            {i18n.t('For: ')}{getSelectedNames(reportParams.selectedOrgUnits)}
                        </p>
                    )}
                </div>
            </div>
        </div>

        {/* Main Table Content */}
        <FootnotesProvider>
            <TableWithData
                {...reportParams}
                periodParamNeeded={periodParamNeeded}
                suppressTitle={true}
            />
        </FootnotesProvider>
    </div>
</Card>
        </div>
    );
}

export default GeneratedTable;
