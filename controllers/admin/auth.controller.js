const User = require('../../models/user.model')
const jwt = require('jsonwebtoken')
const key = require('../../config/key')
const salt = 10

const register = (req, res, next) => {
  if (req.body.password !== req.body.password_confirmation)
    res.json({ type: 'Error', message: 'Password confirmation error.' })
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.json({ type: 'Error', message: 'User Already Exist.' })
      } else {
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        })
        newUser
          .save()
          .then((saveduser) => {
            res.json({ success: saveduser })
          })
          .catch(next)
      }
    })
    .catch(next)
}

const login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        if (!user.approved) {
          res.send({
            isAuthenticated: false,
            token: null,
            message: 'Not Approved',
          })
        } else {
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              const token = jwt.sign(
                {
                  _id: user.id,
                  username: user.username,
                  email: user.email,
                  role: user.role,
                },
                key.SECRET,
              )
              res.status(200).send({
                success: {
                  isAuthenticated: true,
                  token: token,
                  message: 'user found & logged in',
                },
              })
            } else {
              console.log(err)
              console.log(isMatch)
              console.log(req.body.password)
              res.send({
                isAuthenticated: false,
                token: null,
                message: 'password is not correct',
              })
            }
          })
        }
      } else
        res.send({
          isAuthenticated: false,
          token: null,
          message: 'user not found',
        })
    })
    .catch(next)
}

module.exports = {
  register,
  login,
}
