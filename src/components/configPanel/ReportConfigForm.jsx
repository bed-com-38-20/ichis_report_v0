import React from 'react';
import { InputField } from '@dhis2/ui';
import PropTypes from 'prop-types';
import './ReportConfigForm.css';

const ReportConfigForm = ({
  title = '',       
  subtitle = '',    
  logo = null,      
  onTitleChange = () => {},
  onSubtitleChange = () => {},
  onLogoUpload = () => {}
}) => (
  <>
    <InputField
      label="Report Title"
      value={title}
      onChange={onTitleChange}
      className="input-field"
    />

    <InputField
      label="Report Subtitle"
      value={subtitle}
      onChange={onSubtitleChange}
      className="input-field"
    />

    <div className="logo-upload">
      <label className="upload-label">
        Upload Logo
        <input 
          type="file" 
          accept="image/*" 
          onChange={onLogoUpload}
          style={{ display: 'none' }}
        />
      </label>
      {logo && (
        <img 
          src={logo} 
          alt="Logo Preview" 
          className="logo-preview"
        />
      )}
    </div>
    
  </>

  
);

ReportConfigForm.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  logo: PropTypes.string,
  onTitleChange: PropTypes.func,
  onSubtitleChange: PropTypes.func,
  onLogoUpload: PropTypes.func
};

ReportConfigForm.defaultProps = {
  title: '',
  subtitle: '',
  logo: null,
  onTitleChange: () => {},
  onSubtitleChange: () => {},
  onLogoUpload: () => {}
};

export default ReportConfigForm;