const User = require('../models/user.model')
const Account = require('../models/account.model')
const Transaction = require('../models/transaction.model')
const axois = require('axios')
const mongoose = require('mongoose')
const { setFlag } = require('../functionMonitor')

const getAccounts = (req, res, next) => {
  const _id = mongoose.Types.ObjectId(req.body._id)

  Account.findOne({ _id })
    .then((account) => {
      if (account) {
        res.json(account.accounts)
      } else {
        res.json([])
      }
    })
    .catch(next)
}

const saveAccount = (req, res, next) => {
  let _id = mongoose.Types.ObjectId(req.body._id)
  let privateKey = req.body.privateKey
  Account.findOne({ _id })
    .then((account) => {
      if (account.accounts) {
        account.accounts.push(privateKey)
        account
          .save()
          .then((usr) => res.json({ success: usr }))
          .catch(next)
      }
    })
    .catch(next)
}

const removeAccount = (req, res, next) => {
  let _id = mongoose.Types.ObjectId(req.body._id)
  let privateKey = req.body.privateKey
  Account.findOne({ _id })
    .then((account) => {
      if (account.accounts) {
        console.log(account.accounts)
        if (account.accounts.includes(privateKey)) {
          account.accounts = account.accounts.filter(
            (account) => account !== privateKey,
          )
          account
            .save()
            .then((account) => res.json({ success: account }))
            .catch(next)
        }
      }
    })
    .catch(next)
}

const removeAll = (req, res, next) => {
  let _id = mongoose.Types.ObjectId(req.body._id)
  console.log(_id)
  Account.findOne({ _id })
    .then((account) => {
      console.log(account)
      account.accounts = []
      account
        .save()
        .then((account) => {
          console.log(account)
          res.json(account)
        })
        .catch(next)
    })
    .catch(next)
}

const getAbiFromAddress = (req, res, next) => {
  let address = req.body.address
  let api_req = `https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=3P53WGBY952N2TCWS3JEN819IQVXN5BMP2`
  axois
    .get(api_req)
    .then((response) => {
      if (response.data.message === 'OK')
        res.json({ success: response.data.result })
      else res.send({ type: 'Error', message: response.data.result })
    })
    .catch(next)
}

const mintDataSave = (req, res, next) => {
  let {
    _id,
    taskName,
    account,
    privateKey,
    gasLimit,
    maxPriorityFeePerGas,
    value,
    data,
    time,
    to,
    monitorMethod,
    monitorFunction,
  } = req.body

  let transaction
  if (monitorMethod === 'time') {
    transaction = new Transaction({
      userId: mongoose.Types.ObjectId(_id),
      taskName,
      account,
      privateKey,
      gasLimit,
      maxPriorityFeePerGas,
      value,
      data,
      to,
      time: new Date(time),
      status: 'pending',
      monitorMethod,
    })
  } else {
    transaction = new Transaction({
      userId: mongoose.Types.ObjectId(_id),
      taskName,
      account,
      privateKey,
      gasLimit,
      maxPriorityFeePerGas,
      value,
      data,
      to,
      time: new Date(time),
      status: 'pending',
      monitorMethod,
      monitorFunction,
    })
  }
  transaction
    .save()
    .then((trans) => {
      console.log(trans)
      setFlag(true)
      res.json({ success: trans })
    })
    .catch(next)
}

const getAllTransactions = (req, res, next) => {
  Transaction.find()
    .then((transactions) => {
      res.json(transactions)
    })
    .catch(next)
}
module.exports = {
  getAccounts,
  getAllTransactions,
  saveAccount,
  removeAccount,
  removeAll,
  getAbiFromAddress,
  mintDataSave,
}
