const Account = require('../../models/account.model')
const User = require('../../models/user.model')

const accountList = (req, res, next) => {
  Account.find()
    .then((accounts) => {
      res.json(accounts)
    })
    .catch(next)
}

const accountAdd = (req, res, next) => {
  const { adminId } = req.body

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
            User.findOne({ _id: adminId })
              .then((user) => {
                user.currentCount++
                User.findOneAndUpdate({ _id: user._id }, { ...user })
                  .then((user) => {
                    Account.find()
                      .then((accounts) =>
                        res.json({
                          success: {
                            accounts,
                            currentCount: user.currentCount,
                          },
                        }),
                      )
                      .catch(next)
                  })
                  .catch(next)
              })
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
