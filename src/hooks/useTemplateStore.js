import { useDataEngine } from '@dhis2/app-runtime';

const NAMESPACE = 'reportBuilder';
const KEY = 'savedTemplates';

export const useTemplateStore = () => {
    const engine = useDataEngine();

    const loadTemplates = async () => {
        try {
            const result = await engine.query({
                templates: {
                    resource: `dataStore/${NAMESPACE}/${KEY}`,
                },
            });
            console.log("Loaded raw result from DataStore:", result);
            return result.templates;
        } catch (error) {
            if (error?.details?.httpStatusCode === 404 || error?.status === 404) {
                // If the key or namespace doesn't exist, return an empty array
                return [];
            }
            console.error("Failed to load templates:", error);
            throw error;
        }
    };

    const saveTemplates = async (templates) => {
        try {
            await engine.mutate({
                type: 'update',
                resource: `dataStore/${NAMESPACE}/${KEY}`,
                data: templates,
            });
        } catch (error) {
            if (error?.details?.httpStatusCode === 404 || error?.status === 404) {
                // If the key doesn't exist yet, create it
                await engine.mutate({
                    type: 'create',
                    resource: `dataStore/${NAMESPACE}/${KEY}`,
                    data: templates,
                });
            } else {
                console.error("Failed to save templates:", error);
                throw error;
            }
        }
    };

    const deleteTemplate = async (templateId) => {
        const existingTemplates = await loadTemplates();
        const updatedTemplates = existingTemplates.filter(t => t.id !== templateId);
        await saveTemplates(updatedTemplates);
        return updatedTemplates;
    };

    return {
        loadTemplates,
        saveTemplates,
        deleteTemplate,
    };
};
