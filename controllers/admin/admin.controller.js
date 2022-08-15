const { userdoc } = require('@truffle/contract/lib/contract/properties')
const User = require('../../models/user.model')

const userList = (req, res, next) => {
  User.find({ role: 'admin' })
    .then((accounts) => {
      res.json(accounts)
    })
    .catch(next)
}

const userUpdate = (req, res, next) => {
  User.findOneAndUpdate({ _id: req.body.user._id }, { ...req.body.user })
    .then((user) => {
      User.find({ role: 'admin' })
        .then((users) => res.json({ success: { users } }))
        .catch(next)
    })
    .catch(next)
}

module.exports = {
  userList,
  userUpdate,
}
