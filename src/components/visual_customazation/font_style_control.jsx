import React, { useState } from 'react';

const FontStyleControls = ({ onStyleChange }) => {
  const [fontSize, setFontSize] = useState('14px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontWeight, setFontWeight] = useState('normal');
  const [textAlign, setTextAlign] = useState('left');
  const [lineHeight, setLineHeight] = useState('1.5');

  const handleFontSizeChange = (e) => {
    const newSize = e.target.value;
    setFontSize(newSize);
    onStyleChange({ fontSize: newSize, fontFamily, fontWeight, textAlign, lineHeight });
  };

  const handleFontFamilyChange = (e) => {
    const newFamily = e.target.value;
    setFontFamily(newFamily);
    onStyleChange({ fontSize, fontFamily: newFamily, fontWeight, textAlign, lineHeight });
  };

  const handleFontWeightChange = (e) => {
    const newWeight = e.target.value;
    setFontWeight(newWeight);
    onStyleChange({ fontSize, fontFamily, fontWeight: newWeight, textAlign, lineHeight });
  };

  const handleTextAlignChange = (e) => {
    const newAlign = e.target.value;
    setTextAlign(newAlign);
    onStyleChange({ fontSize, fontFamily, fontWeight, textAlign: newAlign, lineHeight });
  };

  const handleLineHeightChange = (e) => {
    const newHeight = e.target.value;
    setLineHeight(newHeight);
    onStyleChange({ fontSize, fontFamily, fontWeight, textAlign, lineHeight: newHeight });
  };

  return (
    <div className="font-style-controls" style={styles.fontStyleControls}>
      <div className="control-group" style={styles.controlGroup}>
        <label style={styles.label}>Font Size:</label>
        <div style={styles.selectWrapper}>
          <select 
            value={fontSize} 
            onChange={handleFontSizeChange}
            style={styles.select}
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
          </select>
          <div style={styles.selectArrow}></div>
        </div>
      </div>
      
      <div className="control-group" style={styles.controlGroup}>
        <label style={styles.label}>Font Family:</label>
        <div style={styles.selectWrapper}>
          <select 
            value={fontFamily} 
            onChange={handleFontFamilyChange}
            style={styles.select}
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
          </select>
          <div style={styles.selectArrow}></div>
        </div>
      </div>
      
      <div className="control-group" style={styles.controlGroup}>
        <label style={styles.label}>Font Weight:</label>
        <div style={styles.selectWrapper}>
          <select 
            value={fontWeight} 
            onChange={handleFontWeightChange}
            style={styles.select}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Light</option>
          </select>
          <div style={styles.selectArrow}></div>
        </div>
      </div>

      <div className="control-group" style={styles.controlGroup}>
        <label style={styles.label}>Text Alignment:</label>
        <div style={styles.alignmentButtons}>
          <button 
            style={{
              ...styles.alignButton,
              ...(textAlign === 'left' ? styles.activeAlignButton : {})
            }}
            onClick={() => {
              setTextAlign('left');
              onStyleChange({ fontSize, fontFamily, fontWeight, textAlign: 'left', lineHeight });
            }}
          >
            Left
          </button>
          <button 
            style={{
              ...styles.alignButton, 
              ...(textAlign === 'center' ? styles.activeAlignButton : {})
            }}
            onClick={() => {
              setTextAlign('center');
              onStyleChange({ fontSize, fontFamily, fontWeight, textAlign: 'center', lineHeight });
            }}
          >
            Center
          </button>
          <button 
            style={{
              ...styles.alignButton,
              ...(textAlign === 'right' ? styles.activeAlignButton : {})
            }}
            onClick={() => {
              setTextAlign('right');
              onStyleChange({ fontSize, fontFamily, fontWeight, textAlign: 'right', lineHeight });
            }}
          >
            Right
          </button>
        </div>
      </div>
      
      <div className="control-group" style={styles.controlGroup}>
        <label style={styles.label}>Line Height:</label>
        <div style={styles.selectWrapper}>
          <select 
            value={lineHeight} 
            onChange={handleLineHeightChange}
            style={styles.select}
          >
            <option value="1">Single</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
            <option value="2">Double</option>
          </select>
          <div style={styles.selectArrow}></div>
        </div>
      </div>

      <div style={styles.previewBox}>
        <div style={styles.previewLabel}>Preview:</div>
        <div style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
          fontWeight: fontWeight,
          textAlign: textAlign,
          lineHeight: lineHeight,
          padding: '10px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          backgroundColor: '#fff'
        }}>
          The quick brown fox jumps over the lazy dog.
        </div>
      </div>
    </div>
  );
};

const styles = {
  fontStyleControls: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #eaeaea',
  },
  controlGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#505050',
  },
  selectWrapper: {
    position: 'relative',
    width: '100%',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    appearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  selectArrow: {
    position: 'absolute',
    top: '50%',
    right: '12px',
    transform: 'translateY(-50%)',
    width: '0',
    height: '0',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid #555',
    pointerEvents: 'none',
  },
  alignmentButtons: {
    display: 'flex',
    width: '100%',
  },
  alignButton: {
    flex: '1',
    padding: '8px 0',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  activeAlignButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    borderColor: '#1976D2',
  },
  previewBox: {
    marginTop: '20px',
  },
  previewLabel: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#505050',
  }
};

export default FontStyleControls;