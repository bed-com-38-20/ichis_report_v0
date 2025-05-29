// src/D2App/pages/tables/saved-table-templates/SavedTableTemplateActions.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Button, FlyoutMenu } from '@dhis2/ui';
import i18n from '../../../locales';
import Icon from '../../../components/Icon';
import { DeleteTableTemplate } from './DeleteTableTemplate';
import PopoverButton from '../../../components/PopoverButton';

export function SavedTableTemplateActions({ onGenerate, onEdit, onDelete, refresh }) {
    return (
        <div>
            <Button
                icon={<Icon name="play_arrow" size="18px" />}
                onClick={onGenerate}
            >
                {i18n.t('Generate')}
            </Button>
            <Button icon={<Icon name="edit" size="18px" />} onClick={onEdit}>
                {i18n.t('Edit')}
            </Button>
            <PopoverButton tooltip={i18n.t('report actions')}>
                {togglePopover => (
                    <FlyoutMenu>
                        <DeleteTableTemplate
                            onDeleteConfirmation={() => {
                                onDelete();
                                togglePopover();
                            }}
                            refresh={refresh} // Pass refresh
                        />
                    </FlyoutMenu>
                )}
            </PopoverButton>
            <style jsx>{`
                div {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
            `}</style>
        </div>
    );
}

SavedTableTemplateActions.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
    refresh: PropTypes.func, // Add refresh prop
};

export default SavedTableTemplateActions;