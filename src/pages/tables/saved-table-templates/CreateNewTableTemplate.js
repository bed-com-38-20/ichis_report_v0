import React, { useState } from 'react'
import i18n from '../../../locales'
import PropTypes from 'prop-types'
import { Button, Card, Divider, IconInfo16 } from '@dhis2/ui'
import InputDialog from '../../../components/InputDialog'
import Icon from '../../../components/Icon'

export function CreateNewTableTemplate({ createNew }) {
    const [modalOpen, setModalOpen] = useState(false)

    function onCreateNew(inputText) {
        setModalOpen(false)
        createNew(inputText)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <Card style={{ padding: '2rem', width: '400px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <Icon name="table" color="#00796B" size={48} />
                </div>
                <h2 style={{ margin: '0 0 1rem' }}>{i18n.t('Create a New Report')}</h2>
                <p style={{ marginBottom: '2rem', color: '#555' }}>
                    {i18n.t('Start building your report template from scratch.')}
                </p>
                <Button
                    icon={<Icon name="add" color="white" />}
                    onClick={() => setModalOpen(true)}
                    primary
                    large
                >
                    {i18n.t('Create new report')}
                </Button>

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
            </Card>
        </div>
    )
}

CreateNewTableTemplate.propTypes = {
    createNew: PropTypes.func.isRequired,
}

export default CreateNewTableTemplate
