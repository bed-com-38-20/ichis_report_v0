import { fetchMergedReportData } from "./dataService";

/**
 * Generate a formatted report based on the report configuration.
 * @param {string} reportId - The ID of the saved report configuration.
 * @returns {Object} - A structured report object ready for UI display.
 */
export const generateReport = async (reportId) => {
    try {
        // Fetch merged data using report configuration
        const reportData = await fetchMergedReportData(reportId);

        if (!reportData || !reportData.data.length) {
            throw new Error("No data available for this report.");
        }

        // Format data for UI display
        const formattedReport = {
            title: reportData.title,
            description: reportData.description,
            period: reportData.timePeriod,
            orgUnits: reportData.orgUnits,
            selectedForms: reportData.selectedForms,
            selectedFields: reportData.selectedFields,
            tableData: formatTableData(reportData.data),
            chartData: formatChartData(reportData.data)
        };

        return formattedReport;
    } catch (error) {
        console.error("Error generating report:", error);
        throw error;
    }
};

/**
 * Format data for tabular display
 * @param {Array} data - Merged data values
 * @returns {Array} - Formatted table data
 */
const formatTableData = (data) => {
    return data.map(entry => ({
        DataElement: entry.dataElement,
        OrgUnit: entry.orgUnit,
        Period: entry.period,
        Value: entry.value
    }));
};

/**
 * Format data for chart visualization
 * @param {Array} data - Merged data values
 * @returns {Object} - Data formatted for chart libraries
 */
const formatChartData = (data) => {
    const chartData = {};

    data.forEach(entry => {
        if (!chartData[entry.dataElement]) {
            chartData[entry.dataElement] = [];
        }
        chartData[entry.dataElement].push({
            x: entry.period,
            y: parseFloat(entry.value)
        });
    });

    return chartData;
};
