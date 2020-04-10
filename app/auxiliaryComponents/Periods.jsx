// Выбор периода в меню
import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Grid } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { getInputDate } from '../functions/dateFunction';

const useStyles = makeStyles(() => createStyles({
  textFilter: {
    marginLeft: 5,
    marginRight: 5,
  },
}));

const Periods = React.memo(({ state, dispatch, keyPress }) => {
  const classes = useStyles();
  return (
    <Grid>
      <TextField
        className={classes.textFilter}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        size="small"
        label="Начало периода"
        value={getInputDate(state.startDate)}
        onChange={({ target: { value } }) => dispatch({ type: 'SET_START_DATE', value })}
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
        label="Конец периода"
        value={getInputDate(state.endDate)}
        onChange={({ target: { value } }) => dispatch({ type: 'SET_END_DATE', value })}
        onKeyUp={({ key }) => {
          if (key === 'Enter') keyPress();
        }}
      />
    </Grid>
  );
});

Periods.propTypes = {
  state: PropTypes.objectOf(PropTypes.string), // Состояние меню
  dispatch: PropTypes.func, // Dicpacth функция для изменения состояния меню
  keyPress: PropTypes.func, // Функция применения фильтра. Вызываем при нажатии Enter в поле ввода.
};

Periods.defaultProps = {
  state: {},
  dispatch: () => {},
  keyPress: () => {},
};

export default Periods;
