import React from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

const TextEditor = ({ item, onUpdate }) => {
  const handleStyleChange = (event, newStyles) => {
    onUpdate({
      ...item,
      style: {
        ...item.style,
        ...newStyles
      }
    });
  };

  const handleContentChange = (event) => {
    onUpdate({
      ...item,
      content: event.target.value
    });
  };

  const handleFontChange = (event) => {
    onUpdate({
      ...item,
      style: {
        ...item.style,
        fontFamily: event.target.value
      }
    });
  };

  const handleSizeChange = (event) => {
    onUpdate({
      ...item,
      style: {
        ...item.style,
        fontSize: event.target.value
      }
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" gutterBottom>
        Text Editor
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={Object.keys(item.style || {}).filter(key => 
            item.style[key] === true || 
            ['textAlign'].includes(key) && item.style[key]
          )}
          onChange={handleStyleChange}
          size="small"
          sx={{ mb: 1 }}
        >
          <ToggleButton value="fontWeight" aria-label="bold">
            <FormatBoldIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="fontStyle" aria-label="italic">
            <FormatItalicIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="textDecoration" aria-label="underlined">
            <FormatUnderlinedIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
        
        <ToggleButtonGroup
          value={item.style?.textAlign || 'left'}
          exclusive
          onChange={(e, alignment) => {
            if (alignment) handleStyleChange(e, { textAlign: alignment });
          }}
          size="small"
        >
          <ToggleButton value="left" aria-label="left aligned">
            <FormatAlignLeftIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="center" aria-label="centered">
            <FormatAlignCenterIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="right" aria-label="right aligned">
            <FormatAlignRightIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel>Font</InputLabel>
          <Select
            value={item.style?.fontFamily || 'Arial'}
            label="Font"
            onChange={handleFontChange}
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Roboto">Roboto</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ width: '100px' }}>
          <InputLabel>Size</InputLabel>
          <Select
            value={item.style?.fontSize || '16px'}
            label="Size"
            onChange={handleSizeChange}
          >
            <MenuItem value="12px">12px</MenuItem>
            <MenuItem value="14px">14px</MenuItem>
            <MenuItem value="16px">16px</MenuItem>
            <MenuItem value="18px">18px</MenuItem>
            <MenuItem value="20px">20px</MenuItem>
            <MenuItem value="24px">24px</MenuItem>
            <MenuItem value="28px">28px</MenuItem>
            <MenuItem value="32px">32px</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Content"
        value={item.content || ''}
        onChange={handleContentChange}
        variant="outlined"
      />
    </Box>
  );
};

export default TextEditor;