// Меню. Синяя полоска вверху экрана
import React from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Toolbar, IconButton, Typography } from '@material-ui/core';
import { Menu as MenuIcon, AddCircleOutline } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { useModalAction, useModalOrder } from './ModalWindow.jsx';

const useStyles = makeStyles((theme) => createStyles({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
}));

const Menu = ({ open, openPanel }) => {
  const { pathname } = useLocation();
  const classes = useStyles();
  const [ModalAction, openModalAction] = useModalAction();
  const [ModaOrder, openModalOrder] = useModalOrder();
  return (
    <Toolbar>
      <ModalAction />
      <ModaOrder />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => openPanel(true)}
        edge="start"
        className={clsx(classes.menuButton, open && classes.hide)}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap>
        {pathname === '/' ? 'Дела' : 'Ордера'}
      </Typography>
      <IconButton
        onClick={() => {
          if (pathname === '/') openModalAction();
          else openModalOrder();
        }}
      >
        <AddCircleOutline style={{ color: '#000000', fontSize: 48 }} />
      </IconButton>
    </Toolbar>
  );
};

Menu.propTypes = {
  open: PropTypes.bool,
  openPanel: PropTypes.func,
};

Menu.defaultProps = {
  open: true,
  openPanel: () => {},
};

export default Menu;
