const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0,
    },
    books: {
      // 책들의 카테고리
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamp: true } // 등록 시간 및 업데이트 시간 갱신됨
)

// 검색 키워드가 걸렸으면 하는 필드 설정
productSchema.index(
  {
    title: 'text',
    description: 'text',
  },
  {
    weights: {
      title: 5, // title에 가중치 5 만큼 더 중요하게 검색이 된다.
      description: 1,
    },
  }
)

const Product = mongoose.model('Product', productSchema)

module.exports = { Product }
