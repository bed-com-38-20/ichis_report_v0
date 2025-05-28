import React, { useState, useEffect } from 'react';
import { MenuItem, NoticeBox } from '@dhis2/ui';
import PropTypes from 'prop-types';
import Icon from '../../../components/Icon';
import ConfirmModal from '../../../components/ConfirmModal';
import i18n from '../../../locales';
import classes from './DeleteTableTemplate.module.css';

export function DeleteTableTemplate({ onDeleteConfirmation, onCancel }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
    });

    // Auto-dismiss notification after 3 seconds
    useEffect(() => {
        if (notification.isVisible) {
            const timer = setTimeout(() => {
                setNotification({ isVisible: false, message: '' });
            }, 60000);
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [notification.isVisible]);

    const handleDeleteConfirmation = () => {
        onDeleteConfirmation(); // Call the provided delete handler
        setModalIsOpen(false); // Close the modal
        setNotification({
            isVisible: true,
            message: i18n.t('report template deleted successfully'),
        }); // Show notification
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
                    <NoticeBox title={i18n.t('Success')}>
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