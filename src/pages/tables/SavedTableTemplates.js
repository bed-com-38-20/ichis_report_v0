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
            name: 'Demo Table',
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
                <div className={classes.noTemplates}>
                    <p className={classes.noTemplatesText}>
                        {i18n.t('No tables have been created yet.')}
                    </p>
                    <CreateExampleTable onCreate={createDemo} />
                </div>
            );
        }

        return (
            <div className={classes.grid}>
                {savedTableTemplates.map(template => (
                    <Card key={template.id} className={classes.templateCard}>
                        <div
                            className={classes.cardContent}
                            onClick={() => navigate(getPath(EDIT_TABLE, template.id))}
                        >
                            <h3 className={classes.templateName}>{template.name}</h3>
                            <div
                                className={classes.actions}
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
        <div className={classes.container}>
            <header className={classes.header}>
                <h1 className={classes.headerTitle}>{i18n.t('Saved Reports')}</h1>
                <div className={classes.headerActions}>
                    <CreateNewTableTemplate createNew={createNew} />
                    <HelpButton subsection="#saved-tables" />
                </div>
            </header>
            <main className={classes.main}>
                {renderTemplates()}
            </main>
            {notification.isVisible && (
                <div className={notificationClasses.notification}>
                    <NoticeBox title={i18n.t('Success')}>
                        {notification.message}
                    </NoticeBox>
                </div>
            )}
        </div>
    );
}

SavedTableTemplates.propTypes = {};

export default SavedTableTemplates;