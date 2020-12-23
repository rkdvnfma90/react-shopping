const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const moment = require('moment')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minglength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  cart: {
    type: Array,
    default: [],
  },
  // 결제 정보
  history: {
    type: Array,
    default: [],
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
})

// 'save' 하기 전에 해당 함수 실행
// 사용자 저장하기 전에 패스워드를 암호화 하는 함수
userSchema.pre('save', function (next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err)

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
        // hash는 암호화된 비밀번호
        user.password = hash
        // 여기서의 next는 index.js의 user.save 이다.
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

userSchema.methods.generateToken = function (cb) {
  const user = this
  const token = jwt.sign(user._id.toHexString(), 'secret')
  const oneHour = moment().add(1, 'hour').valueOf()

  user.tokenExp = oneHour
  user.token = token
  user.save(function (err, user) {
    if (err) return cb(err)
    cb(null, user)
  })
}

/* https://github.com/bestdevhyo1225/dev-log/blob/master/MongoDB/Mongoose-statics-methods.md 참조
  스키마.methods 에서의 this는 this가 호출한 대상을 가리킨다. 예를들어
  user.generateToken 하면 this는 user를 가리키는 것.
  statics는 this가 모델 그 자체를 가리킨다. 즉 mongoose 모델 (User) 를 가리키는 것 (조회할때 주로 사용)
  그렇기 때문에 findByToken에서 mongoose 함수인 findOne을 호출 할 수 있는 것이다.
*/
userSchema.statics.findByToken = function (token, cb) {
  const user = this

  // 토큰 decode하여 검증하는 부분
  jwt.verify(token, 'secret', function (err, decode) {
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
