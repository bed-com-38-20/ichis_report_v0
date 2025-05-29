// src/D2App/components/InputDialog.jsx
import React, { useState } from 'react';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
    InputField,
} from '@dhis2/ui';
import PropTypes from 'prop-types';
import i18n from '../locales';

function InputDialog({
    confirmText,
    inputLabel,
    inputPlaceholder,
    title,
    onCancel,
    onConfirm,
    initialValue = '',
}) {
    const [inputText, setInputText] = useState(initialValue);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onConfirm(inputText);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        disabled={isSubmitting}
                    />
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={onCancel} disabled={isSubmitting}>
                            {i18n.t('Cancel')}
                        </Button>
                        <Button primary type="submit" disabled={isSubmitting}>
                            {isSubmitting ? i18n.t('Submitting...') : confirmText}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </form>
        </Modal>
    );
}

InputDialog.propTypes = {
    confirmText: PropTypes.string.isRequired,
    inputLabel: PropTypes.string.isRequired,
    inputPlaceholder: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
};

export default InputDialog;