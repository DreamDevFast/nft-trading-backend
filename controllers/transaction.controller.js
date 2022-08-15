const Transaction = require('../models/transaction.model')
const mongoose = require('mongoose')
const { setFlag } = require('../functionMonitor')

const getAllTransactions = (req, res, next) => {
  let userId = mongoose.Types.ObjectId(req.body.userId)
  Transaction.find({
    userId,
  })
    .then((transactions) => res.json(transactions))
    .catch(next)
}

const removeTransaction = (req, res, next) => {
  Transaction.deleteOne({ _id: req.body._id })
    .then(() => {
      Transaction.find()
        .then((txs) => {
          setFlag(true)
          res.json({ success: { transactions: txs } })
        })
        .catch(next)
    })
    .catch(next)
}

module.exports = {
  getAllTransactions,
  removeTransaction,
}
