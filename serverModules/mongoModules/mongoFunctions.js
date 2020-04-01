const { Action, Order } = require('./mongooseSchema');

const getOneAction = (id = null) => new Promise((resolve) => {
  if (id === null) resolve(null);
  else {
    Action.findById(id, (err, doc) => {
      if (err || doc === null) resolve(null);
      else resolve(doc);
    });
  }
});

const getMaxNumberAction = () => new Promise((resolve) => {
  Action.find({})
    .sort('-creationNumber')
    .limit(1)
    .exec((err, doc) => {
      if (err || doc === null || doc.length === 0) resolve(0);
      else resolve(doc[0].creationNumber);
    });
});

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
    (date === null
        || number === null
        || issuingAuthority === null
        || accused === null
        || article === null)
      && id === null
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
      newAction.save(newAction, (err, doc) => {
        if (err) resolve(null);
        else resolve(doc);
      });
    });
  }
});

module.exports = { addAction, getOneAction, getMaxNumberAction };
