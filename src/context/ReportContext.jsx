import React, { createContext, useState } from "react";

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [layout, setLayout] = useState([]);
  const [templates, setTemplates] = useState([]);

  const saveTemplate = (template) => {
    setTemplates([...templates, template]);
  };

  return (
    <ReportContext.Provider value={{ layout, setLayout, templates, saveTemplate }}>
      {children}
    </ReportContext.Provider>
  );
};