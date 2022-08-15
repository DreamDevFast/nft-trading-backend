const Transaction = require('../models/transaction.model')
const { setFlag } = require('../functionMonitor')

const getAllTransactions = (req, res, next) => {
  Transaction.find()
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
