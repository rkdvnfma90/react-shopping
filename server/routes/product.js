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
  const term = req.body.searchTerm
  let findArg = {}

  for (let key in req.body.filters) {
    // books, price 들의 필터 개수
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArg[key] = {
          // $gte : greater than equals
          // $lte : less than equals
          // 즉 price 필터에 있는 배열 ([0, 249] [250, 299])
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        }
      } else {
        findArg[key] = req.body.filters[key]
      }
    }
  }

  // 검색 키워드가 있을 경우 (like 검색 구현해보기)
  if (term) {
    // product collection에 들어 있는 모든 상품 정보를 가져오기
    Product.find(findArg)
      .find({ $text: { $search: term } }) // 검색어
      .populate('writer') // 작성자에 대한 모든 정보를 가져올 수 있다.
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length })
      })
  } else {
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
  }
})

router.get('/products_by_id', (req, res) => {
  const type = req.query.type
  let productIds = req.query.id

  if (type === 'array') {
    const ids = req.query.id.split(',')
    productIds = ids.map((item) => {
      return item
    })
  }

  Product.find({ _id: { $in: productIds } }) // SQL 의 in절 생각하면 됨
    .populate('writer')
    .exec((err, product) => {
      if (err) return res.status(400).send({ err })
      // .json() 으로 보내는게 아니라 send로 보내면 response.data에 product 정보가 바로 들어있음
      return res.status(200).send(product)
    })
})

module.exports = router
