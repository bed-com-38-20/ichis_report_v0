import React from 'react';
import PropTypes from 'prop-types';
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui';
import i18n from '../../../../locales';
import contentTypes from '../../../../modules/contentTypes';
import classes from './ContentTypeSelector.module.css';
import Icon from '../../../../components/Icon';
import cx from 'classnames';

export function ContentTypeSelector({ currentContentType, onChange, className }) {
    return (
        <div className={cx(classes.container, className)}>
            <div className={classes.labelWrapper}>
                <Icon name="list" className={classes.icon} />
                <label className={classes.label}>
                    {i18n.t('Content type', { defaultValue: 'Content type' })}
                </label>
            </div>
            <SingleSelectField
                className={classes.select}
                onChange={({ selected }) => onChange(selected)}
                selected={currentContentType}
                dense
            >
                {Object.values(contentTypes).map(({ id, getName }) => (
                    <SingleSelectOption
                        value={id}
                        label={getName()}
                        key={id}
                        className={classes.option}
                    />
                ))}
            </SingleSelectField>
        </div>
    );
}

ContentTypeSelector.propTypes = {
    onChange: PropTypes.func.isRequired,
    currentContentType: PropTypes.string,
    className: PropTypes.string,
};

export default ContentTypeSelector;