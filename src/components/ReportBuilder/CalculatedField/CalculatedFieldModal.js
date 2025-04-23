import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
    InputField,
    TextAreaField,
    Radio,
    Field,
    Card,
    CircularLoader,  // Corrected import for CircularLoader
} from '@dhis2/ui'
import { fetchFormulaHints } from './CalculatedFieldService'

const CalculatedFieldModal = ({ isOpen, onClose, onAdd }) => {
    const [fieldName, setFieldName] = useState('')
    const [formula, setFormula] = useState('')
    const [placement, setPlacement] = useState('row')
    const [showHints, setShowHints] = useState(false)
    const [hints, setHints] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isOpen && showHints) {
            loadFormulaHints()
        }
    }, [isOpen, showHints])

    const loadFormulaHints = async () => {
        setLoading(true)
        try {
            const data = await fetchFormulaHints()
            setHints(data)
            setError(null)
        } catch (err) {
            console.error('Error loading formula hints:', err)
            setError('Failed to load formula hints. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = () => {
        if (!fieldName || !formula) return

        onAdd({ name: fieldName, formula, placement })
        setFieldName('')
        setFormula('')
        setPlacement('row')
        setShowHints(false)
        onClose()
    }

    const handleInsertFormula = (formulaText) => {
        setFormula(formulaText)
        setShowHints(false)
    }

    if (!isOpen) return null

    return (
        <Modal position="middle" onClose={onClose} large>
            <ModalTitle>Add Calculated Field</ModalTitle>
            <ModalContent>
                <div className="modal-form">
                    <InputField
                        label="Field Name"
                        name="fieldName"
                        value={fieldName}
                        onChange={({ value }) => setFieldName(value)}
                        placeholder="Enter field name"
                        required
                    />

                    <TextAreaField
                        label="Formula"
                        name="formula"
                        value={formula}
                        onChange={({ value }) => setFormula(value)}
                        placeholder="Enter formula"
                        rows={3}
                        required
                    />

                    <Button
                        small
                        secondary
                        onClick={() => setShowHints(!showHints)}
                        className="mt-2 mb-3"
                    >
                        {showHints ? 'Hide Formula Hints' : 'Show Formula Hints'}
                    </Button>

                    {showHints && (
                        <Card className="formula-hints-card">
                            <div className="card-header">
                                <h3>Available Formulas</h3>
                            </div>
                            <div className="card-content">
                                {loading ? (
                                    <div className="loading-container">
                                        <CircularLoader small />
                                        <span>Loading formulas...</span>
                                    </div>
                                ) : error ? (
                                    <p className="error-message">{error}</p>
                                ) : hints.length === 0 ? (
                                    <p>No formulas available</p>
                                ) : (
                                    <ul className="formula-list">
                                        {hints.map((hint, index) => (
                                            <li
                                                key={index}
                                                className="formula-item"
                                                onClick={() =>
                                                    handleInsertFormula(hint.expression)
                                                }
                                            >
                                                <strong>{hint.name || 'Unnamed Formula'}</strong>
                                                <p className="formula-expression">
                                                    {hint.expression}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </Card>
                    )}

                    <div className="placement-selection">
                        <h3>Placement</h3>
                        <Field label="Select Placement">
                            <Radio
                                label="Row"
                                name="placement"
                                value="row"
                                checked={placement === 'row'}
                                onChange={({ value }) => setPlacement(value)}
                            />
                            <Radio
                                label="Column"
                                name="placement"
                                value="column"
                                checked={placement === 'column'}
                                onChange={({ value }) => setPlacement(value)}
                            />
                            <Radio
                                label="Header"
                                name="placement"
                                value="header"
                                checked={placement === 'header'}
                                onChange={({ value }) => setPlacement(value)}
                            />
                            <Radio
                                label="Bottom"
                                name="placement"
                                value="bottom"
                                checked={placement === 'bottom'}
                                onChange={({ value }) => setPlacement(value)}
                            />
                        </Field>
                    </div>
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        Cancel
                    </Button>
                    <Button primary onClick={handleSubmit} disabled={!fieldName || !formula}>
                        Add Field
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

CalculatedFieldModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
}

export default CalculatedFieldModal
