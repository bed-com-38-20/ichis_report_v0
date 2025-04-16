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

import React from 'react'
import { InputField, Button } from '@dhis2/ui'

const ReportConfigForm = ({ reportConfig, setReportConfig }) => {

    // Handle logo upload
    const handleLogoUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (upload) => {
            setReportConfig(prev => ({
                ...prev,
                logo: upload.target.result
            }))
        }
        reader.readAsDataURL(file)
    }

    return (
        <div>
            <h4>Report Settings</h4>
            <InputField
                label="Title"
                value={reportConfig.title}
                onChange={e => setReportConfig(prev => ({
                    ...prev,
                    title: e.value
                }))}
            />
            <InputField
                label="Subtitle"
                value={reportConfig.subtitle}
                onChange={e => setReportConfig(prev => ({
                    ...prev,
                    subtitle: e.value
                }))}
            />
            <div style={{ margin: '8px 0' }}>
                <label htmlFor="logoUpload">
                    <strong>Logo:</strong>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    id="logoUpload"
                    onChange={handleLogoUpload}
                />
                {reportConfig.logo && (
                    <img
                        src={reportConfig.logo}
                        alt="Report Logo"
                        style={{ width: '80px', height: '80px', marginLeft: '10px' }}
                    />
                )}
            </div>
        </div>
    )
}

export default ReportConfigForm
