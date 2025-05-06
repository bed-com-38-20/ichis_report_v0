import React from 'react';
import { Grid, Box } from '@mui/material';
import { useDrop } from 'react-dnd';
import ReportItem from '../items/ReportItem';

const GridLayout = ({ columns = 12, items = [], onItemsChange }) => {
  // Calculate how many items can fit per row based on their column widths
  const rows = [];
  let currentRow = [];
  let currentRowWidth = 0;

  items.forEach(item => {
    const itemWidth = item.width || 1;
    if (currentRowWidth + itemWidth > columns) {
      rows.push([...currentRow]);
      currentRow = [item];
      currentRowWidth = itemWidth;
    } else {
      currentRow.push(item);
      currentRowWidth += itemWidth;
    }
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const handleItemMove = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];
    const newItems = [...items];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    onItemsChange(newItems);
  };

  const handleItemResize = (id, newWidth) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, width: newWidth } : item
    );
    onItemsChange(newItems);
  };

  const handleItemUpdate = (id, updates) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onItemsChange(newItems);
  };

  const handleItemDelete = (id) => {
    const newItems = items.filter(item => item.id !== id);
    onItemsChange(newItems);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {rows.map((row, rowIndex) => (
        <Grid container spacing={2} key={`row-${rowIndex}`}>
          {row.map((item, index) => {
            const itemWidth = Math.min(item.width || 1, columns);
            const gridWidth = (itemWidth / columns) * 12; // Convert to MUI's 12-column system
            
            return (
              <Grid item xs={gridWidth} key={item.id}>
                <ReportItem
                  item={item}
                  index={items.indexOf(item)}
                  onMove={handleItemMove}
                  onResize={(width) => handleItemResize(item.id, width)}
                  onUpdate={(updates) => handleItemUpdate(item.id, updates)}
                  onDelete={() => handleItemDelete(item.id)}
                  maxWidth={columns}
                />
              </Grid>
            );
          })}
        </Grid>
      ))}
    </Box>
  );
};

export default GridLayout;