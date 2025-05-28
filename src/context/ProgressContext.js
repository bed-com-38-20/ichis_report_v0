// src/D2App/context/ProgressContext.js
import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { NoticeBox } from '@dhis2/ui';
import i18n from '../locales';

// Create the Progress Context
const ProgressContext = createContext();

// Progress Provider Component
export function ProgressProvider({ children }) {
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Define steps and their progress weights
    const steps = {
        createReport: 10, // 10% for report creation
        addOrgUnit: 30, // 30% for organization unit selection
        selectPeriods: 30, // 30% for period selection
        finalizeReport: 30, // 30% for finalizing report
    };

    // Update progress for a specific step
    const updateProgress = (step, stepProgress = 100) => {
        if (steps[step]) {
            setProgress((prev) => {
                const newProgress = prev + (steps[step] * stepProgress) / 100;
                return Math.min(newProgress, 100); // Cap at 100%
            });
        }
    };

    // Reset progress
    const resetProgress = () => {
        setProgress(0);
        setIsProcessing(false);
        setError(null);
    };

    // Start processing
    const startProcessing = () => {
        setIsProcessing(true);
        setError(null);
    };

    // Set error
    const setProgressError = (errorMessage) => {
        setError(errorMessage);
        setIsProcessing(false);
    };

    return (
        <ProgressContext.Provider
            value={{
                progress,
                isProcessing,
                error,
                updateProgress,
                resetProgress,
                startProcessing,
                setProgressError,
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
}

ProgressProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Hook to use Progress Context
export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
};

// Global Progress Bar Component
export function GlobalProgressBar() {
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
                <div style={{ marginTop: '8px' }}>
                    <NoticeBox error title={i18n.t('Error')}>
                        {error}
                    </NoticeBox>
                </div>
            )}
        </div>
    );
}

export default ProgressContext;