import React, { useState } from 'react'
import i18n from '../../../locales'
import PropTypes from 'prop-types'
import { Button, Tooltip, IconInfo16 } from '@dhis2/ui'
import InputDialog from '../../../components/InputDialog'
import Icon from '../../../components/Icon'

export function CreateNewTableTemplate({ createNew }) {
    const [modalOpen, setModalOpen] = useState(false)

    function onCreateNew(inputText) {
        setModalOpen(false)
        createNew(inputText)
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
            <Button
                icon={<Icon name="add" color="white" />}
                onClick={() => setModalOpen(true)}
                primary
                large
            >
                {i18n.t('Create new report')}
            </Button>
            <Tooltip content={i18n.t('Start building your report from scratch')}>
                <IconInfo16 />
            </Tooltip>

            {modalOpen && (
                <InputDialog
                    title={i18n.t('Create new report template')}
                    inputLabel={i18n.t('Report name')}
                    inputPlaceholder={i18n.t('Enter a name')}
                    initialValue={''}
                    confirmText={i18n.t('Create')}
                    onCancel={() => setModalOpen(false)}
                    onConfirm={onCreateNew}
                />
            )}
        </div>
    )
}

CreateNewTableTemplate.propTypes = {
    createNew: PropTypes.func.isRequired,
}

export default CreateNewTableTemplate