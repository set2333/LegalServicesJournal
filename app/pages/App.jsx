// Основная страница.
import React, { useState, useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import clsx from 'clsx';
import {
  AppBar, IconButton, Drawer, CssBaseline, Divider,
} from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import Nav from '../components/Nav';
import Menu from '../components/Menu';
import Actions from '../components/Actions';
import Orders from '../components/Orders';
import { useModalAction, useModalOrder } from '../components/ModalWindow';
import { endDay, agoMonth } from '../functions/dateFunction';
import MakeStyles from '../styles';

const useStyles = MakeStyles;

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...action.value };
    default:
      return { ...state };
  }
};

// В состоянии хранятся фильтры для списка дел/ордеров.
// startDate - дата создания с которой ищем дела/ордера
// endDate- дата создания по которую ищем дела/ордера
// filter - объект-фильтр для поиска дел.
const initialState = {
  startDate: agoMonth(Date.now()),
  endDate: endDay(Date.now()),
  filter: {},
};

function App() {
  const [open, setOpen] = useState(false); // Панель навигации - открыта/закрыта
  const classes = useStyles(); // Стили
  const [ModalAction, openModalAction] = useModalAction(); // Подключим модальное окно с делом
  const [ModaOrder, openModalOrder] = useModalOrder(); // Подключим модальное окно с ордером
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
