const express = require('express')
const router = express.Router()
const accountCtrl = require('../controllers/account.controller.js')

router.route('/getAccounts').post(accountCtrl.getAccounts)

router.route('/saveAccount').post(accountCtrl.saveAccount)

router.route('/removeAccount').post(accountCtrl.removeAccount)

router.route('/removeAll').post(accountCtrl.removeAll)

router.route('/getAbiFromAddress').post(accountCtrl.getAbiFromAddress)

router.route('/mintDataSave').post(accountCtrl.mintDataSave)

router.route('/getAllTransactions').get(accountCtrl.getAllTransactions)

module.exports = router
