import React from 'react'
import { useDataEngine } from '@dhis2/app-runtime'

/**
 * DataEngine component that provides the DHIS2 data engine to child components
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Function that receives the engine as a parameter
 * @returns {React.ReactElement} The rendered children with engine prop
 */
const DataEngine = ({ children }) => {
    // Get the data engine from the DHIS2 app-runtime
    const engine = useDataEngine()
    
    // Log engine for debugging
    console.log('DataEngine component - engine value:', engine)
    
    // Check if the children prop is a function
    if (typeof children !== 'function') {
        console.error('DataEngine requires a function as children')
        return (
            <div style={{ color: 'red', padding: '20px' }}>
                Configuration error: DataEngine requires a function as children
            </div>
        )
    }
    
    // Call the children function with the engine
    return children(engine)
}

export default DataEngine