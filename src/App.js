import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DataStoreProvider } from '@dhis2/app-service-datastore';
import { DataProvider } from '@dhis2/app-runtime';
import PropTypes from 'prop-types';
import './locales';
import './styles/modalFix.css';
import globalStyles from './styles/global.style';
import classes from './App.module.css';
import { TABLES } from './modules/paths';
import { Tables, NoMatch } from './pages';

/**
 * Application configuration
 * Note: In production, these should come from environment variables
 * Create a .env file with these variables:
 * REACT_APP_DHIS2_BASE_URL=your_base_url
 * REACT_APP_DHIS2_API_VERSION=api_version
 */
const appConfig = {
  baseUrl: process.env.REACT_APP_DHIS2_BASE_URL || 'https://project.ccdev.org/ictprojects/api',
  apiVersion: parseInt(process.env.REACT_APP_DHIS2_API_VERSION) || 39,
  pwaEnabled: false
};

// Namespace for the DataStore
const DATASTORE_NAMESPACE = 'ichis';

/**
 * AppInitializer component
 * Handles application initialization and error states
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render after initialization
 */
const AppInitializer = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Here you could add actual initialization checks
        // For example, make a test API call to verify connection
        // await testApiConnection(); // Implement this function as needed
        
        // Simulate initialization for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInitialized(true);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err instanceof Error ? err : new Error('Initialization failed'));
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <div className={classes.errorContainer}>
        <h2>Connection Failed</h2>
        <p>{error.message}</p>
        <button 
          className={classes.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className={classes.loadingContainer}>
        <div className={classes.spinner}></div>
        <p>Initializing DHIS2 connection...</p>
      </div>
    );
  }

  return children;
};

AppInitializer.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Main application component
 * Sets up the DHIS2 providers and routing
 */
const MyApp = () => (
  <DataProvider config={appConfig}>
    <AppInitializer>
      <DataStoreProvider
        namespace={DATASTORE_NAMESPACE}
        loadingComponent={
          <div className={classes.loadingContainer}>
            <div className={classes.spinner}></div>
            <p>Loading data storage...</p>
          </div>
        }
        errorComponent={
          <div className={classes.errorContainer}>
            <h2>Data Storage Error</h2>
            <p>Failed to load data storage. Please refresh the page.</p>
            <button 
              className={classes.retryButton}
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
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
