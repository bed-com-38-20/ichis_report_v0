// src/D2App/components/CreateNewTableTemplate.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, NoticeBox } from '@dhis2/ui';
import i18n from '../../../locales';
import InputDialog from '../../../components/InputDialog';
import Icon from '../../../components/Icon';
//import { useProgress } from '../../../context/ProgressContext';
import { useNavigate } from 'react-router-dom';

export function CreateNewTableTemplate({ createNew, savedTableTemplates }) {
    const [modalOpen, setModalOpen] = useState(false);
    //const { startProcessing, updateProgress, setProgressError } = useProgress();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    // Clear errors when modal opens
    const handleModalOpen = () => {
        setModalOpen(true);
        setError(null);
        setValidationError(null);
    };

    // Clear errors when modal closes
    const handleModalClose = () => {
        setModalOpen(false);
        setValidationError(null);
    };

    async function onCreateNew(inputText) {
        setValidationError(null);
        
        // Check for empty name
        const trimmedInput = inputText.trim();
        if (!trimmedInput) {
            const errorMessage = i18n.t('Report name cannot be empty');
            setValidationError(errorMessage);
            return;
        }

        // Check for duplicate names (case-insensitive)
        const isDuplicate = savedTableTemplates.some(
            template => template.name.toLowerCase() === trimmedInput.toLowerCase()
        );
        if (isDuplicate) {
            const errorMessage = i18n.t('A report with this name already exists');
            setValidationError(errorMessage);
            return;
        }

        // If validation passes, proceed with creation
        startProcessing('createReport');
        setError(null);

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
                onClick={handleModalOpen}
                primary
            >
                {i18n.t('Create new')}
            </Button>
            {modalOpen && (
                <div>
                    <InputDialog
                        title={i18n.t('Create new report template')}
                        inputLabel={i18n.t('report name')}
                        inputPlaceholder={i18n.t('Enter a name')}
                        initialValue=""
                        confirmText={i18n.t('Create')}
                        onCancel={handleModalClose}
                        onConfirm={onCreateNew}
                    />
                    {validationError && (
                        <div style={{ 
                            position: 'fixed', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10000,
                            backgroundColor: 'white',
                            padding: '16px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            maxWidth: '400px',
                            width: '90%'
                        }}>
                            <NoticeBox error title={i18n.t('Error')} onClose={() => setValidationError(null)}>
                                {validationError}
                            </NoticeBox>
                        </div>
                    )}
                </div>
            )}
            {error && !modalOpen && (
                <div style={{ 
                    marginTop: '16px',
                    position: 'relative',
                    zIndex: 1000
                }}>
                    <NoticeBox error title={i18n.t('Error')} onClose={() => setError(null)}>
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