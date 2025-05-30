import React, { useState } from 'react'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
    InputField,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../locales'

function InputDialog({
    confirmText,
    inputLabel,
    inputPlaceholder,
    title,
    onCancel,
    onConfirm,
    initialValue = '',
}) {
    const [inputText, setInputText] = useState(initialValue)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        onConfirm(inputText)
    }
    
    return (
        <Modal onClose={onCancel}>
            <ModalTitle>{title}</ModalTitle>
            <form onSubmit={handleSubmit}>
                <ModalContent>
                    <InputField
                        initialFocus
                        label={inputLabel}
                        placeholder={inputPlaceholder}
                        onChange={ref => setInputText(ref.value)}
                        value={inputText}
                    />
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={onCancel}>{i18n.t('Cancel')}</Button>
                        <Button
                            primary
                            type="submit"
                        >
                            {confirmText}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </form>
        </Modal>
    )
}

InputDialog.propTypes = {
    confirmText: PropTypes.string.isRequired,
    inputLabel: PropTypes.string.isRequired,
    inputPlaceholder: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
}

export default InputDialog