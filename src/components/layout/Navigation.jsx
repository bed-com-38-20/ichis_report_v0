import React from 'react';
import { NavigationItem } from '@dhis2/ui-widgets'
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <NavigationItem
                label="Home"
                icon="home"
                active={isActive('/')}
                onClick={() => navigate('/')}
            />
            <NavigationItem
                label="Report Builder"
                icon="build"
                active={isActive('/builder')}
                onClick={() => navigate('/builder')}
            />
            <NavigationItem
                label="Saved Templates"
                icon="bookmark"
                active={isActive('/templates')}
                onClick={() => navigate('/templates')}
            />
        </>
    );
};

export default Navigation;