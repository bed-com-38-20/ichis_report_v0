import React, { useEffect, useState } from 'react';
import {
    ButtonStrip,
    Card,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    NoticeBox,
} from '@dhis2/ui';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles/EditTableTemplate.style';
import {
    EditTableCell,
    AddTableDimension,
    HighlightingEditor,
    RowColControls,
    RenameTable,
    EditTableTemplateActions,
} from './edit-table-template';
import BackButton from '../../components/BackButton';
import utils from '../../styles/utils.module.css';
import i18n from '../../locales';
import { TABLES, getPath, GENERATED_TABLE } from '../../modules/paths';
import { useTableActions, useTableState } from '../../context/tableContext';
import HelpButton from '../../components/HelpButton';
import AutosaveStatus from './edit-table-template/AutosaveStatus';
import classes from './DeleteTableTemplate.module.css'; // Reuse CSS from DeleteTableTemplate

export function EditTableTemplate() {
    const params = useParams();
    const table = useTableState();
    const dataStoreActions = useTableActions();
    const navigate = useNavigate();
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
    });

    // Save table to datastore in response to changes
    useEffect(() => {
        dataStoreActions.update({ ...table });
    }, [table]);

    // Auto-dismiss notification after 3 seconds
    useEffect(() => {
        if (notification.isVisible) {
            const timer = setTimeout(() => {
                setNotification({ isVisible: false, message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.isVisible]);

    function onDelete() {
        dataStoreActions.remove();
        setNotification({
            isVisible: true,
            message: i18n.t('Table template deleted successfully'),
        });
        setTimeout(() => navigate(TABLES), 500); // Delay navigation to show notification
    }

    function onGenerate() {
        navigate(getPath(GENERATED_TABLE, params.id));
    }

    function renameTable(name) {
        dataStoreActions.update({ name });
    }

    function tableColumns() {
        return (
            <TableRowHead>
                <TableCellHead />
                {table.columns.map((col, idx, arr) => (
                    <RowColControls
                        type="column"
                        rowColObj={col}
                        idx={idx}
                        maxIdx={arr.length - 1}
                        key={idx}
                    />
                ))}
            </TableRowHead>
        );
    }

    function mapCellsToJsx(cells, rowIdx) {
        return cells.map((cell, idx) => (
            <EditTableCell
                rowIdx={rowIdx}
                cellIdx={idx}
                cell={cell}
                key={idx}
            />
        ));
    }

    function tableRows() {
        return table.rows.map((row, idx, arr) => (
            <TableRow idx={idx} key={idx}>
                <RowColControls
                    type={'row'}
                    rowColObj={row}
                    idx={idx}
                    maxIdx={arr.length - 1}
                />
                {mapCellsToJsx(row.cells, idx)}
            </TableRow>
        ));
    }

    return (
        <div className={`${classes.container} edit-table-template-container`}>
            <header className="header">
                <div>
                    <BackButton
                        to={TABLES}
                        text={i18n.t('Back to Saved Tables')}
                    />
                    <div className="pageTitle">
                        <h1 className="main-title">{i18n.t('Edit Table')}</h1>
                        <HelpButton subsection="#editing-a-table-template" />
                    </div>
                </div>
                <EditTableTemplateActions
                    onGenerate={onGenerate}
                    onDelete={onDelete}
                />
            </header>
            <section className="controls">
                <div>
                    <div className="container">
                        <h6 className="label bright-label">{i18n.t('Table name')}</h6>
                        <div className="tableName">
                            <div className="table-name-display">{table.name}</div>
                            <RenameTable
                                name={table.name}
                                onRename={renameTable}
                            />
                        </div>
                    </div>
                    <HighlightingEditor />
                </div>
                <ButtonStrip end>
                    <AddTableDimension type="Row" />
                    <AddTableDimension type="Column" />
                </ButtonStrip>
            </section>
            <section>
                <Card className={utils.card}>
                    <Table className={utils.noBorder}>
                        <TableHead>{tableColumns()}</TableHead>
                        <TableBody>{tableRows()}</TableBody>
                    </Table>
                </Card>
            </section>
            <footer>
                <AutosaveStatus />
            </footer>
            {notification.isVisible && (
                <div className={classes.notification}>
                    <NoticeBox title={i18n.t('Success')}>
                        {notification.message}
                    </NoticeBox>
                </div>
            )}
            <style jsx>{styles}</style>
            <style jsx>{`
                .edit-table-template-container {
                    background-color: white !important;
                    min-height: 100vh;
                    padding: 1.5rem;
                }

                /* Main title styling */
                :global(.main-title) {
                    color: #1a202c !important;
                    font-weight: 700 !important;
                    font-size: 2rem !important;
                    margin-bottom: 1rem !important;
                    text-shadow: none !important;
                }

                /* Bright label styling */
                :global(.bright-label) {
                    color: #2d3748 !important;
                    font-weight: 600 !important;
                    font-size: 1rem !important;
                    margin-bottom: 0.5rem !important;
                }

                /* Table name display */
                :global(.table-name-display) {
                    color: #1a365d !important;
                    font-weight: 600 !important;
                    font-size: 1.2rem !important;
                }

                /* Header styling */
                :global(.header) {
                    background-color: white !important;
                    padding: 1rem 0 !important;
                    border-bottom: 2px solid #e2e8f0 !important;
                    margin-bottom: 1.5rem !important;
                }

                /* Controls section styling */
                :global(.controls) {
                    background-color: white !important;
                    padding: 1rem !important;
                    border-radius: 8px !important;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
                    margin-bottom: 1.5rem !important;
                }

                /* Make all headings bright and visible */
                :global(h1, h2, h3, h4, h5, h6) {
                    color:rgb(9, 11, 15) !important;
                    font-weight: 600 !important;
                }

                /* Ensure all text is dark and readable */
                :global(.edit-table-template-container *) {
                    color:rgb(152, 176, 218);
                }

                /* Style the page title container */
                :global(.pageTitle) {
                    display: flex !important;
                    align-items: center !important;
                    gap: 1rem !important;
                }

                /* Back button styling */
                :global(.edit-table-template-container button) {
                    font-weight: 500 !important;
                }

                /* Card styling */
                :global(.edit-table-template-container .card) {
                    background-color: white !important;
                    border: 1px solidrgb(87, 97, 192) !important;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
                }

                /* Table styling */
                :global(.edit-table-template-container table) {
                    background-color: white !important;
                }

                :global(.edit-table-template-container th) {
                    background-color:rgb(165, 194, 212) !important;
                    color: #2d3748 !important;
                    font-weight: 600 !important;
                }

                :global(.edit-table-template-container td) {
                    color: #2d3748 !important;
                }

                /* Footer styling */
                :global(footer) {
                    background-color: white !important;
                    padding: 1rem 0 !important;
                    margin-top: 2rem !important;
                }
            `}</style>
        </div>
    );
}

EditTableTemplate.propTypes = {};

export default EditTableTemplate;