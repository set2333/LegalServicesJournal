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

// Формирование excel файла. После формирования файл с произвольным именем сохраняется в папке
// public, и клиенту отправляется название файла. Клиент отправляет запрос на скачивание файла.
// После скачивания файл удаляется.
const getWorkBook = (values) => {
  const border = {
    top: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  };
  const fill = {
    type: 'pattern',
    pattern: 'lightTrellis',
  };
  const cells = ['B', 'C', 'D', 'E', 'F'];
  const workBook = new excel.Workbook();
  workBook.created = new Date();
  workBook.modified = new Date();
  const workSheet = workBook.addWorksheet('Sheet 1');
  workSheet.columns = [
    { header: '', key: 'space', width: 3 },
    { header: '', key: 'name', width: 20 },
    { header: '', key: 'value', width: 38 },
    { header: '', key: 'space2', width: 6 },
    { header: '', key: 'name2', width: 20 },
    { header: '', key: 'value2', width: 38 },
  ];
  values.forEach((item) => {
    if (item.orders.length === 0) {
      workSheet.addRow({
        space: '',
        name: `Дело №${item.creationNumber} от ${item.creationDate.toLocaleDateString()}`,
        value: '',
      }).font = {
        size: 16,
        bold: true,
      };
      let row = workSheet.addRow({ space: '', name: 'Номер дела', value: item.number });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
      row = workSheet.addRow({
        space: '',
        name: 'Дата дела',
        value: item.date,
      });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
      row.getCell('value').alignment = { vertical: 'top', horizontal: 'left' };
      row = workSheet.addRow({ space: '', name: 'Выданно', value: item.issuingAuthority });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
      row = workSheet.addRow({ space: '', name: 'Обвиняемый', value: item.accused });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
      row = workSheet.addRow({ space: '', name: 'Статья', value: item.article });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
      row = workSheet.addRow({ space: '' });
      cells.map((cell) => (row.getCell(cell).fill = fill));
    } else {
      workSheet.addRow({
        space: '',
        name: `Дело №${item.creationNumber} от ${item.creationDate.toLocaleDateString()}`,
        value: '',
        space2: '',
        name2: `Ордер №${
          item.orders[0].creationNumber
        } от ${item.orders[0].creationDate.toLocaleDateString()}`,
        value2: '',
      }).font = {
        size: 16,
        bold: true,
      };
      workSheet.addRow(['']);
      let row = workSheet.addRow({
        space: '',
        name: 'Номер дела',
        value: item.number,
        space2: '',
        name2: 'Номер ордера',
        value2: item.orders[0].number,
      });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
      row.getCell('name2').border = border;
      row.getCell('value2').border = border;
      row = workSheet.addRow({
        space: '',
        name: 'Дата дела',
        value: item.date,
        space2: '',
        name2: 'Дата ордера',
        value2: item.orders[0].date,
      });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
      row.getCell('value').alignment = { vertical: 'top', horizontal: 'left' };
      row.getCell('name2').border = border;
      row.getCell('value2').border = border;
      row.getCell('value2').alignment = { vertical: 'top', horizontal: 'left' };
      row = workSheet.addRow({
        space: '',
        name: 'Выданно',
        value: item.issuingAuthority,
        space2: '',
        name2: 'Адвокат',
        value2: item.orders[0].jurist,
      });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
      row.getCell('name2').border = border;
      row.getCell('value2').border = border;
      row = workSheet.addRow({ space: '', name: 'Обвиняемый', value: item.accused });
      row.getCell('name').border = border;
      row.getCell('value').border = border;
      if (item.orders.length > 1) {
        row = workSheet.addRow({
          space: '',
          name: 'Статья',
          value: item.article,
          space2: '',
          name2: `Ордер №${
            item.orders[1].creationNumber
          } от ${item.orders[1].creationDate.toLocaleDateString()}`,
        });
        row.getCell('name').border = border;
        row.getCell('name2').font = {
          size: 16,
          bold: true,
        };
        row.getCell('value').border = border;
        workSheet.addRow(['']);
      } else {
        row = workSheet.addRow({
          space: '',
          name: 'Статья',
          value: item.article,
        });
        row.getCell('name').border = border;
        row.getCell('value').border = border;
        row = workSheet.addRow({ space: '' });
        cells.map((cell) => (row.getCell(cell).fill = fill));
      }
      if (item.orders.length > 1) {
        for (let i = 1; i < item.orders.length; i += 1) {
          if (i !== 1) {
            workSheet.addRow({
              space: '',
              name: '',
              value: '',
              space2: '',
              name2: `Ордер №${item.orders[i].creationNumber} от ${item.orders[
                i
              ].creationDate.toLocaleDateString()}`,
              value2: '',
            }).font = {
              size: 16,
              bold: true,
            };
            workSheet.addRow(['']);
          }
          row = workSheet.addRow({
            space: '',
            name: '',
            value: '',
            space2: '',
            name2: 'Номер ордера',
            value2: item.orders[i].number,
          });
          row.getCell('name2').border = border;
          row.getCell('value2').border = border;
          row = workSheet.addRow({
            space: '',
            name: '',
            value: '',
            space2: '',
            name2: 'Дата ордера',
            value2: item.orders[i].date,
          });
          row.getCell('name2').border = border;
          row.getCell('value2').border = border;
          row.getCell('value2').alignment = { vertical: 'top', horizontal: 'left' };
          row = workSheet.addRow({
            space: '',
            name: '',
            value: '',
            space2: '',
            name2: 'Адвокат',
            value2: item.orders[i].jurist,
          });
          row.getCell('name2').border = border;
          row.getCell('value2').border = border;
          if (i === item.orders.length - 1) {
            row = workSheet.addRow({ space: '' });
            cells.map((cell) => (row.getCell(cell).fill = fill));
          } else workSheet.addRow([]);
        }
      }
    }
  });
  return workBook;
};

const RouterAPI = express.Router();

const validBody = (req, res, next) => {
  if (req.body) return next();
  return res.sendStatus(400);
};

RouterAPI.post('/api/action', jsonParser, validBody, async (req, res) => {
  try {
    const action = await addAction(req.body);
    if (action === null) return res.sendStatus(400);
    return res.send(JSON.stringify(action));
  } catch (err) {
    return res.sendStatus(400);
  }
});

RouterAPI.post('/api/oneAction', jsonParser, validBody, async (req, res) => {
  try {
    const action = await getOneAction(req.body.id);
    if (action === null) return res.sendStatus(400);
    return res.send(JSON.stringify(action));
  } catch (err) {
    return res.sendStatus(400);
  }
});

RouterAPI.post('/api/actions', jsonParser, validBody, async (req, res) => {
  try {
    const actions = await getActions(req.body.startDate, req.body.endDate, req.body.filter);
    if (actions === null) return res.sendStatus(400);
    return res.send(JSON.stringify(actions));
  } catch (err) {
    return res.sendStatus(400);
  }
});

RouterAPI.post('/api/order', jsonParser, validBody, async (req, res) => {
  try {
    const order = await addOrder(req.body);
    if (order === null) return res.sendStatus(400);
    return res.send(JSON.stringify(order));
  } catch (err) {
    return res.sendStatus(400);
  }
});

RouterAPI.post('/api/oneOrder', jsonParser, validBody, async (req, res) => {
  try {
    const order = await getOneOrder(req.body.id);
    if (order === null) return res.sendStatus(400);
    return res.send(JSON.stringify(order));
  } catch (err) {
    return res.sendStatus(400);
  }
});

RouterAPI.post('/api/orders', jsonParser, validBody, async (req, res) => {
  try {
    const orders = await getOrders(req.body.startDate, req.body.endDate, req.body.filter);
    if (orders === null) return res.sendStatus(400);
    return res.send(JSON.stringify(orders));
  } catch (err) {
    return res.sendStatus(400);
  }
});

RouterAPI.post('/api/excelAction', jsonParser, validBody, async (req, res) => {
  try {
    const action = await getOneAction(req.body.id);
    if (action === null) return res.sendStatus(400);
    const workBook = getWorkBook([action]);
    const fileName = `${uid()}.xlsx`;
    workBook.xlsx
      .writeFile(`public/${fileName}`)
      .then(() => res.send(JSON.stringify({ result: true, fileName })));
    return null;
  } catch (err) {
    return res.sendStatus(400);
  }
});

RouterAPI.post('/api/excelActions', jsonParser, validBody, async (req, res) => {
  try {
    const actions = await getActions(req.body.startDate, req.body.endDate, req.body.filter);
    if (actions === null) return res.sendStatus(400);
    const workBook = getWorkBook(actions);
    const fileName = `${uid()}.xlsx`;
    workBook.xlsx
      .writeFile(`public/${fileName}`)
      .then(() => res.send(JSON.stringify({ result: true, fileName })));
    return null;
  } catch (err) {
    return res.sendStatus(400);
  }
});

module.exports = RouterAPI;
