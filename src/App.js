import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DataStoreProvider } from '@dhis2/app-service-datastore';
import { DataProvider } from '@dhis2/app-runtime';
import './locales';
import './styles/modalFix.css';
import globalStyles from './styles/global.style';
import classes from './App.module.css';
import { TABLES } from './modules/paths';
import { Tables, NoMatch } from './pages';

const appConfig = {
  baseUrl: 'https://project.ccdev.org/ictprojects/api',
  apiVersion: 39,
  pwaEnabled: false,
  headers: {
    Authorization: `Basic ${btoa('underworld:Evan1234@')}`
  }
};

const DATASTORE_NAMESPACE = 'ichis';

// Modified to be a regular component without render props
const AppInitializer = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate initialization check if needed
    setInitialized(true);
  }, []);

  if (error) {
    return (
      <div className={classes.errorContainer}>
        <h2>Connection Failed</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className={classes.loadingContainer}>
        <p>Initializing DHIS2 connection...</p>
      </div>
    );
  }

  return children;
};

const MyApp = () => (
  <DataProvider config={appConfig}>
    <AppInitializer>
      <DataStoreProvider
        namespace={DATASTORE_NAMESPACE}
        loadingComponent={
          <div className={classes.loadingContainer}>
            <p>Loading data storage...</p>
          </div>
        }
      >
        <HashRouter>
          <div className={classes.container}>
            <main className={classes.right}>
              <Routes>
                <Route path={`${TABLES}/*`} element={<Tables />} />
                <Route path="*" element={<NoMatch />} />
              </Routes>
            </main>
          </div>
          <style jsx global>
            {globalStyles}
          </style>
        </HashRouter>
      </DataStoreProvider>
    </AppInitializer>
  </DataProvider>
);

export default MyApp;







// import React from 'react'
// import { HashRouter, Routes, Route } from 'react-router-dom'
// import { useDataQuery } from '@dhis2/app-runtime'
// import './locales'
// import './styles/modalFix.css'
// import globalStyles from './styles/global.style'
// import classes from './App.module.css'
// import { TABLES } from './modules/paths'
// import { Tables, NoMatch } from './pages'
// import TemplateDesigner from './components/TemplateDesigner'
// import ReportDesigner from './components/ReportDesigner'
// import { Navigation } from './navigation'

 
// const query = {
//     dataSets: {
//         resource: 'dataSets',
//         params: {
//             fields: ['id', 'displayName']
//         }
//     }
// }

// const MyApp = () => {
//     const { error, loading, data } = useDataQuery(query)

//     if (error) {
//         return <span>Error loading data</span>
//     }

//     if (loading) {
//         return <span>Loading...</span>
//     }

//     return (
//         <HashRouter>
//             <div className={classes.container}>
//                 <h1>DHIS2 Custom Report & Template Designer</h1>
//                 <TemplateDesigner />  { }
//                 <ReportDesigner />

//                 <main className={classes.right}>
//                     <Routes>
//                         <Route path={TABLES} element={<Tables />} />
//                         <Route path="*" element={<NoMatch />} />
//                     </Routes>
//                 </main>
//             </div>
//             <style jsx global>
//                 {globalStyles}
//             </style>
//         </HashRouter>
//     )
// }

// export default MyApp




//     return (
//         <HashRouter>
//             <div className={classes.container}>
//                 <main className={classes.right}>
//                     <Routes>
//                         <Route path={TABLES} component={Tables} />
//                         <Route component={NoMatch} />
//                     </Routes>
//                 </main>
//             </div>
//             <style jsx global>
//                 {globalStyles}
//             </style>
//         </HashRouter>
//     )
// }

//export default MyApp
