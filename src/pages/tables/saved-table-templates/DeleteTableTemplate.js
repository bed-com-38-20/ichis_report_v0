// src/D2App/components/DeleteTableTemplate.jsx
import React, { useState, useEffect } from 'react';
import { MenuItem, NoticeBox } from '@dhis2/ui';
import PropTypes from 'prop-types';
import Icon from '../../../components/Icon';
import ConfirmModal from '../../../components/ConfirmModal';
import i18n from '../../../locales';
import classes from './DeleteTableTemplate.module.css';
import { useProgress } from '../../../context/ProgressContext';
import { useDataStore } from '@dhis2/app-service-datastore';

export function DeleteTableTemplate({ onDeleteConfirmation, onCancel }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { startProcessing, setProgressError } = useProgress();
    const { refresh } = useDataStore();
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        isError: false,
    });

    useEffect(() => {
        if (notification.isVisible) {
            const timer = setTimeout(() => {
                setNotification({ isVisible: false, message: '', isError: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.isVisible]);

    const handleDeleteConfirmation = async () => {
        startProcessing('deleteReport');
        try {
            await onDeleteConfirmation();
            refresh();
            setModalIsOpen(false);
            setNotification({
                isVisible: true,
                message: i18n.t('Report template deleted successfully'),
                isError: false,
            });
        } catch (error) {
            setProgressError(i18n.t('Failed to delete report template'));
            setNotification({
                isVisible: true,
                message: i18n.t('Failed to delete report template'),
                isError: true,
            });
            console.error('Deletion failed:', error);
        }
    };

    return (
        <div className={classes.container}>
            <MenuItem
                icon={<Icon name="delete" />}
                label={i18n.t('Delete')}
                onClick={() => setModalIsOpen(true)}
            />
            {modalIsOpen && (
                <ConfirmModal
                    destructive
                    title={i18n.t('Confirm delete')}
                    text={i18n.t('Are you sure you want to delete this template?')}
                    confirmText={i18n.t('Delete')}
                    onCancel={() => {
                        if (onCancel) onCancel();
                        setModalIsOpen(false);
                    }}
                    onConfirm={handleDeleteConfirmation}
                />
            )}
            {notification.isVisible && (
                <div className={classes.notification}>
                    <NoticeBox title={notification.isError ? i18n.t('Error') : i18n.t('Success')} error={notification.isError}>
                        {notification.message}
                    </NoticeBox>
                </div>
            )}
        </div>
    );
}

DeleteTableTemplate.propTypes = {
    onDeleteConfirmation: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};

export default DeleteTableTemplate;