const express = require('express')
const router = express.Router()
const { User } = require('../models/User')

const { auth } = require('../middleware/auth')

//=================================
//             User
//=================================

// auth는 미들웨어
router.get('/auth', auth, (req, res) => {
  // 여기까지 왔다면 성공적으로 미들웨어를 통과한 것이다. (인증 성공)
  res.status(200).json({
    _id: req.user._id, // auth 미들웨어에서 req를 설정했기에 사용 가능
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  })
})

router.post('/register', (req, res) => {
  // body-parser 가 클라이언트에서 요청한 값들을 받아 올 수 있다.
  // 회원 가입 할때 필요한 정보들을 클라이언트에서 받아와서 데이터 베이스에 저장한다.
  // req.body 에는 아래와 같은 json이 들어있다.
  // 이렇게 json 형의 데이터가 들어 있을 수 있는 것은 body-parser 가 있기 떄문.
  /*
     {
         id: "kpl",
         password: "1234"
     }
  */
  const user = new User(req.body)

  user.save((err, doc) => {
    // doc에는 저장할 데이터가 들어있음
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true,
    })
  })
})

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found',
      })

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Wrong password' })

      // 패스워드가 일치 한다면 해당 유저를 위한 토큰 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)
        // 쿠키를 사용하여 유저 토큰을 저장
        res.cookie('w_authExp', user.tokenExp)
        res.cookie('w_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        })
      })
    })
  })
})

router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: '', tokenExp: '' },
    (err, doc) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).send({
        success: true,
      })
    }
  )
})

module.exports = router
