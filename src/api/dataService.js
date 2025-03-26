import axios from "axios";

// Base URL for DHIS2 API (ensure this is correctly set in your .env file)
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

//  Fetch available data elements from DHIS2
export const fetchDataElements = async () => {
    try {
        const response = await apiClient.get("/dataElements?paging=false&fields=id,name");
        return response.data.dataElements;
    } catch (error) {
        console.error("Error fetching data elements:", error);
        throw error;
    }
};

//  Fetch available organization units
export const fetchOrgUnits = async () => {
    try {
        const response = await apiClient.get("/organisationUnits?paging=false&fields=id,name");
        return response.data.organisationUnits;
    } catch (error) {
        console.error("Error fetching organization units:", error);
        throw error;
    }
};

// Fetch saved reports
export const fetchSavedReports = async () => {
    try {
        const response = await apiClient.get("/reports?paging=false&fields=id,name,type");
        return response.data.reports;
    } catch (error) {
        console.error("Error fetching saved reports:", error);
        throw error;
    }
};

//  Fetch a specific report's data
export const fetchReportData = async (reportId) => {
    try {
        const response = await apiClient.get(`/reports/${reportId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching report data:", error);
        throw error;
    }
};

// Save a new report configuration
export const saveReport = async (reportData) => {
    try {
        const response = await apiClient.post("/reports", reportData);
        return response.data;
    } catch (error) {
        console.error("Error saving report:", error);
        throw error;
    }
};

// Export report as PDF
export const exportReportAsPDF = async (reportId) => {
    try {
        const response = await apiClient.get(`/reports/${reportId}/pdf`, {
            responseType: "blob"
        });
        return response.data;
    } catch (error) {
        console.error("Error exporting report as PDF:", error);
        throw error;
    }
};

// Export report as Excel
export const exportReportAsExcel = async (reportId) => {
    try {
        const response = await apiClient.get(`/reports/${reportId}/xls`, {
            responseType: "blob"
        });
        return response.data;
    } catch (error) {
        console.error("Error exporting report as Excel:", error);
        throw error;
    }
};
