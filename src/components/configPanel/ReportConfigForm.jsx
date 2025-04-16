// import React from 'react';
// import { InputField, Button } from '@dhis2/ui';
// import './ReportConfigForm.css';

// const ReportConfigForm = ({ reportConfig, setReportConfig }) => {
//   const handlePrint = () => window.print();

//   const handleTitleChange = ({ value }) => {
//     setReportConfig(prev => ({ ...prev, title: value }));
//   };

//   const handleSubtitleChange = ({ value }) => {
//     setReportConfig(prev => ({ ...prev, subtitle: value }));
//   };

//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setReportConfig(prev => ({ ...prev, logo: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="report-config-form">
//       <h3>Report Configuration</h3>
//       <InputField
//         label="Report Title"
//         value={reportConfig.title}
//         onChange={handleTitleChange}
//       />

//       <InputField
//         label="Report Subtitle"
//         value={reportConfig.subtitle}
//         onChange={handleSubtitleChange}
//       />

//       <div className="logo-upload">
//         <label className="upload-label">
//           Upload Logo
//           <input 
//             type="file" 
//             accept="image/*" 
//             onChange={handleLogoUpload}
//             style={{ display: 'none' }}
//           />
//         </label>
//         {reportConfig.logo && (
//           <img 
//             src={reportConfig.logo} 
//             alt="Logo Preview" 
//             className="logo-preview"
//           />
//         )}
//       </div>

//       <div className="button-group">
//         <Button primary onClick={handlePrint}>
//           Print Report
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ReportConfigForm;

// components/configPanel/ReportConfigForm.jsx




import React from 'react';
import { InputField } from '@dhis2/ui';
import PropTypes from 'prop-types';
import './ReportConfigForm.css';

const ReportConfigForm = ({
  title = '',       // Default value
  subtitle = '',    // Default value
  logo = null,      // Default value
  onTitleChange = () => {},
  onSubtitleChange = () => {},
  onLogoUpload = () => {}
}) => (
  <>
    <h3>Report Configuration</h3>
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