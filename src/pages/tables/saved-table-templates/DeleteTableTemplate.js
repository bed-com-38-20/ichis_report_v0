// src/D2App/components/DeleteTableTemplate.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip } from '@dhis2/ui';
import i18n from '../../../locales';
import { useProgress } from '../../../context/ProgressContext';
import Icon from '../../../components/Icon';

export function DeleteTableTemplate({ onDeleteConfirmation, refresh }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [notification, setNotification] = useState({ isVisible: false, message: '', isError: false });
    const { startProcessing, setProgressError, resetProgress } = useProgress();

    const handleDeleteConfirmation = async () => {
        startProcessing('deleteReport');
        try {
            await onDeleteConfirmation();
            if (typeof refresh === 'function') {
                refresh(); // Refresh dataStore
            } else {
                console.warn('refresh is not a function:', refresh);
            }
            setModalIsOpen(false);
            resetProgress(); // Reset progress
            setNotification({
                isVisible: true,
                message: i18n.t('Report template deleted successfully'),
                isError: false,
            });
        } catch (error) {
            setProgressError(i18n.t('Failed to delete report template'));
            setNotification({
                isVisible: true,
                message: i18n.t('Failed to delete report template: {{message}}', { message: error.message }),
                isError: true,
            });
            console.error('Deletion failed:', error);
        }
    };

    return (
        <>
            <Button
                destructive
                onClick={() => setModalIsOpen(true)}
                icon={<Icon name="delete" />}
            >
                {i18n.t('Delete')}
            </Button>
            {modalIsOpen && (
                <Modal>
                    <ModalTitle>{i18n.t('Confirm Deletion')}</ModalTitle>
                    <ModalContent>
                        {i18n.t('Are you sure you want to delete this report template?')}
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={() => setModalIsOpen(false)}>
                                {i18n.t('Cancel')}
                            </Button>
                            <Button destructive onClick={handleDeleteConfirmation}>
                                {i18n.t('Delete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
            {notification.isVisible && (
                <div style={{ marginTop: '16px' }}>
                    <NoticeBox error={notification.isError} title={notification.isError ? i18n.t('Error') : i18n.t('Success')}>
                        {notification.message}
                    </NoticeBox>
                </div>
            )}
        </>
    );
}

DeleteTableTemplate.propTypes = {
    onDeleteConfirmation: PropTypes.func.isRequired,
    refresh: PropTypes.func, // Not required to avoid breaking if not passed
};

export default DeleteTableTemplate;