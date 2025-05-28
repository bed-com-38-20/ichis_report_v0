import React, { useEffect, useState, useCallback } from 'react';
import { CircularLoader, Tooltip, Button } from '@dhis2/ui';
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

    const { data, loading, error, refetch } = useDataQuery(ANALYTICS_QUERY, {
        variables: queryVars,
        onError: (err) => {
            // Log detailed error information
            console.error(`Analytics query failed for ${cell.data.item.name}:`, err);
            console.error('Query parameters:', queryVars);
            console.error('Full error response:', err.details?.response);
            
            setErrorDetails({
                item: cell.data.item.name,
                params: { ...queryVars },
                message: err.message || 'Unknown error',
                httpStatus: err.details?.response?.status,
                responseText: err.details?.response?.statusText
            });
            
            // Implement retry and fallback logic
            if (retryCount < MAX_RETRIES && !isRetrying) {
                setIsRetrying(true);
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    setIsRetrying(false);
                    refetch(queryVars);
                }, RETRY_DELAY);
            } 
            // After max retries, try fallback period strategy if not already using it
            else if (!useFallbackPeriod && originalPeId !== getFallbackPeriodId(originalPeId)) {
                setUseFallbackPeriod(true);
                setRetryCount(0);
            }
        }
    });

    // Make sure query updates in response to new props or fallback changes
    useEffect(() => {
        // Reset retry counter when parameters change
        setRetryCount(0);
        refetch(queryVars);
    }, [cell, selectedOrgUnits, selectedPeriods, useFallbackPeriod, manualRefreshTrigger, refetch]);

    const handleManualRefresh = () => {
        // Reset all state and try again
        setRetryCount(0);
        setUseFallbackPeriod(false);
        setErrorDetails(null);
        setManualRefreshTrigger(prev => prev + 1);
    };

    function getTooltipContent() {
        let content = `Data item: ${cell.data.item.name}`;
        
        // Add period information
        content += `\nPeriod: ${effectivePeId}`;
        if (useFallbackPeriod) {
            content += ` (fallback from ${originalPeId})`;
        }
        
        // Add error information to tooltip if applicable
        if (error) {
            content += '\nError: Failed to load data';
            if (retryCount > 0) {
                content += ` (Retry ${retryCount}/${MAX_RETRIES})`;
            }
            if (errorDetails) {
                content += `\nItem: ${errorDetails.item}`;
                content += `\nParameters: dx:${errorDetails.params.dxId}, ou:${errorDetails.params.ouId}, pe:${errorDetails.params.peId}`;
                if (errorDetails.message) {
                    content += `\nError message: ${errorDetails.message}`;
                }
                if (errorDetails.httpStatus) {
                    content += `\nHTTP Status: ${errorDetails.httpStatus} ${errorDetails.responseText || ''}`;
                }
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

    // Handle loading state
    if (loading) {
        return (
            <div className="cell-loading">
                <CircularLoader small />
                <style jsx>{`
                    .cell-loading {
                        display: flex;
                        justify-content: center;
                        min-height: 24px;
                        align-items: center;
                    }
                `}</style>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <Tooltip content={getTooltipContent()}>
                {props => (
                    <div {...props} className="error-cell">
                        <span className="error-value">
                            {useFallbackPeriod ? '∼' : '-'}
                        </span>
                        {retryCount >= MAX_RETRIES && (
                            <span 
                                className="refresh-button"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleManualRefresh();
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                ⟳
                            </span>
                        )}
                        <FootnoteRefs cell={cell} />
                        <style jsx>{`
                            .error-cell {
                                color: #888;
                                display: flex;
                                align-items: center;
                                gap: 4px;
                            }
                            .error-value {
                                cursor: help;
                            }
                            .refresh-button {
                                cursor: pointer;
                                font-size: 12px;
                                color: #0066cc;
                                opacity: 0.7;
                            }
                            .refresh-button:hover {
                                opacity: 1;
                            }
                        `}</style>
                    </div>
                )}
            </Tooltip>
        );
    }

    // Handle successful data state
    return (
        <Tooltip content={getTooltipContent()}>
            {props => (
                <div {...props}>
                    <span
                        className={cx({ 
                            highlightingOn: table.highlightingOn,
                            fallbackData: useFallbackPeriod
                        })}
                    >
                        {data.result.rows.length ? data.result.rows[0][1] : '-'}
                        {useFallbackPeriod && <span className="fallback-indicator">*</span>}
                    </span>

                    <FootnoteRefs cell={cell} />

                    <style jsx>{`
                        .highlightingOn {
                            display: inline-block;
                            padding: 0.5rem;
                            margin: -0.5rem 0rem -0.5rem -0.5rem;
                            background-color: ${getCellColor()};
                        }
                        .fallbackData {
                            font-style: italic;
                        }
                        .fallback-indicator {
                            font-size: 10px;
                            vertical-align: super;
                            margin-left: 2px;
                            color: #666;
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