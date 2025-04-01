import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa";
import { fetchSavedReports, deleteReport } from "../api/dhis2Client"; 

const SavedReports = () => {
    const [reports, setReports] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadReports();
    }, []);

    async function loadReports() {
        setLoading(true);
        try {
            const savedReports = await fetchSavedReports();
            setReports(savedReports || []);
        } catch (error) {
            console.error("Error fetching reports:", error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (reportId) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                await deleteReport(reportId);
                loadReports(); // Reload after deletion
            } catch (error) {
                console.error("Error deleting report:", error);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                Saved Reports <span className="text-blue-500 ml-2">📊</span>
            </h2>

            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate("/create-report")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
                >
                    <FaPlus className="mr-2" /> Create new
                </button>
            </div>

            <div className="bg-gray-100 rounded-lg shadow-sm">
                {loading ? (
                    <p className="text-gray-600 p-4">Loading reports...</p>
                ) : reports.length > 0 ? (
                    reports.map((report) => (
                        <div key={report.id} className="flex justify-between p-4 border-b hover:bg-gray-200">
                            <span
                                className="cursor-pointer flex-1"
                                onClick={() => navigate(`/view-report/${report.id}`)}
                            >
                                {report.displayName}
                            </span>

                            <div className="relative">
                                <button onClick={() => setMenuOpen(menuOpen === report.id ? null : report.id)}>
                                    <FaEllipsisV className="text-gray-600" />
                                </button>

                                {menuOpen === report.id && (
                                    <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg p-2">
                                        <button
                                            className="flex items-center text-gray-700 hover:text-blue-500 mb-2 w-full"
                                            onClick={() => navigate(`/edit-report/${report.id}`)}
                                        >
                                            <FaEdit className="mr-2" /> Edit
                                        </button>
                                        <button
                                            className="flex items-center text-red-500 hover:text-red-700 w-full"
                                            onClick={() => handleDelete(report.id)}
                                        >
                                            <FaTrash className="mr-2" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 p-4">No saved reports available</p>
                )}
            </div>
        </div>
    );
};

export default SavedReports;
