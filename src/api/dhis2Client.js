// Handles API requests
import axios from "axios";

const DHIS2_BASE_URL = "https://project.ccdev.org/ictprojects"; //  DHIS2 instance
const DHIS2_USERNAME = "Thoko M'mwenye";  //  username
const DHIS2_PASSWORD = "Mmwenye@1920"; // password

// Encode authentication credentials
const authHeader = `Basic ${btoa(`${DHIS2_USERNAME}:${DHIS2_PASSWORD}`)}`;

// Create an axios instance with default settings
const apiClient = axios.create({
    baseURL: DHIS2_BASE_URL,
    headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
    },
});

/**
 * Fetch data elements from DHIS2
 */
export const fetchDataElements = async () => {
    try {
        const response = await apiClient.get("/dataElements.json?paging=false");
        return response.data.dataElements || [];
    } catch (error) {
        console.error("Error fetching data elements:", error);
        return [];
    }
};

/**
 * Fetch organization units from DHIS2
 */
export const fetchOrgUnits = async () => {
    try {
        const response = await apiClient.get("/organisationUnits.json?paging=false");
        return response.data.organisationUnits || [];
    } catch (error) {
        console.error("Error fetching organization units:", error);
        return [];
    }
};

/**
 * Fetch all saved reports from DHIS2
 */
export const fetchSavedReports = async () => {
    try {
        const response = await apiClient.get("/reports.json?paging=false");
        return response.data.reports || [];
    } catch (error) {
        console.error("Error fetching saved reports:", error);
        return [];
    }
};

/**
 * Fetch a specific report by ID
 */
export const fetchReportData = async (reportId) => {
    try {
        const response = await apiClient.get(`/reports/${reportId}.json`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching report ${reportId}:`, error);
        throw error;
    }
};

/**
 * Create a new report
 */
export const createReport = async (reportData) => {
    try {
        const response = await apiClient.post("/reports", reportData);
        return response.data;
    } catch (error) {
        console.error("Error creating report:", error);
        throw error;
    }
};

/**
 * Update an existing report
 */
export const updateReport = async (reportId, updatedData) => {
    try {
        const response = await apiClient.put(`/reports/${reportId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating report ${reportId}:`, error);
        throw error;
    }
};

/**
 * Delete a saved report from DHIS2
 */
export const deleteReport = async (reportId) => {
    try {
        await apiClient.delete(`/reports/${reportId}`);
        console.log(`Report ${reportId} deleted successfully`);
    } catch (error) {
        console.error(`Error deleting report ${reportId}:`, error);
        throw error;
    }
};
