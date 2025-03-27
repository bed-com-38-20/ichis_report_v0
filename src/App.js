import { useDataQuery } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import React from 'react';
import classes from './App.module.css';
import DataElementsList from './dataElementList';
import TemplateDesigner from './components/TemplateDesigner';
import ReportDesigner from './components/ReportDesigner';



const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => {
    const { error, loading, data } = useDataQuery(query)

    if (error) {
        return <span>{i18n.t('ERROR')}</span>
    }

    if (loading) {
        return <span>{i18n.t('Loading...')}</span>
    }

    return (
        <div className={classes.container}>
            <h1>DHIS2 Custom Report & Template Designer</h1>
           
            <TemplateDesigner />
            <ReportDesigner />
        </div>
    )
}

export default MyApp
