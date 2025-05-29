// src/D2App/components/DataContentSelector.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import i18n from '../../../../locales';
import { UPDATE_CELL } from '../../../../reducers/tableReducer';
import DataEngine from '../../../../components/DataEngine';
import { DataSelectorDialog, OrgUnitSelectorDialog, PeriodSelectorDialog } from './index';
import SelectorFrame from '../SelectorFrame';
import { useTableDispatch, useTableState } from '../../../../context/tableContext';
import { getIntervalString, HighlightingEditorDialog } from '../HighlightingEditor';
import { useProgress } from '../../../../context/ProgressContext';
import { useNavigate } from 'react-router-dom';

function getSelectedNames(arr) {
    return arr.map((item) => item.name).join(', ');
}

export function DataContentSelector({ cell, rowIdx, cellIdx }) {
    const table = useTableState();
    const dispatch = useTableDispatch();
    const { startProcessing, updateProgress, setProgressError } = useProgress();
    const navigate = useNavigate();
    const [dataDialogOpen, setDataDialogOpen] = useState(false);
    const [orgUnitDialogOpen, setOrgUnitDialogOpen] = useState(false);
    const [periodDialogOpen, setPeriodDialogOpen] = useState(false);
    const [highlightingDialogOpen, setHighlightingDialogOpen] = useState(false);

    const toggleDataDialog = () => setDataDialogOpen((state) => !state);
    const toggleOrgUnitDialog = () => setOrgUnitDialogOpen((state) => !state);
    const togglePeriodDialog = () => setPeriodDialogOpen((state) => !state);
    const toggleHighlightingDialog = () => setHighlightingDialogOpen((state) => !state);

    const onDataDialogSave = async ({ item, ...metadata }) => {
        if (!item) return;
        startProcessing('selectDataItem');
        try {
            dispatch({
                type: UPDATE_CELL,
                payload: {
                    cell: { data: { ...cell.data, item, ...metadata } },
                    rowIdx,
                    cellIdx,
                },
            });
            updateProgress('selectDataItem', 100); // 20% for data item (30% total)
            navigate('/tables/org-units');
        } catch (error) {
            setProgressError(i18n.t('Failed to save data item'));
            console.error('Data save error:', error);
        }
    };

    const onOrgUnitDialogSave = async (orgUnits) => {
        startProcessing('selectOrgUnit');
        try {
            dispatch({
                type: UPDATE_CELL,
                payload: {
                    cell: { data: { ...cell.data, orgUnits } },
                    rowIdx,
                    cellIdx,
                },
            });
            updateProgress('selectOrgUnit', 100); // 20% for org units (50% total)
            navigate('/tables/periods');
        } catch (error) {
            setProgressError(i18n.t('Failed to save organization units'));
            console.error('Org unit save error:', error);
        }
    };

    const onPeriodDialogSave = async (periods) => {
        startProcessing('selectPeriods');
        try {
            dispatch({
                type: UPDATE_CELL,
                payload: {
                    cell: { data: { ...cell.data, periods } },
                    rowIdx,
                    cellIdx,
                },
            });
            updateProgress('selectPeriods', 100); // 20% for periods (70% total)
            navigate('/tables/finalize');
        } catch (error) {
            setProgressError(i18n.t('Failed to save periods'));
            console.error('Period save error:', error);
        }
    };

    const getHighlightingIntervals = () => {
        return (
            cell.highlightingIntervals ||
            table.columns[cellIdx].highlightingIntervals ||
            table.rows[rowIdx].highlightingIntervals ||
            table.highlightingIntervals
        );
    };

    const getNextIntervalsAfterClear = () => {
        return (
            table.columns[cellIdx].highlightingIntervals ||
            table.rows[rowIdx].highlightingIntervals ||
            null
        );
    };

    const getHighlightingSelectorContent = () => {
        if (!cell.highlightingIntervals || isEqual(cell.highlightingIntervals, table.highlightingIntervals)) {
            return i18n.t('Same as table');
        }
        if (isEqual(cell.highlightingIntervals, table.columns[cellIdx].highlightingIntervals)) {
            return i18n.t('Same as column');
        }
        if (isEqual(cell.highlightingIntervals, table.rows[rowIdx].highlightingIntervals)) {
            return i18n.t('Same as row');
        }
        return getIntervalString(cell.highlightingIntervals);
    };

    const onHighlightingDialogClear = () => {
        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { highlightingIntervals: getNextIntervalsAfterClear() },
                rowIdx,
                cellIdx,
            },
        });
    };

    const onHighlightingDialogSave = (intervals) => {
        dispatch({
            type: UPDATE_CELL,
            payload: {
                cell: { highlightingIntervals: intervals },
                rowIdx,
                cellIdx,
            },
        });
    };

    const { data } = cell;
    return (
        <>
            <SelectorFrame
                title={i18n.t('Data Item')}
                content={data.item ? data.item.name : <em>{i18n.t('None')}</em>}
                tooltip={i18n.t('Select data')}
                onClick={toggleDataDialog}
            />
            <SelectorFrame
                title={i18n.t('Organisation unit(s)')}
                content={
                    data.orgUnits?.length ? getSelectedNames(data.orgUnits) : <em>{i18n.t('Select during generation')}</em>
                }
                tooltip={i18n.t('Select organisation unit(s)')}
                onClick={toggleOrgUnitDialog}
            />
            <SelectorFrame
                title={i18n.t('Period(s)')}
                content={
                    data.periods?.length ? getSelectedNames(data.periods) : <em>{i18n.t('Select during generation')}</em>
                }
                tooltip={i18n.t('Select period(s)')}
                onClick={togglePeriodDialog}
            />
            {table.highlightingOn && (
                <SelectorFrame
                    title={i18n.t('Highlighting rules')}
                    content={getHighlightingSelectorContent()}
                    tooltip={i18n.t('Configure highlighting for cell')}
                    onClick={toggleHighlightingDialog}
                    onClear={onHighlightingDialogClear}
                />
            )}
            {dataDialogOpen && (
                <DataEngine>
                    {(engine) => (
                        <DataSelectorDialog
                            engine={engine}
                            onClose={toggleDataDialog}
                            onSave={onDataDialogSave}
                            initialValues={data?.item ? { ...data } : {}}
                            navigate={navigate}
                        />
                    )}
                </DataEngine>
            )}
            <OrgUnitSelectorDialog
                open={orgUnitDialogOpen}
                currentlySelected={data.orgUnits}
                toggleModal={toggleOrgUnitDialog}
                onSave={onOrgUnitDialogSave}
            />
            <PeriodSelectorDialog
                open={periodDialogOpen}
                currentlySelected={data.periods}
                toggleModal={togglePeriodDialog}
                onSave={onPeriodDialogSave}
            />
            <HighlightingEditorDialog
                open={highlightingDialogOpen}
                toggle={toggleHighlightingDialog}
                helpText={i18n.t('Configure highlighting intervals for this cell')}
                highlightingIntervals={getHighlightingIntervals()}
                onSave={onHighlightingDialogSave}
            />
        </>
    );
}

DataContentSelector.propTypes = {
    cellIdx: PropTypes.number.isRequired,
    rowIdx: PropTypes.number.isRequired,
    cell: PropTypes.shape({
        contentType: PropTypes.string,
        data: PropTypes.shape({
            dataType: PropTypes.string,
            groupDetail: PropTypes.string,
            groupId: PropTypes.string,
            item: PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
            }),
            orgUnits: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string,
                    name: PropTypes.string,
                    path: PropTypes.string,
                })
            ),
            periods: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string,
                    name: PropTypes.string,
                })
            ),
        }),
        highlightingIntervals: PropTypes.array,
        text: PropTypes.string,
    }).isRequired,
};

export default DataContentSelector;