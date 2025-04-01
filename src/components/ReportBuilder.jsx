import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataElements, fetchOrgUnits, createReport, updateReport } from "../api/dhis2Client";
import { FaSave, FaChartBar, FaBuilding, FaList } from "react-icons/fa";

const ReportBuilder = ({ existingReport, selectedForms, selectedFields }) => {
    const navigate = useNavigate();
    const [reportConfig, setReportConfig] = useState(existingReport || {
        title: "",
        selectedForms: selectedForms || [],
        selectedFields: selectedFields || [],
        dataElements: [],
        orgUnits: [],
        timePeriod: ""
    });

    const [dataElements, setDataElements] = useState([]);
    const [orgUnits, setOrgUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMetadata() {
            try {
                const elements = await fetchDataElements();
                const units = await fetchOrgUnits();
                setDataElements(elements || []);
                setOrgUnits(units || []);
            } catch (error) {
                console.error("Error fetching metadata:", error);
            } finally {
                setLoading(false);
            }
        }
        loadMetadata();
    }, []);

    useEffect(() => {
        // Ensure selected forms & fields from TemplateSelector are included in the config
        setReportConfig((prev) => ({
            ...prev,
            selectedForms: selectedForms || prev.selectedForms,
            selectedFields: selectedFields || prev.selectedFields,
        }));
    }, [selectedForms, selectedFields]);

    const handleInputChange = (e) => {
        setReportConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleMultiSelectChange = (e, field) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setReportConfig((prev) => ({ ...prev, [field]: values }));
    };

    const handleSaveReport = async () => {
        if (!reportConfig.title) {
            alert("Please provide a report title before saving.");
            return;
        }

        try {
            const finalReportConfig = {
                ...reportConfig,
                selectedForms: selectedForms, // Ensure selected forms are saved
                selectedFields: selectedFields, // Ensure selected fields are saved
            };

            if (existingReport) {
                await updateReport(existingReport.id, finalReportConfig);
                alert("Report updated successfully!");
            } else {
                await createReport(finalReportConfig);
                alert("Report saved successfully!");
            }
            navigate("/saved-reports");
        } catch (error) {
            console.error("Error saving report:", error);
            alert("Failed to save report.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaChartBar className="text-blue-600 mr-2" /> {existingReport ? "Edit Report" : "Create Report"}
            </h2>

            {loading ? <p>Loading metadata...</p> : (
                <>
                    {/* Report Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Report Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={reportConfig.title}
                            onChange={handleInputChange}
                            placeholder="Enter report title"
                            className="w-full p-3 border rounded-lg shadow-sm"
                        />
                    </div>

                    {/* Selected Forms */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Selected Forms:</label>
                        <div className="bg-gray-100 p-2 rounded-lg">
                            {reportConfig.selectedForms.length > 0 ? (
                                reportConfig.selectedForms.map((form, index) => (
                                    <span key={index} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm mr-2">
                                        {form}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No forms selected</p>
                            )}
                        </div>
                    </div>

                    {/* Selected Fields */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Selected Fields:</label>
                        <div className="bg-gray-100 p-2 rounded-lg">
                            {reportConfig.selectedFields.length > 0 ? (
                                reportConfig.selectedFields.map((field, index) => (
                                    <span key={index} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm mr-2">
                                        {field}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No fields selected</p>
                            )}
                        </div>
                    </div>

                    {/* Organization Units */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1 flex items-center">
                            <FaBuilding className="text-blue-600 mr-2" /> Organization Units:
                        </label>
                        <select multiple onChange={(e) => handleMultiSelectChange(e, "orgUnits")} className="w-full p-3 border rounded-lg">
                            {orgUnits.map((unit) => (
                                <option key={unit.id} value={unit.id}>{unit.displayName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button onClick={handleSaveReport} className="w-1/2 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600">
                            <FaSave className="mr-2" /> Save Report
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportBuilder;
