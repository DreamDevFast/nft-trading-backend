const express = require('express')
const router = express.Router()
const accountCtrl = require('../../controllers/admin/account.controller.js')

router.route('/').get(accountCtrl.accountList)
router.route('/add').post(accountCtrl.accountAdd)
router.route('/remove').delete(accountCtrl.accountRemove)

module.exports = router
