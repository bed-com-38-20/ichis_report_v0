const reportTemplates = {
    summary: {
        name: "Summary Report",
        description: "A concise report with key highlights.",
        fields: ["Title", "Key Findings", "Conclusion"],
    },
    detailed: {
        name: "Detailed Report",
        description: "A comprehensive report with in-depth analysis.",
        fields: ["Title", "Introduction", "Methodology", "Results", "Conclusion"],
    },
    statistical: {
        name: "Statistical Report",
        description: "A data-driven report with charts and graphs.",
        fields: ["Title", "Data Tables", "Graphs", "Statistical Analysis"],
    },
};

export const getReportTemplate = (templateName) => {
    return reportTemplates[templateName] || reportTemplates.summary;
};

export default reportTemplates;
