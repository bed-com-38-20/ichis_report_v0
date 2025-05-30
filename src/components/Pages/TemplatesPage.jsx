import React, { useState, useEffect } from 'react';
import { DataTable, DataTableRow, DataTableCell, Button } from '@dhis2/ui';
//import styles from './TemplatesPage.module.css';

const TemplatesPage = () => {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        // Load templates from localStorage or API
        const savedTemplates = JSON.parse(localStorage.getItem('reportTemplates') || '[]');
        setTemplates(savedTemplates);
    }, []);

    const handleLoadTemplate = (templateId) => {
        // Implement template loading logic
    };

    const handleDeleteTemplate = (templateId) => {
        // Implement template deletion logic
    };

    return (
        <div className={styles.templatesContainer}>
            <h2>Saved Templates</h2>
            {templates.length === 0 ? (
                <p>No templates saved yet</p>
            ) : (
                <DataTable>
                    <DataTableRow>
                        <DataTableCell>Name</DataTableCell>
                        <DataTableCell>Created</DataTableCell>
                        <DataTableCell>Actions</DataTableCell>
                    </DataTableRow>
                    {templates.map(template => (
                        <DataTableRow key={template.id}>
                            <DataTableCell>{template.name}</DataTableCell>
                            <DataTableCell>
                                {new Date(template.createdAt).toLocaleDateString()}
                            </DataTableCell>
                            <DataTableCell>
                                <Button small onClick={() => handleLoadTemplate(template.id)}>
                                    Load
                                </Button>
                                <Button small destructive onClick={() => handleDeleteTemplate(template.id)}>
                                    Delete
                                </Button>
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTable>
            )}
        </div>
    );
};

export default TemplatesPage;