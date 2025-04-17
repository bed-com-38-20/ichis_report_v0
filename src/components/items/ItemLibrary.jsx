import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Paper, 
  Grid,
  Tooltip
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import ImageIcon from '@mui/icons-material/Image';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'REPORT_ITEM',
    item: { 
      type,
      width: 12, // Default to full width
      id: `temp-${type}-${Date.now()}`,
      content: '',
      new: true
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Tooltip title={`Add ${label}`} placement="top">
      <Paper
        ref={drag}
        elevation={isDragging ? 0 : 1}
        sx={{
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          opacity: isDragging ? 0.4 : 1,
          cursor: 'grab',
          backgroundColor: isDragging ? '#f0f7ff' : 'white',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: '#f0f7ff',
            transform: 'translateY(-2px)',
          }
        }}
      >
        {icon}
        <Typography variant="caption" textAlign="center">
          {label}
        </Typography>
      </Paper>
    </Tooltip>
  );
};

const ItemLibrary = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" gutterBottom>
        Add Items
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Drag and drop items to add them to your report sections
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DraggableItem 
            type="text" 
            icon={<TextFieldsIcon sx={{ fontSize: 32 }} />} 
            label="Text Block" 
          />
        </Grid>
        <Grid item xs={6}>
          <DraggableItem 
            type="image" 
            icon={<ImageIcon sx={{ fontSize: 32 }} />} 
            label="Image" 
          />
        </Grid>
        <Grid item xs={6}>
          <DraggableItem 
            type="table" 
            icon={<TableChartIcon sx={{ fontSize: 32 }} />} 
            label="Data Table" 
          />
        </Grid>
        <Grid item xs={6}>
          <DraggableItem 
            type="chart" 
            icon={<InsertChartIcon sx={{ fontSize: 32 }} />} 
            label="Chart" 
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Saved Items
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Reuse previously created items
      </Typography>
      
      <Box sx={{ 
        mt: 2, 
        p: 2, 
        backgroundColor: '#f9f9f9', 
        borderRadius: 1,
        textAlign: 'center'
      }}>
        <Typography variant="body2" color="textSecondary">
          No saved items yet
        </Typography>
      </Box>
    </Box>
  );
};

export default ItemLibrary;