import React, { createContext, useState } from "react";

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
    const [reportConfig, setReportConfig] = useState({
        title: "",
        description: "",
        logo: "",
        dataElements: [], // Ensures it's always an array
        orgUnits: [],     // Ensures it's always an array
        timePeriod: "",
    });

    return (
        <ReportContext.Provider value={{ reportConfig, setReportConfig }}>
            {children}
        </ReportContext.Provider>
    );
};

// Ensure the context has a default value to prevent errors
export const useReportContext = () => {
    const context = React.useContext(ReportContext);
    if (!context) {
        throw new Error("useReportContext must be used within a ReportProvider");
    }
    return context;
};
