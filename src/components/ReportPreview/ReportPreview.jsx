// import React, { useCallback } from 'react';
// import './ReportPreview.css';
// import ReportHeader from '../../ReportHeader';

// const ReportPreview = ({ reportConfig, setReportConfig }) => {
//     // Allow dropping for rows
//     const handleRowDrop = useCallback((event) => {
//         const field = event.dataTransfer.getData('text/plain');
//         event.preventDefault();
//         setReportConfig(prev => ({
//             ...prev,
//             rows: [...prev.rows, field]
//         }));
//     }, [setReportConfig]);

//     // Allow dropping for columns
//     const handleColumnDrop = useCallback((event) => {
//         const field = event.dataTransfer.getData('text/plain');
//         event.preventDefault();
//         setReportConfig(prev => ({
//             ...prev,
//             columns: [...prev.columns, field]
//         }));
//     }, [setReportConfig]);

//     const allowDrop = useCallback((event) => {
//         event.preventDefault();
//     }, []);

//     return (
//         <div className="report-preview">
//             <div className="printable-area">
//                 {/* Report Header: Only Org Unit, Title, Subtitle & Logo */}
//                 <ReportHeader 
//                     title={reportConfig.title}
//                     subtitle={reportConfig.subtitle}
//                     facility={reportConfig.facility}
//                     date={reportConfig.date}
//                     period={reportConfig.period}
//                     logo={reportConfig.logo}
//                 />

//                 {/* Droppable area for Rows */}
//                 <div className="dropzone rows-dropzone" onDrop={handleRowDrop} onDragOver={allowDrop}>
//                     <h4>Rows</h4>
//                     {reportConfig.rows.length === 0 && <p>Drop row fields here</p>}
//                     {reportConfig.rows.map((row, index) => (
//                         <div key={index} className="dropped-item" draggable="true">
//                             {row}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Droppable area for Columns */}
//                 <div className="dropzone columns-dropzone" onDrop={handleColumnDrop} onDragOver={allowDrop}>
//                     <h4>Columns</h4>
//                     {reportConfig.columns.length === 0 && <p>Drop column fields here</p>}
//                     {reportConfig.columns.map((col, index) => (
//                         <div key={index} className="dropped-item" draggable="true">
//                             {col}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Calculated Fields */}
//                 {reportConfig.calculatedFields && reportConfig.calculatedFields.length > 0 && (
//                     <div className="calc-fields-section">
//                         <h4>Calculated Fields</h4>
//                         {reportConfig.calculatedFields.map((field, idx) => (
//                             <div key={idx} className="calc-field-item">
//                                 <strong>{field.name}:</strong> {field.formula}
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* Dynamic Texts */}
//                 {reportConfig.dynamicTexts && reportConfig.dynamicTexts.length > 0 && (
//                     <div className="dynamic-text-section">
//                         <h4>Dynamic Texts</h4>
//                         {reportConfig.dynamicTexts.map(dt => (
//                             <div key={dt.id} className="dynamic-text-item">
//                                 {dt.text}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ReportPreview;

import React, { useCallback } from 'react';
import { Button } from '@dhis2/ui';
import './ReportPreview.css';
import ReportHeader from '../../ReportHeader';

const ReportPreview = ({ reportConfig, setReportConfig }) => {
    // Handler to trigger browser print.
    const handlePrint = () => {
        window.print();
    };

    // Allow dropping for row fields.
    const handleRowDrop = useCallback((event) => {
        const field = event.dataTransfer.getData('text/plain');
        event.preventDefault();
        setReportConfig(prev => ({
            ...prev,
            rows: [...prev.rows, field]
        }));
    }, [setReportConfig]);

    // Allow dropping for column fields.
    const handleColumnDrop = useCallback((event) => {
        const field = event.dataTransfer.getData('text/plain');
        event.preventDefault();
        setReportConfig(prev => ({
            ...prev,
            columns: [...prev.columns, field]
        }));
    }, [setReportConfig]);

    const allowDrop = useCallback((event) => {
        event.preventDefault();
    }, []);

    return (
        <div className="report-preview">
            <div className="printable-area">
                {/* Report Header */}
                <ReportHeader 
                    title={reportConfig.title}
                    subtitle={reportConfig.subtitle}
                    facility={reportConfig.facility}
                    date={reportConfig.date}
                    period={reportConfig.period}
                    logo={reportConfig.logo}
                />

                {/* Droppable area for Rows */}
                <div className="dropzone rows-dropzone" onDrop={handleRowDrop} onDragOver={allowDrop}>
                    <h4>Rows</h4>
                    {reportConfig.rows.length === 0 && <p>Drop row fields here</p>}
                    {reportConfig.rows.map((row, index) => (
                        <div key={index} className="dropped-item" draggable="true">
                            {row}
                        </div>
                    ))}
                </div>

                {/* Droppable area for Columns */}
                <div className="dropzone columns-dropzone" onDrop={handleColumnDrop} onDragOver={allowDrop}>
                    <h4>Columns</h4>
                    {reportConfig.columns.length === 0 && <p>Drop column fields here</p>}
                    {reportConfig.columns.map((col, index) => (
                        <div key={index} className="dropped-item" draggable="true">
                            {col}
                        </div>
                    ))}
                </div>

                {/* Calculated Fields */}
                {reportConfig.calculatedFields && reportConfig.calculatedFields.length > 0 && (
                    <div className="calc-fields-section">
                        <h4>Calculated Fields</h4>
                        {reportConfig.calculatedFields.map((field, idx) => (
                            <div key={idx} className="calc-field-item">
                                <strong>{field.name}:</strong> {field.formula}
                            </div>
                        ))}
                    </div>
                )}

                {/* Dynamic Texts */}
                {reportConfig.dynamicTexts && reportConfig.dynamicTexts.length > 0 && (
                    <div className="dynamic-text-section">
                        <h4>Dynamic Texts</h4>
                        {reportConfig.dynamicTexts.map(dt => (
                            <div key={dt.id} className="dynamic-text-item">
                                {dt.text}
                            </div>
                        ))}
                    </div>
                )}

                {/* Print Button positioned at the bottom */}
                <div className="print-button-container">
                    <Button onClick={handlePrint}>Print Report</Button>
                </div>
            </div>
        </div>
    );
};

export default ReportPreview;

