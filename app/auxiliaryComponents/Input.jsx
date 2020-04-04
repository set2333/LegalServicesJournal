import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { getInputDate } from '../functions/dateFunction';

const useStyles = makeStyles(() => createStyles({
  textFilter: {
    marginLeft: 5,
    marginRight: 5,
  },
}));

const Input = ({
  label, dispatch, dispatchType, inputValue, inputType,
}) => {
  const classes = useStyles();
  if (inputType === 'date') {
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
          value={getInputDate(inputValue)}
          onChange={({ target: { value } }) => dispatch({ type: dispatchType, value })}
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
        value={inputValue}
        onChange={({ target: { value } }) => dispatch({ type: dispatchType, value })}
      />
    </>
  );
};

export default Input;
