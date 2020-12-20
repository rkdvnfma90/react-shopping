const { User } = require('../models/User')

const auth = (req, res, next) => {
  // 클라이언트의 쿠키에서 토큰을 가져옴
  const token = req.cookies.w_auth

  User.findByToken(token, (err, user) => {
    if (err) throw err
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      })

    // request에 담아주는 이유는 해당 미들웨어를 사용하는 곳에서도 사용할수 있게 하기 위함
    req.token = token
    req.user = user
    // next를 해주지 않으면 이 미들웨어에 계속 머물게 된다.
    next()
  })
}

module.exports = { auth }
