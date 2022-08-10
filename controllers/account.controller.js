const User = require('../models/user.model')
const Transaction = require('../models/transaction.model')
const axois = require('axios')
const { initFunctionMonitor } = require('../functionMonitor')

const getAccounts = (req, res, next) => {
  const _id = req.body._id

  User.findOne({ _id })
    .then((user) => {
      res.json(user.accounts)
    })
    .catch(next)
}

const saveAccount = (req, res, next) => {
  let _id = req.body._id
  let privateKey = req.body.privateKey
  User.findOne({ _id })
    .then((user) => {
      if (user.accounts) {
        console.log(user.accounts)
        if (user.accounts.length >= 5)
          res.status(400).send({ message: 'Cannot set accounts over 5!' })
        else {
          user.accounts.push(privateKey)
          user
            .save()
            .then((usr) => res.json({ success: usr }))
            .catch(next)
        }
      }
    })
    .catch(next)
}

const removeAccount = (req, res, next) => {
  let _id = req.body._id
  let privateKey = req.body.privateKey
  User.findOne({ _id })
    .then((user) => {
      if (user.accounts) {
        console.log(user.accounts)
        if (user.accounts.includes(privateKey)) {
          user.accounts = user.accounts.filter(
            (account) => account !== privateKey,
          )
          user
            .save()
            .then((user) => res.json({ success: user }))
            .catch(next)
        }
      }
    })
    .catch(next)
}

const removeAll = (req, res, next) => {
  let _id = req.body._id
  console.log(_id)
  User.findOne({ _id })
    .then((user) => {
      console.log(user)
      user.accounts = []
      user
        .save()
        .then((user) => {
          console.log(user)
          res.json(user)
        })
        .catch(next)
    })
    .catch(next)
}

const getAbiFromAddress = (req, res, next) => {
  let address = req.body.address
  let api_req = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=3P53WGBY952N2TCWS3JEN819IQVXN5BMP2`
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
    account,
    time,
    rawTransaction,
    monitorMethod,
    monitorFunction,
  } = req.body

  Transaction.findOne({ rawTransaction })
    .then((trans) => {
      if (trans) {
        Transaction.find({ monitorMethod: 'function', status: 'pending' })
          .then((transactions) => {
            initFunctionMonitor(transactions)
            res.json({ message: 'That transaction is already exists!' })
          })
          .catch(next)
      } else {
        console.log('Hi')
        let transaction
        if (monitorMethod === 'time') {
          transaction = new Transaction({
            userId: _id,
            account,
            time: new Date(time),
            rawTransaction,
            status: 'pending',
            monitorMethod,
          })
        } else {
          transaction = new Transaction({
            userId: _id,
            account,
            time: new Date(time),
            rawTransaction,
            status: 'pending',
            monitorMethod,
            monitorFunction,
          })
        }
        console.log('Hi again')
        transaction
          .save()
          .then((trans) => {
            console.log(trans)
            Transaction.find({ monitorMethod: 'function', status: 'pending' })
              .then((transactions) => {
                initFunctionMonitor(transactions)
                res.json({ success: trans })
              })
              .catch(next)
          })
          .catch(next)
      }
    })
    .catch(next)
}

module.exports = {
  getAccounts,
  saveAccount,
  removeAccount,
  removeAll,
  getAbiFromAddress,
  mintDataSave,
}
