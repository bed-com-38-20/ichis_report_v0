import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Pages/HomePage';
import ReportBuilderPage from './components/pages/ReportBuilderPage';
import TemplatesPage from './components/Pages/TemplatesPage';
import './App.css';
import { Provider } from '@dhis2/app-runtime'


// const dhis2Config = {
//   baseUrl: 'https://play.im.dhis2.org/stable-2-41-3-1', // Replace with your actual DHIS2 server URL
//   apiVersion: 37, // Use the appropriate API version for your DHIS2 instance
//   pwaEnabled: false,
//   headers: {
//     Authorization: `Basic ${btoa('underworld:Evan1234@')}`
//   }
// }

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
