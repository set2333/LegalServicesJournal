import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@material-ui/core';

const Nav = () => {
  const { pathname } = useLocation();
  return (
    <List component="nav">
      <ListItem button selected={pathname === '/'}>
        <Link to="/">
          <ListItemText>Дела</ListItemText>
        </Link>
      </ListItem>
      <ListItem button selected={pathname === '/orders'}>
        <Link to="/orders">
          <ListItemText>Ордера</ListItemText>
        </Link>
      </ListItem>
    </List>
  );
};

export default Nav;
