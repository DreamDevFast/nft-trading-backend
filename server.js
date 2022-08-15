const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const mongoose = require('mongoose')
const helmet = require('helmet')
const key = require('./config/key')
const passport = require('passport')
const timer = require('./timer')
const functionMonitor = require('./functionMonitor')
const path = require('path')
const User = require('./models/user.model')
// const wssprovider = new ethers.providers.WebSocketProvider(env.WSS_KEY)

require('./config/passport')

// Import routes
const adminAuthRouter = require('./routes/admin/auth.route')
const adminAccountRouter = require('./routes/admin/account.route')
const adminAdminRouter = require('./routes/admin/admin.route')
const authRouter = require('./routes/auth.route')
const accountRouter = require('./routes/account.route')
const userRouter = require('./routes/user.route')
const transactionRouter = require('./routes/transaction.route')

const app = express()
app.use(express.static(path.join(__dirname, 'build')))

app.use(
  cors({
    origin: '*',
  }),
)
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())

// Implement route
app.use('/admin/auth', adminAuthRouter)
app.use('/admin/account', adminAccountRouter)
app.use('/admin/admin', adminAdminRouter)
app.use('/auth', authRouter)
app.use('/nfttrading', accountRouter)
app.use('/user', userRouter)
app.use('/transaction', transactionRouter)

// Implement 500 error route
app.use(function (err, req, res, next) {
  console.log(err)
  res.status(500).send('Something is broken.')
})

// Implement 404 error route
app.use(function (req, res, next) {
  res.status(404).send('Sorry we could not find that.')
})

mongoose
  .connect(process.env.MONGOLAB_URL || key.MONGO_URL)
  .then(() => console.log('mongoose connected.'))
  .catch((err) => console.log('mongoose error: ' + err))

function initial() {
  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new User({
        username: 'super_admin',
        email: 'super_admin@nft-trading.com',
        password: 'super_admin',
        approved: true,
        role: 'super_admin',
      }).save((err) => {
        if (err) {
          console.log('error', err)
        }
        console.log("added 'super_admin' to user collections")
      })
    }
  })
}

initial()
const PORT = process.env.PORT || 5001

timer.run()
functionMonitor.run()

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
