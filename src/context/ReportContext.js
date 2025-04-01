import React, { createContext, useContext, useState, useEffect } from "react";

// Load saved templates from local storage
const loadTemplates = () => {
    try {
        const storedTemplates = localStorage.getItem("reportTemplates");
        return storedTemplates ? JSON.parse(storedTemplates) : [];
    } catch (error) {
        console.error("Error loading templates:", error);
        return [];
    }
};

// Save templates to local storage
const saveTemplates = (templates) => {
    try {
        localStorage.setItem("reportTemplates", JSON.stringify(templates));
    } catch (error) {
        console.error("Error saving templates:", error);
    }
};

// Create the ReportContext with default values
const ReportContext = createContext({
    reportConfig: {
        title: "",
        description: "",
        logo: "",
        dataElements: [],
        orgUnits: [],
        timePeriod: "",
    },
    templates: [], 
    setReportConfig: () => {},
    saveTemplate: () => {},
    updateTemplate: () => {},
    deleteTemplate: () => {},
});

export const ReportProvider = ({ children }) => {
    const [reportConfig, setReportConfig] = useState({
        title: "",
        description: "",
        logo: "",
        dataElements: [],
        orgUnits: [],
        timePeriod: "",
    });

    const [templates, setTemplates] = useState(() => loadTemplates());

    // Function to save a new template
    const saveTemplate = (template) => {
        const newTemplates = [...templates, template];
        setTemplates(newTemplates);
        saveTemplates(newTemplates);
    };

    // Function to update an existing template
    const updateTemplate = (updatedTemplate) => {
        const newTemplates = templates.map((t) =>
            t.title === updatedTemplate.title ? updatedTemplate : t
        );
        setTemplates(newTemplates);
        saveTemplates(newTemplates);
    };

    // Function to delete a template
    const deleteTemplate = (title) => {
        const newTemplates = templates.filter((t) => t.title !== title);
        setTemplates(newTemplates);
        saveTemplates(newTemplates);
    };

    return (
        <ReportContext.Provider 
            value={{ reportConfig, setReportConfig, templates, saveTemplate, updateTemplate, deleteTemplate }}>
            {children}
        </ReportContext.Provider>
    );
};

// Hook to use the ReportContext
export const useReportContext = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error("useReportContext must be used within a ReportProvider");
    }
    return context;
};

export default ReportContext;
