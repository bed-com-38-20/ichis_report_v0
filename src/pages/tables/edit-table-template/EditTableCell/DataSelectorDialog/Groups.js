// src/D2App/pages/tables/edit-table-template/EditTableCell/DataSelectorDialog/Groups.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui';
import { Detail } from './Detail';
import { dataTypes } from '../../../../../modules/dataTypes';
import styles from './styles/Groups.style';

export const Groups = ({
    dataType,
    detailValue,
    groupId,
    groups,
    onDetailChange,
    onGroupChange,
}) => {
    let optionItems = groups;

    if (dataTypes[dataType].defaultGroup) {
        const { id, getName } = dataTypes[dataType].defaultGroup;
        optionItems = [{ id, name: getName() }, ...optionItems];
    }

    const groupDetail = dataTypes[dataType].groupDetail;

    return (
        <div className="container">
            <style jsx>{styles}</style>
            <div className="group-container">
                <SingleSelectField
                    label={dataTypes[dataType].getGroupLabel()}
                    selected={groupId}
                    placeholder={
                        !groupId && dataTypes[dataType].getPlaceholder
                            ? dataTypes[dataType].getPlaceholder()
                            : null
                    }
                    onChange={ref => onGroupChange(ref.selected)}
                    dense
                    inputProps={{ 'aria-label': dataTypes[dataType].getGroupLabel() }} // Add aria-label
                >
                    {optionItems.map(item => (
                        <SingleSelectOption
                            value={item.id}
                            key={item.id}
                            label={item.name}
                        />
                    ))}
                </SingleSelectField>
            </div>
            {groupDetail && (
                <Detail currentValue={detailValue} onChange={onDetailChange} />
            )}
        </div>
    );
};

Groups.propTypes = {
    dataType: PropTypes.string.isRequired,
    detailValue: PropTypes.string.isRequired,
    groupId: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired,
    onDetailChange: PropTypes.func.isRequired,
    onGroupChange: PropTypes.func.isRequired,
};

export default Groups;