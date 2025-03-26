// Handles API requests
import axios from "axios";

const DHIS2_BASE_URL = "https://project.ccdev.org/ictprojects"; // Change to actual instance

export const fetchDataElements = async () => {
    const response = await axios.get(`${DHIS2_BASE_URL}/dataElements.json?paging=false`);
    return response.data.dataElements;
};

export const fetchOrgUnits = async () => {
    const response = await axios.get(`${DHIS2_BASE_URL}/organisationUnits.json?paging=false`);
    return response.data.organisationUnits;
};

// New function to fetch report data
export const fetchReportData = async () => {
    try {
        const response = await axios.get(`${DHIS2_BASE_URL}/reports.json?paging=false`);
        return response.data.reports; // Adjust this if your report data is structured differently
    } catch (error) {
        console.error("Error fetching report data:", error);
        throw error;
    }
};
