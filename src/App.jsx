import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataStoreProvider } from '@dhis2/app-service-datastore';
import { DataProvider } from '@dhis2/app-runtime';
import './locales';
import './styles/modalFix.css';
import globalStyles from './styles/global.style';
import classes from './App.module.css';
import { TABLES } from './modules/paths';
import { Tables, NoMatch } from './pages';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/home/homePage';

const appConfig = {
  baseUrl: 'https://play.im.dhis2.org/dev/',


  apiVersion: 37,
  pwaEnabled: false,
  headers: {
    Authorization: `Basic ${btoa('admin:district')}`
  }
};

const DATASTORE_NAMESPACE = 'ichis';

// Fixed component with all hooks before conditional returns
const AppInitializer = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  
  // All useEffect hooks called before any conditional returns
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false);
    }, 2500); // Show landing screen for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Simulate initialization check if needed
    setInitialized(true);
  }, []);
  
  // Conditional returns after all hooks
  if (showLanding) {
    return <LandingPage />;
  }
  
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
                 
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
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
