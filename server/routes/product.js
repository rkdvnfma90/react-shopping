const express = require('express')
const router = express.Router()
const multer = require('multer')
const { Product } = require('../models/Product')

//=================================
//             Product
//=================================

// https://github.com/expressjs/multer/blob/master/doc/README-ko.md multer 사용법
const storage = multer.diskStorage({
  // 파일이 저장될 경로
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  // 저장되는 파일명
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})

const upload = multer({ storage: storage }).single('file')

router.post('/image', (req, res) => {
  // 클라이언트에서 요청한 이미지를 저장을 해준다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err })
    }
    return res.json({
      success: true,
      // req.file.path , req.file.filename 해도 잘 가는듯
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    })
  })
})

router.post('/', (req, res) => {
  // 받아온 정보들을 DB에 넣어준다.
  const product = new Product(req.body)
  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

router.post('/products', (req, res) => {
  const limit = req.body.limit ? parseInt(req.body.limit) : 20
  const skip = req.body.skip ? parseInt(req.body.skip) : 0
  let findArg = {}

  for (let key in req.body.filters) {
    // books, price 들의 필터 개수
    if (req.body.filters[key].length > 0) {
      findArg[key] = req.body.filters[key]
    }
  }

  // product collection에 들어 있는 모든 상품 정보를 가져오기
  Product.find(findArg)
    .populate('writer') // 작성자에 대한 모든 정보를 가져올 수 있다.
    .skip(skip)
    .limit(limit)
    .exec((err, productInfo) => {
      if (err) return res.status(400).json({ success: false, err })
      return res
        .status(200)
        .json({ success: true, productInfo, postSize: productInfo.length })
    })
})

module.exports = router
