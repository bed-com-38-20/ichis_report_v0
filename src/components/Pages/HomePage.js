import React from 'react';
import { Card, Button } from '@dhis2/ui';
import { useNavigate } from 'react-router-dom';
//import styles from './HomePage.module.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.homeContainer}>
            <h1>DHIS2 Report Builder</h1>
            <p className={styles.subtitle}>Create, customize, and manage your DHIS2 reports</p>
            
            <div className={styles.cardContainer}>
                <Card className={styles.featureCard}>
                    <h3>Create New Report</h3>
                    <p>Build custom reports with drag-and-drop functionality</p>
                    <Button primary onClick={() => navigate('/builder')}>
                        Start Building
                    </Button>
                </Card>
                
                <Card className={styles.featureCard}>
                    <h3>Manage Templates</h3>
                    <p>Save and load report templates for future use</p>
                    <Button onClick={() => navigate('/templates')}>
                        View Templates
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default HomePage;