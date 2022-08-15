const express = require('express')
const router = express.Router()
const adminCtrl = require('../../controllers/admin/admin.controller.js')

router.route('/').get(adminCtrl.userList)
router.route('/update').post(adminCtrl.userUpdate)


module.exports = router