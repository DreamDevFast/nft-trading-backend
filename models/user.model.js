const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const SALT_WORK_FACTOR = 10

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  approved: {
    type: Boolean,
    default: false,
  },
  currentCount: {
    type: Number,
    default: 0,
  },
  maxCount: {
    type: Number,
    default: 0,
  },
})
/*
 * Statics
 */
UserSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        return user
      })
      .catch((err) => res.json(err))
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ username: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
  },
}

UserSchema.pre('save', function (next) {
  var user = this
  // if (this.isNew) {
  //   this.createAt = this.updateAt = Date.now()
  // }
  // else {
  //   this.updateAt = Date.now()
  // }
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

module.exports = User = mongoose.model('users', UserSchema)
