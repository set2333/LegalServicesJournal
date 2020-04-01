// Модальные окна для создания/редактирования дел и ордеров
import React, { useState } from 'react';
import {
  Modal, Paper, Typography, Button, Grid, TextField, Container,
} from '@material-ui/core/';

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

  const ModalWindow = () => (
    <Modal open={open}>
      <Container maxWidth="md">
        <Paper elevation={10} style={{ margin: 10, padding: 10 }}>
          <Grid container>
            <Grid item md={12} align="center" style={gridStyle}>
              <Typography>Дело №</Typography>
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
              <TextField
                variant="outlined"
                multiline
                rows="4"
                label="Комментарий"
                style={filedStyle}
              />
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
