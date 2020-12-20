const express = require('express')
const router = express.Router()
const multer = require('multer')

//=================================
//             Product
//=================================

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
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    })
  })
})

module.exports = router
