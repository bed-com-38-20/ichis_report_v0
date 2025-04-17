import React from 'react';
import { useDrop } from 'react-dnd';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import GridLayout from './GridLayout';

const Section = ({ 
  section, 
  onUpdate, 
  onDelete, 
  isHeader = false, 
  isFooter = false 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'REPORT_ITEM',
    drop: (item) => {
      if (item.type === 'new') {
        onUpdate({
          ...section,
          items: [...section.items, { ...item, id: `item-${Date.now()}` }]
        });
      } else {
        // Handle moving existing items
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    }),
  });

  const handleSectionStyleChange = (style) => {
    onUpdate({
      ...section,
      style: { ...section.style, ...style }
    });
  };

  const sectionType = isHeader ? 'Header' : isFooter ? 'Footer' : 'Section';
  
  return (
    <Paper 
      ref={drop}
      elevation={2} 
      sx={{
        p: 2,
        mb: 2,
        minHeight: '100px',
        backgroundColor: isOver ? '#f0f7ff' : 'white',
        border: isOver ? '1px dashed #2196f3' : '1px solid #e0e0e0',
        ...section.style
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DragIndicatorIcon sx={{ mr: 1, cursor: 'move' }} />
          <Typography variant="subtitle1">
            {section.title || `${sectionType} ${section.id}`}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => onDelete(section.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <GridLayout 
        columns={section.columns || 12}
        items={section.items || []}
        onItemsChange={(items) => onUpdate({ ...section, items })}
      />
    </Paper>
  );
};

export default Section;
