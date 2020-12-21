import React, { useEffect, useState } from 'react'
import { Col, Card, Row } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { DingtalkOutlined } from '@ant-design/icons'
import axios from 'axios'
import ImageSlider from '../../utils/ImageSlider'
import CheckBox from './Sections/CheckBox'
import RadioBox from './Sections/RadioBox'
import SearchFeature from './Sections/SearchFeature'
import { books, price } from './Sections/Datas'

function LandingPage() {
  const [Products, setProducts] = useState([])
  const [Skip, setSkip] = useState(0) // 초기 값으로는 처음 데이터 부터 보여줘야 하기에 0
  const [Limit, setLimit] = useState(8) // 최대 8개씩 데이터를 가져옴
  const [PostSize, setPostSize] = useState(0)
  const [Filters, setFilters] = useState({
    books: [],
    price: [],
  })
  const [SearchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const body = {
      skip: Skip,
      limit: Limit,
      searchTerm: SearchTerm,
      filters: Filters,
    }

    getProducts(body)
  }, [SearchTerm, Filters])

  const getProducts = (body) => {
    axios.post('/api/product/products', body).then((response) => {
      if (response.data.success) {
        if (body.loadMore) {
          setProducts([...Products, ...response.data.productInfo])
        } else {
          setProducts(response.data.productInfo)
        }
        // 더보기 버튼을 컨트롤 하기 위한 post 의 개수
        setPostSize(response.data.postSize)
      } else {
        alert('상품을 가져오는데 실패 했습니다.')
      }
    })
  }

  const loadMoreHandler = () => {
    const skip = Skip + Limit
    const body = {
      skip: skip,
      limit: Limit,
      loadMore: true,
    }

    getProducts(body)
    setSkip(skip)
  }

  // 한 row의 사이즈는 24 사이즈이다.
  // lg = 6 의 의미는 한 줄에 4개의 요소가 들어 간다는 뜻
  const renderCards = Products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card cover={<ImageSlider images={product.images} />}>
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    )
  })

  const handlePrice = (value) => {
    const priceData = price
    let priceArray = []

    for (let key in priceData) {
      if (priceData[key]._id === parseInt(value, 10)) {
        // data[key].array 는 price 필터의 array 값이다 ([0,199] [200,249] 등등)
        priceArray = priceData[key].array
      }
    }

    return priceArray
  }

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters }
    newFilters[category] = filters

    if (category === 'price') {
      const priceValues = handlePrice(filters)
      newFilters[category] = priceValues
    }

    setSkip(0)
    setFilters(newFilters)
  }

  // 쓰로틀링 추가해주기 !!
  const updateSearchTerm = (newSearchTerm) => {
    const body = {
      skip: 0, // DB에서 처음부터 들고와야 하기 때문에 0
      limit: Limit,
      filters: Filters,
      searchTerm: SearchTerm,
    }

    setSkip(0)
    setSearchTerm(newSearchTerm)
    //getProducts(body)
  }

  return (
    <div style={{ width: '75%', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>
          Yes 25 <DingtalkOutlined />
        </h2>
      </div>

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* 체크박스 필터 영역 */}
          <CheckBox
            list={books}
            handleFilters={(filters) => handleFilters(filters, 'books')}
          />
        </Col>

        <Col lg={12} xs={24}>
          {/* 라디오박스 필터 영역 */}
          <RadioBox
            list={price}
            handleFilters={(filters) => handleFilters(filters, 'price')}
          />
        </Col>
      </Row>

      {/* 검색 영역 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '1rem auto',
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerm} />
      </div>

      {/* gutter는 여백 */}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      <br />

      {PostSize >= Limit && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={loadMoreHandler}>더보기</button>
        </div>
      )}
    </div>
  )
}

export default LandingPage
