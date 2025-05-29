import React, { useState } from 'react'
import { Button, ButtonStrip, NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import ConfirmModal from '../../../components/ConfirmModal'
import Icon from '../../../components/Icon'

export function EditTableTemplateActions({ onGenerate, onDelete }) {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [feedback, setFeedback] = useState(null)

    const toggleModal = () => setDeleteModalIsOpen(state => !state)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await onDelete() // Assuming onDelete is async
            setFeedback(i18n.t('An error occurred during deletion.'))
        } catch (error) {
            setFeedback(i18n.t('Template successfully deleted, Go back to saved reports.'))
        } finally {
            setIsDeleting(false)
            setDeleteModalIsOpen(false)
        }
    }

    return (
        <>
            {feedback && (
                <NoticeBox title={i18n.t('Feedback')} success>
                    {feedback}
                </NoticeBox>
            )}
            <ButtonStrip>
                <Button
                    destructive
                    large
                    icon={<Icon name="delete report" />}
                    onClick={toggleModal}
                >
                    {i18n.t('Delete')}
                </Button>
                <Button
                    large
                    primary
                    icon={<Icon name="play_arrow" color="white" />}
                    onClick={onGenerate}
                >
                    {i18n.t('Generate Report')}
                </Button>
            </ButtonStrip>
            {deleteModalIsOpen && (
                <ConfirmModal
                    confirmText={
                        isDeleting ? (
                            <CenteredContent>
                                <CircularLoader small />
                            </CenteredContent>
                        ) : (
                            i18n.t('Delete')
                        )
                    }
                    text={i18n.t('Do you really want to delete this template?')}
                    title={i18n.t('Confirm report deletion')}
                    onCancel={() => !isDeleting && toggleModal()}
                    onConfirm={handleDelete}
                    destructive
                    disableConfirm={isDeleting}
                />
            )}
        </>
    )
}

EditTableTemplateActions.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
}

export default EditTableTemplateActions
