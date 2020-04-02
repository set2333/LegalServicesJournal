// Меню. Синяя полоска вверху экрана
import React, { useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Toolbar, IconButton, Typography, TextField,
} from '@material-ui/core';
import { Menu as MenuIcon, AddCircleOutline, Search } from '@material-ui/icons';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => createStyles({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  menuRoot: {
    backgroundColor: '#56CEF7',
  },
  textFilter: {
    marginLeft: 5,
    marginRight: 5,
  },
}));

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_START_DATE':
      return { ...state, startDate: action.value };
    case 'SET_END_DATE':
      return { ...state, endDate: action.value };
    case 'SET_DATE':
      return { ...state, date: action.value };
    case 'SET_NUMBER':
      return { ...state, number: action.value };
    case 'SET_CREATION_NUMBER':
      return { ...state, creationNumber: action.value };
    case 'SET_ACCUSED':
      return { ...state, accused: action.value };
    case 'SET_JURIST':
      return { ...state, jurist: action.value };
    case 'SET_ACTION':
      return { ...state, action: action.value };
    default:
      return { ...state };
  }
};

const initialState = {
  startDate: new Date(),
  endDate: new Date(),
  date: '',
  number: '',
  creationNumber: '',
  accused: '',
  jurist: '',
  action: '',
};

const TextFilter = ({
  label, dispatch, typeDispatch, valueFilter, typeFilter,
}) => {
  const classes = useStyles();
  if (typeFilter === 'date') {
    return (
      <>
        <TextField
          className={classes.textFilter}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          size="small"
          label={label}
          value={valueFilter}
          onChange={({ target: { value } }) => dispatch({ type: typeDispatch, value })}
        />
      </>
    );
  }
  return (
    <>
      <TextField
        className={classes.textFilter}
        variant="outlined"
        size="small"
        label={label}
        value={valueFilter}
        onChange={({ target: { value } }) => dispatch({ type: typeDispatch, value })}
      />
    </>
  );
};

const Menu = ({
  open, openPanel, openModalAction, openModalOrder, dispatch,
}) => {
  const { pathname } = useLocation();
  const [state, stateDispatch] = useReducer(reducer, initialState);
  const classes = useStyles();
  const filters = [
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

  if (pathname === '/orders') {
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
      valueFilter: state.action,
      typeFilter: 'text',
    });
  }
  return (
    <Toolbar className={classes.menuRoot}>
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
        {pathname === '/' ? 'Дела за период с' : 'Ордера за период с'}
      </Typography>
      {filters.map((item) => (
        <TextFilter
          label={item.label}
          dispatch={item.dispatch}
          typeDispatch={item.typeDispatch}
          valueFilter={item.valueFilter}
          typeFilter={item.typeFilter}
        />
      ))}
      <IconButton
        onClick={() => {
          const filter = {};
          if (state.accused) filter.accused = state.accused;
          if (state.date) filter.date = state.date;
          if (state.number) filter.number = state.number;
          if (state.creationNumber) filter.creationNumber = state.creationNumber;
          if (pathname === '/orders') {
            if (state.jurist) filter.jurist = state.jurist;
            if (state.action) filter.action = state.action;
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
  openModalAction: PropTypes.func,
  openModalOrder: PropTypes.func,
  dispatch: PropTypes.func,
};

Menu.defaultProps = {
  open: true,
  openPanel: () => {},
  openModalAction: () => {},
  openModalOrder: () => {},
  dispatch: () => {},
};

TextFilter.propTypes = {
  label: PropTypes.string,
  dispatch: PropTypes.func,
  typeDispatch: PropTypes.string,
  valueFilter: PropTypes.string,
  typeFilter: PropTypes.string,
};

TextFilter.defaultProps = {
  label: '',
  dispatch: () => {},
  typeDispatch: '',
  valueFilter: '',
  typeFilter: '',
};

export default Menu;
