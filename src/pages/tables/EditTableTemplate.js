// src/D2App/pages/tables/edit-table-template/EditTableTemplate.jsx
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
    Button,
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
import classes from './DeleteTableTemplate.module.css';
import { FinalizeReport } from './FinalizeReport';
import { useProgress } from '../../context/ProgressContext';

export function EditTableTemplate() {
    const params = useParams();
    const table = useTableState();
    const dataStoreActions = useTableActions();
    const navigate = useNavigate();
    const { updateProgress } = useProgress();
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
    });
    const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);

    useEffect(() => {
        dataStoreActions.update({ ...table });
    }, [table]);

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
            message: i18n.t('report template deleted successfully'),
        });
        setTimeout(() => navigate(TABLES), 500);
    }

    function onGenerate() {
        navigate(getPath(GENERATED_TABLE, params.id));
    }

    function renameTable(name) {
        dataStoreActions.update({ name });
    }

    function onFinalize() {
        setFinalizeModalOpen(true);
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
        <div className={classes.container}>
            <header className="header">
                <div>
                    <BackButton
                        to={TABLES}
                        text={i18n.t('Back to Saved Reports')}
                    />
                    <div className="pageTitle">
                        <h1>{i18n.t('Edit Report')}</h1>
                        <HelpButton subsection="#editing-a-report-template" />
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
                        <h6 className="label">{i18n.t('Report name')}</h6>
                        <div className="tableName">
                            <div>{table.name}</div>
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
                    <Button primary onClick={onFinalize} disabled={!table.rows[0]?.cells[0]?.data?.periods?.length}>
                        {i18n.t('Finalize Report')}
                    </Button>
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
            {finalizeModalOpen && (
                <FinalizeReport onClose={() => setFinalizeModalOpen(false)} />
            )}
            <style jsx>{styles}</style>
        </div>
    );
}

export default EditTableTemplate;