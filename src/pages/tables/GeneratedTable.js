import React, { useRef, useState, useEffect } from 'react';
import { Button, Card, Help, Switch, CircularLoader } from '@dhis2/ui';
import i18n from '../../locales';
import { useReactToPrint } from 'react-to-print';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import Icon from '../../components/Icon';
import { ReportParameters, TableWithData } from './generated-table';
import { EDIT_TABLE, getPath, TABLES } from '../../modules/paths';
import { DATA } from '../../modules/contentTypes';
import { useTableState } from '../../context/tableContext';
import HelpButton from '../../components/HelpButton';
import { FootnotesProvider } from '../../context/footnotesContext';
import ReportVisualizations from './generated-table/ReportVisualization';
import classes from './styles/GeneratedTable.module.css';
import utils from '../../styles/utils.module.css';

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
    const printRef = useRef();
    const fileInputRef = useRef(); // Ref for hidden file input
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [reportParams, setReportParams] = useState({
        selectedOrgUnits: [],
        selectedPeriods: [],
    });
    const [reportParamsDialogOpen, setReportParamsDialogOpen] = useState(true);
    const [reportParamsErrors, setReportParamsErrors] = useState([]);
    const [showVisualizations, setShowVisualizations] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [animateInContent, setAnimateInContent] = useState(false);
    const [logoUrl, setLogoUrl] = useState('https://via.placeholder.com/150x50?text=Logo'); // Default placeholder logo

    useEffect(() => {
        setTimeout(() => {
            setAnimateInContent(true);
        }, 300);
    }, []);

    const handlePrint = useReactToPrint({
        content: () => printRef.current || null,
        documentTitle: table.name || 'Table Report',
        onBeforeGetContent: () => {
            setIsLoading(true);
            return new Promise((resolve) => setTimeout(resolve, 500));
        },
        onAfterPrint: () => setIsLoading(false),
    });

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type (only images)
            if (!file.type.startsWith('image/')) {
                alert(i18n.t('Please upload a valid image file (PNG, JPG, etc.).'));
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setLogoUrl(reader.result); // Set logo URL to base64 data URL
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click(); // Trigger hidden file input
    };

    const toggleReportParamsDialog = () => setReportParamsDialogOpen((state) => !state);

    const orgUnitParamNeeded = !isAllPopulatedInTable('orgUnits', table);
    const periodParamNeeded = !isAllPopulatedInTable('periods', table);

    function onGenerate(params) {
        const errors = [];
        if (periodParamNeeded && params.selectedPeriods.length === 0) {
            errors.push(i18n.t('One or more periods are required to query data for this table.'));
            setReportParamsDialogOpen(true);
        }
        setReportParamsErrors(errors);
        setReportParams(params);
        setIsLoading(true);
        setAnimateInContent(false);
        setTimeout(() => {
            setIsLoading(false);
            setAnimateInContent(true);
        }, 800);
    }

    const isPrintDisabled = periodParamNeeded && !reportParams.selectedPeriods.length;
    const formattedDateTime = new Date().toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <div id="generated-table" className={`${classes.container} ${isDarkMode ? classes.darkMode : ''}`}>
            {/* Sidebar for Actions and Parameters */}
            <div className={classes.sidebar}>
                <BackButton to={TABLES} text={i18n.t('Back to Saved Reports')} className={classes.backButton} />
                <div className={classes.sidebarActions}>
                    <h3 className={classes.sidebarTitle}>{i18n.t('Actions')}</h3>
                    <div className={classes.actionButtons}>
                        <Button
                            className={classes.actionButton}
                            onClick={toggleReportParamsDialog}
                        >
                            <Icon name="settings" className={classes.buttonIcon} />
                            {i18n.t('Parameters')}
                        </Button>
                        <Button
                            className={classes.actionButton}
                            onClick={() => navigate(getPath(EDIT_TABLE, id))}
                        >
                            <Icon name="table_chart" className={classes.buttonIcon} />
                            {i18n.t('Template')}
                        </Button>
                        <Button
                            className={classes.actionButton}
                            primary
                            onClick={handlePrint}
                            disabled={isPrintDisabled || isLoading}
                        >
                            <Icon name="print" className={classes.buttonIcon} />
                            {isLoading ? i18n.t('Preparing...') : i18n.t('Print')}
                        </Button>
                        <Button
                            className={classes.actionButton}
                            onClick={triggerFileInput}
                        >
                            <Icon name="image" className={classes.buttonIcon} />
                            {i18n.t('Add Logo')}
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleLogoUpload}
                            accept="image/*"
                            className={classes.fileInput}
                        />
                    </div>
                    <Switch
                        checked={isDarkMode}
                        onChange={() => setIsDarkMode(!isDarkMode)}
                        label={i18n.t('Dark Mode')}
                        className={classes.themeSwitch}
                    />
                    <HelpButton subsection="#generating-a-table-from-a-template" className={classes.helpButton} />
                </div>
            </div>

            {/* Main Content */}
            <div className={classes.mainContent}>
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

                <Card className={classes.reportCard}>
                    <div className={classes.header}>
                        <img
                            src={logoUrl}
                            alt="Report Logo"
                            className={classes.logo}
                        />
                        <h1 className={classes.title}>{table.name || i18n.t('Report')}</h1>
                        {table.description && (
                            <span className={classes.description}>{table.description}</span>
                        )}
                        <div className={classes.dateTime}>
                            <Icon name="today" className={classes.dateIcon} />
                            {i18n.t('Generated on')} {formattedDateTime}
                        </div>
                    </div>

                    {reportParamsErrors.length > 0 && (
                        <div className={classes.errorBanner}>
                            <Icon name="error" className={classes.errorIcon} />
                            {reportParamsErrors.map((error, i) => (
                                <p key={i}>{error}</p>
                            ))}
                        </div>
                    )}

                    {(reportParams.selectedOrgUnits.length > 0 || reportParams.selectedPeriods.length > 0) && (
                        <div className={classes.parametersSection}>
                            <h2 className={classes.parametersTitle}>{i18n.t('Report Parameters')}</h2>
                            <div className={classes.parametersGrid}>
                                {reportParams.selectedOrgUnits.length > 0 && (
                                    <div className={classes.parameterItem}>
                                        <div className={classes.parameterHeader}>
                                            <Icon name="location_on" className={classes.parameterIcon} />
                                            <span>{i18n.t('Organization Units')}</span>
                                        </div>
                                        <div className={classes.parameterTags}>
                                            {reportParams.selectedOrgUnits.map((unit, index) => (
                                                <span key={index} className={classes.tag}>
                                                    {unit.displayName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {reportParams.selectedPeriods.length > 0 && (
                                    <div className={classes.parameterItem}>
                                        <div className={classes.parameterHeader}>
                                            <Icon name="calendar_today" className={classes.parameterIcon} />
                                            <span>{i18n.t('Periods')}</span>
                                        </div>
                                        <div className={classes.parameterTags}>
                                            {reportParams.selectedPeriods.map((period, index) => (
                                                <span key={index} className={classes.tag}>
                                                    {period.displayName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Switch
                                checked={showVisualizations}
                                onChange={() => setShowVisualizations(!showVisualizations)}
                                label={i18n.t('Show Visualizations')}
                                className={classes.switch}
                            />
                        </div>
                    )}

                    <div
                        ref={printRef}
                        className={`${classes.content} ${animateInContent ? classes.fadeIn : ''}`}
                    >
                        {isLoading ? (
                            <div className={classes.loadingContainer}>
                                <CircularLoader />
                                <p>{i18n.t('Loading data...')}</p>
                            </div>
                        ) : (
                            <>
                                <FootnotesProvider>
                                    <TableWithData
                                        {...reportParams}
                                        periodParamNeeded={periodParamNeeded}
                                        className={classes.table}
                                    />
                                </FootnotesProvider>
                                {showVisualizations && (
                                    <div className={classes.visualizations}>
                                        <h2 className={classes.visualizationsTitle}>
                                            <Icon name="bar_chart" className={classes.sectionIcon} />
                                            {i18n.t('Data Visualizations')}
                                        </h2>
                                        <ReportVisualizations
                                            selectedOrgUnits={reportParams.selectedOrgUnits}
                                            selectedPeriods={reportParams.selectedPeriods}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <Help className={classes.help}>
                        <Icon name="info" className={classes.infoIcon} />
                        {i18n.t('Tip - hover the mouse over a data cell to see its information.')}
                    </Help>
                </Card>
            </div>
        </div>
    ); 
}

export default GeneratedTable;