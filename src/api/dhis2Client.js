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
