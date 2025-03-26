import React, { useState, useEffect } from "react";
import { useReportContext } from "../context/ReportContext"; 
import { fetchDataElements, fetchOrgUnits } from "../api/dhis2Client";
import { FaSave, FaEye, FaChartBar, FaCalendarAlt, FaBuilding, FaList } from "react-icons/fa";

const ReportBuilder = () => {
    const { reportConfig, setReportConfig } = useReportContext(); 
    const [dataElements, setDataElements] = useState([]);
    const [orgUnits, setOrgUnits] = useState([]);

    useEffect(() => {
        async function loadMetadata() {
            try {
                const elements = await fetchDataElements();
                const units = await fetchOrgUnits();
                setDataElements(elements || []);
                setOrgUnits(units || []);
            } catch (error) {
                console.error("Error fetching metadata:", error);
            }
        }
        loadMetadata();
    }, []);

    const handleInputChange = (e) => {
        setReportConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleMultiSelectChange = (e, field) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setReportConfig((prev) => ({ ...prev, [field]: values }));
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaChartBar className="text-blue-600 mr-2" /> Build a Configurable Report
            </h2>

            {/* Report Title */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Report Title:</label>
                <input
                    type="text"
                    name="title"
                    value={reportConfig.title || ""}
                    onChange={handleInputChange}
                    placeholder="Enter report title"
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                />
            </div>

            {/* Select Data Elements */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1 flex items-center">
                    <FaList className="text-blue-600 mr-2" /> Data Elements:
                </label>
                <select multiple onChange={(e) => handleMultiSelectChange(e, "dataElements")}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300">
                    {dataElements.length > 0 ? (
                        dataElements.map((item) => (
                            <option key={item.id} value={item.id}>{item.displayName}</option>
                        ))
                    ) : (
                        <option disabled>No data elements available</option>
                    )}
                </select>
            </div>

            {/* Select Organization Units */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1 flex items-center">
                    <FaBuilding className="text-blue-600 mr-2" /> Organization Units:
                </label>
                <select multiple onChange={(e) => handleMultiSelectChange(e, "orgUnits")}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300">
                    {orgUnits.length > 0 ? (
                        orgUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>{unit.displayName}</option>
                        ))
                    ) : (
                        <option disabled>No organization units available</option>
                    )}
                </select>
            </div>

            {/* Select Time Period */}
            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-1 flex items-center">
                    <FaCalendarAlt className="text-blue-600 mr-2" /> Time Period:
                </label>
                <input
                    type="date"
                    name="timePeriod"
                    value={reportConfig.timePeriod || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
                <button className="w-1/2 bg-green-500 text-white p-3 rounded-lg font-medium hover:bg-green-600 transition flex items-center justify-center">
                    <FaSave className="mr-2" /> Save Report
                </button>
                <button className="w-1/2 bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition flex items-center justify-center">
                    <FaEye className="mr-2" /> Preview Report
                </button>
            </div>
        </div>
    );
};

export default ReportBuilder;
