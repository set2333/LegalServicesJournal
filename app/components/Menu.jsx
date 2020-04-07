// Меню. Синяя полоска вверху экрана
import React, { useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  Toolbar, IconButton, Typography, Grid,
} from '@material-ui/core';
import {
  Menu as MenuIcon, AddCircleOutline, Search, BackupOutlined,
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import {
  beginDay, endDay, agoMonth, beginDateZeroTime,
} from '../functions/dateFunction';
import Input from '../auxiliaryComponents/Input';
import { getExcelActions, getExcelOrders } from '../api/api';
import MakeStyles from '../styles';

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
    case 'SET_ACTION':
      return { ...state, actionString: action.value };
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
  actionString: '',
};

// Функция получения объекта фильтра для его диспатча в родительский компонент. Так как может
// вызыватся на разных страницах (дела, ордера) то и возвращает разные объекты. Например что бы
// не фильтровать дела по полю юрист, которого в делах нет.
const getFilter = (state, typeMenu, pathname) => {
  const filter = {};
  if (state.accused) filter.accused = state.accused;
  if (state.date && new Date(state.date).toString() !== 'Invalid Date') filter.date = beginDateZeroTime(state.date);
  if (state.number) filter.number = state.number;
  if (state.creationNumber) filter.creationNumber = state.creationNumber;
  if (typeMenu === 'orders' || (typeMenu === null && pathname === '/orders')) {
    if (state.jurist) filter.jurist = state.jurist;
    if (state.actionString) filter.actionString = state.actionString;
  }
  return filter;
};

const getFileFromServer = (response) => {
  if (response.result) {
    window.open(`http://${window.location.host}/getFile?fileName=${response.fileName}`, '_self');
  }
};

const Menu = ({
  open, openPanel, openModalAction, openModalOrder, dispatch, typeMenu,
}) => {
  const { pathname } = useLocation();
  const [state, stateDispatch] = useReducer(reducer, initialState);
  const classes = useStyles();
  // Поля ввода выводятся с помощью компонента Input. Подготовим массивы объектов для вывода
  // Массив выбора периода. Выводится во всех вариантах меню
  const periods = [
    {
      label: 'Начало периода',
      dispatch: stateDispatch,
      typeDispatch: 'SET_START_DATE',
      valueFilter: state.startDate,
      typeFilter: 'date',
    },
    {
      label: 'Конец периода',
      dispatch: stateDispatch,
      typeDispatch: 'SET_END_DATE',
      valueFilter: state.endDate,
      typeFilter: 'date',
    },
  ];
  // Массив общих фильтров
  const filters = [
    {
      label: 'Номер',
      dispatch: stateDispatch,
      typeDispatch: 'SET_CREATION_NUMBER',
      valueFilter: state.creationNumber,
      typeFilter: 'text',
    },
    {
      label: 'Дата постановления',
      dispatch: stateDispatch,
      typeDispatch: 'SET_DATE',
      valueFilter: state.date,
      typeFilter: 'date',
    },
    {
      label: 'Номер постановления',
      dispatch: stateDispatch,
      typeDispatch: 'SET_NUMBER',
      valueFilter: state.number,
      typeFilter: 'text',
    },
    {
      label: 'Обвиняемый',
      dispatch: stateDispatch,
      typeDispatch: 'SET_ACCUSED',
      valueFilter: state.accused,
      typeFilter: 'text',
    },
  ];

  // Если меню находится на странице с ордерами, добавим в массив фильтров спецефичные фильтры
  if (typeMenu === 'orders' || (typeMenu === null && pathname === '/orders')) {
    filters.push({
      label: 'Адвокат',
      dispatch: stateDispatch,
      typeDispatch: 'SET_JURIST',
      valueFilter: state.jurist,
      typeFilter: 'text',
    });
    filters.push({
      label: 'Дело',
      dispatch: stateDispatch,
      typeDispatch: 'SET_ACTION',
      valueFilter: state.actionString,
      typeFilter: 'text',
    });
  }
  return (
    <Toolbar className={classes.menuRoot}>
      <Grid>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => openPanel(true)}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
      </Grid>
      <Grid container direction="column" justify="flex-start" alignItems="stretch">
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid>
            <Typography variant="h6" noWrap>
              {typeMenu === 'actions' || (typeMenu === null && pathname === '/')
                ? 'Дела за период '
                : 'Ордера за период '}
            </Typography>
          </Grid>
          <Grid>
            {periods.map((item) => (
              <Input
                label={item.label}
                dispatch={item.dispatch}
                dispatchType={item.typeDispatch}
                inputValue={item.valueFilter}
                inputType={item.typeFilter}
              />
            ))}
          </Grid>
          <Grid>
            <IconButton
              onClick={() => {
                const filter = getFilter(state, typeMenu, pathname);
                dispatch({
                  type: 'SET_FILTER',
                  value: { startDate: state.startDate, endDate: state.endDate, filter },
                });
              }}
            >
              <Search style={{ color: '#000000', fontSize: 48 }} />
            </IconButton>
            <IconButton
              onClick={() => {
                if (typeMenu === 'actions' || (typeMenu === null && pathname === '/')) openModalAction({ open: true, id: null });
                else openModalOrder({ open: true, id: null });
              }}
            >
              <AddCircleOutline style={{ color: '#000000', fontSize: 48 }} />
            </IconButton>
            <IconButton
              onClick={() => {
                const filter = getFilter(state, typeMenu, pathname);
                if (pathname === '/') {
                  getExcelActions({
                    startDate: new Date(state.startDate),
                    endDate: new Date(state.endDate),
                    filter,
                  }).subscribe(getFileFromServer);
                } else {
                  getExcelOrders({
                    startDate: new Date(state.startDate),
                    endDate: new Date(state.endDate),
                    filter,
                  }).subscribe(getFileFromServer);
                }
              }}
            >
              <BackupOutlined style={{ color: '#000000', fontSize: 48 }} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid>
            <Typography variant="h6">Филтры</Typography>
          </Grid>
          <Grid>
            {filters.map((item) => (
              <Input
                label={item.label}
                dispatch={item.dispatch}
                dispatchType={item.typeDispatch}
                inputValue={item.valueFilter}
                inputType={item.typeFilter}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

Menu.propTypes = {
  open: PropTypes.bool, // Признак открытости бокового меню
  openPanel: PropTypes.func, // Открытие бокового меню
  openModalAction: PropTypes.func, // Открытие модального окна с делом
  openModalOrder: PropTypes.func, // Открытие модального окна с ордером
  dispatch: PropTypes.func, // Функция которая диспатчит фильтр в родительский компонент
  typeMenu: PropTypes.string, // тип меню (orders, actions или null). Если null то тип меню берется
  // из const { pathname } = useLocation(); В этом случае у нас просто список ордеров или дел.
  // Если тип указан, то мы находимся в модальной форме выбора дела, которая вызывается из модальной
  // формы создания или редактирования ордера.
};

Menu.defaultProps = {
  open: true,
  openPanel: () => {},
  openModalAction: () => {},
  openModalOrder: () => {},
  dispatch: () => {},
  typeMenu: null,
};

export default Menu;
