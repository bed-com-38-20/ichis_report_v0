import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Card, CircularLoader, AlertBar } from '@dhis2/ui';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
 import MenuItem from '@mui/material/MenuItem';
 import Dialog from '@mui/material/Dialog';
 import DialogActions from '@mui/material/DialogActions';
 import DialogContent from '@mui/material/DialogContent';
 import DialogContentText from '@mui/material/DialogContentText';
 import DialogTitle from '@mui/material/DialogTitle';
import { useTemplateStore } from '../../hooks/useTemplateStore';


const TemplatesPage = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const navigate = useNavigate();
    const { loadTemplates, deleteTemplate } = useTemplateStore();
    

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

    const openMenu = (event, template) => {
        setAnchorEl(event.currentTarget);
        setSelectedTemplate(template);
    };

    const closeMenu = () => {
        setAnchorEl(null);
        setSelectedTemplate(null);
    };

    const handleEdit = () => {
        navigate(`/builder?templateId=${selectedTemplate.id}`);
        closeMenu();
    };

    const handleGenerate = () => {
        alert(`Generating report for ${selectedTemplate.name}...`);
        closeMenu();
    };

    const confirmDelete = () => {
        setDeleteConfirmOpen(true);
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        if (!selectedTemplate) return;

        setDeleting(true);
    
        try {
            const updated = await deleteTemplate(selectedTemplate.id);
            setTemplates(updated);
            setSuccessMessage(`Template "${selectedTemplate.name}" was deleted successfully.`);
        } catch (error) {
            console.error("Error deleting template:", error);
            setError("Failed to delete the template.");
        } finally {
            setDeleting(false);
            setDeleteConfirmOpen(false);
            setSelectedTemplate(null);
        }
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
                                        onClick={(event) => openMenu(event, template)}
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
            {successMessage && (
                 <AlertBar duration={4000} onHidden={() => setSuccessMessage('')}>
                     {successMessage}
                 </AlertBar>
             )}
 
             {/* Dropdown Menu */}
             <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                 <MenuItem onClick={handleEdit}>Edit</MenuItem>
                 <MenuItem onClick={handleGenerate}>Generate</MenuItem>
                 <MenuItem onClick={confirmDelete}>Delete</MenuItem>
             </Menu>
 
             {/* Delete Confirmation Dialog */}
             <Dialog
                 open={deleteConfirmOpen}
                 onClose={() => setDeleteConfirmOpen(false)}
             >
                 <DialogTitle>Delete Template</DialogTitle>
                 <DialogContent>
                     <DialogContentText>
                         Are you sure you want to delete the template "{selectedTemplate?.name}"?
                     </DialogContentText>
                 </DialogContent>
                 <DialogActions>
                     <Button onClick={() => setDeleteConfirmOpen(false)} secondary>
                         Cancel
                     </Button>
                     <Button onClick={handleDelete} destructive disabled={!selectedTemplate || deleting}>
                     {deleting ? <CircularLoader small /> : 'Delete'}
                     </Button>
                 </DialogActions>
             </Dialog>
        </div>
    );
};

export default TemplatesPage;