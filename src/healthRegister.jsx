import { useDataQuery } from '@dhis2/app-runtime'
import React from 'react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const query = {
    healthRegister: {
        resource: 'dataValueSets',
        params: {
            dataSet: 'i will update later evan hahahah', 
            orgUnit: 'easy bro will come back to you another time', 
            period: '202403', 
        },
    },
}

const HealthRegister = () => {
    const { error, loading, data } = useDataQuery(query)

    if (error) {
        return <span>Error fetching data</span>
    }

    if (loading) {
        return <span>Loading health register...</span>
    }

    const generatePDF = () => {
        const doc = new jsPDF()
        doc.text('Health Register Report', 14, 10)
        doc.autoTable({
            head: [['Data Element', 'Value']],
            body: data.healthRegister.dataValues.map((item) => [
                item.dataElement,
                item.value,
            ]),
        })
        doc.save('health_register.pdf')
    }

    return (
        <div>
            <h2>Health Register</h2>
            <button onClick={generatePDF}>Download PDF</button>
            <table border="1">
                <thead>
                    <tr>
                        <th>Data Element</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.healthRegister.dataValues.map((item) => (
                        <tr key={item.dataElement}>
                            <td>{item.dataElement}</td>
                            <td>{item.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default HealthRegister
