// Фильтры для меню
import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Grid, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { getInputDate } from '../functions/dateFunction';

const useStyles = makeStyles(() => createStyles({
  textFilter: {
    marginLeft: 5,
    marginRight: 5,
  },
}));

const Filters = React.memo(({ state, dispatch, keyPress }) => {
  const classes = useStyles();
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Grid>
        <Typography variant="h6">Фильтры</Typography>
      </Grid>
      <Grid>
        <TextField
          className={classes.textFilter}
          variant="outlined"
          size="small"
          label="п.п"
          value={state.creationNumber === 0 ? '' : state.creationNumber}
          onChange={({ target: { value } }) => {
            if (!Number.isNaN(+value)) dispatch({ type: 'SET_CREATION_NUMBER', value: +value });
          }}
          onKeyUp={({ key }) => {
            if (key === 'Enter') keyPress();
          }}
        />
        <TextField
          className={classes.textFilter}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          size="small"
          label="Дата дела"
          value={getInputDate(state.date)}
          onChange={({ target: { value } }) => dispatch({ type: 'SET_DATE', value })}
          onKeyUp={({ key }) => {
            if (key === 'Enter') keyPress();
          }}
        />
        <TextField
          className={classes.textFilter}
          variant="outlined"
          size="small"
          label="Номер дела"
          value={state.number}
          onChange={({ target: { value } }) => dispatch({ type: 'SET_NUMBER', value })}
          onKeyUp={({ key }) => {
            if (key === 'Enter') keyPress();
          }}
        />
        <TextField
          className={classes.textFilter}
          variant="outlined"
          size="small"
          label="Обвиняемый"
          value={state.accused}
          onChange={({ target: { value } }) => dispatch({ type: 'SET_ACCUSED', value })}
          onKeyUp={({ key }) => {
            if (key === 'Enter') keyPress();
          }}
        />
        <TextField
          className={classes.textFilter}
          variant="outlined"
          size="small"
          label="Адвокат"
          value={state.jurist}
          onChange={({ target: { value } }) => dispatch({ type: 'SET_JURIST', value })}
          onKeyUp={({ key }) => {
            if (key === 'Enter') keyPress();
          }}
        />
        <TextField
          className={classes.textFilter}
          variant="outlined"
          size="small"
          label="Ордер"
          value={state.orderNumber}
          onChange={({ target: { value } }) => dispatch({ type: 'SET_ORDERNUMBER', value })}
          onKeyUp={({ key }) => {
            if (key === 'Enter') keyPress();
          }}
        />
      </Grid>
    </Grid>
  );
});

Filters.propTypes = {
  state: PropTypes.objectOf(PropTypes.string), // Состояние меню
  dispatch: PropTypes.func, // Dicpacth функция для изменения состояния меню
  keyPress: PropTypes.func, // Функция применения фильтра. Вызываем при нажатии Enter в поле ввода.
};

Filters.defaultProps = {
  state: {},
  dispatch: () => {},
  keyPress: () => {},
};

export default Filters;
