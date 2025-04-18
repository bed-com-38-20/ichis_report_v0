import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import Section from './Section';
import HeaderFooter from './HeaderFooter';

const ReportLayout = ({ reportConfig, setReportConfig }) => {
  const { header, footer, sections = [] } = reportConfig;

  const handleSectionUpdate = (updatedSection) => {
    const newSections = sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    );
    setReportConfig({ ...reportConfig, sections: newSections });
  };

  const handleSectionDelete = (sectionId) => {
    const newSections = sections.filter(section => section.id !== sectionId);
    setReportConfig({ ...reportConfig, sections: newSections });
  };

  const handleHeaderUpdate = (updatedHeader) => {
    setReportConfig({ ...reportConfig, header: updatedHeader });
  };

  const handleFooterUpdate = (updatedFooter) => {
    setReportConfig({ ...reportConfig, footer: updatedFooter });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {header && (
        <HeaderFooter 
          type="header" 
          section={header} 
          onUpdate={handleHeaderUpdate} 
          onDelete={() => setReportConfig({ ...reportConfig, header: null })} 
        />
      )}
      
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Report Content</Typography>
        <Divider sx={{ mb: 2 }} />
        
        {sections.map(section => (
          <Section 
            key={section.id} 
            section={section} 
            onUpdate={handleSectionUpdate} 
            onDelete={handleSectionDelete} 
          />
        ))}
        
        {sections.length === 0 && (
          <Box 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              backgroundColor: '#f9f9f9',
              border: '1px dashed #ccc',
              borderRadius: 1
            }}
          >
            <Typography color="textSecondary">
              No sections added. Use the controls to add sections to your report.
            </Typography>
          </Box>
        )}
      </Paper>
      
      {footer && (
        <HeaderFooter 
          type="footer" 
          section={footer} 
          onUpdate={handleFooterUpdate} 
          onDelete={() => setReportConfig({ ...reportConfig, footer: null })} 
        />
      )}
    </Box>
  );
};

export default ReportLayout;