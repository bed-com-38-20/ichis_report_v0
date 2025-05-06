import React from 'react';
import { Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Section from './Section';

const HeaderFooter = ({ 
  type, // 'header' or 'footer'
  section, 
  onUpdate, 
  onDelete 
}) => {
  const handleHeightChange = (event) => {
    onUpdate({
      ...section,
      style: { ...section.style, height: event.target.value }
    });
  };

  const handlePositionChange = (event) => {
    onUpdate({
      ...section,
      position: event.target.value
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">
          {type === 'header' ? 'Header' : 'Footer'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Height</InputLabel>
            <Select
              value={section.style?.height || '80px'}
              onChange={handleHeightChange}
              label="Height"
            >
              <MenuItem value="60px">Small</MenuItem>
              <MenuItem value="80px">Medium</MenuItem>
              <MenuItem value="120px">Large</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Position</InputLabel>
            <Select
              value={section.position || 'all'}
              onChange={handlePositionChange}
              label="Position"
            >
              <MenuItem value="all">All pages</MenuItem>
              <MenuItem value="first">First page only</MenuItem>
              <MenuItem value="exceptFirst">Except first page</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Section 
        section={section} 
        onUpdate={onUpdate} 
        onDelete={onDelete} 
        isHeader={type === 'header'} 
        isFooter={type === 'footer'} 
      />
    </Box>
  );
};

export default HeaderFooter;