const express = require('express')
const router = express.Router()
const { User } = require('../models/User')
const { Product } = require('../models/Product')
const { Payment } = require('../models/Payment')
const { auth } = require('../middleware/auth')
const async = require('async')

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
    // cart 와 history 정보도 auth 미들웨어를 통과할 때 마다 상태를 가지고 있어야 함.
    cart: req.user.cart,
    history: req.user.history,
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

router.post('/addToCart', auth, (req, res) => {
  // 먼저 해당 유저의 정보를 다 가져옴 (req.user._id 사용할 수 있는 이유는 auth 미들웨어 때문)
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    // userInfo 는 User 모델의 document 이다.
    // 가져온 정보에서 Cart 에 넣으려 하는 상품이 이미 들어있는지 확인
    let duplicate = false
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true
      }
    })

    // 상품이 카트에 이미 있을 때
    if (duplicate) {
      User.findOneAndUpdate(
        {
          _id: req.user._id,
          'cart.id': req.body.productId, // 먼저 해당 User를 찾고 그 User의 cart array의 id가 productId 인 것을 찾는다.
        },
        {
          $inc: { 'cart.$.quantity': 1 }, // $inc는 증가시킨 다는 의미, cart의 quantity를 1 증가 시킨다.
        },
        {
          new: true, // 업데이트 된 정보를 받기위해 이 옵션이 필요하다.
        },
        (err, userInfo) => {
          // new: true 옵션을 줬기 때문에 userInfo에 업데이트 된 정보가 들어있다.
          if (err) return res.status(400).json({ success: false, err })
          res.status(200).send(userInfo.cart) // cart의 정보만 보내준다. (리듀서의 payload 로 들어감)
        }
      )
    } else {
      // 상품이 카트에 없을 때
      User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $push: {
            // cart 부분에 넣어준다.
            cart: {
              id: req.body.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        {
          new: true, // 업데이트 된 정보를 받기위해 이 옵션이 필요하다.
        },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err })
          res.status(200).send(userInfo.cart) // cart의 정보만 보내준다.
        }
      )
    }
  })
})

router.get('/removeFromCart', auth, (req, res) => {
  // 카트 목록에서 지우려고 한 상품을 먼저 지운다. (redux에 있는 cartDetail 정보도 같이 지워야 한다.)
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      // cart에서 id와 일치하는 항목을 삭제한다.
      $pull: {
        cart: {
          id: req.query.id,
        },
      },
    },
    {
      new: true,
    },
    (err, userInfo) => {
      const cart = userInfo.cart
      const array = cart.map((item) => {
        return item.id
      })

      Product.find({ _id: { $in: array } })
        .populate('writer')
        .exec((err, productInfo) => {
          // productInfo 와 cart 둘다 보내는 이유는 User collection의 cart 정보가 Product Collection 에는 없기 때문
          return res.status(200).json({
            productInfo,
            cart,
          })
        })

      // product collection에서 현재 남아있는 상품들의 정보를 가져오기
    }
  )
})

router.post('/successBuy', auth, (req, res) => {
  // 1. User collection 안에 history 필드 안에 간단한 결제 정보 넣어 주기.
  let history = []
  let transactionData = {}

  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentID,
    })
  })

  // 2. Payment collection 안에 자세한 결제 정보를 넣어 주기.
  transactionData.user = {
    // req.user 는 미들웨어 통해서 온 정보
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  }

  transactionData.data = req.body.paymentData
  transactionData.product = history

  // history 정보 저장
  User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $push: { history: history },
      $set: { cart: [] }, // 카트를 비워준다.
    },
    {
      new: true,
    },
    (err, user) => {
      if (err) return res.json({ success: false, err })

      // Payment collection에 transactionData 정보 저장
      const payment = new Payment(transactionData)
      payment.save((err, doc) => {
        if (err) return res.json({ success: false, err })

        // 3. Product collection 안에 sold 필드 정보 업데이트 하기.

        // 상품당 몇개의 quantity를 샀는지
        let products = []

        // doc은 payment document이다.
        doc.product.forEach((item) => {
          products.push({
            id: item.id,
            quantity: item.quantity,
          })
        })

        async.eachSeries(
          products,
          (item, callback) => {
            Product.update(
              {
                _id: item.id,
              },
              {
                $inc: {
                  sold: item.quantity,
                },
              },
              { new: false }, // front 로 보내주지 않아도 되므로 false
              callback
            )
          },
          (err) => {
            if (err) return res.status(400).json({ success: false, err })
            res
              .status(200)
              .json({ success: true, cart: user.cart, cartDetail: [] })
          }
        )
      })
    }
  )
})

module.exports = router
