const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  to: {
    type: String,
  },
  gasLimit: {
    type: Number,
    required: true,
  },
  maxPriorityFeePerGas: {
    type: Number,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  monitorMethod: {
    type: String,
    requried: true,
  },
  monitorFunction: {
    type: String,
  },
})

module.exports = Transaction = mongoose.model('transactions', TransactionSchema)
