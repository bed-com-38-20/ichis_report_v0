import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Box, Paper, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import OpenWithIcon from '@mui/icons-material/OpenWith';

const ReportItem = ({ 
  item, 
  index, 
  onMove, 
  onResize, 
  onUpdate, 
  onDelete, 
  maxWidth = 12 
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'REPORT_ITEM',
    item: { id: item.id, index, type: 'existing' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: 'REPORT_ITEM',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(draggedItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Only perform the move when the mouse has crossed half of the item's height
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      if (draggedItem.type === 'existing') {
        onMove(dragIndex, hoverIndex);
        // Mutate the monitor item so that the hover fires only once
        draggedItem.index = hoverIndex;
      }
    },
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  const handleResize = (direction) => {
    const currentWidth = item.width || 1;
    let newWidth = currentWidth;
    
    if (direction === 'increase' && currentWidth < maxWidth) {
      newWidth = currentWidth + 1;
    } else if (direction === 'decrease' && currentWidth > 1) {
      newWidth = currentWidth - 1;
    }
    
    if (newWidth !== currentWidth) {
      onResize(newWidth);
    }
  };

  // Render the actual content based on item type
  const renderItemContent = () => {
    switch (item.type) {
      case 'text':
        return <Typography>{item.content || 'Text content'}</Typography>;
      case 'image':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {item.src ? (
              <img 
                src={item.src} 
                alt={item.alt || 'Report image'} 
                style={{ maxWidth: '100%', maxHeight: '200px' }} 
              />
            ) : (
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100px', 
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography color="textSecondary">Image placeholder</Typography>
              </Box>
            )}
          </Box>
        );
      case 'table':
        return (
          <Box sx={{ overflowX: 'auto' }}>
            <Typography>Data table placeholder</Typography>
          </Box>
        );
      case 'chart':
        return (
          <Box 
            sx={{ 
              height: '150px', 
              backgroundColor: '#f9f9f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography color="textSecondary">Chart placeholder</Typography>
          </Box>
        );
      default:
        return <Typography>Unknown component type</Typography>;
    }
  };

  return (
    <Paper
      ref={ref}
      sx={{
        p: 1,
        opacity,
        border: '1px solid #e0e0e0',
        backgroundColor: '#ffffff',
        minHeight: '60px',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 0 0 2px #2196f3'
        }
      }}
      data-handler-id={handlerId}
    >
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        display: 'flex',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: '0 0 0 4px'
      }}>
        <IconButton size="small" onClick={() => handleResize('decrease')}>
          <Typography sx={{ fontSize: 14 }}>-</Typography>
        </IconButton>
        <Typography sx={{ alignSelf: 'center', px: 1, fontSize: 12 }}>
          {item.width || 1}/{maxWidth}
        </Typography>
        <IconButton size="small" onClick={() => handleResize('increase')}>
          <Typography sx={{ fontSize: 14 }}>+</Typography>
        </IconButton>
        <IconButton size="small" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: '0 0 4px 0',
        cursor: 'move'
      }}>
        <IconButton size="small">
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Box sx={{ pt: 4, pb: 1 }}>
        {renderItemContent()}
      </Box>
    </Paper>
  );
};

export default ReportItem;