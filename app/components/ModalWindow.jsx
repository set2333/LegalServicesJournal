// Модальные окна для создания/редактирования дел и ордеров
import React, { useState, useReducer } from 'react';
import {
  Modal, Paper, Typography, Button, Grid, TextField, Container,
} from '@material-ui/core/';
import { editAction } from '../api/api';

const gridStyle = {
  padding: 10,
};

const filedStyle = {
  width: '100%',
};

const buttonStyle = {
  margin: 10,
};

// Модальное окно для дела. Реализованно как пользовательский хук.
const useModalAction = () => {
  const [open, setOpen] = useState(false);
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_NUMBER':
        return { ...state, number: action.value };
      case 'SET_DATE':
        return { ...state, date: action.value };
      case 'SET_ISSUINGAUTHORITY':
        return { ...state, issuingAuthority: action.value };
      case 'SET_ACCUSED':
        return { ...state, accused: action.value };
      case 'SET_ARTICLE':
        return { ...state, article: action.value };
      case 'SET_COMMENT':
        return { ...state, comment: action.value };
      default:
        return { ...state };
    }
  };
  const initialState = {
    date: new Date(),
    number: '123',
    issuingAuthority: '',
    accused: '',
    article: '',
    comment: 'test',
  };
  const afterAjaxSend = (res) => {
    console.log('SEND: ', res);
  };

  const ModalWindow = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
      <Modal open={open}>
        <Container maxWidth="md">
          <Paper elevation={10} style={{ margin: 10, padding: 10 }}>
            <Grid container>
              <Grid item md={12} align="center" style={gridStyle}>
                <Typography>Дело №</Typography>
              </Grid>
              <Grid item md={4} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  label="Номер"
                  style={filedStyle}
                  value={state.number}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_NUMBER', value })}
                />
              </Grid>
              <Grid item md={4} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  type="date"
                  label="Дата постановления"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={filedStyle}
                  value={state.date}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_DATE', value })}
                />
              </Grid>
              <Grid item md={4} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  label="Обвиняемый"
                  style={filedStyle}
                  value={state.accused}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_ACCUSED', value })}
                />
              </Grid>
              <Grid item md={8} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  label="Выданно"
                  style={filedStyle}
                  value={state.issuingAuthority}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_ISSUINGAUTHORITY', value })}
                />
              </Grid>
              <Grid item md={4} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  label="Статья"
                  style={filedStyle}
                  value={state.article}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_ARTICLE', value })}
                />
              </Grid>
              <Grid item md={12} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  multiline
                  rows="4"
                  label="Комментарий"
                  style={filedStyle}
                  value={state.comment}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_COMMENT', value })}
                />
              </Grid>
              <Grid item md={12} align="center" style={gridStyle}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => editAction(state).subscribe(afterAjaxSend)}
                  style={buttonStyle}
                >
                  Сохранить
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpen(false)}
                  style={buttonStyle}
                >
                  Закрыть
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Modal>
    );
  };
  return [ModalWindow, () => setOpen(true)];
};

const useModalOrder = () => {
  const [open, setOpen] = useState(false);
  const ModalWindow = () => (
    <Modal open={open}>
      <Container maxWidth="md">
        <Paper elevation={10} style={{ margin: 10, padding: 10 }}>
          <Grid container>
            <Grid item md={12} align="center" style={gridStyle}>
              <Typography>Ордер №</Typography>
            </Grid>
            <Grid item md={4} align="center" style={gridStyle}>
              <TextField variant="outlined" label="Номер" style={filedStyle} />
            </Grid>
            <Grid item md={4} align="center" style={gridStyle}>
              <TextField
                variant="outlined"
                type="date"
                label="Дата постановления"
                InputLabelProps={{
                  shrink: true,
                }}
                style={filedStyle}
              />
            </Grid>
            <Grid item md={4} align="center" style={gridStyle}>
              <TextField variant="outlined" label="Обвиняемый" style={filedStyle} />
            </Grid>
            <Grid item md={8} align="center" style={gridStyle}>
              <TextField variant="outlined" label="Выданно" style={filedStyle} />
            </Grid>
            <Grid item md={4} align="center" style={gridStyle}>
              <TextField variant="outlined" label="Статья" style={filedStyle} />
            </Grid>
            <Grid item md={12} align="center" style={gridStyle}>
              <TextField variant="outlined" multiline rows="4" label="Fldjrfn" style={filedStyle} />
            </Grid>
            <Grid item md={12} align="center" style={gridStyle}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(false)}
                style={buttonStyle}
              >
                Сохранить
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(false)}
                style={buttonStyle}
              >
                Закрыть
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Modal>
  );
  return [ModalWindow, () => setOpen(true)];
};

export { useModalAction, useModalOrder };
