const mongoose = require('mongoose');
const { Action, Order } = require('./serverModules/mongoModules/mongooseSchema');
const { addAction, addOrder, getActions } = require('./serverModules/mongoModules/mongoFunctions');

const beginDateZeroTime = (date) => {
  const result = new Date(date);
  return Number.isNaN(result)
    ? date
    : new Date(
      result.getFullYear(),
      result.getMonth(),
      result.getDate(),
      0,
      -new Date().getTimezoneOffset(),
      0,
      0,
    );
};

mongoose.connect(
  'mongodb://localhost:27017/juristjournal',
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  async (err) => {
    if (err) return console.log(err);
    Action.collection.drop();
    Order.collection.drop();
    const actions = [
      {
        number: '44',
        issuingAuthority: 'Судом г.Кызыл',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        comment: 'Тестовый комментарий',
      },
      {
        number: '68',
        issuingAuthority: 'Судом г.Кызыл',
        accused: 'Петров Петр Петрович',
        article: 'ст.74',
        comment: '',
      },
      {
        number: '79',
        issuingAuthority: 'Судом г.Кызыл',
        accused: 'Николаев Иван Павлович',
        article: 'ст.39',
        comment: '',
      },
      {
        number: '95',
        issuingAuthority: 'Судом пгт. Каа-Хем',
        accused: 'Андреев Константин Генадьевич',
        article: 'ст.215',
        comment: '',
      },
      {
        number: '123',
        issuingAuthority: 'Судом пгт. Каа-Хем',
        accused: 'Иванова Мария Ильинична',
        article: 'ст.59',
        comment: 'Комментарий',
      },
      {
        number: '256',
        issuingAuthority: 'Судом г.Кызыл',
        accused: 'Васильев Дмитрий Федорович',
        article: 'ст.14',
        comment: '',
      },
      {
        number: '312',
        issuingAuthority: 'Судом г.Кызыл',
        accused: 'Дмитриев Антон Павлович',
        article: 'ст.140',
        comment: '',
      },
    ];
    const orders = [
      {
        number: '25',
        jurist: 'Плевако Федор Никифорович',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        comment: 'Тестовый комментарий',
        action: '44',
      },
      {
        number: '147',
        jurist: 'Глория Оллред',
        accused: 'Петров Петр Петрович',
        article: 'ст.74',
        comment: 'Тестовый комментарий',
        action: '68',
      },
      {
        number: '213',
        jurist: 'Плевако Федор Никифорович',
        accused: 'Николаев Иван Павлович',
        article: 'ст.39',
        comment: '',
        action: '79',
      },
      {
        number: '316',
        jurist: 'Плевако Федор Никифорович',
        accused: 'Николаев Иван Павлович',
        article: 'ст.39',
        comment: '',
        action: '79',
      },
      {
        number: '319',
        jurist: 'Глория Оллред',
        accused: 'Дмитриев Антон Павлович',
        article: 'ст.140',
        comment: 'Тестовый комментарий',
        action: '312',
      },
    ];
    const demoDate = beginDateZeroTime(new Date());
    actions.forEach(async (item, index) => {
      setTimeout(async () => await addAction({ ...item, date: demoDate }), index * 100);
    });
    orders.forEach(async (item, index) => {
      setTimeout(async () => {
        const action = await getActions(new Date(2000, 1, 1), new Date(3000, 1, 1), {
          number: item.action,
        });
        await addOrder({ ...item, date: demoDate, action: action[0]._id });
      }, 1500 + index * 100);
    });
  },
);
