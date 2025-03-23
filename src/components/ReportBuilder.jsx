import React, { useContext, useEffect, useState } from "react";
import { ReportContext } from "../context/ReportContext";
import { fetchDataElements, fetchOrgUnits } from "../api/dhis2Client";

const ReportBuilder = () => {
    const { reportConfig, setReportConfig } = useContext(ReportContext);
    const [dataElements, setDataElements] = useState([]);
    const [orgUnits, setOrgUnits] = useState([]);

    useEffect(() => {
        async function loadMetadata() {
            try {
                const elements = await fetchDataElements();
                const units = await fetchOrgUnits();
                setDataElements(elements || []); // Ensure it's always an array
                setOrgUnits(units || []); // Ensure it's always an array
            } catch (error) {
                console.error("Error fetching metadata:", error);
                setDataElements([]);
                setOrgUnits([]);
            }
        }
        loadMetadata();
    }, []);

    const handleInputChange = (e) => {
        setReportConfig((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleMultiSelectChange = (e, field) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setReportConfig((prev) => ({
            ...prev,
            [field]: values,
        }));
    };

    return (
        <div className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">Create Report</h2>

            <label>Title:</label>
            <input 
                type="text" 
                name="title" 
                value={reportConfig.title || ""} 
                onChange={handleInputChange} 
                className="border p-2 w-full"
            />

            <label>Description:</label>
            <textarea 
                name="description" 
                value={reportConfig.description || ""} 
                onChange={handleInputChange} 
                className="border p-2 w-full"
            />

            <label>Data Elements:</label>
            <select multiple onChange={(e) => handleMultiSelectChange(e, "dataElements")}>
                {dataElements.length > 0 ? (
                    dataElements.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.displayName}
                        </option>
                    ))
                ) : (
                    <option disabled>No data elements available</option>
                )}
            </select>

            <label>Organization Units:</label>
            <select multiple onChange={(e) => handleMultiSelectChange(e, "orgUnits")}>
                {orgUnits.length > 0 ? (
                    orgUnits.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                            {unit.displayName}
                        </option>
                    ))
                ) : (
                    <option disabled>No organization units available</option>
                )}
            </select>

            <label>Time Period:</label>
            <input 
                type="date" 
                name="timePeriod" 
                value={reportConfig.timePeriod || ""} 
                onChange={handleInputChange} 
                className="border p-2 w-full" 
            />

            <button className="bg-blue-500 text-white px-4 py-2 mt-4">Save Report</button>
        </div>
    );
};

export default ReportBuilder;
