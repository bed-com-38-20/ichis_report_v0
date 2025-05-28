import React, { useState } from 'react';
import i18n from '../../../locales';
import PropTypes from 'prop-types';
import { Button } from '@dhis2/ui';
import InputDialog from '../../../components/InputDialog';
import Icon from '../../../components/Icon';

// Custom Progress Bar Component
const CustomProgressBar = ({ progress }) => (
    <div
        style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden',
        }}
    >
        <div
            style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#2c6693', // DHIS2 primary color
                transition: 'width 0.3s ease-in-out',
            }}
        />
    </div>
);

CustomProgressBar.propTypes = {
    progress: PropTypes.number.isRequired,
};

export function CreateNewTableTemplate({ createNew }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isCreating, setIsCreating] = useState(false);

    async function onCreateNew(inputText) {
        setModalOpen(false);
        setIsCreating(true);
        setProgress(0);

        // Simulate progress updates (replace with actual async logic)
        const steps = 4;
        for (let i = 1; i <= steps; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setProgress((i / steps) * 100);
        }

        try {
            await createNew(inputText);
        } catch (error) {
            console.error('Report creation failed:', error);
            // Optionally, show error to user (e.g., using @dhis2/ui NoticeBox)
        } finally {
            setIsCreating(false);
            setProgress(0);
        }
    }

    return (
        <div>
            <Button
                icon={<Icon name="add" color="white" />}
                onClick={() => setModalOpen(true)}
                primary
                disabled={isCreating}
            >
                {i18n.t('Create new')}
            </Button>
            {modalOpen && (
                <InputDialog
                    title={i18n.t('Create new report template')}
                    inputLabel={i18n.t('report name')}
                    inputPlaceholder={i18n.t('Enter a name')}
                    initialValue={''}
                    confirmText={i18n.t('Create')}
                    onCancel={() => setModalOpen(false)}
                    onConfirm={onCreateNew}
                />
            )}
            {isCreating && (
                <div style={{ marginTop: '16px', width: '100%' }}>
                    <CustomProgressBar progress={progress} />
                    <p>{i18n.t('Creating report... {{progress}}%', { progress: Math.round(progress) })}</p>
                </div>
            )}
        </div>
    );
}






CreateNewTableTemplate.propTypes = {
    createNew: PropTypes.func.isRequired,
};

export default CreateNewTableTemplate;