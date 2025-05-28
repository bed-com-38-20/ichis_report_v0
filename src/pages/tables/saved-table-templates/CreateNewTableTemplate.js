// src/D2App/components/CreateNewTableTemplate.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, NoticeBox } from '@dhis2/ui';
import i18n from '../../../locales';
import InputDialog from '../../../components/InputDialog';
import Icon from '../../../components/Icon';
import { useProgress } from '../../../context/ProgressContext';
import { useNavigate } from 'react-router-dom';

export function CreateNewTableTemplate({ createNew }) {
    const [modalOpen, setModalOpen] = useState(false);
    const { startProcessing, updateProgress, setProgressError } = useProgress();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    async function onCreateNew(inputText) {
        setModalOpen(false);
        startProcessing('createReport');
        setError(null);

        try {
            await createNew(inputText);
            updateProgress('createReport', 100); // 10% for report creation
            navigate('/tables/data-item');
        } catch (error) {
            setProgressError(i18n.t('Failed to create report'));
            setError(i18n.t('Failed to create report: {{message}}', { message: error.message }));
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
};

export default CreateNewTableTemplate;