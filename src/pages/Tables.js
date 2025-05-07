import React from 'react'
import PropTypes from 'prop-types'
import { DataStoreProvider } from '@dhis2/app-service-datastore'
import {
    EditTableTemplate,
    SavedTableTemplates,
    GeneratedTable,
} from './tables/index'
import { TableProvider } from '../context/tableContext'
import NoMatch from './NoMatch'
import { Routes, Route, useParams } from 'react-router-dom'


const EditTableWrapper = () => {
    const { id } = useParams()
    return (
        <TableProvider id={id}>
            <EditTableTemplate />
        </TableProvider>
    )
}

const GeneratedTableWrapper = () => {
    const { id } = useParams()
    return (
        <TableProvider id={id}>
            <GeneratedTable />
        </TableProvider>
    )
}

export function Tables() {
    return (
        <DataStoreProvider namespace="tableTemplates">
            <Routes> 
                <Route path="edit/:id" element={<EditTableWrapper />} /> 
                <Route path="generated/:id" element={<GeneratedTableWrapper />} />
                <Route path="/" element={<SavedTableTemplates />} />
                <Route path="*" element={<NoMatch />} /> 
            </Routes>
        </DataStoreProvider>
    )
}

Tables.propTypes = {
    match: PropTypes.shape({ url: PropTypes.string }), 
}

export default Tables
