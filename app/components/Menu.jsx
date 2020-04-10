// Меню. Синяя полоска вверху экрана
import React, { useReducer } from 'react';
import {
  Toolbar, IconButton, Typography, Grid,
} from '@material-ui/core';
import { AddCircleOutline, Search, BackupOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types';
import {
  beginDay, endDay, agoMonth, beginDateZeroTime,
} from '../functions/dateFunction';
import Filters from '../auxiliaryComponents/Filters';
import Periods from '../auxiliaryComponents/Periods';
import { getExcelActions } from '../api/api';
import MakeStyles from '../styles';
import { areEqualMenu } from '../functions/memoFunction';

const useStyles = MakeStyles;

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_START_DATE':
      return { ...state, startDate: beginDay(action.value) };
    case 'SET_END_DATE':
      return { ...state, endDate: endDay(action.value) };
    case 'SET_DATE':
      return { ...state, date: beginDay(action.value) };
    case 'SET_NUMBER':
      return { ...state, number: action.value };
    case 'SET_CREATION_NUMBER':
      return { ...state, creationNumber: action.value };
    case 'SET_ACCUSED':
      return { ...state, accused: action.value };
    case 'SET_JURIST':
      return { ...state, jurist: action.value };
    default:
      return { ...state };
  }
};

// Состояние содержит фильтры для поиска. При нажатии на кнопку поиски эти данные оборачиваются
// в объект фильтр и дисптчатся в App.jsx. Там происходит обновление состояния и меняются пропсы в
// Actions.jsx или Orders.jsx, а те в свою очередь получают данные по новым фильтрам через API.
const initialState = {
  startDate: agoMonth(Date.now()),
  endDate: endDay(Date.now()),
  date: '',
  number: '',
  creationNumber: '',
  accused: '',
  jurist: '',
};

// Функция получения объекта фильтра для его диспатча в родительский компонент. Так как может
// вызыватся на разных страницах (дела, ордера) то и возвращает разные объекты. Например что бы
// не фильтровать дела по полю юрист, которого в делах нет.
const getFilter = (state) => {
  const filter = {};
  if (state.accused) filter.accused = state.accused;
  if (state.date && new Date(state.date).toString() !== 'Invalid Date') filter.date = beginDateZeroTime(state.date);
  if (state.number) filter.number = state.number;
  if (state.creationNumber) filter.creationNumber = state.creationNumber;
  if (state.jurist) filter.jurist = state.jurist;
  return filter;
};

const getFileFromServer = (response) => {
  if (response.result) {
    window.open(`http://${window.location.host}/getFile?fileName=${response.fileName}`, '_self');
  }
};

const Menu = React.memo(({ openModalAction, dispatch, typeMenu }) => {
  const [state, stateDispatch] = useReducer(reducer, initialState);
  const classes = useStyles();
  // Функция поиска по фильтрам. Вызывается по кнопке поиск или по Enter-у в полях фильтров
  const onClickFilter = () => {
    const filter = getFilter(state, typeMenu);
    dispatch({
      type: 'SET_FILTER',
      value: { startDate: state.startDate, endDate: state.endDate, filter },
    });
  };
  return (
    <Toolbar className={classes.menuRoot}>
      <Grid container direction="column" justify="flex-start" alignItems="stretch">
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid>
            <Typography variant="h6" noWrap>
              Дела за период
            </Typography>
          </Grid>
          <Periods state={state} dispatch={stateDispatch} keyPress={onClickFilter} />
          <Grid>
            <IconButton onClick={onClickFilter}>
              <Search style={{ color: '#000000', fontSize: 48 }} />
            </IconButton>
            <IconButton onClick={() => openModalAction({ open: true, id: null })}>
              <AddCircleOutline style={{ color: '#000000', fontSize: 48 }} />
            </IconButton>
            <IconButton
              onClick={() => {
                const filter = getFilter(state, typeMenu);
                getExcelActions({
                  startDate: new Date(state.startDate),
                  endDate: new Date(state.endDate),
                  filter,
                }).subscribe(getFileFromServer);
              }}
            >
              <BackupOutlined style={{ color: '#000000', fontSize: 48 }} />
            </IconButton>
          </Grid>
        </Grid>
        <Filters state={state} dispatch={stateDispatch} keyPress={onClickFilter} />
      </Grid>
    </Toolbar>
  );
}, areEqualMenu);

Menu.propTypes = {
  openModalAction: PropTypes.func, // Открытие модального окна с делом
  dispatch: PropTypes.func, // Функция которая диспатчит фильтр в родительский компонент
  typeMenu: PropTypes.string, // тип меню (orders, actions или null). Если null то тип меню берется
  // из const { pathname } = useLocation(); В этом случае у нас просто список ордеров или дел.
  // Если тип указан, то мы находимся в модальной форме выбора дела, которая вызывается из модальной
  // формы создания или редактирования ордера.
};

Menu.defaultProps = {
  openModalAction: () => {},
  dispatch: () => {},
  typeMenu: null,
};

export default React.memo(Menu);
