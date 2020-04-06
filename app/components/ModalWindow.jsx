// Модальные окна для создания/редактирования дел и ордеров
import React, { useState, useReducer, useEffect } from 'react';
import {
  Modal,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core/';
import {
  editAction,
  editOrder,
  getOneAction,
  getOneOrder,
  getExcelOrder,
  getExcelAction,
} from '../api/api';
import {
  getInputDate, getLocalDate, agoMonth, endDay,
} from '../functions/dateFunction';
import Actions from './Actions.jsx';
import Menu from './Menu.jsx';

const gridStyle = {
  padding: 10,
};

const filedStyle = {
  width: '100%',
};

const buttonStyle = {
  margin: 10,
};

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
    case 'SET_JURIST':
      return { ...state, jurist: action.value };
    case 'SET_ARTICLE':
      return { ...state, article: action.value };
    case 'SET_COMMENT':
      return { ...state, comment: action.value };
    case 'SET_ACTION': {
      return { ...state, action: action.action, actionString: action.actionString };
    }
    case 'SET_ALL':
      return { ...state, ...action.value };
    default:
      return { ...state };
  }
};
const initialState = {
  date: new Date(),
  number: '',
  accused: '',
  article: '',
  comment: '',
  creationNumber: '',
  creationDate: '',
};

const useModalActions = (setAction) => {
  const filterReducer = (state, action) => {
    switch (action.type) {
      case 'SET_FILTER':
        return { ...action.value };
      default:
        return { ...state };
    }
  };

  const filterInitialState = {
    startDate: agoMonth(Date.now()),
    endDate: endDay(Date.now()),
    filter: {},
  };

  const [stateModal, setStateModal] = useState({ open: false, dispatch: () => {} });
  const ModalActions = () => {
    const [state, dispatch] = useReducer(filterReducer, filterInitialState);
    return (
      <Dialog open={stateModal.open} scroll="paper" maxWidth="md">
        <DialogTitle>
          <Menu typeMenu="actions" dispatch={dispatch} />
        </DialogTitle>
        <DialogContent>
          <Actions
            startDate={state.startDate}
            endDate={state.endDate}
            filter={state.filter}
            clickRow={(value) => {
              getOneAction(value).subscribe((response) => {
                setAction({
                  type: 'SET_ACTION',
                  action: response._id,
                  actionString: response.actionString,
                });
                setStateModal({ open: false, dispatch: () => {} });
              });
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setStateModal({ open: false, id: null })}
            style={buttonStyle}
          >
            Закрыть
          </Button>
        </DialogContent>
      </Dialog>
    );
  };
  return [ModalActions, (value) => setStateModal(value)];
};

// Модальное окно для дела. Реализованно как пользовательский хук.
const useModalAction = () => {
  const [stateModal, setStateModal] = useState({ open: false, id: null });
  const afterAjaxSend = (res) => {
    setStateModal({ open: false, id: null });
  };
  const ModalWindow = () => {
    const [state, dispatch] = useReducer(reducer, { ...initialState, issuingAuthority: '' });
    useEffect(() => {
      if (stateModal.id !== null) {
        getOneAction(stateModal.id).subscribe((response) => {
          dispatch({ type: 'SET_ALL', value: response });
        });
      }
    }, [stateModal.id]);
    return (
      <Modal open={stateModal.open}>
        <Container maxWidth="md">
          <Paper elevation={10} style={{ margin: 10, padding: 10 }}>
            <Grid container>
              <Grid item md={12} align="center" style={gridStyle}>
                <Typography>
                  {stateModal.id === null
                    ? 'Создание нового дела'
                    : `Дело №${state.creationNumber} от ${getLocalDate(state.creationDate)}`}
                </Typography>
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
                  value={getInputDate(state.date)}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_DATE', value })}
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
              <Grid item md={6} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  label="Выданно"
                  style={filedStyle}
                  value={state.issuingAuthority}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_ISSUINGAUTHORITY', value })}
                />
              </Grid>
              <Grid item md={6} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  label="Обвиняемый"
                  style={filedStyle}
                  value={state.accused}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_ACCUSED', value })}
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
                  onClick={() => editAction(state, stateModal.id).subscribe(afterAjaxSend)}
                  style={buttonStyle}
                >
                  Сохранить
                </Button>
                <Button
                  variant="contained"
                  onClick={() => getExcelAction(stateModal.id).subscribe((response) => {
                    if (response.result) {
                      window.open(
                        `http://${window.location.host}/getFile?fileName=${response.fileName}`,
                        '_self',
                      );
                    }
                  })}
                  style={buttonStyle}
                >
                  Загрузить
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setStateModal({ open: false, id: null })}
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
  return [ModalWindow, (value) => setStateModal(value)];
};

const useModalOrder = () => {
  const [stateModal, setStateModal] = useState({ open: false, id: null });
  const afterAjaxSend = (res) => {
    setStateModal({ open: false, id: null });
  };
  const ModalWindow = () => {
    const [state, dispatch] = useReducer(reducer, {
      ...initialState,
      jurist: '',
      action: '',
      actionString: '',
    });
    const [ModalFindActions, openModalFindActions] = useModalActions(dispatch);
    useEffect(() => {
      if (stateModal.id !== null) {
        getOneOrder(stateModal.id).subscribe((response) => {
          dispatch({ type: 'SET_ALL', value: response });
        });
      }
    }, [stateModal.id]);
    return (
      <Modal open={stateModal.open}>
        <Container maxWidth="md">
          <ModalFindActions />
          <Paper elevation={10} style={{ margin: 10, padding: 10 }}>
            <Grid container>
              <Grid item md={12} align="center" style={gridStyle}>
                <Typography>
                  {stateModal.id === null
                    ? 'Создание нового ордера'
                    : `Ордер №${state.creationNumber} от ${getLocalDate(state.creationDate)}`}
                </Typography>
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
                  label="Дата ордера"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={filedStyle}
                  value={getInputDate(state.date)}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_DATE', value })}
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
              <Grid item md={6} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  label="Адвокат"
                  style={filedStyle}
                  value={state.jurist}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_JURIST', value })}
                />
              </Grid>
              <Grid item md={6} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  label="Обвиняемый"
                  style={filedStyle}
                  value={state.accused}
                  onChange={({ target: { value } }) => dispatch({ type: 'SET_ACCUSED', value })}
                />
              </Grid>
              <Grid item md={12} align="center" style={gridStyle}>
                <TextField
                  variant="outlined"
                  label="Дело"
                  style={filedStyle}
                  value={state.actionString}
                  onClick={() => openModalFindActions({ open: true, dispatch })}
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
                  onClick={() => editOrder(state, stateModal.id).subscribe(afterAjaxSend)}
                  style={buttonStyle}
                >
                  Сохранить
                </Button>
                <Button
                  variant="contained"
                  onClick={() => getExcelOrder(stateModal.id).subscribe((response) => {
                    if (response.result) {
                      window.open(
                        `http://${window.location.host}/getFile?fileName=${response.fileName}`,
                        '_self',
                      );
                    }
                  })}
                  style={buttonStyle}
                >
                  Загрузить
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setStateModal({ open: false, id: null })}
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
  return [ModalWindow, (value) => setStateModal(value)];
};

export { useModalAction, useModalOrder };
