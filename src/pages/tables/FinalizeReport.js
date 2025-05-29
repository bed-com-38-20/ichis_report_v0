// src/D2App/components/FinalizeReport.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, NoticeBox } from '@dhis2/ui';
import i18n from '../../locales';
import { useProgress } from '../../context/ProgressContext';
import { useNavigate, useParams } from 'react-router-dom';
import { TABLES } from '../../modules/paths';
import { useTableState,useTableActions } from '../../context/tableContext';
import { fromJSON } from 'postcss';

export function FinalizeReport() {
    const { startProcessing, updateProgress, setProgressError, resetProgress } = useProgress();
    const navigate = useNavigate();
    const { id } = useParams();
    const table = useTableState();
    const dataStoreActions = useTableActions();
    const [error, setError] = useState(null);

    const handleFinalize = async () => {
        startProcessing('finalizeReport');
        try {
            // Update table state to mark as finalized
            await dataStoreActions.update({ ...table, finalized: true });
            updateProgress('finalizeReport', 100); // 30% (100% total)
            resetProgress();
            navigate(TABLES);
        } catch (error) {
            setProgressError(i18n.t('Failed to finalize report'));
            setError(i18n.t('Failed to finalize report: {{message}}', { message: error.message }));
            console.error('Finalization failed:', error);
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <h1>{i18n.t('Finalize Report')}</h1>
            <p>{i18n.t('Review and finalize your report template.')}</p>
            <Button primary onClick={handleFinalize}>
                {i18n.t('Finalize Report')}
            </Button>
            {error && (
                <div style={{ marginTop: '16px' }}>
                    <NoticeBox error title={i18n.t('Error')}>
                        {error}
                    </NoticeBox>
                </div>
            )}
        </div>
    );
}

FinalizeReport.propTypes = {};

export default FinalizeReport;