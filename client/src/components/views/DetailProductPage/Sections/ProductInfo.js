import React from 'react'
import { Button, Descriptions } from 'antd'
import { useDispatch } from 'react-redux'
import { addTocart } from '../../../../_actions/user_actions'

function ProductInfo({ detail }) {
  const dispatch = useDispatch()

  const clickHandler = () => {
    // 필요한 정보를 Cart 필드에다가 넣어 준다.
    // Cart는 User 모델에서 관리하고 있기 때문에 redux를 사용한다.
    dispatch(addTocart(detail._id))
  }
  return (
    <div>
      <Descriptions title="Product Info">
        <Descriptions.Item label="Price">{detail.price}</Descriptions.Item>
        <Descriptions.Item label="Sold">{detail.sold}</Descriptions.Item>
        <Descriptions.Item label="View">{detail.views}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {detail.description}
        </Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button size="large" shape="round" type="danger" onClick={clickHandler}>
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

export default ProductInfo
