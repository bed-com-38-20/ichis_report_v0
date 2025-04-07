// import React from 'react';
// import { useDataQuery } from '@dhis2/app-runtime';
// import { HashRouter, Routes, Route } from 'react-router-dom';
// import { 
//   CssVariables,
//   CssReset,
//   Box,
//   Layer,
//   CenteredContent,
//   CircularLoader,
//   AlertBar
// } from '@dhis2/ui';
// import ReportDesigner from './components/ReportDesigner';
// import Navigation from './components/Navigation';
// import { ReportProvider } from './context/ReportContext';
// import './styles/global.css';

// const query = {
//   me: {
//     resource: 'me',
//   },
// };

// const MyApp = () => {
//   const { loading, error, data } = useDataQuery(query);

//   if (loading) {
//     return (
//       <CenteredContent>
//         <CircularLoader />
//       </CenteredContent>
//     );
//   }

//   if (error) {
//     return (
//       <AlertBar critical>
//         Error loading user data: {error.message}
//       </AlertBar>
//     );
//   }

//   return (
//     <HashRouter>
//       <ReportProvider>
//         <CssVariables />
//         <CssReset />
//         <Layer>
//           <Box display="flex" height="100vh">
//             <Navigation username={data.me.name} />
//             <Box flex={1} padding="16px" overflow="auto">
//               <Routes>
//                 <Route path="/custom-tables" element={<ReportDesigner mode="tables" />} />
//                 <Route path="/custom-reports" element={<ReportDesigner mode="reports" />} />
//                 <Route path="/help" element={
//                   <Box padding="16px">
//                     <h2>Help Center</h2>
//                     <p>Welcome, {data.me.name}! How can we help?</p>
//                   </Box>
//                 } />
//                 <Route path="*" element={<ReportDesigner mode="tables" />} />
//               </Routes>
//             </Box>
//           </Box>
//         </Layer>
//       </ReportProvider>
//     </HashRouter>
//   );
// };

// export default MyApp;

 
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DataTable, DataTableRow, DataTableCell } from '@dhis2/ui';
import DraggableItem from './DraggableItem';
import DroppableTable from './DroppableTable';

const App = () => {
    const items = [
        { id: '1', name: 'Indicator 1' },
        { id: '2', name: 'Indicator 2' },
        { id: '3', name: 'Indicator 3' },
    ];

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
                <div style={{ width: '200px' }}>
                    <h3>Available Items</h3>
                    {items.map(item => (
                        <DraggableItem key={item.id} item={item} />
                    ))}
                </div>
                
                <div style={{ flex: 1 }}>
                    <h3>Table</h3>
                    <DroppableTable />
                </div>
            </div>
        </DndProvider>
    );
};

export default App;