import React, { useEffect, useState, useCallback } from 'react';
import { CircularLoader, Tooltip, Button, NoticeBox } from '@dhis2/ui';
import { useDataQuery } from '@dhis2/app-runtime';
import PropTypes from 'prop-types';
import cx from 'classnames';
import i18n from '../../../locales';
import { useTableState } from '../../../context/tableContext';
import { getSelectedIds } from './TableWithData';
import FootnoteRefs from './FootnoteRefs';

// Define a simple retry mechanism for failed requests
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Period fallback strategies
const PERIOD_FALLBACKS = [
  { regex: /^THIS_MONTH;/, fallback: 'LAST_MONTH' },
  { regex: /^LAST_3_MONTHS$/, fallback: 'LAST_MONTH' },
  { regex: /;LAST_3_MONTHS$/, fallback: match => match.split(';')[0] }
];

// Error types mapping with improved visual feedback messages
const ERROR_TYPES = {
  TABLE_NOT_EXISTS: {
    pattern: /referenced table does not exist|SqlState: 42P01/i,
    userMessage: 'Analytics table missing. Run analytics generation job before viewing this data.',
    isCritical: true,
    icon: '⚠️',
    color: '#E53935'
  },
  DIMENSION_NOT_FOUND: {
    pattern: /dimension.+not found/i, 
    userMessage: 'A requested dimension was not found in analytics',
    isCritical: false,
    icon: '❓',
    color: '#FB8C00'
  },
  NETWORK_ERROR: {
    pattern: /network|timeout|connection/i,
    userMessage: 'Network connection issue',
    isCritical: false,
    icon: '📶',
    color: '#7E57C2'
  },
  UNKNOWN_ERROR: {
    userMessage: 'An error occurred while loading data',
    isCritical: false,
    icon: '❗',
    color: '#757575'
  }
};

const ANALYTICS_QUERY = {
    result: {
        resource: 'analytics',
        params: ({ dxId, ouId, peId }) => {
            // Create base parameters
            const params = {
                dimension: `dx:${dxId}`,
                skipMeta: true,
            };
            
            // Add filters only if they have values
            const filters = [];
            if (ouId && ouId.length) {
                filters.push(`ou:${ouId}`);
            }
            
            // Format period - try to correct potentially invalid format
            // If it contains a semicolon, try with comma instead
            const formattedPeId = peId.includes(';') ? peId.replace(';', ',') : peId;
            filters.push(`pe:${formattedPeId}`);
            
            if (filters.length > 0) {
                params.filter = filters;
            }
            
            return params;
        },
    },
};

function CellData({ cell, selectedOrgUnits, selectedPeriods }) {
    if (!cell.data.item) return null;

    const table = useTableState();
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const [useFallbackPeriod, setUseFallbackPeriod] = useState(false);
    const [manualRefreshTrigger, setManualRefreshTrigger] = useState(0);
    const [errorDetails, setErrorDetails] = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [showFullTooltip, setShowFullTooltip] = useState(false);
    const [animateValue, setAnimateValue] = useState(false);

    // Get original period ID
    const originalPeId = cell.data.periods?.length
        ? getSelectedIds(cell.data.periods)
        : getSelectedIds(selectedPeriods);
        
    // Generate fallback period ID if needed
    const getFallbackPeriodId = useCallback((originalId) => {
        for (const strategy of PERIOD_FALLBACKS) {
            if (strategy.regex.test(originalId)) {
                return typeof strategy.fallback === 'function' 
                    ? strategy.fallback(originalId) 
                    : strategy.fallback;
            }
        }
        return originalId;
    }, []);
    
    // Use fallback period if needed
    const effectivePeId = useFallbackPeriod 
        ? getFallbackPeriodId(originalPeId)
        : originalPeId;

    const queryVars = {
        dxId: cell.data.item.id,
        ouId: cell.data.orgUnits?.length
            ? getSelectedIds(cell.data.orgUnits)
            : getSelectedIds(selectedOrgUnits),
        peId: effectivePeId,
    };

    // Helper to identify specific error types
    const identifyErrorType = useCallback((err) => {
        if (!err) return null;
        
        const errorMessage = (err.message || '') + 
            (err.details?.response?.statusText || '') + 
            (JSON.stringify(err.details?.response?.data) || '');
            
        for (const [key, errorDef] of Object.entries(ERROR_TYPES)) {
            if (errorDef.pattern?.test(errorMessage)) {
                return key;
            }
        }
        
        return 'UNKNOWN_ERROR';
    }, []);

    const { data, loading, error, refetch } = useDataQuery(ANALYTICS_QUERY, {
        variables: queryVars,
        onError: (err) => {
            // Log detailed error information
            console.error(`Analytics query failed for ${cell.data.item.name}:`, err);
            console.error('Query parameters:', queryVars);
            console.error('Full error response:', err.details?.response);
            
            // Identify specific error type
            const currentErrorType = identifyErrorType(err);
            setErrorType(currentErrorType);
            
            setErrorDetails({
                item: cell.data.item.name,
                params: { ...queryVars },
                message: err.message || 'Unknown error',
                httpStatus: err.details?.response?.status,
                responseText: err.details?.response?.statusText,
                errorType: currentErrorType
            });
            
            // Don't retry for critical errors that won't resolve with retries
            const isCriticalError = ERROR_TYPES[currentErrorType]?.isCritical;
            
            // Implement retry and fallback logic
            if (!isCriticalError && retryCount < MAX_RETRIES && !isRetrying) {
                setIsRetrying(true);
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    setIsRetrying(false);
                    refetch(queryVars);
                }, RETRY_DELAY);
            } 
            // After max retries, try fallback period strategy if not already using it
            else if (!isCriticalError && !useFallbackPeriod && originalPeId !== getFallbackPeriodId(originalPeId)) {
                setUseFallbackPeriod(true);
                setRetryCount(0);
            }
        },
        onComplete: () => {
            // Animate the value when loaded successfully
            setAnimateValue(true);
            setTimeout(() => setAnimateValue(false), 600);
        }
    });

    // Make sure query updates in response to new props or fallback changes
    useEffect(() => {
        // Reset retry counter when parameters change
        setRetryCount(0);
        setErrorType(null);
        refetch(queryVars);
    }, [cell, selectedOrgUnits, selectedPeriods, useFallbackPeriod, manualRefreshTrigger, refetch]);

    const handleManualRefresh = () => {
        // Reset all state and try again
        setRetryCount(0);
        setUseFallbackPeriod(false);
        setErrorDetails(null);
        setErrorType(null);
        setManualRefreshTrigger(prev => prev + 1);
    };

    // Navigate user to analytics generation page
    const handleRunAnalytics = (e) => {
        e.stopPropagation();
        // Open in new tab, replace with actual path in your DHIS2 instance
        window.open('/dhis-web-data-administration/index.html#/analytics', '_blank');
    };

    function getTooltipContent() {
        let content = showFullTooltip ? 
            `<div class="tooltip-header">${cell.data.item.name}</div>` : 
            `<div class="tooltip-title">Data item: ${cell.data.item.name}</div>`;
        
        // Add period information
        content += `<div class="tooltip-param"><span class="tooltip-label">Period:</span> ${effectivePeId}`;
        if (useFallbackPeriod) {
            content += ` <span class="tooltip-fallback">(fallback from ${originalPeId})</span>`;
        }
        content += `</div>`;
        
        // Add organization unit information
        const ouDisplay = queryVars.ouId || 'None selected';
        content += `<div class="tooltip-param"><span class="tooltip-label">Org Unit:</span> ${ouDisplay.length > 30 ? ouDisplay.substring(0, 30) + '...' : ouDisplay}</div>`;
        
        // Add data value if available
        if (data?.result?.rows?.length) {
            const value = data.result.rows[0][1];
            content += `<div class="tooltip-value"><span class="tooltip-label">Value:</span> <strong>${value}</strong></div>`;
        }
        
        // Add error information to tooltip if applicable
        if (error) {
            const errorTypeDef = ERROR_TYPES[errorType] || ERROR_TYPES.UNKNOWN_ERROR;
            content += `<div class="tooltip-error"><span class="tooltip-error-icon">${errorTypeDef.icon || '❗'}</span> ${errorTypeDef.userMessage || 'Failed to load data'}`;
            
            if (retryCount > 0) {
                content += ` <span class="tooltip-retry">(Retry ${retryCount}/${MAX_RETRIES})</span>`;
            }
            content += `</div>`;
            
            if (errorDetails && showFullTooltip) {
                content += `<div class="tooltip-details">
                    <div class="tooltip-detail-item"><span>Item:</span> ${errorDetails.item}</div>
                    <div class="tooltip-detail-item"><span>Parameters:</span> dx:${errorDetails.params.dxId.substring(0, 15)}...</div>
                </div>`;
                
                // Don't include technical details for critical errors to avoid confusing users
                if (!errorTypeDef.isCritical && errorDetails.message) {
                    content += `<div class="tooltip-technical">${errorDetails.message}</div>`;
                }
                
                // Add action suggestion for table not exists error
                if (errorType === 'TABLE_NOT_EXISTS') {
                    content += `<div class="tooltip-action">Action needed: Run analytics generation</div>`;
                }
            }
            
            if (!showFullTooltip) {
                content += `<div class="tooltip-expand">Click for more details</div>`;
            }
        }
        
        return content;
    }

    function getCellColor() {
        // Check if highlighting intervals exist
        const intervals = cell.highlightingIntervals || table.highlightingIntervals;
        if (!intervals) return null;
        
        // Check if data exists and has rows
        if (!data?.result?.rows || !data.result.rows.length) {
            return null; // Return null or a default color
        }
        
        const value = data.result.rows[0][1];
        if (value === undefined) return null;
        
        for (const { lowerBound, color } of intervals) {
            if (Number(value) >= Number(lowerBound)) return color;
        }
        return null; // Return null if no interval matches
    }
    
    // Get the actual value with formatting
    const getValue = () => {
        if (!data?.result?.rows?.length) return '-';
        
        const value = data.result.rows[0][1];
        
        // Format number if it's numeric
        if (!isNaN(value) && value !== '') {
            const numValue = parseFloat(value);
            
            // Format large numbers with comma separators
            if (Math.abs(numValue) >= 1000) {
                return numValue.toLocaleString();
            }
            
            // Format decimals
            if (numValue % 1 !== 0) {
                return numValue.toFixed(2);
            }
        }
        
        return value;
    };

    // Handle loading state
    if (loading) {
        return (
            <div className="cell-loading">
                <CircularLoader small />
                <style jsx>{`
                    .cell-loading {
                        display: flex;
                        justify-content: center;
                        min-height: 32px;
                        align-items: center;
                        padding: 4px;
                        background-color: #f9f9f9;
                        border-radius: 4px;
                        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
                    }
                `}</style>
            </div>
        );
    }

    // Handle error state
    if (error) {
        const errorTypeDef = ERROR_TYPES[errorType] || ERROR_TYPES.UNKNOWN_ERROR;
        
        return (
            <Tooltip content={getTooltipContent()} placement="bottom">
                {props => (
                    <div 
                        {...props} 
                        className="error-cell"
                        onClick={() => setShowFullTooltip(true)}
                    >
                        <div className="error-content">
                            <span className="error-icon">{errorTypeDef.icon}</span>
                            <span className="error-value">
                                {errorType === 'TABLE_NOT_EXISTS' ? '!' : useFallbackPeriod ? '∼' : '-'}
                            </span>
                        </div>
                        
                        <div className="error-actions">
                            {/* Special handling for table_not_exists errors */}
                            {errorType === 'TABLE_NOT_EXISTS' && (
                                <button 
                                    className="action-button analytics-button"
                                    onClick={handleRunAnalytics}
                                    title="Run Analytics Generation"
                                >
                                    <span className="button-icon">⚙️</span>
                                    <span className="button-text">Fix</span>
                                </button>
                            )}
                            
                            {/* Show refresh button for regular errors after max retries */}
                            {errorType !== 'TABLE_NOT_EXISTS' && retryCount >= MAX_RETRIES && (
                                <button 
                                    className="action-button refresh-button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleManualRefresh();
                                    }}
                                    title="Retry Loading Data"
                                >
                                    <span className="button-icon">⟳</span>
                                    <span className="button-text">Retry</span>
                                </button>
                            )}
                        </div>
                        
                        <FootnoteRefs cell={cell} />
                        
                        <style jsx>{`
                            .error-cell {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                padding: 6px 8px;
                                background-color: ${errorTypeDef.color}10;
                                border-left: 3px solid ${errorTypeDef.color};
                                border-radius: 4px;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                min-height: 32px;
                                min-width: 48px;
                            }
                            
                            .error-cell:hover {
                                background-color: ${errorTypeDef.color}20;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            
                            .error-content {
                                display: flex;
                                align-items: center;
                                gap: 4px;
                                margin-bottom: 4px;
                            }
                            
                            .error-icon {
                                font-size: 14px;
                            }
                            
                            .error-value {
                                font-weight: ${errorType === 'TABLE_NOT_EXISTS' ? 'bold' : 'normal'};
                                color: ${errorTypeDef.color};
                            }
                            
                            .error-actions {
                                display: flex;
                                gap: 4px;
                                margin-top: 2px;
                            }
                            
                            .action-button {
                                background: transparent;
                                border: 1px solid ${errorTypeDef.color}80;
                                border-radius: 12px;
                                color: ${errorTypeDef.color};
                                padding: 2px 6px;
                                font-size: 11px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                gap: 3px;
                                transition: all 0.2s ease;
                            }
                            
                            .action-button:hover {
                                background-color: ${errorTypeDef.color}30;
                            }
                            
                            .button-icon {
                                font-size: 10px;
                            }
                            
                            .button-text {
                                font-weight: 500;
                            }
                            
                            .analytics-button {
                                background-color: ${errorTypeDef.color}20;
                            }
                        `}</style>
                        
                        {/* Global tooltip styles */}
                        <style jsx global>{`
                            .tooltip-header {
                                font-weight: 600;
                                font-size: 14px;
                                padding-bottom: 8px;
                                margin-bottom: 8px;
                                border-bottom: 1px solid rgba(0,0,0,0.1);
                                color: #2c3e50;
                            }
                            
                            .tooltip-title {
                                font-weight: 600;
                                margin-bottom: 6px;
                                color: #2c3e50;
                            }
                            
                            .tooltip-param {
                                margin: 4px 0;
                                font-size: 13px;
                            }
                            
                            .tooltip-label {
                                font-weight: 500;
                                color: #64748b;
                            }
                            
                            .tooltip-fallback {
                                font-style: italic;
                                color: #94a3b8;
                                font-size: 12px;
                            }
                            
                            .tooltip-value {
                                margin-top: 6px;
                                font-size: 13px;
                            }
                            
                            .tooltip-error {
                                margin-top: 8px;
                                padding: 6px 8px;
                                background-color: #fef2f2;
                                border-radius: 4px;
                                color: #991b1b;
                                display: flex;
                                align-items: center;
                                gap: 6px;
                                font-size: 13px;
                            }
                            
                            .tooltip-error-icon {
                                font-size: 14px;
                            }
                            
                            .tooltip-retry {
                                font-size: 12px;
                                color: #9ca3af;
                            }
                            
                            .tooltip-details {
                                margin-top: 8px;
                                padding-top: 8px;
                                border-top: 1px dashed rgba(0,0,0,0.1);
                                font-size: 12px;
                            }
                            
                            .tooltip-detail-item {
                                margin: 3px 0;
                                color: #64748b;
                            }
                            
                            .tooltip-detail-item span {
                                font-weight: 500;
                                color: #475569;
                                margin-right: 4px;
                            }
                            
                            .tooltip-technical {
                                margin-top: 6px;
                                font-family: monospace;
                                font-size: 11px;
                                padding: 4px;
                                background-color: #f1f5f9;
                                border-radius: 3px;
                                color: #334155;
                                max-width: 300px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            
                            .tooltip-action {
                                margin-top: 8px;
                                font-weight: 500;
                                color: #2563eb;
                                font-size: 13px;
                            }
                            
                            .tooltip-expand {
                                margin-top: 6px;
                                font-style: italic;
                                color: #64748b;
                                font-size: 12px;
                                text-align: center;
                            }
                        `}</style>
                    </div>
                )}
            </Tooltip>
        );
    }

    // Handle successful data state
    return (
        <Tooltip content={getTooltipContent()} placement="bottom">
            {props => (
                <div {...props} className={cx("cell-data-container", { 
                    [`highlighting-${getCellColor()?.replace('#', '')}`]: getCellColor() && table.highlightingOn,
                })}>
                    <div 
                        className={cx("cell-value", { 
                            "fallback-data": useFallbackPeriod,
                            "animate-value": animateValue
                        })}
                    >
                        {getValue()}
                        {useFallbackPeriod && <span className="fallback-indicator">*</span>}
                    </div>

                    <FootnoteRefs cell={cell} />

                    <style jsx>{`
                        .cell-data-container {
                            padding: 8px 12px;
                            border-radius: 6px;
                            transition: background-color 0.2s ease, transform 0.1s ease;
                            min-height: 32px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                            background-color: white;
                        }
                        
                        .cell-data-container:hover {
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            transform: translateY(-1px);
                        }
                        
                        .cell-value {
                            font-weight: 600;
                            color: #1e293b;
                            font-size: 14px;
                            text-align: center;
                            transition: opacity 0.3s ease;
                        }
                        
                        .fallback-data {
                            font-style: italic;
                            color: #64748b;
                        }
                        
                        .fallback-indicator {
                            font-size: 10px;
                            vertical-align: super;
                            margin-left: 2px;
                            color: #64748b;
                            font-weight: normal;
                        }
                        
                        .animate-value {
                            animation: pulse 0.6s ease;
                        }
                        
                        @keyframes pulse {
                            0% { opacity: 0.4; transform: scale(0.95); }
                            50% { opacity: 1; transform: scale(1.05); }
                            100% { opacity: 1; transform: scale(1); }
                        }
                    `}</style>
                    
                    {/* Dynamic styles based on highlighting */}
                    <style jsx>{`
                        .highlighting-${getCellColor()?.replace('#', '')} {
                            background-color: ${getCellColor()}25;
                            border-left: 3px solid ${getCellColor()};
                        }
                    `}</style>
                </div>
            )}
        </Tooltip>
    );
}

CellData.propTypes = {
    cell: PropTypes.shape({
        data: PropTypes.shape({
            item: PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
            }),
            orgUnits: PropTypes.array,
            periods: PropTypes.array,
        }),
        highlightingIntervals: PropTypes.arrayOf(
            PropTypes.shape({
                lowerBound: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                color: PropTypes.string,
            })
        ),
    }),
    selectedOrgUnits: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ),
    selectedPeriods: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ),
};

export default CellData;