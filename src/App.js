import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/pages/HomePage'; 
import ReportBuilderPage from './components/Pages/ReportBuilderPage'; 
import TemplatesPage from './components/Pages/TemplatesPage';
import { ReportBuilderProvider } from './components/ReportBuilder/ReportBuilderContext';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/builder"
          element={
            <ReportBuilderProvider>
              <ReportBuilderPage />
            </ReportBuilderProvider>
          }
        />
        <Route
          path="/templates"
          element={
            <ReportBuilderProvider>
              <TemplatesPage />
            </ReportBuilderProvider>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
