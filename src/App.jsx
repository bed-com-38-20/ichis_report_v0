import React from "react";
import { ReportProvider } from "./context/ReportContext"; 
import ReportBuilder from "./components/ReportBuilder";  

const App = () => {
  return (
    <ReportProvider>
      <ReportBuilder />
    </ReportProvider>
  );
};

export default App;
