import React from 'react';
//import Layout, { Navigation } from '@dhis2/ui';
import Navigation from './Navigation';
import styles from './AppLayout.module.css';

const AppLayout = ({ children }) => {
    return (
        <div className={styles.container}>
            <Layout>
                <Navigation />
                <main className={styles.mainContent}>
                    {children}
                </main>
            </Layout>
        </div>
    );
};

export default AppLayout;