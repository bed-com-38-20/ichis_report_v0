// import React, { useState, useEffect } from 'react';
// import { DataTable, DataTableRow, DataTableCell, Button } from '@dhis2/ui';
// //import styles from './TemplatesPage.module.css';

// const TemplatesPage = () => {
//     const [templates, setTemplates] = useState([]);

//     useEffect(() => {
//         // Load templates from localStorage or API
//         const savedTemplates = JSON.parse(localStorage.getItem('reportTemplates') || '[]');
//         setTemplates(savedTemplates);
//     }, []);

//     const handleLoadTemplate = (templateId) => {
//         // Implement template loading logic
//     };

//     const handleDeleteTemplate = (templateId) => {
//         // Implement template deletion logic
//     };

//     return (
//         <div>
//             <h2>Saved Templates</h2>
//             {templates.length === 0 ? (
//                 <p>No templates saved yet</p>
//             ) : (
//                 <DataTable>
//                     <DataTableRow>
//                         <DataTableCell>Name</DataTableCell>
//                         <DataTableCell>Created</DataTableCell>
//                         <DataTableCell>Actions</DataTableCell>
//                     </DataTableRow>
//                     {templates.map(template => (
//                         <DataTableRow key={template.id}>
//                             <DataTableCell>{template.name}</DataTableCell>
//                             <DataTableCell>
//                                 {new Date(template.createdAt).toLocaleDateString()}
//                             </DataTableCell>
//                             <DataTableCell>
//                                 <Button small onClick={() => handleLoadTemplate(template.id)}>
//                                     Load
//                                 </Button>
//                                 <Button small destructive onClick={() => handleDeleteTemplate(template.id)}>
//                                     Delete
//                                 </Button>
//                             </DataTableCell>
//                         </DataTableRow>
//                     ))}
//                 </DataTable>
//             )}
//         </div>
//     );
// };

// export default TemplatesPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Card } from '@dhis2/ui';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const TemplatesPage = () => {
    const [templates, setTemplates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load saved Templates from localStorage or API
        const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
        // If no saved Templates exist, initialize with demo data to match the screenshot
        if (savedTemplates.length === 0) {
            const demoTemplates = [
                { id: 'demo', name: 'Demo Template' },
                { id: 'template1', name: 'template 1' },
                { id: 'template2', name: 'template 2' },
                { id: 'template3', name: 'template 3' }
            ];
            setTemplates(demoTemplates);
            localStorage.setItem('savedTemplates', JSON.stringify(demoTemplates));
        } else {
            setTemplates(savedTemplates);
        }
    }, []);

    const handleCreateNew = () => {
        // Navigate to the ReportBuilderPage
        navigate('/builder');
    };

    const handleTableActions = (templateId) => {
        // Handle table actions (edit, delete, etc.)
        console.log('Actions for template:', templateId);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2>Saved Templates</h2>
                <Button primary onClick={handleCreateNew}>
                    Create new
                </Button>
            </div>
            
            <Card>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {templates.map(template => (
                            <TableRow key={template.id}>
                                <TableCell>{template.name}</TableCell>
                                <TableCell style={{ width: '48px', textAlign: 'right' }}>
                                <IconButton
                                    name="more"
                                    onClick={() => handleTableActions(template.id)}
                                >
                                     <MoreVertIcon />
                                </IconButton>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default TemplatesPage;