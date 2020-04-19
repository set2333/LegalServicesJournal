// Функции работы с базой данных
const mongoose = require('mongoose');
const { Action, Order } = require('./mongooseSchema');

// Функция получения фильтрующего объекта.
// accused и jurist - ищут не по полному совпадению, а по вхождению
// jurist применяется только для фильтрации ордеров.
const getFilter = (filter, byOrder = false) => {
  const result = {};
  for (const [key, value] of Object.entries(filter)) {
    if (key === 'accused' || (byOrder && key === 'jurist')) result[key] = { $regex: new RegExp(value), $options: 'i' };
    else if (byOrder && key === 'orderNumber') result.number = value;
    else if (key !== 'jurist' && key !== 'orderNumber') result[key] = value;
  }
  return result;
};

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

// Получение списка ордеров
const getOrders = (
  startDate = new Date(2000, 0, 1),
  endDate = new Date(3000, 10, 1),
  filter = {},
) => new Promise((resolve) => {
  Order.find({
    $and: [
      { creationDate: { $gte: startDate } },
      { creationDate: { $lte: endDate } },
      getFilter(filter, true),
    ],
  })
    .sort('-creationDate')
    .exec((err, doc) => {
      if (err) resolve(null);
      else resolve(doc);
    });
});

// Получить дело по id.
const getOneAction = (id = null) => new Promise((resolve) => {
  if (id === null) resolve(null);
  else {
    Action.findById(id, (err, action) => {
      if (err || action === null) resolve(null);
      else {
        getOrders(new Date(2000, 0, 1), new Date(3000, 10, 1), { action: action._id }).then(
          (orders) => {
            if (orders === null) resolve(null);
            else {
              resolve({
                id: action._id,
                date: action.date,
                number: action.number,
                issuingAuthority: action.issuingAuthority,
                accused: action.accused,
                article: action.article,
                measureDate: action.measureDate,
                comment: action.comment,
                creationDate: action.creationDate,
                creationNumber: action.creationNumber,
                actionString: action.actionString,
                orders,
              });
            }
          },
          () => resolve({
            id: action._id,
            date: action.date,
            number: action.number,
            issuingAuthority: action.issuingAuthority,
            accused: action.accused,
            article: action.article,
            measureDate: action.measureDate,
            comment: action.comment,
            creationDate: action.creationDate,
            creationNumber: action.creationNumber,
            actionString: action.actionString,
            orders: [],
          }),
        );
      }
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

// Добавление или изменение дела
const addAction = ({
  id = null,
  date = null,
  number = null,
  issuingAuthority = null,
  accused = null,
  article = null,
  measureDate = null,
  creationDate = null,
  creationNumber = null,
  comment = '',
} = {}) => new Promise((resolve) => {
  if (id === null && accused === null) resolve(null);
  else if (id) {
    getOneAction(id).then((result) => {
      const action = {
        date: date || result.date,
        number: number || result.number,
        issuingAuthority: issuingAuthority || result.issuingAuthority,
        accused: accused || result.accused,
        article: article || result.article,
        measureDate: measureDate || result.measureDate,
        creationDate: creationDate || result.creationDate,
        creationNumber: creationNumber || result.creationNumber,
        comment: comment || result.comment,
      };
      Action.findByIdAndUpdate(id, action, { returnOriginal: false }, (err, doc) => {
        if (err) resolve(null);
        else resolve(doc);
      });
    });
  } else {
    getMaxNumberAction().then((maxNumber) => {
      const newCreationDate = new Date();
      const newAction = new Action({
        date,
        number,
        issuingAuthority,
        accused,
        article,
        comment,
        creationDate: creationDate || newCreationDate,
        creationNumber: creationNumber || maxNumber + 1,
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
  action = null,
  comment = '',
} = {}) => new Promise((resolve) => {
  if (id === null && jurist === null) resolve(null);
  else if (id) {
    getOneOrder(id).then((result) => {
      getOneAction(action || result.action).then((currentAction) => {
        if (currentAction === null) resolve(null);
        else {
          const order = {
            date: date || result.date,
            number: number || result.number,
            jurist: jurist || result.jurist,
            comment: comment || result.comment,
            action: action
              ? mongoose.Types.ObjectId(action)
              : mongoose.Types.ObjectId(result.action[0]),
          };
          Order.findByIdAndUpdate(id, order, { returnOriginal: false }, (err, doc) => {
            if (err) resolve(null);
            else resolve(doc);
          });
        }
      });
    });
  } else {
    getMaxNumberOrder().then((maxNumber) => {
      getOneAction(action).then((currentAction) => {
        if (currentAction === null) resolve(null);
        else {
          const newOrder = new Order({
            date,
            number,
            jurist,
            comment,
            creationDate: new Date(),
            creationNumber: maxNumber + 1,
            action: mongoose.Types.ObjectId(action),
          });
          newOrder.save((err, doc) => {
            if (err) resolve(null);
            else resolve(doc);
          });
        }
      });
    });
  }
});

// Получение списка дел
const getActions = (
  startDate = new Date(2000, 0, 1),
  endDate = new Date(3000, 0, 1),
  filter = {},
) => new Promise((resolve) => {
  Action.find({
    $and: [
      { creationDate: { $gte: startDate } },
      { creationDate: { $lte: endDate } },
      getFilter(filter),
    ],
  })
    .sort('-creationDate')
    .exec((err, doc) => {
      if (err) resolve(null);
      else if (filter.jurist || filter.orderNumber) {
        const filterOrder = {};
        if (filter.jurist) filterOrder.jurist = filter.jurist;
        if (filter.orderNumber) filterOrder.orderNumber = filter.orderNumber;
        getOrders(startDate, endDate, filterOrder).then(
          (orders) => {
            const newDoc = doc.filter((action) => orders.find((order) => order.action[0].toString() === action._id.toString()));
            const promises = newDoc.map(({ id }) => getOneAction(id));
            resolve(Promise.all(promises));
          },
          () => resolve(null),
        );
      } else {
        const promises = doc.map(({ id }) => getOneAction(id));
        resolve(Promise.all(promises));
      }
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
