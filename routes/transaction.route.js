const express = require('express')
const router = express.Router()
const transCtrl = require('../controllers/transaction.controller.js')

router.route('/').get(transCtrl.getAllTransactions)

router.route('/remove').delete(transCtrl.removeTransaction)

module.exports = router
