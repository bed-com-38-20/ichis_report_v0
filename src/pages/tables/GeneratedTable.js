import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Card, Help, Switch, CircularLoader } from '@dhis2/ui';
import i18n from '../../locales';
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
    const fileInputRef = useRef();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [reportParams, setReportParams] = useState({
        selectedOrgUnits: [],
        selectedPeriods: [],
    });
    const [reportParamsDialogOpen, setReportParamsDialogOpen] = useState(true);
    const [reportParamsErrors, setReportParamsErrors] = useState([]);
    const [showVisualizations, setShowVisualizations] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [animateInContent, setAnimateInContent] = useState(false);
    const [logoUrl, setLogoUrl] = useState('https://via.placeholder.com/150x50?text=Logo');
    const [reportDescription, setReportDescription] = useState('');
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    // Define formattedDateTime BEFORE handlePrint function
    const formattedDateTime = new Date().toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit',
        hour12: true,
    });

    useEffect(() => {
        setTimeout(() => {
            setAnimateInContent(true);
        }, 300);
    }, []);

    // Add this function to handle description changes
    const handleDescriptionChange = (event) => {
        setReportDescription(event.target.value);
    };

    const handleDescriptionSave = () => {
        setIsEditingDescription(false);
    };

    const handleDescriptionEdit = () => {
        setIsEditingDescription(true);
    };

    const handlePrint = useCallback(async () => {
        if (!printRef.current) {
            console.error("Nothing to print - ref not attached");
            return;
        }

        setIsPrinting(true);

        try {
            // Wait for all images to load before printing
            const images = printRef.current.querySelectorAll('img');
            const imagePromises = Array.from(images).map(img => {
                return new Promise((resolve) => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = resolve;
                        img.onerror = resolve; // Resolve even on error to not block printing
                    }
                });
            });

            await Promise.all(imagePromises);

            const printContent = printRef.current.cloneNode(true);

            // Create a header with the new layout for the print content
            const printHeader = document.createElement('div');
            printHeader.className = 'print-header';
            printHeader.style.cssText = `
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px 0;
                margin-bottom: 30px;
                border-bottom: 2px solid #eee;
                page-break-inside: avoid;
            `;

            // Create header content container
            const headerContent = document.createElement('div');
            headerContent.style.cssText = `
                display: flex;
                align-items: center;
                gap: 16px;
                width: 100%;
            `;

            // Add logo/avatar section if logo exists and is not placeholder
            if (logoUrl && logoUrl !== 'https://via.placeholder.com/150x50?text=Logo') {
                const avatarContainer = document.createElement('div');
                avatarContainer.style.cssText = `
                    flex-shrink: 0;
                    width: 56px;
                    height: 56px;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #f5f5f5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                const logoImg = document.createElement('img');
                logoImg.src = logoUrl;
                logoImg.alt = 'Report Logo';
                logoImg.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                `;

                avatarContainer.appendChild(logoImg);
                headerContent.appendChild(avatarContainer);
            }

            // Create info section container
            const infoSection = document.createElement('div');
            infoSection.style.cssText = `
                flex: 1;
                min-width: 0;
            `;

            // Add report title
            const titleElement = document.createElement('h1');
            titleElement.textContent = table.name || i18n.t('Report');
            titleElement.style.cssText = `
                margin: 0 0 4px 0;
                font-size: 20px;
                font-weight: 600;
                color: #1a1a1a;
                line-height: 1.3;
            `;
            infoSection.appendChild(titleElement);

            // Add description if exists
            if (table.description) {
                const descElement = document.createElement('p');
                descElement.textContent = table.description;
                descElement.style.cssText = `
                    margin: 0 0 4px 0;
                    font-size: 14px;
                    color: #666;
                    line-height: 1.4;
                `;
                infoSection.appendChild(descElement);
            }

            // Add generation date
            const dateElement = document.createElement('span');
            dateElement.textContent = `${i18n.t('Generated on')} ${formattedDateTime}`;
            dateElement.style.cssText = `
                font-size: 12px;
                color: #999;
                font-weight: 400;
            `;
            infoSection.appendChild(dateElement);

            headerContent.appendChild(infoSection);
            printHeader.appendChild(headerContent);

            // Remove existing logos from the cloned content to avoid duplicates
            const existingLogos = printContent.querySelectorAll(`.${classes.logo}, .${classes.logoPreview}`);
            existingLogos.forEach(logo => logo.remove());

            // Remove visualizations title from print content
            const visualizationsTitle = printContent.querySelector(`.${classes.visualizationsTitle}`);
            if (visualizationsTitle) {
                visualizationsTitle.remove();
            }

            // Remove SegmentedControl and ButtonStrip from visualizations
            const segmentedControls = printContent.querySelectorAll('[data-test^="dhis2-uicore-segmentedcontrol"], .segmented-control');
            segmentedControls.forEach(control => control.remove());

            const buttonStrips = printContent.querySelectorAll('[data-test^="dhis2-uicore-buttonstrip"], .button-strip');
            buttonStrips.forEach(strip => strip.remove());

            // Remove control boxes
            const controlBoxes = printContent.querySelectorAll('div[style*="justify-content: space-between"]');
            controlBoxes.forEach(box => {
                const hasSegmentedControl = box.querySelector('[data-test^="dhis2-uicore-segmentedcontrol"], .segmented-control');
                const hasButtonStrip = box.querySelector('[data-test^="dhis2-uicore-buttonstrip"], .button-strip');
                if (hasSegmentedControl || hasButtonStrip) {
                    box.remove();
                }
            });

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
                    <title>${table.name || i18n.t('Report')}</title>
                    <style>
                        @page { 
                            size: auto; 
                            margin: 15mm; 
                        }
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 0;
                            padding: 0;
                            line-height: 1.4;
                        }
                        .print { 
                            width: 100%; 
                        }
                        .print-header {
                            display: flex !important;
                            align-items: center !important;
                            gap: 16px !important;
                            padding: 20px 0 !important;
                            margin-bottom: 30px !important;
                            border-bottom: 2px solid #eee !important;
                            page-break-inside: avoid !important;
                        }
                        .print-header > div {
                            display: flex !important;
                            align-items: center !important;
                            gap: 16px !important;
                            width: 100% !important;
                        }
                        .print-header img {
                            width: 56px !important;
                            height: 56px !important;
                            object-fit: cover !important;
                            border-radius: 8px !important;
                            flex-shrink: 0 !important;
                        }
                        .print-header h1 {
                            margin: 0 0 4px 0 !important;
                            font-size: 20px !important;
                            font-weight: 600 !important;
                            color: #1a1a1a !important;
                            line-height: 1.3 !important;
                        }
                        .print-header p {
                            margin: 0 0 4px 0 !important;
                            font-size: 14px !important;
                            color: #666 !important;
                            line-height: 1.4 !important;
                        }
                        .print-header span {
                            font-size: 12px !important;
                            color: #999 !important;
                            font-weight: 400 !important;
                        }
                        table { 
                            border-collapse: collapse; 
                            width: 100%; 
                            margin: 20px 0;
                        }
                        th, td { 
                            border: 1px solid #ddd; 
                            padding: 8px; 
                            text-align: left;
                        }
                        th { 
                            background-color: #f2f2f2; 
                            font-weight: bold;
                        }
                        
                        /* Hide unwanted elements in print */
                        .${classes.visualizationsTitle} { 
                            display: none !important; 
                        }
                        [data-test^="dhis2-uicore-segmentedcontrol"] { 
                            display: none !important; 
                        }
                        [data-test^="dhis2-uicore-buttonstrip"] { 
                            display: none !important; 
                        }
                        .segmented-control { 
                            display: none !important; 
                        }
                        .button-strip { 
                            display: none !important; 
                        }
                        
                        /* Print-specific layout adjustments */
                        @media print {
                            body { 
                                -webkit-print-color-adjust: exact !important; 
                                print-color-adjust: exact !important;
                            }
                            .print-header {
                                page-break-after: avoid !important;
                            }
                            .print-header img {
                                page-break-inside: avoid !important;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="print">
                        ${printHeader.outerHTML}
                        ${printContent.innerHTML}
                    </div>
                    <script>
                        // Wait for images to load in the print window too
                        function waitForImages() {
                            const images = document.querySelectorAll('img');
                            const promises = Array.from(images).map(img => {
                                return new Promise((resolve) => {
                                    if (img.complete) {
                                        resolve();
                                    } else {
                                        img.onload = resolve;
                                        img.onerror = resolve;
                                    }
                                });
                            });
                            
                            Promise.all(promises).then(() => {
                                setTimeout(() => {
                                    window.print();
                                    window.close();
                                }, 1000); // Increased timeout to ensure logo loads
                            });
                        }
                        
                        if (document.readyState === 'complete') {
                            waitForImages();
                        } else {
                            window.addEventListener('load', waitForImages);
                        }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();

        } catch (error) {
            console.error('Print error:', error);
            alert(i18n.t('An error occurred while preparing the print. Please try again.'));
        } finally {
            setIsPrinting(false);
        }
    }, [logoUrl, table.name, table.description, formattedDateTime]);











    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert(i18n.t('Please upload a valid image file (PNG, JPG, etc.).'));
                return;
            }

            // Check file size (optional)
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert(i18n.t('Image file is too large. Please choose a smaller image.'));
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setLogoUrl(reader.result);
            };
            reader.onerror = () => {
                alert(i18n.t('Error reading the image file. Please try again.'));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
                            primary
                            onClick={toggleReportParamsDialog}
                        >
                            <Icon name="settings" className={classes.buttonIcon} />
                            {i18n.t('Parameters')}
                        </Button>
                        <Button
                            className={classes.actionButton}
                            primary
                            onClick={() => navigate(getPath(EDIT_TABLE, id))}
                        >
                            <Icon name="table_chart" className={classes.buttonIcon} />
                            {i18n.t('Template')}
                        </Button>


                        <Button
                            className={classes.actionButton}
                            primary
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

                        <Button
                            className={classes.actionButton}
                            primary
                            onClick={handlePrint}
                            disabled={isPrintDisabled || isPrinting}
                        >
                            <Icon name="print" className={classes.buttonIcon} />
                            {isPrinting ? i18n.t('Printing...') : i18n.t('Print')}
                        </Button>
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
                        <div className={classes.headerContent}>
                            {/* Avatar/Logo Section */}
                            <div className={classes.headerAvatar}>
                                {logoUrl !== 'https://via.placeholder.com/150x50?text=Logo' ? (
                                    <img
                                        src={logoUrl}
                                        alt="Report Logo"
                                        className={classes.avatarImage}
                                    />
                                ) : (
                                    <div className={classes.avatarPlaceholder}>
                                        <Icon name="image" />
                                    </div>
                                )}
                            </div>

                            {/* Title and Info Section */}
                            <div className={classes.headerInfo}>
                                <h1 className={classes.headerTitle}>
                                    {table.name || i18n.t('Report')}
                                </h1>

                                {/* {selectedPeriods.length ? (
                                    <p>
                                        {i18n.t('Period{{s}} - {{pe}}', {
                                            s: selectedPeriods.length > 1 ? 's' : '',
                                            pe: getSelectedNames(selectedPeriods),
                                        })}
                                    </p>
                                ) : null} */}
                                {/* <p className={classes.headerSubtitle}>
                                    {table.description || i18n.t('Generated Report')}
                                </p> */}
                                <span className={classes.headerDate}>
                                    {formattedDateTime}
                                </span>

                            </div>

                            {/* Actions Section */}
                            <div className={classes.headerActions}>
                                {logoUrl !== 'https://via.placeholder.com/150x50?text=Logo' && (
                                    <Button
                                        small
                                        secondary
                                        onClick={() => setLogoUrl('https://via.placeholder.com/150x50?text=Logo')}
                                        className={classes.removeLogoBtn}
                                    >
                                        <Icon name="delete" />
                                    </Button>
                                )}
                            </div>
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
                                        hideHeader
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