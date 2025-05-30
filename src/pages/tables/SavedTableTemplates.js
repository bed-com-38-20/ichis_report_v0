import React, { useState, useEffect } from 'react';
import { Card, NoticeBox } from '@dhis2/ui';
import i18n from '../../locales';
import { useSavedObjectList } from '@dhis2/app-service-datastore';
import { useNavigate } from 'react-router-dom';
import {
    CreateNewTableTemplate,
    SavedTableTemplateActions,
} from './saved-table-templates';
import { defaultTable } from '../../modules/defaultTable';
import classes from './SavedTableTemplates.module.css';
import notificationClasses from './DeleteTableTemplate.module.css'; // Reuse notification CSS
import { EDIT_TABLE, GENERATED_TABLE, getPath } from '../../modules/paths';
import HelpButton from '../../components/HelpButton';
import { CreateExampleTable } from './saved-table-templates/CreateExampleTable';

export function SavedTableTemplates() {
    const navigate = useNavigate();
    const [savedTableTemplates, tableTemplateActions] = useSavedObjectList({
        global: true,
    });
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
    });

    // Auto-dismiss notification after 3 seconds
    useEffect(() => {
        if (notification.isVisible) {
            const timer = setTimeout(() => {
                setNotification({ isVisible: false, message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.isVisible]);

    async function createNew(name) {
        const { id } = await tableTemplateActions.add({ ...defaultTable, name });
        navigate(getPath(EDIT_TABLE, id));
    }

    async function createDemo(exampleTable) {
        const { id } = await tableTemplateActions.add({
            ...exampleTable,
            name: 'Sample Practice Report',
        });
        navigate(getPath(EDIT_TABLE, id));
    }

    async function handleDelete(id) {
        await tableTemplateActions.remove(id);
        setNotification({
            isVisible: true,
            message: i18n.t('Table template deleted successfully'),
        });
    }

    function renderTemplates() {
        if (!savedTableTemplates?.length) {
            return (
                <div className={`${classes.noTemplates} no-templates-styled`}>
                    <p className={`${classes.noTemplatesText} no-templates-text-styled`}>
                        {i18n.t('No reports have been created yet. Start by creating a new report to get started.')}
                    </p>
                    <CreateExampleTable onCreate={createDemo} />
                </div>
            );
        }

        return (
            <div className={classes.grid}>
                {savedTableTemplates.map(template => (
                    <Card key={template.id} className={`${classes.templateCard} template-card-styled`}>
                        <div
                            className={`${classes.cardContent} card-content-styled`}
                            onClick={() => navigate(getPath(EDIT_TABLE, template.id))}
                        >
                            <h3 className={`${classes.templateName} template-name-styled`}>{template.name}</h3>
                            <div
                                className={`${classes.actions} actions-styled`}
                                onClick={e => e.stopPropagation()}
                            >
                                <SavedTableTemplateActions
                                    onGenerate={() =>
                                        navigate(getPath(GENERATED_TABLE, template.id))
                                    }
                                    onEdit={() =>
                                        navigate(getPath(EDIT_TABLE, template.id))
                                    }
                                    onDelete={() => handleDelete(template.id)}
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className={`${classes.container} saved-templates-container`}>
            <header className={`${classes.header} header-styled`}>
                <h1 className={`${classes.headerTitle} header-title-styled`}>{i18n.t('Saved Reports')}</h1>
                <div className={classes.headerActions}>
                    <CreateNewTableTemplate createNew={createNew} savedTableTemplates={savedTableTemplates} />
                    <HelpButton subsection="#saved-tables" />
                </div>
            </header>
            <main className={`${classes.main} main-styled`}>
                {renderTemplates()}
            </main>
            {notification.isVisible && (
                <div className={notificationClasses.notification}>
                    <NoticeBox title={i18n.t('Success')}>
                        {notification.message}
                    </NoticeBox>
                </div>
            )}
            <style jsx>{`
                /* Override background to white */
                :global(.saved-templates-container) {
                    background-color: white !important;
                    background-image: none !important;
                    min-height: 100vh;
                    padding: 0;
                }

                /* Header styling with white background */
                :global(.header-styled) {
                    background: white !important;
                    background-image: none !important;
                    color: #1a202c !important;
                    border-bottom: 3px solid #e2e8f0 !important;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                }

                /* Header title bright and visible */
                :global(.header-title-styled) {
                    color: #1a365d !important;
                    font-weight: 700 !important;
                    font-size: 2rem !important;
                    text-shadow: none !important;
                }

                /* Main content area */
                :global(.main-styled) {
                    background-color: white !important;
                    padding: 2rem !important;
                }

                /* Template cards with enhanced styling */
                :global(.template-card-styled) {
                    background-color: white !important;
                    border: 2px solid #e2e8f0 !important;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07) !important;
                    transition: all 0.3s ease !important;
                }

                :global(.template-card-styled:hover) {
                    border-color: #3182ce !important;
                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
                    transform: translateY(-2px) !important;
                }

                /* Card content styling */
                :global(.card-content-styled) {
                    padding: 1.5rem !important;
                    background-color: white !important;
                }

                /* Report/Table name - BRIGHT AND VISIBLE */
                :global(.template-name-styled) {
                    color: #1a202c !important;
                    font-weight: 700 !important;
                    font-size: 1.5rem !important;
                    margin-bottom: 1rem !important;
                    text-shadow: none !important;
                    line-height: 1.3 !important;
                    word-wrap: break-word !important;
                    white-space: normal !important;
                    overflow: visible !important;
                    text-overflow: unset !important;
                }

                /* Actions styling */
                :global(.actions-styled) {
                    margin-top: auto !important;
                    padding-top: 1rem !important;
                    border-top: 1px solid #f7fafc !important;
                }

                /* No templates section */
                :global(.no-templates-styled) {
                    background-color: #f8fafc !important;
                    border: 2px dashed #cbd5e0 !important;
                    color: #2d3748 !important;
                    padding: 3rem !important;
                    border-radius: 12px !important;
                }

                :global(.no-templates-text-styled) {
                    color: #4a5568 !important;
                    font-size: 1.1rem !important;
                    font-weight: 500 !important;
                    line-height: 1.6 !important;
                }

                /* Ensure all text is dark and readable */
                :global(.saved-templates-container *) {
                    color: #2d3748;
                }

                /* Button styling in header */
                :global(.saved-templates-container .header-styled button) {
                    font-weight: 600 !important;
                    border: 1px solid #e2e8f0 !important;
                }

                /* Grid styling */
                :global(.saved-templates-container .grid) {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    :global(.header-title-styled) {
                        font-size: 1.75rem !important;
                    }
                    
                    :global(.template-name-styled) {
                        font-size: 1.25rem !important;
                    }
                    
                    :global(.main-styled) {
                        padding: 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
}

SavedTableTemplates.propTypes = {};

export default SavedTableTemplates;