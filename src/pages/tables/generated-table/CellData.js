import React, { useEffect, useMemo } from 'react';
import { CircularLoader, Tooltip } from '@dhis2/ui';
import { useDataQuery } from '@dhis2/app-runtime';
import PropTypes from 'prop-types';
import cx from 'classnames';
import i18n from '../../../locales';
import { useTableState } from '../../../context/tableContext';
import { getSelectedIds } from './TableWithData';
import FootnoteRefs from './FootnoteRefs';

const ANALYTICS_QUERY = {
    result: {
        resource: 'analytics',
        params: ({ dxId, ouId, peId }) => ({
            dimension: `dx:${dxId}`,
            filter: [ouId.length ? `ou:${ouId}` : '', `pe:${peId}`].filter(Boolean),
            skipMeta: true,
        }),
    },
};

function CellData({ cell, selectedOrgUnits = [], selectedPeriods = [] }) {
    const table = useTableState();

    // Memoize query variables to prevent unnecessary refetches
    const queryVars = useMemo(() => ({
        dxId: cell.data?.item?.id || '',
        ouId: cell.data?.orgUnits?.length
            ? getSelectedIds(cell.data.orgUnits)
            : getSelectedIds(selectedOrgUnits),
        peId: cell.data?.periods?.length
            ? getSelectedIds(cell.data.periods)
            : getSelectedIds(selectedPeriods),
    }), [cell, selectedOrgUnits, selectedPeriods]);

    const { data, loading, error, refetch } = useDataQuery(ANALYTICS_QUERY, {
        variables: queryVars,
        lazy: !cell.data?.item?.id, // Don't fetch if no item id
    });

    useEffect(() => {
        if (cell.data?.item?.id) {
            refetch(queryVars);
        }
    }, [queryVars, refetch, cell.data?.item?.id]);

    const getTooltipContent = () => {
        return cell.data?.item?.name 
            ? `${i18n.t('Data item')}: ${cell.data.item.name}`
            : i18n.t('No data available');
    };

    const getCellColor = () => {
        try {
            const intervals = cell.highlightingIntervals || table.highlightingIntervals || [];
            const value = data?.result?.rows?.[0]?.[1];
            
            if (value === undefined || !intervals.length) {
                return 'transparent';
            }

            const numericValue = Number(value);
            if (isNaN(numericValue)) return 'transparent';

            // Find the highest threshold the value meets
            const matchingInterval = [...intervals]
                .sort((a, b) => Number(b.lowerBound) - Number(a.lowerBound))
                .find(interval => numericValue >= Number(interval.lowerBound));

            return matchingInterval?.color || 'transparent';
        } catch (error) {
            console.error('Error calculating cell color:', error);
            return 'transparent';
        }
    };

    const renderCellContent = () => {
        if (loading) return <CircularLoader small />;
        if (error) {
            console.error('Cell data error:', error);
            return <span className="error">{i18n.t('Error loading data')}</span>;
        }
        if (!data?.result?.rows?.length) return '-';

        const displayValue = data.result.rows[0][1] || '-';
        const backgroundColor = table.highlightingOn ? getCellColor() : 'transparent';

        return (
            <>
                <span 
                    className={cx({ highlightingOn: table.highlightingOn })}
                    style={{ backgroundColor }}
                >
                    {displayValue}
                </span>
                <FootnoteRefs cell={cell} />
            </>
        );
    };

    if (!cell.data?.item) {
        return (
            <Tooltip content={i18n.t('No data item configured')}>
                <div>-</div>
            </Tooltip>
        );
    }

    return (
        <Tooltip content={getTooltipContent()}>
            <div className="cell-container">
                {renderCellContent()}
                <style jsx>{`
                    .cell-container {
                        min-height: 24px;
                        display: flex;
                        align-items: center;
                    }
                    .highlightingOn {
                        display: inline-block;
                        padding: 0.5rem;
                        margin: -0.5rem 0 -0.5rem -0.5rem;
                        border-radius: 3px;
                    }
                    .error {
                        color: #d32f2f;
                        font-size: 0.875rem;
                    }
                `}</style>
            </div>
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
                lowerBound: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                ]),
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

CellData.defaultProps = {
    cell: { data: {} },
    selectedOrgUnits: [],
    selectedPeriods: [],
};

export default CellData;