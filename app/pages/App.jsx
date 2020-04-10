// Основная страница.
import React, { useReducer } from 'react';
import clsx from 'clsx';
import { AppBar, CssBaseline } from '@material-ui/core';
import uid from 'uid';
import Menu from '../components/Menu';
import Actions from '../components/Actions';
import useModalAction from '../components/ModalWindow';
import { endDay, agoMonth } from '../functions/dateFunction';
import MakeStyles from '../styles';

const useStyles = MakeStyles;

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...action.value, uid: state.uid };
    case 'SET_UID':
      return { ...state, uid: action.value };
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
  uid: uid(),
};

function App() {
  const classes = useStyles(); // Стили
  const [state, dispatch] = useReducer(reducer, initialState);
  const [ModalAction, openModalAction] = useModalAction((newUid) => dispatch({ type: 'SET_UID', value: newUid })); // Подключим модальное окно с делом
  return (
    <div className={classes.root} id="main_div">
      <ModalAction />
      <CssBaseline />
      <AppBar position="fixed" className={clsx(classes.appBar)}>
        <Menu openModalAction={openModalAction} dispatch={dispatch} />
      </AppBar>
      <main className={clsx(classes.content)}>
        <div className={classes.drawerHeader} />
        <div>
          <Actions
            startDate={state.startDate}
            endDate={state.endDate}
            filter={state.filter}
            clickRow={(value) => openModalAction({ open: true, id: value })}
            uid={state.uid}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
