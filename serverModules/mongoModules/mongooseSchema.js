// Настройка схемы mongoose
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Юристы
const Jurist = mongoose.model(
  'jurist',
  new Schema(
    {
      name: String,
    },
    { versionKey: false },
  ),
);

// Обвиняемый
const Accused = mongoose.model(
  'accused',
  new Schema(
    {
      name: String,
    },
    { versionKey: false },
  ),
);

// Дела
const Action = mongoose.model(
  'action',
  new Schema(
    {
      date: Date,
      number: String,
      issuingAuthority: String,
      accused: String,
      article: String,
      creationDate: Date,
      creationNumber: Number,
      comment: String,
      actionString: String,
    },
    { versionKey: false },
  ),
);

// Ордера
const Order = mongoose.model(
  'order',
  new Schema(
    {
      date: Date,
      number: String,
      jurist: String,
      accused: String,
      article: String,
      creationDate: Date,
      creationNumber: Number,
      comment: String,
      action: [{ type: Schema.Types.ObjectId, ref: 'action' }],
      actionString: String,
    },
    { versionKey: false },
  ),
);

module.exports.Accused = Accused;
module.exports.Jurist = Jurist;
module.exports.Action = Action;
module.exports.Order = Order;
