import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaEdit, FaFilePdf, FaFileExcel } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import EditReport from "../components/EditReport";
import TemplateSelector from "../components/TemplateSelector";
import { generateReport } from "../api/reportGenerator"; // Import generateReport function

const ViewReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formattedReport, setFormattedReport] = useState(null); // Use formattedReport state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("default");

    useEffect(() => {
        async function loadReport() {
            try {
                const data = await generateReport(id); // Fetch the report using generateReport
                setFormattedReport(data);
            } catch (err) {
                setError("Failed to generate report");
                setError("Failed to generate report");
            } finally {
                setLoading(false);
            }
        }
        loadReport();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                // Assuming deleteReport exists in your API
                await deleteReport(id);
                alert("Report deleted successfully");
                navigate("/saved-reports");
            } catch (err) {
                alert("Failed to delete report");
            }
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = (updatedReport) => {
        setFormattedReport(updatedReport);
        setIsEditing(false);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text(`Report: ${formattedReport.title}`, 10, 10);

        autoTable(doc, {
            startY: 20,
            head: [["Forms", "Fields", "Data Elements", "Org Units", "Time Period"]],
            body: [
                [
                    formattedReport.selectedForms.join(", ") || "N/A",
                    formattedReport.selectedFields.join(", ") || "N/A",
                    formattedReport.selectedFields.join(", ") || "N/A", // Assuming selectedFields holds the data elements
                    formattedReport.orgUnits.join(", ") || "N/A",
                    formattedReport.period || "N/A",
                ],
            ],
        });

        doc.save(`${formattedReport.title}_${selectedTemplate}.pdf`);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet([{
            "Report Title": formattedReport.title,
            "Selected Forms": formattedReport.selectedForms.join(", ") || "N/A",
            "Selected Fields": formattedReport.selectedFields.join(", ") || "N/A",
            "Data Elements": formattedReport.selectedFields.join(", ") || "N/A", // Assuming selectedFields holds the data elements
            "Organization Units": formattedReport.orgUnits.join(", ") || "N/A",
            "Time Period": formattedReport.period || "N/A",
        }]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report Data");
        XLSX.writeFile(workbook, `${formattedReport.title}_${selectedTemplate}.xlsx`);
    };

    if (loading) return <p className="text-gray-600">Loading report...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigate("/saved-reports")} className="text-blue-500 flex items-center">
                    <FaArrowLeft className="mr-2" /> Back to Reports
                </button>
                <div className="flex gap-4">
                    <button onClick={handleEditToggle} className="text-green-500 flex items-center">
                        <FaEdit className="mr-2" /> {isEditing ? "Cancel" : "Edit Report"}
                    </button>
                    <button onClick={handleDelete} className="text-red-500 flex items-center">
                        <FaTrash className="mr-2" /> Delete Report
                    </button>
                </div>
            </div>

            {/* Edit Mode */}
            {isEditing ? (
                <EditReport report={formattedReport} onSave={handleSaveChanges} />
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{formattedReport.title}</h2>

                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Selected Forms:</h3>
                    <p className="text-gray-600">{formattedReport.selectedForms.join(", ") || "No forms selected"}</p>

                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Selected Fields:</h3>
                    <p className="text-gray-600">{formattedReport.selectedFields.join(", ") || "No fields selected"}</p>

                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Data Elements:</h3>
                    <p className="text-gray-600">{formattedReport.selectedFields.join(", ") || "No data elements selected"}</p>

                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Organization Units:</h3>
                    <p className="text-gray-600">{formattedReport.orgUnits.join(", ") || "No organization units selected"}</p>

                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Time Period:</h3>
                    <p className="text-gray-600">{formattedReport.period || "No time period specified"}</p>
                </div>
            )}

            {/* Template Selector */}
            <div className="mt-6">
                <TemplateSelector selectedTemplate={selectedTemplate} onChange={setSelectedTemplate} />
            </div>

            {/* Export Buttons */}
            <div className="flex gap-4 mt-6">
                <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600">
                    <FaFilePdf className="mr-2" /> Export as PDF
                </button>
                <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600">
                    <FaFileExcel className="mr-2" /> Export as Excel
                </button>
            </div>
        </div>
    );
};

export default ViewReport;
