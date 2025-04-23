import React from 'react';
import i18n from '../locales';
import { Card, IconTable24, IconDocument24, IconHelp24, Button } from '@dhis2/ui';
import { TABLES, REPORTS, HELP } from '../modules/paths';
import './Home.css'; // Import external CSS for grid layout

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">{i18n.t('Welcome to DHIS2 Report Builder')}</h1>
      <div className="grid-container">
        <NavCard
          title={i18n.t('Custom Tables')}
          icon={<IconTable24 />}
          content={i18n.t(
            'Create, view, and edit custom tables. Text and data contents of the table can be chosen on a cell-by-cell basis.'
          )}
          action={i18n.t('View Tables')}
          path={TABLES}
        />
        <NavCard
          title={i18n.t('Custom Reports')}
          icon={<IconDocument24 />}
          content={i18n.t(
            'Create, view, and edit custom reports. Add text, images, and DHIS assets to a printable and downloadable report document.'
          )}
          action={i18n.t('View Reports')}
          path={REPORTS}
        />
        <NavCard
          title={i18n.t('Help')}
          icon={<IconHelp24 />}
          content={i18n.t(
            'View instructions for using the Custom Tables and Custom Reports tools.'
          )}
          action={i18n.t('View Instructions')}
          path={HELP}
        />
      </div>
    </div>
  );
};

// NavCard component styled to match DHIS2
const NavCard = ({ title, icon, content, action, path }) => {
  return (
    <Card className="nav-card">
      <div className="nav-card-content">
        <div className="nav-card-icon">{icon}</div>
        <h3 className="nav-card-title">{title}</h3>
        <p className="nav-card-text">{content}</p>
        <Button primary className="nav-card-button" onClick={() => window.location.href = path}>
          {action}
        </Button>
      </div>
    </Card>
  );
};

export default Home;