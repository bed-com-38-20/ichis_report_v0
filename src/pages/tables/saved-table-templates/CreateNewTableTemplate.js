// src/D2App/components/CreateNewTableTemplate.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, NoticeBox } from '@dhis2/ui';
import i18n from '../../../locales';
import InputDialog from '../../../components/InputDialog';
import Icon from '../../../components/Icon';
import { useProgress } from '../../../context/ProgressContext';
import { useNavigate } from 'react-router-dom';

export function CreateNewTableTemplate({ createNew, savedTableTemplates }) {
    const [modalOpen, setModalOpen] = useState(false);
    const { startProcessing, updateProgress, setProgressError } = useProgress();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    async function onCreateNew(inputText) {
        startProcessing('createReport');
        setError(null);

        // Check for empty name
        const trimmedInput = inputText.trim();
        if (!trimmedInput) {
            const errorMessage = i18n.t('Report name cannot be empty');
            setProgressError(errorMessage);
            setError(errorMessage);
            setModalOpen(false);
            return;
        }

        // Check for duplicate names (case-insensitive)
        const isDuplicate = savedTableTemplates.some(
            template => template.name.toLowerCase() === trimmedInput.toLowerCase()
        );
        if (isDuplicate) {
            const errorMessage = i18n.t('A report with this name already exists');
            setProgressError(errorMessage);
            setError(errorMessage);
            setModalOpen(false);
            return;
        }

        try {
            await createNew(trimmedInput);
            updateProgress('createReport', 100);
            setModalOpen(false);
            navigate('/tables/data-item');
        } catch (error) {
            const errorMessage = i18n.t('Failed to create report: {{message}}', { message: error.message });
            setProgressError(i18n.t('Failed to create report'));
            setError(errorMessage);
            setModalOpen(false);
            console.error('Report creation failed:', error);
        }
    }

    return (
        <div>
            <Button
                icon={<Icon name="add" color="white" />}
                onClick={() => setModalOpen(true)}
                primary
            >
                {i18n.t('Create new')}
            </Button>
            {modalOpen && (
                <InputDialog
                    title={i18n.t('Create new report template')}
                    inputLabel={i18n.t('report name')}
                    inputPlaceholder={i18n.t('Enter a name')}
                    initialValue=""
                    confirmText={i18n.t('Create')}
                    onCancel={() => setModalOpen(false)}
                    onConfirm={onCreateNew}
                />
            )}
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

CreateNewTableTemplate.propTypes = {
    createNew: PropTypes.func.isRequired,
    savedTableTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CreateNewTableTemplate;