import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';
import ReportLayout from '../layout/ReportLayout';

const ReportPreview = ({ reportConfig }) => {
  const { 
    title, 
    subtitle, 
    logo, 
    date, 
    facility, 
    period,
    pageSize = 'A4',
    orientation = 'portrait',
    header,
    footer,
    sections = []
  } = reportConfig;

  // Define page dimensions based on paper size and orientation
  const getPageDimensions = () => {
    const dimensions = {
      'A4': { width: '210mm', height: '297mm' },
      'letter': { width: '215.9mm', height: '279.4mm' },
      'legal': { width: '215.9mm', height: '355.6mm' },
      'custom': reportConfig.customDimensions || { width: '210mm', height: '297mm' }
    };

    const selected = dimensions[pageSize];
    
    if (orientation === 'landscape') {
      return { width: selected.height, height: selected.width };
    }
    
    return selected;
  };

  const pageDimensions = getPageDimensions();

  return (
    <Box 
      sx={{ 
        flex: 1, 
        p: 3, 
        backgroundColor: '#f5f5f5', 
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Paper 
        elevation={3}
        sx={{
          width: pageDimensions.width,
          minHeight: pageDimensions.height,
          backgroundColor: 'white',
          padding: '20mm',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Title Block */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          {logo && (
            <Box sx={{ mr: 2 }}>
              <img 
                src={logo} 
                alt="Report logo" 
                style={{ maxHeight: '60px', maxWidth: '100px' }} 
              />
            </Box>
          )}
          <Box>
            <Typography variant="h4" component="h1">
              {title || 'Report Title'}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle1" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Metadata Block */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            {facility && (
              <Typography variant="body2">
                <strong>Facility:</strong> {facility}
              </Typography>
            )}
            {period && (
              <Typography variant="body2">
                <strong>Period:</strong> {period}
              </Typography>
            )}
          </Box>
          <Typography variant="body2">
            <strong>Date:</strong> {date}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Report Layout with Sections */}
        <Box sx={{ flex: 1 }}>
          <ReportLayout reportConfig={reportConfig} />
        </Box>
      </Paper>
    </Box>
  );
};

export default ReportPreview;