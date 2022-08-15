const express = require('express')
const router = express.Router()
const accountCtrl = require('../controllers/user.controller.js')

router.route('/remove-all').post(accountCtrl.removeAll)
router.route('/').post(accountCtrl.list)

module.exports = router
