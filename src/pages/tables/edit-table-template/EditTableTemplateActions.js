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
            setFeedback(i18n.t('Template successfully deleted, Go back to saved reports.'))
        } catch (error) {
            setFeedback(i18n.t('An error occurred during deletion.'))
        } finally {
            setIsDeleting(false)
            setDeleteModalIsOpen(false)
        }
    }

    return (
        <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px', 
            maxWidth: '600px', 
            margin: '2rem auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
            {/* Feedback Notice */}
            {feedback && (
                <NoticeBox
                    title={feedback.includes('successfully') ? i18n.t('Success') : i18n.t('Error')}
                    success={feedback.includes('successfully')}
                    style={{ 
                        marginBottom: '1.5rem', 
                        borderRadius: '6px', 
                        padding: '1rem',
                        backgroundColor: feedback.includes('successfully') ? '#e6ffed' : '#ffe6e6',
                        border: `1px solid ${feedback.includes('successfully') ? '#2e7d32' : '#d32f2f'}`
                    }}
                >
                    {feedback}
                </NoticeBox>
            )}

            {/* Delete and Generate Buttons */}
            <ButtonStrip style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                justifyContent: 'center',
                padding: '0.75rem',
                backgroundColor: '#fff',
                borderRadius: '6px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
            }}>
                <Button
                    destructive
                    large
                    icon={<Icon name="delete" />}
                    onClick={toggleModal}
                    disabled={isDeleting}
                    style={{
                        flex: 1,
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        backgroundColor: isDeleting ? '#f5f5f5' : '#d32f2f',
                        color: '#fff',
                        border: 'none',
                        cursor: isDeleting ? 'not-allowed' : 'pointer'
                    }}
                >
                    {i18n.t('Delete')}
                </Button>
                <Button
                    large
                    primary
                    icon={<Icon name="play_arrow" color="white" />}
                    onClick={onGenerate}
                    style={{
                        flex: 1,
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        border: 'none'
                    }}
                >
                    {i18n.t('Generate Report')}
                </Button>
            </ButtonStrip>

            {/* Delete Confirmation Modal */}
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
        </div>
    )
}

EditTableTemplateActions.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
}

export default EditTableTemplateActions