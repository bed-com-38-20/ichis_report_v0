import React, { createContext, useContext, useState } from "react";

// Provide a default value to avoid undefined errors
const ReportContext = createContext({
    reportConfig: {
        title: "",
        description: "",
        logo: "",
        dataElements: [],
        orgUnits: [],
        timePeriod: "",
    },
    setReportConfig: () => {}, // No-op function as default
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

    return (
        <ReportContext.Provider value={{ reportConfig, setReportConfig }}>
            {children}
        </ReportContext.Provider>
    );
};

export const useReportContext = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error("useReportContext must be used within a ReportProvider");
    }
    return context;
};

export default ReportContext;
