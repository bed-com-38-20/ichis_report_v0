import axios from "axios";

// Base URL for DHIS2 API (ensure this is correctly set in .env file)
const BASE_URL = process.env.REACT_APP_DHIS2_BASE_URL || "https://project.ccdev.org/ictprojects";
const API_VERSION = process.env.REACT_APP_DHIS2_API_VERSION || "39"; // Adjust based on DHIS2 version

// Axios instance with authentication headers
const apiClient = axios.create({
    baseURL: `${BASE_URL}/${API_VERSION}`,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(process.env.REACT_APP_DHIS2_USERNAME + ":" + process.env.REACT_APP_DHIS2_PASSWORD)}`
    }
});

/**
 * Fetch available data elements from DHIS2
 */
export const fetchDataElements = async () => {
    try {
        const response = await apiClient.get("/dataElements?paging=false&fields=id,name");
        return response.data.dataElements;
    } catch (error) {
        console.error("Error fetching data elements:", error);
        throw error;
    }
};

/**
 * Fetch available organization units from DHIS2
 */
export const fetchOrgUnits = async () => {
    try {
        const response = await apiClient.get("/organisationUnits?paging=false&fields=id,name");
        return response.data.organisationUnits;
    } catch (error) {
        console.error("Error fetching organization units:", error);
        throw error;
    }
};

/**
 * Fetch a list of saved reports from DHIS2
 */
export const fetchSavedReports = async () => {
    try {
        const response = await apiClient.get("/reports?paging=false&fields=id,name,type");
        return response.data.reports;
    } catch (error) {
        console.error("Error fetching saved reports:", error);
        throw error;
    }
};

/**
 * Fetch details of a specific report by ID
 */
export const fetchReportData = async (reportId) => {
    try {
        const response = await apiClient.get(`/reports/${reportId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching report data:", error);
        throw error;
    }
};

/**
 * Save a new report configuration to DHIS2
 */
export const saveReport = async (reportData) => {
    try {
        const response = await apiClient.post("/reports", reportData);
        return response.data;
    } catch (error) {
        console.error("Error saving report:", error);
        throw error;
    }
};

/**
 * Delete a report by ID
 */
export const deleteReport = async (reportId) => {
    try {
        await apiClient.delete(`/reports/${reportId}`);
        return { success: true, message: "Report deleted successfully." };
    } catch (error) {
        console.error("Error deleting report:", error);
        throw error;
    }
};

/**
 * Export report as PDF
 */
export const exportReportAsPDF = async (reportId) => {
    try {
        const response = await apiClient.get(`/reports/${reportId}/pdf`, { responseType: "blob" });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Report_${reportId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error exporting report as PDF:", error);
        throw error;
    }
};

/**
 * Export report as Excel
 */
export const exportReportAsExcel = async (reportId) => {
    try {
        const response = await apiClient.get(`/reports/${reportId}/xls`, { responseType: "blob" });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Report_${reportId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error exporting report as Excel:", error);
        throw error;
    }
};

/**
 * Fetch and merge data from multiple DHIS2 forms based on user configuration.
 * @param {string} reportId - The ID of the report configuration.
 * @returns {Object} - Merged report data.
 */
export const fetchMergedReportData = async (reportId) => {
    try {
        // Fetch saved report configuration
        const reportConfig = await fetchReportData(reportId);
        if (!reportConfig) throw new Error("Report not found.");

        const { selectedForms, selectedFields, orgUnits, timePeriod, title, description } = reportConfig;
        let mergedData = [];

        // Fetch and merge data from multiple selected forms
        for (const form of selectedForms) {
            const url = `/dataValueSets?dataSet=${form}&orgUnit=${orgUnits.join(";")}&period=${timePeriod}`;
            const response = await apiClient.get(url);

            response.data.dataValues.forEach((entry) => {
                if (selectedFields.includes(entry.dataElement)) {
                    mergedData.push({
                        dataElement: entry.dataElement,
                        orgUnit: entry.orgUnit,
                        period: entry.period,
                        value: entry.value
                    });
                }
            });
        }

        return {
            title,
            description,
            selectedForms,
            selectedFields,
            orgUnits,
            timePeriod,
            data: mergedData
        };
    } catch (error) {
        console.error("Error fetching merged report data:", error);
        throw error;
    }
};
