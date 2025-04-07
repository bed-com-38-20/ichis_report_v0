import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, MenuItem } from '@dhis2/ui';

const Navigation = () => {
  return (
    <Menu>
      <MenuItem
        label="Custom Tables"
        component={NavLink}
        to="/custom-tables"
        activeClassName="active"
        dataTest="nav-tables"
      />
      <MenuItem
        label="Custom Reports"
        component={NavLink}
        to="/custom-reports"
        activeClassName="active"
        dataTest="nav-reports"
      />
      <MenuItem
        label="Help"
        component={NavLink}
        to="/help"
        activeClassName="active"
        dataTest="nav-help"
      />
    </Menu>
  );
};

export default Navigation;