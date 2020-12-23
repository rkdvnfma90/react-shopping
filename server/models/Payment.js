const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: Array,
      default: [],
    },
    data: {
      type: Array,
      default: [],
    },
    product: {
      type: Array,
      default: [],
    },
  },
  { timestamp: true } // 등록 시간 및 업데이트 시간 갱신됨
)

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = { Payment }
