import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    dataElements: {
        resource: 'dataElements',
    },
}

const DataElementsList = () => {
    const { error, loading, data } = useDataQuery(query)

    if (error) return <span>Error: {error.message}</span>
    if (loading) return <span>Loading...</span>

    return (
        <ul>
            {data.dataElements.dataElements.map((item) => (
                <li key={item.id}>{item.displayName}</li>
            ))}
        </ul>
    )
}

export default DataElementsList
