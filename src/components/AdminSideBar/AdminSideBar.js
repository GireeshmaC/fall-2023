// AdminSidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';

function AdminSidebar() {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <Link to="/admin" style={{ textDecoration: 'none' }}>
          <ListItem button>
            <ListItemText primary="Users" />
          </ListItem>
        </Link>
        {/* Add more sidebar links here */}
      </List>
    </Drawer>
  );
}

export default AdminSidebar;
