import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Card, CircularLoader, AlertBar } from '@dhis2/ui';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTemplateStore } from '../../hooks/useTemplateStore';


const TemplatesPage = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { loadTemplates } = useTemplateStore();

    useEffect(() => {
        const fetchTemplates = async () => {
            setLoading(true);
            try {
                const savedTemplates = await loadTemplates();
                console.log('Fetched templates:', savedTemplates);
                setTemplates(savedTemplates);
            } catch (err) {
                console.error('Failed to load templates:', err);
                setError('Could not load templates from the DHIS2 DataStore.');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
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
            {loading ? (
                <CircularLoader small />
            ) : error ? (
                <AlertBar critical>{error}</AlertBar>
            ) : (
            
                <Card>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {templates.map(template => (
                                <TableRow key={template.id}>
                                    <TableCell>{template.name}</TableCell>
                                    <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
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
            )}
        </div>
    );
};

export default TemplatesPage;