// src/D2App/context/ProgressContext.js
import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { NoticeBox } from '@dhis2/ui';
import i18n from '../locales';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(null);

    const steps = {
        createReport: { weight: 10, label: i18n.t('Create Report') },
        selectDataItem: { weight: 20, label: i18n.t('Select Data Item') },
        selectOrgUnit: { weight: 20, label: i18n.t('Select Organization Units') },
        selectPeriods: { weight: 20, label: i18n.t('Select Periods') },
        finalizeReport: { weight: 30, label: i18n.t('Finalize Report') },
    };

    const updateProgress = (step, stepProgress = 100) => {
        if (steps[step]) {
            setProgress((prev) => {
                const newProgress = prev + (steps[step].weight * stepProgress) / 100;
                return Math.min(newProgress, 100);
            });
            setCurrentStep(step);
            setIsProcessing(true);
        }
    };

    const resetProgress = () => {
        setProgress(0);
        setIsProcessing(false);
        setError(null);
        setCurrentStep(null);
    };

    const startProcessing = (step) => {
        setIsProcessing(true);
        setError(null);
        setCurrentStep(step);
    };

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
                currentStep,
                steps,
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

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
};

export function GlobalProgressBar() {
    const { progress, isProcessing, error, currentStep, steps } = useProgress();

    if (!isProcessing && !error) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1000,
                backgroundColor: '#fff',
                padding: '8px 16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: '100%',
                margin: 0,
            }}
        >
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
                    <p>
                        {i18n.t('Report progress: {{progress}}% (Step: {{step}})', {
                            progress: Math.round(progress),
                            step: currentStep ? steps[currentStep].label : i18n.t('Starting...'),
                        })}
                    </p>
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