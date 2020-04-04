// Меню. Синяя полоска вверху экрана
import React, { useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
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
import Input from '../auxiliaryComponents/Input.jsx';
import { getExcelAction } from '../api/api';

const useStyles = makeStyles((theme) => createStyles({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  menuRoot: {
    backgroundColor: '#56CEF7',
    minHeight: 128,
  },
}));

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

const Menu = ({
  open, openPanel, openModalAction, openModalOrder, dispatch, typeMenu,
}) => {
  const { pathname } = useLocation();
  const [state, stateDispatch] = useReducer(reducer, initialState);
  const classes = useStyles();
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
                const filter = {};
                if (state.accused) filter.accused = state.accused;
                if (state.date && new Date(state.date).toString() !== 'Invalid Date') filter.date = beginDateZeroTime(state.date);
                if (state.number) filter.number = state.number;
                if (state.creationNumber) filter.creationNumber = state.creationNumber;
                if (typeMenu === 'orders' || (typeMenu === null && pathname === '/orders')) {
                  if (state.jurist) filter.jurist = state.jurist;
                  if (state.actionString) filter.actionString = state.actionString;
                }
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
              onClick={() => getExcelAction('123456789').subscribe((response) => console.log(response))}
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
  open: PropTypes.bool,
  openPanel: PropTypes.func,
  openModalAction: PropTypes.func,
  openModalOrder: PropTypes.func,
  dispatch: PropTypes.func,
  typeMenu: PropTypes.string,
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
