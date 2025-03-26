import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { fetchSavedReports } from "../api/dataService"; // Fetch saved reports

const SavedReports = () => {
    const [reports, setReports] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadReports() {
            try {
                const savedReports = await fetchSavedReports();
                setReports(savedReports || []);
            } catch (error) {
                console.error("Error fetching reports:", error);
                setReports([]);
            }
        }
        loadReports();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                Saved Reports <span className="text-blue-500 ml-2">ℹ️</span>
            </h2>

            {/* Create Report Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate("/create-report")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
                >
                    <FaPlus className="mr-2" /> Create new
                </button>
            </div>

            {/* Report List */}
            <div className="bg-gray-100 rounded-lg shadow-sm">
                {reports.length > 0 ? (
                    reports.map((report) => (
                        <div
                            key={report.id}
                            className="flex justify-between p-4 border-b cursor-pointer hover:bg-gray-200"
                            onClick={() => navigate(`/view-report/${report.id}`)}
                        >
                            <span>{report.name}</span>
                            <FaEllipsisV className="text-gray-600" />
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
