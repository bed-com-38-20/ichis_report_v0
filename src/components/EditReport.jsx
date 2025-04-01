import React, { useState } from "react";
import { FaSave } from "react-icons/fa";

const EditReport = ({ report, onSave, onCancel }) => {
    const [editedReport, setEditedReport] = useState({
        title: report.title || "",
        description: report.description || "",
        dataElements: report.dataElements || [],
        orgUnits: report.orgUnits || [],
        timePeriod: report.timePeriod || "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedReport((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(editedReport);
    };

    return (
        <div>
            <label className="block text-gray-700 font-semibold mb-1">Report Title:</label>
            <input
                type="text"
                name="title"
                value={editedReport.title}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg shadow-sm mb-4"
            />

            <label className="block text-gray-700 font-semibold mb-1">Description:</label>
            <textarea
                name="description"
                value={editedReport.description}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg shadow-sm mb-4"
            ></textarea>

            <button
                onClick={handleSave}
                className="w-full bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
            >
                <FaSave className="mr-2" /> Save Changes
            </button>

            <button
                onClick={onCancel}
                className="w-full bg-gray-400 text-white p-3 rounded-lg mt-2 hover:bg-gray-500 transition"
            >
                Cancel
            </button>
        </div>
    );
};

export default EditReport;
