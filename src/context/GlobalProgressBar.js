// src/components/GlobalProgressBar.jsx
import React from 'react';
import { NoticeBox } from '@dhis2/ui';
import { useProgress } from '../context/ProgressContext';
import i18n from '../locales';

function GlobalProgressBar() {
    const { progress, isProcessing, error } = useProgress();

    if (!isProcessing && !error) return null;

    return (
        <div style={{ margin: '16px', width: '100%' }}>
            {isProcessing && (
                <>
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
                                backgroundColor: '#2c6693',
                                transition: 'width 0.3s ease-in-out',
                            }}
                        />
                    </div>
                    <p>{i18n.t('Report progress: {{progress}}%', { progress: Math.round(progress) })}</p>
                </>
            )}
            {error && (
                <NoticeBox error title={i18n.t('Error')}>
                    {error}
                </NoticeBox>
            )}
        </div>
    );
}

export default GlobalProgressBar;