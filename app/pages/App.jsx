import React, { useState, useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  AppBar, IconButton, Drawer, CssBaseline, Divider,
} from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import Nav from '../components/Nav.jsx';
import Menu from '../components/Menu.jsx';
import Actions from '../components/Actions.jsx';
import Orders from '../components/Orders.jsx';
import { useModalAction, useModalOrder } from '../components/ModalWindow.jsx';
import { endDay, agoMonth } from '../functions/dateFunction';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(8),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...action.value };
    default:
      return { ...state };
  }
};

const initialState = {
  startDate: agoMonth(Date.now()),
  endDate: endDay(Date.now()),
  filter: {},
};

function App() {
  const [open, setOpen] = useState(false); // Панель навигации - открыта/закрыта
  const classes = useStyles();
  const [ModalAction, openModalAction] = useModalAction();
  const [ModaOrder, openModalOrder] = useModalOrder();
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className={classes.root}>
      <ModalAction />
      <ModaOrder />
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Menu
          open={open}
          openPanel={setOpen}
          openModalAction={openModalAction}
          openModalOrder={openModalOrder}
          dispatch={dispatch}
        />
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <Nav />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <div>
          <Switch>
            <Route
              exact
              path="/"
              component={() => Actions({
                ...state,
                clickRow: (value) => openModalAction({ open: true, id: value }),
              })}
            />
            <Route
              path="/orders"
              component={() => Orders({
                ...state,
                clickRow: (value) => openModalOrder({ open: true, id: value }),
              })}
            />
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default App;
