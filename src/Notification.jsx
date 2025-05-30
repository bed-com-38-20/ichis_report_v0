import React, { useState, useEffect } from 'react';
import { AlertBar } from '@dhis2/ui';

export const useNotification = () => {
    const [notification, setNotification] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const showNotification = (message, type = 'info', duration = 3000) => {
        setNotification({ message, type, duration });
        setIsVisible(true);
    };

    useEffect(() => {
        if (!notification) return;

        const timer = setTimeout(() => {
            setIsVisible(false);
            // Small delay before clearing to allow fade-out animation
            setTimeout(() => setNotification(null), 500);
        }, notification.duration);

        return () => clearTimeout(timer);
    }, [notification]);

    const Notification = () => {
        if (!notification || !isVisible) return null;

        const alertProps = {
            [notification.type === 'error' && 'critical']: true,
            [notification.type === 'success' && 'success']: true,
            [notification.type === 'warning' && 'warning']: true,
        };

        return (
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                width: '300px'
            }}>
                <AlertBar 
                    duration={notification.duration} 
                    {...alertProps}
                >
                    {notification.message}
                </AlertBar>
            </div>
        );
    };

    return [Notification, showNotification];
};