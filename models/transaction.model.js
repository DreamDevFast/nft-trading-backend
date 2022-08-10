const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionSchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  rawTransaction: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  transactionHash: {
    type: String,
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
