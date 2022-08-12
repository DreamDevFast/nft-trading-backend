const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const mongoose = require('mongoose')
const helmet = require('helmet')
const key = require('./config/key')
const passport = require('passport')
const timer = require('./timer')
const path = require('path')
// const wssprovider = new ethers.providers.WebSocketProvider(env.WSS_KEY)

require('./config/passport')

// Import routes
const authRouter = require('./routes/auth.route')
const accountRouter = require('./routes/account.route')
const userRouter = require('./routes/user.route')

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
app.use('/auth', authRouter)
app.use('/nfttrading', accountRouter)
app.use('/user', userRouter)

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

const PORT = process.env.PORT || 5001

timer.run()

// var subscription = web3.eth
//   .subscribe(
//     'logs',
//     {
//       address: '0x3045FD0a5fC98F0f1Ac1f1680Fd9346683740C14',
//     },
//     function (error, result) {
//       if (!error) console.log(result)
//     },
//   )
//   .on('data', function (log) {
//     console.log(log)
//   })
//   .on('changed', function (log) {})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
  // let api_req = `https://api-kovan.etherscan.io/api?module=account&action=txlist&address=0x3045FD0a5fC98F0f1Ac1f1680Fd9346683740C14&startblock=0&endblock=99999999&sort=asc&apikey=3P53WGBY952N2TCWS3JEN819IQVXN5BMP2`
  // axios.get(api_req).then((response) => {
  //   if (response.data.message === 'OK') {
  //     console.log(response.data.result)
  //   }
  // })
  // web3.eth
  //   .subscribe(
  //     'logs',
  //     {
  //       address: '0x3045FD0a5fC98F0f1Ac1f1680Fd9346683740C14',
  //     },
  //     function (error, result) {
  //       if (!error) console.log(result)
  //     },
  //   )
  //   .on('data', function (log) {
  //     console.log(log)
  //   })
  //   .on('changed', function (log) {})
})
