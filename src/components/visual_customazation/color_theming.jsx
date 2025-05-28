import React, { useState } from 'react';

const ColorThemeSelector = ({ onThemeChange }) => {
  const themes = {
    default: {
      primary: '#2196F3',
      secondary: '#FF9800',
      background: '#FFFFFF',
      text: '#333333',
    },
    dark: {
      primary: '#3F51B5',
      secondary: '#FF4081',
      background: '#303030',
      text: '#FFFFFF',
    },
    light: {
      primary: '#00BCD4',
      secondary: '#FFC107',
      background: '#F5F5F5',
      text: '#212121',
    },
    dhis2: {
      primary: '#43CBCB',
      secondary: '#B881DC',
      background: '#FFFFFF',
      text: '#333333',
    },
    material: {
      primary: '#009688',
      secondary: '#FF5722',
      background: '#FAFAFA',
      text: '#424242',
    },
    custom: {
      primary: '#4CAF50',
      secondary: '#E91E63',
      background: '#EEEEEE',
      text: '#424242',
    },
  };

  const [selectedTheme, setSelectedTheme] = useState('default');
  const [customTheme, setCustomTheme] = useState({...themes.custom});

  const handleThemeChange = (e) => {
    const theme = e.target.value;
    setSelectedTheme(theme);
    onThemeChange(themes[theme]);
  };

  const handleCustomColorChange = (colorKey, value) => {
    const newCustomTheme = {...customTheme, [colorKey]: value};
    setCustomTheme(newCustomTheme);
    
    if (selectedTheme === 'custom') {
      onThemeChange(newCustomTheme);
    }
  };

  return (
    <div className="color-theme-selector" style={styles.container}>
      <div className="theme-select" style={styles.controlGroup}>
        <label style={styles.label}>Color Theme:</label>
        <div style={styles.selectWrapper}>
          <select 
            value={selectedTheme} 
            onChange={handleThemeChange}
            style={styles.select}
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="dhis2">DHIS2</option>
            <option value="material">Material</option>
            <option value="custom">Custom</option>
          </select>
          <div style={styles.selectArrow}></div>
        </div>
      </div>
      
      <div className="theme-palette" style={styles.themePalette}>
        {Object.keys(themes).map(themeName => (
          <div 
            key={themeName}
            style={{
              ...styles.paletteItem,
              ...(selectedTheme === themeName ? styles.activePalette : {})
            }}
            onClick={() => {
              setSelectedTheme(themeName);
              onThemeChange(themes[themeName]);
            }}
          >
            <div style={{
              ...styles.paletteColor,
              backgroundColor: themes[themeName].primary
            }}></div>
            <div style={{
              ...styles.paletteColor,
              backgroundColor: themes[themeName].secondary
            }}></div>
            <div style={{...styles.paletteName}}>{themeName}</div>
          </div>
        ))}
      </div>
      
      {selectedTheme === 'custom' && (
        <div className="custom-colors" style={styles.customColors}>
          <div style={styles.customColorsTitle}>Customize Colors</div>
          
          <div className="color-picker" style={styles.colorPicker}>
            <label style={styles.colorLabel}>Primary Color:</label>
            <div style={styles.colorInputWrapper}>
              <input 
                type="color" 
                value={customTheme.primary}
                onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                style={styles.colorInput}
              />
              <span style={styles.colorHex}>{customTheme.primary}</span>
            </div>
          </div>
          
          <div className="color-picker" style={styles.colorPicker}>
            <label style={styles.colorLabel}>Secondary Color:</label>
            <div style={styles.colorInputWrapper}>
              <input 
                type="color" 
                value={customTheme.secondary}
                onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                style={styles.colorInput}
              />
              <span style={styles.colorHex}>{customTheme.secondary}</span>
            </div>
          </div>
          
          <div className="color-picker" style={styles.colorPicker}>
            <label style={styles.colorLabel}>Background Color:</label>
            <div style={styles.colorInputWrapper}>
              <input 
                type="color" 
                value={customTheme.background}
                onChange={(e) => handleCustomColorChange('background', e.target.value)}
                style={styles.colorInput}
              />
              <span style={styles.colorHex}>{customTheme.background}</span>
            </div>
          </div>
          
          <div className="color-picker" style={styles.colorPicker}>
            <label style={styles.colorLabel}>Text Color:</label>
            <div style={styles.colorInputWrapper}>
              <input 
                type="color" 
                value={customTheme.text}
                onChange={(e) => handleCustomColorChange('text', e.target.value)}
                style={styles.colorInput}
              />
              <span style={styles.colorHex}>{customTheme.text}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="theme-preview" style={styles.themePreview}>
        <div style={styles.previewLabel}>Theme Preview:</div>
        <div style={{
          ...styles.previewContainer,
          backgroundColor: themes[selectedTheme].background,
          color: themes[selectedTheme].text
        }}>
          <div style={{
            ...styles.previewHeader,
            color: themes[selectedTheme].primary,
            borderBottom: `2px solid ${themes[selectedTheme].primary}`
          }}>
            Sample Report Header
          </div>
          <div style={{
            ...styles.previewSubheader,
            color: themes[selectedTheme].secondary
          }}>
            This is a subtitle
          </div>
          <div style={styles.previewContent}>
            <p style={styles.previewText}>Evan chimwaza i want to test how the report will appear after theme selection.</p>
            <button style={{
              ...styles.previewButton,
              backgroundColor: themes[selectedTheme].primary,
              color: '#fff'
            }}>
              Primary Button
            </button>
            <button style={{
              ...styles.previewButton,
              backgroundColor: themes[selectedTheme].secondary,
              color: '#fff',
              marginLeft: '10px'
            }}>
              Secondary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
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
  themePalette: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  paletteItem: {
    width: 'calc(33.333% - 10px)',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  activePalette: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderColor: '#2196F3',
  },
  paletteColor: {
    height: '20px',
    marginBottom: '5px',
    borderRadius: '3px',
  },
  paletteName: {
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '5px',
    textTransform: 'capitalize',
  },
  customColors: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '20px',
  },
  customColorsTitle: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '12px',
    color: '#333',
  },
  colorPicker: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  colorLabel: {
    flex: '1',
    fontSize: '13px',
    color: '#666',
  },
  colorInputWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  colorInput: {
    width: '30px',
    height: '30px',
    border: 'none',
    padding: '0',
    background: 'none',
    marginRight: '8px',
    cursor: 'pointer',
  },
  colorHex: {
    fontSize: '13px',
    color: '#666',
    width: '70px',
  },
  themePreview: {
    marginTop: '20px',
  },
  previewLabel: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#505050',
  },
  previewContainer: {
    padding: '15px',
    borderRadius: '4px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  previewHeader: {
    fontSize: '18px',
    fontWeight: 'bold',
    paddingBottom: '8px',
    marginBottom: '8px',
  },
  previewSubheader: {
    fontSize: '14px',
    marginBottom: '15px',
  },
  previewContent: {
    padding: '10px 0',
  },
  previewText: {
    marginBottom: '15px',
    fontSize: '14px',
  },
  previewButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  }
};

export default ColorThemeSelector;