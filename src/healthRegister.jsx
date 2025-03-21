import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Button,
    CircularLoader,
    NoticeBox,
    DataTable,
    DataTableHead,
    DataTableRow,
    DataTableCell,
    DataTableBody
} from "@dhis2/ui";
import DataElementList from "./dataElementList";
import jsPDF from "jspdf";
import "jspdf-autotable";

const API_URL = "https://project.ccdev.org/ictprojects";
const AUTH = { username: "admin", password: "district" };

const HealthRegister = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [selectedFields, setSelectedFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data elements dynamically
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_URL, {
                    auth: AUTH,
                    params: {
                        dimension: "dx:Uvn6LCg7dVU", // Example data element ID
                        filter: "pe:LAST_12_MONTHS",
                        orgUnit: "ImspTQPwCqd" // Example organization unit (Sierra Leone)
                    }
                });
                setAnalyticsData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Toggle selected fields
    const handleFieldSelect = (index) => {
        setSelectedFields((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    // Generate and download the PDF report
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("DHIS2 Report", 10, 10);

        if (!analyticsData) return;

        const headers = selectedFields.length > 0
            ? selectedFields.map((i) => analyticsData.headers[i].name)
            : analyticsData.headers.map((h) => h.name);

        const rows = analyticsData.rows.map((row) =>
            selectedFields.length > 0
                ? selectedFields.map((i) => row[i])
                : row
        );

        doc.autoTable({ head: [headers], body: rows, startY: 20 });
        doc.save("DHIS2_Report.pdf");
    };

    if (loading) return <CircularLoader small />;
    if (error) return <NoticeBox title="Error" error>{error.message}</NoticeBox>;

    // Extract available headers from API response
    const availableHeaders = analyticsData.headers || [];
    const headersToPreview = selectedFields.length > 0
        ? selectedFields.map((i) => availableHeaders[i].name)
        : availableHeaders.map((h) => h.name);
    const rowsToPreview = analyticsData.rows || [];

    return (
        <div style={{ padding: "1rem" }}>
            <h1>DHIS2 Report Builder</h1>
            <DataElementList fields={availableHeaders} selectedFields={selectedFields} onFieldSelect={handleFieldSelect} />

            <div style={{ marginTop: "1rem" }}>
                <h3>Live Report Preview</h3>
                <DataTable>
                    <DataTableHead>
                        <DataTableRow>
                            {headersToPreview.map((header, idx) => (
                                <DataTableCell key={idx} fixed>{header}</DataTableCell>
                            ))}
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {rowsToPreview.map((row, idx) => (
                            <DataTableRow key={idx}>
                                {row.map((cell, cIdx) => (
                                    <DataTableCell key={cIdx}>{cell}</DataTableCell>
                                ))}
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            </div>

            <div style={{ marginTop: "1rem" }}>
                <Button onClick={generatePDF}>Download Report</Button>
            </div>
        </div>
    );
};

export default HealthRegister;
