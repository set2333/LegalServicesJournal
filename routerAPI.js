const express = require('express');
const jsonParser = require('body-parser').json();
const excel = require('exceljs');
const uid = require('uid');
const {
  addAction,
  getOneAction,
  addOrder,
  getOneOrder,
  getActions,
  getOrders,
} = require('./serverModules/mongoModules/mongoFunctions');
// const { getExcelActionById } = require('./serverModules/excelModules/getExcel');

const getWorkBook = (values) => {
  const border = {
    top: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  };
  const workBook = new excel.Workbook();
  workBook.created = new Date();
  workBook.modified = new Date();
  const workSheet = workBook.addWorksheet('Sheet 1');
  workSheet.columns = [
    { header: '', key: 'space', width: 3 },
    {
      header: '',
      key: 'name',
      width: 20,
    },
    {
      header: '',
      key: 'value',
      width: 38,
    },
  ];
  values.forEach((item) => {
    workSheet.addRow({
      space: '',
      name: `${item.action ? 'Ордер' : 'Дело'} №${
        item.creationNumber
      } от ${item.creationDate.toLocaleDateString()}`,
      value: '',
    }).font = {
      size: 16,
      bold: true,
    };
    workSheet.addRow(['']);
    let row = workSheet.addRow({ space: '', name: 'Номер постановления', value: item.number });
    row.getCell('name').border = border;
    row.getCell('value').border = border;
    row = workSheet.addRow({
      space: '',
      name: 'Дата постановления',
      value: item.date,
    });
    row.getCell('name').border = border;
    row.getCell('value').border = border;
    row.getCell('value').alignment = { vertical: 'top', horizontal: 'left' };
    if (item.issuingAuthority) {
      row = workSheet.addRow({ space: '', name: 'Выданно', value: item.issuingAuthority });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
    }
    if (item.jurist) {
      row = workSheet.addRow({ space: '', name: 'Юрист', value: item.jurist });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
    }
    row = workSheet.addRow({ space: '', name: 'Обвиняемый', value: item.accused });
    row.getCell('name').border = border;
    row.getCell('value').border = border;
    row = workSheet.addRow({ space: '', name: 'Статья', value: item.article });
    row.getCell('name').border = border;
    row.getCell('value').border = border;
    if (item.action) {
      row = workSheet.addRow({ space: '', name: 'Дело', value: item.actionString });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
    }
    workSheet.addRow(['']);
  });
  return workBook;
};

const RouterAPI = express.Router();

const validBody = (req, res, next) => {
  if (req.body) return next();
  return res.sendStatus(400);
};

RouterAPI.post('/api/action', jsonParser, validBody, async (req, res) => {
  const action = await addAction(req.body);
  if (action === null) return res.sendStatus(400);
  return res.send(JSON.stringify(action));
});

RouterAPI.post('/api/oneAction', jsonParser, validBody, async (req, res) => {
  const action = await getOneAction(req.body.id);
  if (action === null) return res.sendStatus(400);
  return res.send(JSON.stringify(action));
});

RouterAPI.post('/api/actions', jsonParser, validBody, async (req, res) => {
  const actions = await getActions(req.body.startDate, req.body.endDate, req.body.filter);
  if (actions === null) return res.sendStatus(400);
  return res.send(JSON.stringify(actions));
});

RouterAPI.post('/api/order', jsonParser, validBody, async (req, res) => {
  const order = await addOrder(req.body);
  if (order === null) return res.sendStatus(400);
  return res.send(JSON.stringify(order));
});

RouterAPI.post('/api/oneOrder', jsonParser, validBody, async (req, res) => {
  const order = await getOneOrder(req.body.id);
  if (order === null) return res.sendStatus(400);
  return res.send(JSON.stringify(order));
});

RouterAPI.post('/api/orders', jsonParser, validBody, async (req, res) => {
  const orders = await getOrders(req.body.startDate, req.body.endDate, req.body.filter);
  if (orders === null) return res.sendStatus(400);
  return res.send(JSON.stringify(orders));
});

RouterAPI.post('/api/excelAction', jsonParser, validBody, async (req, res) => {
  const action = await getOneAction(req.body.id);
  if (action === null) return res.sendStatus(400);
  const workBook = getWorkBook([action]);
  const fileName = `${uid()}.xlsx`;
  workBook.xlsx
    .writeFile(`public/${fileName}`)
    .then(() => res.send(JSON.stringify({ result: true, fileName })));
  return null;
});

RouterAPI.post('/api/excelOrder', jsonParser, validBody, async (req, res) => {
  const order = await getOneOrder(req.body.id);
  if (order === null) return res.sendStatus(400);
  const workBook = getWorkBook([order]);
  const fileName = `${uid()}.xlsx`;
  workBook.xlsx
    .writeFile(`public/${fileName}`)
    .then(() => res.send(JSON.stringify({ result: true, fileName })));
  return null;
});

RouterAPI.post('/api/excelActions', jsonParser, validBody, async (req, res) => {
  const actions = await getActions(req.body.startDate, req.body.endDate, req.body.filter);
  if (actions === null) return res.sendStatus(400);
  const workBook = getWorkBook(actions);
  const fileName = `${uid()}.xlsx`;
  workBook.xlsx
    .writeFile(`public/${fileName}`)
    .then(() => res.send(JSON.stringify({ result: true, fileName })));
  return null;
});

RouterAPI.post('/api/excelOrders', jsonParser, validBody, async (req, res) => {
  const actions = await getOrders(req.body.startDate, req.body.endDate, req.body.filter);
  if (actions === null) return res.sendStatus(400);
  const workBook = getWorkBook(actions);
  const fileName = `${uid()}.xlsx`;
  workBook.xlsx
    .writeFile(`public/${fileName}`)
    .then(() => res.send(JSON.stringify({ result: true, fileName })));
  return null;
});

module.exports = RouterAPI;
