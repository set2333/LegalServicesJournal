// Модальные окна для создания/редактирования дел и ордеров
import React, { useState, useReducer, useEffect } from 'react';
import {
  Dialog,
  Typography,
  Button,
  Grid,
  TextField,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
} from '@material-ui/core/';
import Draggable from 'react-draggable';
import uid from 'uid';
import {
  editAction, getOneAction, getExcelAction, editOrder, getOneOrder,
} from '../api/api';
import { getInputDate, getLocalDate } from '../functions/dateFunction';

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
    case 'SET_UID':
      return { ...state, uid: action.value };
    case 'SET_ALL':
      return { ...state, ...action.value };
    default:
      return { ...state };
  }
};
const initialState = {
  date: new Date(),
  number: '',
  comment: '',
  creationNumber: '',
  creationDate: '',
};

const PaperComponentAction = (props) => (
  <Draggable handle="#draggable-dialog-title">
    <Paper {...props} />
  </Draggable>
);

const PaperComponentOrder = (props) => (
  <Draggable handle="#draggable-dialog-title-order">
    <Paper {...props} />
  </Draggable>
);

// Модальное окно для ордера. Реализованно как пользовательский хук.
const useModalOrder = (setUid) => {
  const [stateModal, setStateModal] = useState({
    open: false,
    id: null,
    accused: '',
    article: '',
    action: '',
  });
  const afterAjaxSend = () => {
    setUid(uid());
    setStateModal({
      open: false,
      id: null,
      accused: '',
      article: '',
      action: '',
    });
  };
  const ModalWindow = () => {
    const [state, dispatch] = useReducer(reducer, {
      ...initialState,
      jurist: '',
      action: '',
    });
    useEffect(() => {
      if (stateModal.id !== null) {
        getOneOrder(stateModal.id).subscribe((response) => {
          dispatch({ type: 'SET_ALL', value: response });
        });
      }
    }, [stateModal.id]);
    return (
      <Dialog
        open={stateModal.open}
        scroll="paper"
        maxWidth="md"
        PaperComponent={PaperComponentOrder}
      >
        <DialogTitle id="draggable-dialog-title-order" style={{ cursor: 'move' }}>
          <Typography>
            {stateModal.id === null
              ? 'Создание нового ордера'
              : `Ордер №${state.creationNumber} от ${getLocalDate(state.creationDate)}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item md={3} style={gridStyle}>
              <TextField
                variant="outlined"
                label="Номер ордера"
                style={filedStyle}
                value={state.number}
                onChange={({ target: { value } }) => dispatch({ type: 'SET_NUMBER', value })}
              />
            </Grid>
            <Grid item md={3} style={gridStyle}>
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
            <Grid item md={6} style={gridStyle}>
              <TextField
                variant="outlined"
                label="Адвокат"
                style={filedStyle}
                value={state.jurist}
                onChange={({ target: { value } }) => dispatch({ type: 'SET_JURIST', value })}
              />
            </Grid>
            <Grid item md={6} style={gridStyle}>
              <TextField
                variant="outlined"
                label="Обвиняемый"
                style={filedStyle}
                value={stateModal.accused}
              />
            </Grid>
            <Grid item md={6} style={gridStyle}>
              <TextField
                variant="outlined"
                label="Статья"
                style={filedStyle}
                value={stateModal.article}
              />
            </Grid>
            <Grid item md={12} style={gridStyle}>
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
                onClick={() => editOrder({ ...state, action: stateModal.action }, stateModal.id).subscribe(
                  afterAjaxSend,
                )}
                style={buttonStyle}
              >
                Сохранить
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
        </DialogContent>
      </Dialog>
    );
  };
  return [ModalWindow, (value) => setStateModal(value)];
};

// Модальное окно для дела. Реализованно как пользовательский хук.
const useModalAction = (setUid) => {
  const [stateModal, setStateModal] = useState({ open: false, id: null });
  const closeModalWindow = () => {
    setStateModal({ open: false, id: null });
    setUid(uid());
  };
  const ModalWindow = () => {
    const [state, dispatch] = useReducer(reducer, {
      ...initialState,
      accused: '',
      article: '',
      issuingAuthority: '',
      uid: '',
      orders: [],
    });
    const [ModalOrder, openModalOrder] = useModalOrder((newUid) => dispatch({ type: 'SET_UID', value: newUid }));
    useEffect(() => {
      if (stateModal.id !== null) {
        getOneAction(stateModal.id).subscribe((response) => {
          dispatch({ type: 'SET_ALL', value: response });
        });
      }
    }, [stateModal.id, state.uid]);
    return (
      <Dialog
        open={stateModal.open}
        scroll="paper"
        maxWidth="md"
        PaperComponent={PaperComponentAction}
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
          <Typography>
            {stateModal.id === null
              ? 'Создание нового дела'
              : `Дело №${state.creationNumber} от ${getLocalDate(state.creationDate)}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <ModalOrder />
          <Grid container>
            <Grid item md={9} style={gridStyle}>
              <TextField
                variant="outlined"
                label="Выдано"
                style={filedStyle}
                value={state.issuingAuthority}
                onChange={({ target: { value } }) => dispatch({ type: 'SET_ISSUINGAUTHORITY', value })}
              />
            </Grid>
            <Grid item md={3} style={gridStyle}>
              <TextField
                variant="outlined"
                type="date"
                label="Дата постаонвления"
                InputLabelProps={{
                  shrink: true,
                }}
                style={filedStyle}
                value={getInputDate(state.date)}
                onChange={({ target: { value } }) => dispatch({ type: 'SET_DATE', value })}
              />
            </Grid>
            <Grid item md={6} style={gridStyle}>
              <TextField
                variant="outlined"
                label="Обвиняемый"
                style={filedStyle}
                value={state.accused}
                onChange={({ target: { value } }) => dispatch({ type: 'SET_ACCUSED', value })}
              />
            </Grid>
            <Grid item md={3} style={gridStyle}>
              <TextField
                variant="outlined"
                label="Статья"
                style={filedStyle}
                value={state.article}
                onChange={({ target: { value } }) => dispatch({ type: 'SET_ARTICLE', value })}
              />
            </Grid>
            <Grid item md={3} style={gridStyle}>
              <TextField
                variant="outlined"
                label="Номер дела"
                style={filedStyle}
                value={state.number}
                onChange={({ target: { value } }) => dispatch({ type: 'SET_NUMBER', value })}
              />
            </Grid>
            <Grid item md={12} style={gridStyle}>
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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Номер ордера</TableCell>
                    <TableCell>Дата ордера</TableCell>
                    <TableCell>Адвокат</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.orders.map((order) => (
                    <TableRow
                      style={{ cursor: 'pointer' }}
                      onClick={() => openModalOrder({
                        open: true,
                        id: order._id,
                        accused: state.accused,
                        article: state.article,
                        action: stateModal.id,
                      })}
                    >
                      <TableCell>{order.number}</TableCell>
                      <TableCell>{getLocalDate(order.date)}</TableCell>
                      <TableCell>{order.jurist}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item md={12} align="center" style={gridStyle}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => editAction(state, stateModal.id).subscribe(closeModalWindow)}
                style={buttonStyle}
              >
                Сохранить
              </Button>
              {stateModal.id !== null ? (
                <>
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
                    onClick={() => openModalOrder({
                      open: true,
                      id: null,
                      accused: state.accused,
                      article: state.article,
                      action: stateModal.id,
                    })}
                    style={buttonStyle}
                  >
                    Новый ордер
                  </Button>
                </>
              ) : null}

              <Button
                variant="contained"
                color="secondary"
                onClick={closeModalWindow}
                style={buttonStyle}
              >
                Закрыть
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };
  return [ModalWindow, (value) => setStateModal(value)];
};

export default useModalAction;
