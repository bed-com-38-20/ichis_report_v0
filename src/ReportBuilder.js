import React, { useEffect, useState } from 'react';
import ItemPanel from './ItemPanel';
import DroppableTable from './DroppableTable';
import './ReportBuilder.css';

const ReportBuilder = ({ orgUnit, period }) => {
    const [config, setConfig] = useState({
        columns: [{ name: 'Period' }, { name: 'Organisation Unit' }],
        data: {}
    });

    useEffect(() => {
        const saved = localStorage.getItem('calculatedFields');
        if (saved) {
            const parsed = JSON.parse(saved);
            setConfig(prev => ({
                ...prev,
                columns: [...prev.columns, ...parsed]
            }));
        }
    }, []);

    useEffect(() => {
        const fields = config.columns.filter(c => c.formula);
        localStorage.setItem('calculatedFields', JSON.stringify(fields));
    }, [config.columns]);

    const handleAddCalculatedField = (newField) => {
        if (!config.columns.some(c => c.name === newField.name)) {
            setConfig(prev => ({
                ...prev,
                columns: [...prev.columns, newField]
            }));
        }
    };

    const handleUpdateCalculatedField = (index, updatedField) => {
        const updated = [...config.columns];
        const calcFields = config.columns.filter(c => c.formula);
        updated[config.columns.findIndex(c => c.formula === calcFields[index].formula)] = updatedField;
        setConfig(prev => ({ ...prev, columns: updated }));
    };

    const handleDeleteCalculatedField = (index) => {
        const calcFields = config.columns.filter(col => col.formula);
        const toDelete = calcFields[index];
        setConfig(prev => ({
            ...prev,
            columns: prev.columns.filter(c => c !== toDelete)
        }));
    };

    const calculatedFields = config.columns.filter(col => col.formula);

    return (
        <div className="report-builder">
            <ItemPanel
                onAddCalculatedField={handleAddCalculatedField}
                onUpdateCalculatedField={handleUpdateCalculatedField}
                onDeleteCalculatedField={handleDeleteCalculatedField}
                calculatedFields={calculatedFields}
            />
            <DroppableTable
                config={config}
                orgUnit={orgUnit}
                period={period}
                onConfigChange={setConfig}
            />
        </div>
    );
};

export default ReportBuilder;
