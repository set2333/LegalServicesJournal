// Настройка схемы mongoose
const mongoose = require('mongoose');

const { Schema } = mongoose;

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
      creationDate: Date,
      creationNumber: Number,
      comment: String,
      action: [{ type: Schema.Types.ObjectId, ref: 'action' }],
    },
    { versionKey: false },
  ),
);

module.exports.Action = Action;
module.exports.Order = Order;
