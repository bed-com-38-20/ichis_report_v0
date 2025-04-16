// import React, { useState } from 'react'
// import { Card, Button, InputField } from '@dhis2/ui'
// import OrgUnitSelector from './OrgUnitSelector'
// import PeriodSelector from './PeriodSelector'
// import ReportConfigForm from './ReportConfigForm'
// import './ConfigPanel.css'

// const ConfigPanel = ({ reportConfig, setReportConfig, metadata, loading }) => {
//     const [calcFieldName, setCalcFieldName] = useState('')
//     const [calcFieldFormula, setCalcFieldFormula] = useState('')
//     const [dynamicTextValue, setDynamicTextValue] = useState('')

//     // Handle add a calculated field
//     const handleAddCalculatedField = () => {
//         if (!calcFieldName || !calcFieldFormula) return
//         setReportConfig(prev => ({
//             ...prev,
//             calculatedFields: [
//                 ...prev.calculatedFields,
//                 {
//                     name: calcFieldName,
//                     formula: calcFieldFormula
//                 }
//             ]
//         }))
//         setCalcFieldName('')
//         setCalcFieldFormula('')
//     }

//     // Handle add dynamic text
//     const handleAddDynamicText = () => {
//         if (!dynamicTextValue) return
//         setReportConfig(prev => ({
//             ...prev,
//             dynamicTexts: [
//                 ...prev.dynamicTexts,
//                 {
//                     id: Date.now(),
//                     text: dynamicTextValue
//                 }
//             ]
//         }))
//         setDynamicTextValue('')
//     }

//     return (
//         <div className="config-panel">
//             <Card>
//                 <div className="config-content">
//                     <h3>DHIS2 Integration</h3>
                    
//                     <OrgUnitSelector
//                         reportConfig={reportConfig}
//                         setReportConfig={setReportConfig}
//                         metadata={metadata}
//                         loading={loading}
//                     />

//                     <PeriodSelector
//                         reportConfig={reportConfig}
//                         setReportConfig={setReportConfig}
//                     />

//                     <ReportConfigForm
//                         reportConfig={reportConfig}
//                         setReportConfig={setReportConfig}
//                     />

//                     {/* Calculated Fields */}
//                     <div className="calc-fields-section">
//                         <h4>Add Calculated Field</h4>
//                         <InputField
//                             label="Name"
//                             value={calcFieldName}
//                             onChange={e => setCalcFieldName(e.value)}
//                         />
//                         <InputField
//                             label="Formula (e.g., Revenue - Expenses)"
//                             value={calcFieldFormula}
//                             onChange={e => setCalcFieldFormula(e.value)}
//                         />
//                         <Button onClick={handleAddCalculatedField}>
//                             Add
//                         </Button>
//                     </div>

//                     {/* Dynamic Text */}
//                     <div className="dynamic-text-section">
//                         <h4>Add Dynamic Text</h4>
//                         <InputField
//                             label="Text"
//                             value={dynamicTextValue}
//                             onChange={e => setDynamicTextValue(e.value)}
//                         />
//                         <Button onClick={handleAddDynamicText}>
//                             Add
//                         </Button>
//                     </div>

//                     {/* Report Designer: Drag & Drop placeholder */}
//                     <div className="report-designer">
//                         <h3>Report Designer</h3>
//                         <div className="draggable-fields">
//                             <div className="field-group">
//                                 <h4>Rows</h4>
//                                 {/* Example draggable items */}
//                                 <div 
//                                     className="draggable-item"
//                                     draggable="true"
//                                     onDragStart={(e) => {
//                                         e.dataTransfer.setData('text/plain', 'RowField1')
//                                     }}
//                                 >
//                                     Row Field 1
//                                 </div>
//                                 <div 
//                                     className="draggable-item"
//                                     draggable="true"
//                                     onDragStart={(e) => {
//                                         e.dataTransfer.setData('text/plain', 'RowField2')
//                                     }}
//                                 >
//                                     Row Field 2
//                                 </div>
//                             </div>
//                             <div className="field-group">
//                                 <h4>Columns</h4>
//                                 <div 
//                                     className="draggable-item"
//                                     draggable="true"
//                                     onDragStart={(e) => {
//                                         e.dataTransfer.setData('text/plain', 'ColumnFieldA')
//                                     }}
//                                 >
//                                     Column Field A
//                                 </div>
//                                 <div 
//                                     className="draggable-item"
//                                     draggable="true"
//                                     onDragStart={(e) => {
//                                         e.dataTransfer.setData('text/plain', 'ColumnFieldB')
//                                     }}
//                                 >
//                                     Column Field B
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     )
// }

// export default ConfigPanel

import React, { useState } from 'react';
import { Card, Button, InputField } from '@dhis2/ui';
import OrgUnitSelector from './OrgUnitSelector';
import PeriodSelector from './PeriodSelector';
import ReportConfigForm from './ReportConfigForm';
import './ConfigPanel.css';

const ConfigPanel = ({ reportConfig, setReportConfig, metadata, loading }) => {
    // Local state for calculated field inputs
    const [calcFieldName, setCalcFieldName] = useState('');
    const [calcFieldFormula, setCalcFieldFormula] = useState('');

    // Local state for dynamic text input
    const [dynamicTextValue, setDynamicTextValue] = useState('');

    // Add calculated field to report context
    const handleAddCalculatedField = () => {
        if (!calcFieldName || !calcFieldFormula) return;
        setReportConfig(prev => ({
            ...prev,
            calculatedFields: [
                ...prev.calculatedFields,
                { name: calcFieldName, formula: calcFieldFormula }
            ]
        }));
        setCalcFieldName('');
        setCalcFieldFormula('');
    };

    // Add dynamic text to report context
    const handleAddDynamicText = () => {
        if (!dynamicTextValue) return;
        setReportConfig(prev => ({
            ...prev,
            dynamicTexts: [
                ...prev.dynamicTexts,
                { id: Date.now(), text: dynamicTextValue }
            ]
        }));
        setDynamicTextValue('');
    };

    return (
        <div className="config-panel">
            <Card>
                <div className="config-content">
                    <h3>DHIS2 Integration</h3>
                    
                    <OrgUnitSelector
                        reportConfig={reportConfig}
                        setReportConfig={setReportConfig}
                        metadata={metadata}
                        loading={loading}
                    />

                    <PeriodSelector
                        reportConfig={reportConfig}
                        setReportConfig={setReportConfig}
                    />

                    <ReportConfigForm
                        reportConfig={reportConfig}
                        setReportConfig={setReportConfig}
                    />

                    {/* Calculated Fields */}
                    <div className="calc-fields-section">
                        <h4>Add Calculated Field</h4>
                        <InputField
                            label="Name"
                            value={calcFieldName}
                            onChange={e => setCalcFieldName(e.value)}
                        />
                        <InputField
                            label="Formula (e.g., Revenue - Expenses)"
                            value={calcFieldFormula}
                            onChange={e => setCalcFieldFormula(e.value)}
                        />
                        <Button onClick={handleAddCalculatedField}>
                            Add Calculated Field
                        </Button>
                    </div>

                    {/* Dynamic Text */}
                    <div className="dynamic-text-section">
                        <h4>Add Dynamic Text</h4>
                        <InputField
                            label="Text"
                            value={dynamicTextValue}
                            onChange={e => setDynamicTextValue(e.value)}
                        />
                        <Button onClick={handleAddDynamicText}>
                            Add Dynamic Text
                        </Button>
                    </div>

                    {/* Report Designer: Draggable Fields for Rows & Columns */}
                    <div className="report-designer">
                        <h3>Report Designer</h3>
                        <div className="draggable-fields">
                            <div className="field-group">
                                <h4>Rows</h4>
                                <div 
                                    className="draggable-item"
                                    draggable="true"
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/plain', 'Row Field 1');
                                    }}
                                >
                                    Row Field 1
                                </div>
                                <div 
                                    className="draggable-item"
                                    draggable="true"
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/plain', 'Row Field 2');
                                    }}
                                >
                                    Row Field 2
                                </div>
                            </div>
                            <div className="field-group">
                                <h4>Columns</h4>
                                <div 
                                    className="draggable-item"
                                    draggable="true"
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/plain', 'Column Field A');
                                    }}
                                >
                                    Column Field A
                                </div>
                                <div 
                                    className="draggable-item"
                                    draggable="true"
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/plain', 'Column Field B');
                                    }}
                                >
                                    Column Field B
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Report Designer */}
                </div>
            </Card>
        </div>
    );
};

export default ConfigPanel;
