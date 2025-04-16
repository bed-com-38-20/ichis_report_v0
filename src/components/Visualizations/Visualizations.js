// import React from 'react';
import { Button } from '@dhis2/ui';
import './Visualizations.css';

const Visualizations = ({ reportConfig, setReportConfig }) => {
    return (
        <div className="visualizations">
            <h3>Visualizations</h3>
            <p>
                Visual elements (charts, graphs, etc.) will be displayed here.
            </p>
            {/* Example button to simulate a visualization affecting report configuration */}
            <Button
                onClick={() =>
                    setReportConfig(prev => ({
                        ...prev,
                        title: 'Title Updated from Visualizations'
                    }))
                }
            >
                Update Title via Visualizations
            </Button>
        </div>
    );
};

export default Visualizations;
