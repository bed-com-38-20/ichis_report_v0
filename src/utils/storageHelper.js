// utils/storageHelper.js

// Key for storing report templates in localStorage
const STORAGE_KEY = "savedTemplates";

/**
 * Save a template to localStorage.
 * @param {string} templateName - Name of the template.
 * @param {object} templateData - The template configuration to save.
 */
export const saveTemplate = (templateName, templateData) => {
    try {
        let templates = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        templates[templateName] = templateData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
        console.error("Error saving template to localStorage:", error);
    }
};

/**
 * Load a template from localStorage.
 * @param {string} templateName - Name of the template to retrieve.
 * @returns {object|null} - The template configuration or null if not found.
 */
export const loadTemplate = (templateName) => {
    try {
        const templates = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        return templates[templateName] || null;
    } catch (error) {
        console.error("Error loading template from localStorage:", error);
        return null;
    }
};

/**
 * Get all saved templates from localStorage.
 * @returns {object} - All saved templates.
 */
export const getAllTemplates = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (error) {
        console.error("Error retrieving templates from localStorage:", error);
        return {};
    }
};

/**
 * Delete a specific template from localStorage.
 * @param {string} templateName - Name of the template to delete.
 */
export const deleteTemplate = (templateName) => {
    try {
        let templates = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        if (templates[templateName]) {
            delete templates[templateName];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        }
    } catch (error) {
        console.error("Error deleting template from localStorage:", error);
    }
};

/**
 * Clear all templates from localStorage.
 */
export const clearAllTemplates = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing templates from localStorage:", error);
    }
};
