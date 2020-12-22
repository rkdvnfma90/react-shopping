import React, { useEffect } from 'react'
import axios from 'axios'

function DetailProductPage({ match }) {
  // match는 props에 기본으로 있는 값으로 앞에서 :productId 에 넘어온 값을 알 수 있다.
  const productId = match.params.productId

  useEffect(() => {
    axios
      .get(`/api/product/products_by_id?id=${productId}&type=single`)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data)
        } else {
          alert('상세정보 조회시 에러가 발생했습니다.')
        }
      })
  }, [])
  return <div>DetailProductPage</div>
}

export default DetailProductPage
