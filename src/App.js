// import React, { useState, useEffect } from 'react'
// import { useDataQuery, useConfig } from '@dhis2/app-runtime'
// import { DndProvider } from 'react-dnd'
// import { HTML5Backend } from 'react-dnd-html5-backend'
// import ConfigPanel from './components/configPanel/ConfigPanel'
// import ReportPreview from './components/ReportPreview/ReportPreview'
// import Visualizations from './components/Visualizations/Visualizations'
// import './App.css'

// const App = () => {
//     const { baseUrl } = useConfig()

//     // State to store entire report configuration
//     const [reportConfig, setReportConfig] = useState({
//         title: 'Default Title',
//         subtitle: 'Default Subtitle',
//         logo: null,
//         date: new Date().toLocaleDateString(),
//         facility: '',
//         orgUnit: null,
//         period: '',
//         periodSelection: null,
//         columns: [],
//         rows: [],
//         items: [],
//         calculatedFields: [], // Will hold expressions, e.g. { name, formula }
//         dynamicTexts: []      // Will hold dynamic text components (user-defined)
//     })

//     // Example DHIS2 metadata query
//     const { data: metadata, loading: metadataLoading } = useDataQuery({
//         orgUnits: {
//             resource: 'organisationUnits',
//             params: {
//                 paging: false,
//                 fields: 'id,displayName,level',
//                 level: 3
//             }
//         },
//         systemSettings: {
//             resource: 'systemSettings',
//             params: { key: ['applicationTitle'] }
//         },
//         user: {
//             resource: 'me',
//             params: { fields: 'organisationUnits[id,displayName]' }
//         }
//     })

//     return (
//         <DndProvider backend={HTML5Backend}>
//             <div className="app-grid">
                
//                 {/* LEFT: Configuration (OrgUnit, Period, Calculated Fields, Drag/Drop Setup) */}
//                 <div className="left-panel">
//                     <ConfigPanel
//                         reportConfig={reportConfig}
//                         setReportConfig={setReportConfig}
//                         metadata={metadata}
//                         loading={metadataLoading}
//                     />
//                 </div>
                
//                 {/* MIDDLE: Blank Panel with a Report Preview */}
//                 <div className="middle-panel">
//                     <ReportPreview
//                         reportConfig={reportConfig}
//                         setReportConfig={setReportConfig}
//                     />
//                 </div>
                
//                 {/* RIGHT: Visualizations (Also can affect the report configuration) */}
//                 <div className="right-panel">
//                     <Visualizations
//                         reportConfig={reportConfig}
//                         setReportConfig={setReportConfig}
//                     />
//                 </div>
//             </div>
//         </DndProvider>
//     )
// }

// export default App

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDataQuery, useConfig } from '@dhis2/app-runtime';
import ConfigPanel from './components/configPanel/ConfigPanel';
import ReportPreview from './components/reportPreview/ReportPreview';
import Visualizations from './components/visualizations/Visualizations';
import './App.css';

const App = () => {
    const { baseUrl } = useConfig();
    const [reportConfig, setReportConfig] = useState({
        title: 'Default Title',
        subtitle: 'Default Subtitle',
        logo: null,
        date: new Date().toLocaleDateString(),
        facility: '',
        orgUnit: null,
        period: '',
        periodSelection: null,
        columns: [],
        rows: [],
        items: [],
        calculatedFields: [],
        dynamicTexts: []
    });

    const { data: metadata, loading: metadataLoading } = useDataQuery({
        orgUnits: {
            resource: 'organisationUnits',
            params: {
                paging: false,
                fields: 'id,displayName,level',
                level: 3
            }
        },
        systemSettings: {
            resource: 'systemSettings',
            params: { key: ['applicationTitle'] }
        },
        user: {
            resource: 'me',
            params: { fields: 'organisationUnits[id,displayName]' }
        }
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="app-grid">
                {/* Left Panel */}
                <div className="left-panel">
                    <ConfigPanel 
                        reportConfig={reportConfig}
                        setReportConfig={setReportConfig}
                        metadata={metadata}
                        loading={metadataLoading}
                    />
                </div>
                {/* Center Panel */}
                <div className="middle-panel">
                    <ReportPreview 
                        reportConfig={reportConfig}
                        setReportConfig={setReportConfig}
                    />
                </div>
                {/* Right Panel */}
                <div className="right-panel">
                    <Visualizations 
                        reportConfig={reportConfig}
                        setReportConfig={setReportConfig}
                    />
                </div>
            </div>
        </DndProvider>
    );
};

export default App;
