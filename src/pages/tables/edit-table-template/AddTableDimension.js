import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@dhis2/ui'
import i18n from '../../../locales'
import { ADD_ROW, ADD_COLUMN } from '../../../reducers/tableReducer'
import Icon from '../../../components/Icon'
import InputDialog from '../../../components/InputDialog'
import { useTableDispatch } from '../../../context/tableContext'

export function AddTableDimension({ type }) {
    const dispatch = useTableDispatch()
    const [modalOpen, setModalOpen] = useState(false)
    const [disabled, setDisabled] = useState(false)  // Disabled state when modal is open

    const handleCancel = () => {
        setModalOpen(false)
        setDisabled(false)  // Enable button when modal is closed
    }

    const handleConfirm = (inputText) => {
        dispatch({
            type: type === 'Row' ? ADD_ROW : ADD_COLUMN,
            payload: { name: inputText.trim() },
        })
        setModalOpen(false)
        setDisabled(false)  // Enable button after the action is completed

        // Sound feedback (You can replace this with any sound you'd prefer)
        const audio = new Audio('/path/to/success-sound.mp3')
        audio.play()

        // Alert feedback
        alert(i18n.t('Successfully added {{type}}: {{name}}', { type, name: inputText.trim() }))
    }

    const openDialog = () => {
        setModalOpen(true)
        setDisabled(true)  // Disable button when modal is open
    }

    const isRow = type === 'Row'
    const buttonStyle = {
        backgroundColor: isRow ? '#2563EB' : '#10B981',
        color: 'white',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '8px',
        transition: 'transform 0.3s ease-in-out',
    }

    // Hover animation
    const buttonHoverStyle = {
        ...buttonStyle,
        transform: 'scale(1.05)',  // Slight scale effect on hover
    }

    return (
        <>
            <Button
                large
                icon={<Icon name="add" color="white" />}
                onClick={openDialog}
                style={buttonStyle}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                disabled={disabled}
            >
                {i18n.t('Add {{type}}', { type })}
            </Button>

            {modalOpen && (
                <InputDialog
                    title={i18n.t('New {{type}}', { type })}
                    inputLabel={i18n.t('{{type}} Name', { type })}
                    inputPlaceholder={i18n.t('Enter a name')}
                    confirmText={i18n.t('Add {{type}}', { type })}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    )
}

AddTableDimension.propTypes = {
    type: PropTypes.oneOf(['Row', 'Column']).isRequired,
}

export default AddTableDimension
