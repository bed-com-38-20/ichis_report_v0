import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Pages/HomePage';
import ReportBuilderPage from './components/pages/ReportBuilderPage';
import TemplatesPage from './components/Pages/TemplatesPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<ReportBuilderPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
