const Account = require('../../models/account.model')

const accountList = (req, res, next) => {
  Account.find()
    .then((accounts) => {
      res.json(accounts)
    })
    .catch(next)
}

const accountAdd = (req, res, next) => {
  Account.findOne({ connectedAccount: req.body.connectedAccount })
    .then((account) => {
      if (account) {
        res.send({ type: 'Error', message: 'Already Exist' })
      } else {
        new Account({
          connectedAccount: req.body.connectedAccount,
          accounts: [],
        })
          .save()
          .then(() => {
            Account.find()
              .then((accounts) => res.json({ success: { accounts } }))
              .catch(next)
          })
          .catch(next)
      }
    })
    .catch(next)
}

const accountRemove = (req, res, next) => {
  Account.deleteOne({ connectedAccount: req.body.connectedAccount })
    .then(() => {
      Account.find()
        .then((accounts) => res.json({ success: { accounts } }))
        .catch(next)
    })
    .catch(next)
}

module.exports = {
  accountList,
  accountAdd,
  accountRemove,
}
