import React, { useEffect, useState } from 'react'
import { Col, Card, Row } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { DingtalkOutlined } from '@ant-design/icons'
import axios from 'axios'

function LandingPage() {
  const [Products, setProducts] = useState([])
  useEffect(() => {
    axios.post('/api/product/products').then((response) => {
      if (response.data.success) {
        setProducts(response.data.productInfo)
      } else {
        alert('상품을 가져오는데 실패 했습니다.')
      }
    })
  })

  // 한 row의 사이즈는 24 사이즈이다.
  // lg = 6 의 의미는 한 줄에 4개의 요소가 들어 간다는 뜻
  const renderCards = Products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          cover={
            <img
              style={{ width: '100%', maxHeight: '150px' }}
              src={`http://localhost:5000/${product.images[0]}`}
            />
          }
        >
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    )
  })

  return (
    <div style={{ width: '75%', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>
          Yes 25 <DingtalkOutlined />
        </h2>
      </div>

      {/* gutter는 여백 */}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button>더보기</button>
      </div>
    </div>
  )
}

export default LandingPage
