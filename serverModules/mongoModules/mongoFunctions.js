// Функции работы с базой данных
const mongoose = require('mongoose');
const { Action, Order } = require('./mongooseSchema');

// Получить дело по id.
const getOneAction = (id = null) => new Promise((resolve) => {
  if (id === null) resolve(null);
  else {
    Action.findById(id, (err, doc) => {
      if (err || doc === null) resolve(null);
      else resolve(doc);
    });
  }
});

// Получить ордер по id.
const getOneOrder = (id = null) => new Promise((resolve) => {
  if (id === null) resolve(null);
  else {
    Order.findById(id, (err, doc) => {
      if (err || doc === null) resolve(null);
      else resolve(doc);
    });
  }
});

// Максмальный номер дела. Нужно для автонумерации дел.
const getMaxNumberAction = () => new Promise((resolve) => {
  Action.find({})
    .sort('-creationNumber')
    .limit(1)
    .exec((err, doc) => {
      if (err || doc === null || doc.length === 0) resolve(0);
      else resolve(doc[0].creationNumber);
    });
});

// Максмальный номер ордера. Нужно для автонумерации ордеров.
const getMaxNumberOrder = () => new Promise((resolve) => {
  Order.find({})
    .sort('-creationNumber')
    .limit(1)
    .exec((err, doc) => {
      if (err || doc === null || doc.length === 0) resolve(0);
      else resolve(doc[0].creationNumber);
    });
});

// Добавление или изменение дела
const addAction = ({
  id = null,
  date = null,
  number = null,
  issuingAuthority = null,
  accused = null,
  article = null,
  comment = '',
} = {}) => new Promise((resolve) => {
  if (
    id === null
      && (date === null
        || number === null
        || issuingAuthority === null
        || accused === null
        || article === null)
  ) resolve(null);
  else if (id) {
    getOneAction(id).then((result) => {
      const action = {
        date: date || result.date,
        number: number || result.number,
        issuingAuthority: issuingAuthority || result.issuingAuthority,
        accused: accused || result.accused,
        article: article || result.article,
        comment: comment || result.comment,
      };
      Action.findByIdAndUpdate(id, action, (err, doc) => {
        if (err) resolve(null);
        else resolve(doc);
      });
    });
  } else {
    getMaxNumberAction().then((maxNumber) => {
      const newAction = new Action({
        date,
        number,
        issuingAuthority,
        accused,
        article,
        comment,
        creationDate: new Date(),
        creationNumber: maxNumber + 1,
      });
      newAction.save((err, doc) => {
        if (err) resolve(null);
        else resolve(doc);
      });
    });
  }
});

// Добавление или изменение ордера
const addOrder = ({
  id = null,
  date = null,
  number = null,
  jurist = null,
  accused = null,
  article = null,
  action = null,
  comment = '',
} = {}) => new Promise((resolve) => {
  if (
    id === null
      && (date === null
        || number === null
        || jurist === null
        || accused === null
        || article === null
        || action === null)
  ) resolve(null);
  else if (id) {
    getOneOrder(id).then((result) => {
      const order = {
        date: date || result.date,
        number: number || result.number,
        jurist: jurist || result.jurist,
        accused: accused || result.accused,
        article: article || result.article,
        comment: comment || result.comment,
        action: action || result.action,
      };
      Order.findByIdAndUpdate(id, order, (err, doc) => {
        if (err) resolve(null);
        else resolve(doc);
      });
    });
  } else {
    getMaxNumberOrder().then((maxNumber) => {
      const newOrder = new Order({
        date,
        number,
        jurist,
        accused,
        article,
        comment,
        creationDate: new Date(),
        creationNumber: maxNumber + 1,
        action: mongoose.Types.ObjectId(action),
      });
      newOrder.save((err, doc) => {
        if (err) resolve(null);
        else resolve(doc);
      });
    });
  }
});

const getActions = (
  startDate = new Date(2000, 0, 1),
  endDate = new Date(3000, 0, 1),
  filter = {},
) => new Promise((resolve) => {
  Action.find({
    $and: [{ creationDate: { $gte: startDate } }, { creationDate: { $lte: endDate } }, filter],
  })
    .sort('-creationDate')
    .exec((err, doc) => {
      if (err) resolve(null);
      else resolve(doc);
    });
});

const getOrders = (
  startDate = new Date(2000, 0, 1),
  endDate = new Date(3000, 10, 1),
  filter = {},
) => new Promise((resolve) => {
  Order.find({
    $and: [{ creationDate: { $gte: startDate } }, { creationDate: { $lte: endDate } }, filter],
  })
    .sort('-creationDate')
    .exec((err, doc) => {
      if (err) resolve(null);
      else resolve(doc);
    });
});

module.exports = {
  addAction,
  getOneAction,
  getMaxNumberAction,
  addOrder,
  getOneOrder,
  getMaxNumberOrder,
  getActions,
  getOrders,
};
