import React, { useState } from 'react';
import DraggableItem from './DraggableItem';

const ItemPanel = ({ items = [], onAddCalculatedField, onUpdateCalculatedField, onDeleteCalculatedField, calculatedFields = [] }) => {
    const [fieldName, setFieldName] = useState('');
    const [formula, setFormula] = useState('');

    const [editingIndex, setEditingIndex] = useState(null);
    const [editFieldName, setEditFieldName] = useState('');
    const [editFormula, setEditFormula] = useState('');

    const handleAdd = () => {
        if (!fieldName || !formula) return;
        onAddCalculatedField({
            name: fieldName,
            formula,
            type: 'calculated'
        });
        setFieldName('');
        setFormula('');
    };

    const startEditing = (index, field) => {
        setEditingIndex(index);
        setEditFieldName(field.name);
        setEditFormula(field.formula);
    };

    const handleEditSave = () => {
        if (!editFieldName || !editFormula) return;
        onUpdateCalculatedField(editingIndex, {
            name: editFieldName,
            formula: editFormula,
            type: 'calculated'
        });
        setEditingIndex(null);
        setEditFieldName('');
        setEditFormula('');
    };

    return (
        <div style={styles.panel}>
            <h3>Data Elements / Indicators</h3>
            {items.map((item) => (
                <DraggableItem key={item.id} item={item} />
            ))}

            <h4 style={{ marginTop: '16px' }}>Add Calculated Field</h4>
            <input
                type="text"
                placeholder="Name (e.g., Profit)"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                style={styles.input}
            />
            <input
                type="text"
                placeholder="Formula (e.g., Revenue - Expenses)"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleAdd} style={styles.button}>Add</button>

            {calculatedFields.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                    <h5>Calculated Fields</h5>
                    {calculatedFields.map((cf, i) => (
                        <div key={`cf-${i}`} style={styles.calculatedItem}>
                            {editingIndex === i ? (
                                <>
                                    <input
                                        value={editFieldName}
                                        onChange={(e) => setEditFieldName(e.target.value)}
                                        style={styles.input}
                                        placeholder="Name"
                                    />
                                    <input
                                        value={editFormula}
                                        onChange={(e) => setEditFormula(e.target.value)}
                                        style={styles.input}
                                        placeholder="Formula"
                                    />
                                    <button onClick={handleEditSave} style={styles.button}>Save</button>
                                    <button onClick={() => setEditingIndex(null)} style={styles.cancel}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <DraggableItem item={cf} />
                                    <button onClick={() => startEditing(i, cf)} style={styles.smallBtn}>✏️</button>
                                    <button onClick={() => onDeleteCalculatedField(i)} style={styles.smallBtn}>🗑️</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    panel: {
        width: '250px',
        padding: '10px',
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px'
    },
    input: {
        width: '100%',
        marginBottom: '8px',
        padding: '6px',
        fontSize: '14px'
    },
    button: {
        padding: '6px 12px',
        backgroundColor: '#0064d5',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '5px'
    },
    cancel: {
        padding: '6px 12px',
        backgroundColor: '#aaa',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    calculatedItem: {
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    smallBtn: {
        padding: '2px 6px',
        backgroundColor: '#eee',
        border: '1px solid #ccc',
        borderRadius: '3px',
        cursor: 'pointer'
    }
};

export default ItemPanel;
