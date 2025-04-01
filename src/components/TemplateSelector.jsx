import React, { useState, useEffect } from "react";
import reportTemplates, { getReportTemplate } from "../api/ReportTemplates";
import { fetchDataElements } from "../api/dataService";
import { saveTemplate, loadTemplate, getAllTemplates, deleteTemplate } from "../utils/storageHelper";

const TemplateSelector = ({ onSelectTemplate }) => {
    const [selectedTemplate, setSelectedTemplate] = useState("summary");
    const [customTemplates, setCustomTemplates] = useState({});
    const [availableFields, setAvailableFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [selectedForms, setSelectedForms] = useState([]);

    useEffect(() => {
        try {
            // Load saved templates from localStorage
            const templates = getAllTemplates() || {};
            setCustomTemplates(templates);
        } catch (error) {
            console.error("Error loading templates:", error);
            setCustomTemplates({});
        }

        // Fetch available fields from DHIS2
        fetchDataElements()
            .then((data) => setAvailableFields(Array.isArray(data) ? data : []))
            .catch((error) => {
                console.error("Error fetching data elements:", error);
                setAvailableFields([]);
            });
    }, []);

    const handleTemplateChange = (e) => {
        const templateName = e.target.value;
        setSelectedTemplate(templateName);

        const selectedTemplateData =
            reportTemplates?.[templateName] || customTemplates?.[templateName] || getReportTemplate(templateName);
        
        if (selectedTemplateData) {
            onSelectTemplate(selectedTemplateData);
        }
    };

    const handleFieldChange = (e) => {
        const fieldId = e.target.value;
        setSelectedFields((prevFields) =>
            prevFields.includes(fieldId)
                ? prevFields.filter((id) => id !== fieldId)
                : [...prevFields, fieldId]
        );
    };

    const handleFormChange = (e) => {
        const formId = e.target.value;
        setSelectedForms((prevForms) =>
            prevForms.includes(formId)
                ? prevForms.filter((id) => id !== formId)
                : [...prevForms, formId]
        );
    };

    const handleSaveTemplate = () => {
        const templateData = {
            ...reportTemplates[selectedTemplate],
            selectedForms,
            selectedFields
        };

        saveTemplate(selectedTemplate, templateData);
        setCustomTemplates(getAllTemplates());
        alert("Template saved successfully!");
    };

    const handleDeleteTemplate = (templateName) => {
        if (window.confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
            deleteTemplate(templateName);
            setCustomTemplates(getAllTemplates());
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-100 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Report Template</h3>
            
            <select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                className="w-full p-2 border rounded-lg shadow-sm"
            >
                <optgroup label="Default Templates">
                    {Object.keys(reportTemplates).map((key) => (
                        <option key={key} value={key}>
                            {reportTemplates[key].name}
                        </option>
                    ))}
                </optgroup>
                {Object.keys(customTemplates).length > 0 && (
                    <optgroup label="Saved Templates">
                        {Object.keys(customTemplates).map((key) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </optgroup>
                )}
            </select>

            <div className="mt-4 p-3 bg-white shadow rounded-lg">
                <h4 className="text-md font-bold">
                    {reportTemplates[selectedTemplate]?.name || customTemplates[selectedTemplate]?.name || "Unnamed Template"}
                </h4>
                <p className="text-gray-600">
                    {reportTemplates[selectedTemplate]?.description || customTemplates[selectedTemplate]?.description || "No description available"}
                </p>
            </div>

            <div className="mt-4">
                <h4 className="text-md font-bold">Select Fields</h4>
                {availableFields.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-lg shadow">
                        {availableFields.map((field) => (
                            <label key={field.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={field.id}
                                    checked={selectedFields.includes(field.id)}
                                    onChange={handleFieldChange}
                                    className="form-checkbox"
                                />
                                <span>{field.name}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">Loading fields...</p>
                )}
            </div>

            <div className="flex gap-4 mt-4">
                <button
                    onClick={handleSaveTemplate}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                >
                    Save Template
                </button>
                {selectedTemplate in customTemplates && (
                    <button
                        onClick={() => handleDeleteTemplate(selectedTemplate)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                    >
                        Delete Template
                    </button>
                )}
            </div>
        </div>
    );
};

export default TemplateSelector;
