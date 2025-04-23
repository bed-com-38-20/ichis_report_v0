import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import HeightIcon from '@mui/icons-material/Height';

const LayoutControls = ({ reportConfig, setReportConfig }) => {
  const { header, footer, sections = [] } = reportConfig;

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      columns: 12,
      items: [],
      style: { 
        padding: '16px', 
        marginBottom: '16px' 
      }
    };
    
    setReportConfig({
      ...reportConfig,
      sections: [...sections, newSection]
    });
  };

  const addHeader = () => {
    if (!header) {
      setReportConfig({
        ...reportConfig,
        header: {
          id: 'header',
          title: 'Header',
          columns: 12,
          items: [],
          position: 'all',
          style: { 
            height: '80px', 
            padding: '16px', 
            borderBottom: '1px solid #e0e0e0' 
          }
        }
      });
    }
  };

  const addFooter = () => {
    if (!footer) {
      setReportConfig({
        ...reportConfig,
        footer: {
          id: 'footer',
          title: 'Footer',
          columns: 12,
          items: [],
          position: 'all',
          style: { 
            height: '60px', 
            padding: '16px', 
            borderTop: '1px solid #e0e0e0' 
          }
        }
      });
    }
  };

  const updateSectionTitle = (sectionId, newTitle) => {
    const newSections = sections.map(section => 
      section.id === sectionId ? { ...section, title: newTitle } : section
    );
    setReportConfig({ ...reportConfig, sections: newSections });
  };

  const updateSectionColumns = (sectionId, columns) => {
    const newSections = sections.map(section => 
      section.id === sectionId ? { ...section, columns: parseInt(columns, 10) } : section
    );
    setReportConfig({ ...reportConfig, sections: newSections });
  };

  const deleteSection = (sectionId) => {
    const newSections = sections.filter(section => section.id !== sectionId);
    setReportConfig({ ...reportConfig, sections: newSections });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Layout Customization</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<ViewHeadlineIcon />} 
            onClick={addHeader}
            disabled={!!header}
            size="small"
            fullWidth
          >
            Add Header
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<ViewHeadlineIcon />} 
            onClick={addFooter}
            disabled={!!footer}
            size="small"
            fullWidth
          >
            Add Footer
          </Button>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={addSection}
          size="medium"
          fullWidth
          sx={{ mb: 2 }}
        >
          Add Content Section
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Sections</Typography>
      
      {sections.map((section, index) => (
        <Accordion key={section.id} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ flexGrow: 1 }}>{section.title || `Section ${index + 1}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Title"
                variant="outlined"
                size="small"
                value={section.title || ''}
                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                fullWidth
              />
              
              <FormControl size="small" fullWidth>
                <InputLabel>Grid Columns</InputLabel>
                <Select
                  value={section.columns || 12}
                  label="Grid Columns"
                  onChange={(e) => updateSectionColumns(section.id, e.target.value)}
                >
                  <MenuItem value={1}>1 column</MenuItem>
                  <MenuItem value={2}>2 columns</MenuItem>
                  <MenuItem value={3}>3 columns</MenuItem>
                  <MenuItem value={4}>4 columns</MenuItem>
                  <MenuItem value={6}>6 columns</MenuItem>
                  <MenuItem value={12}>12 columns</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title="Delete Section">
                  <IconButton 
                    color="error" 
                    onClick={() => deleteSection(section.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      
      {sections.length === 0 && (
        <Box 
          sx={{ 
            p: 2, 
            textAlign: 'center', 
            backgroundColor: '#f9f9f9',
            border: '1px dashed #ccc',
            borderRadius: 1
          }}
        >
          <Typography color="textSecondary">
            No sections added yet
          </Typography>
        </Box>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>Responsive Settings</Typography>
      
      <FormControl size="small" fullWidth sx={{ mb: 2 }}>
        <InputLabel>Page Size</InputLabel>
        <Select
          value={reportConfig.pageSize || 'A4'}
          label="Page Size"
          onChange={(e) => setReportConfig({ ...reportConfig, pageSize: e.target.value })}
        >
          <MenuItem value="A4">A4 (210 × 297 mm)</MenuItem>
          <MenuItem value="letter">Letter (8.5 × 11 in)</MenuItem>
          <MenuItem value="legal">Legal (8.5 × 14 in)</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl size="small" fullWidth sx={{ mb: 2 }}>
        <InputLabel>Orientation</InputLabel>
        <Select
          value={reportConfig.orientation || 'portrait'}
          label="Orientation"
          onChange={(e) => setReportConfig({ ...reportConfig, orientation: e.target.value })}
        >
          <MenuItem value="portrait">Portrait</MenuItem>
          <MenuItem value="landscape">Landscape</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LayoutControls;