import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductImage from './Sections/ProductImage'
import ProductInfo from './Sections/ProductInfo'
import { Row, Col } from 'antd'

function DetailProductPage({ match }) {
  // match는 props에 기본으로 있는 값으로 앞에서 :productId 에 넘어온 값을 알 수 있다.
  const productId = match.params.productId

  const [Product, setProduct] = useState({})

  useEffect(() => {
    axios
      .get(`/api/product/products_by_id?id=${productId}&type=single`)
      .then((response) => {
        setProduct(response.data[0])
      })
      .catch((err) => alert(err))
  }, [])
  return (
    <div style={{ width: '100%', padding: '3rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>{Product.title}</h1>
      </div>

      <br />

      <Row gutter={[16, 16]}>
        <Col lg={12} sm={24}>
          {/* ProductImage */}
          <ProductImage detail={Product} />
        </Col>
        <Col lg={12} sm={24}>
          {/* ProductInfo */}
          <ProductInfo detail={Product} />
        </Col>
      </Row>
    </div>
  )
}

export default DetailProductPage
