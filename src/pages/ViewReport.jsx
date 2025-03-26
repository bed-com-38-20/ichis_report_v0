import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { fetchReportData } from "../api/dataService";


const ViewReport = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);

    useEffect(() => {
        async function getReport() {
            const data = await fetchReportData(id);
            setReport(data);
        }
        getReport();
    }, [id]);

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Report: {report?.title || "Loading..."}</h2>
            <p className="text-gray-700 mb-4">{report?.description}</p>

            {/* Export Buttons */}
            <div className="flex gap-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600">
                    <FaFilePdf className="mr-2" /> Export as PDF
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600">
                    <FaFileExcel className="mr-2" /> Export as Excel
                </button>
            </div>
        </div>
    );
};

export default ViewReport;
