const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
  connectedAccount: {
    type: String,
    required: true,
  },
  accounts: [String],
})

module.exports = accounts = mongoose.model('accounts', AccountSchema)
