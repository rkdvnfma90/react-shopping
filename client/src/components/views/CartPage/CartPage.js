import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getCartItems, removeCartItem } from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock'
import { Empty } from 'antd'

function CartPage({ user }) {
  const [Total, setTotal] = useState(0)
  const [ShowTotal, setShowTotal] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    let cartItems = []

    // 리덕스 User state에 cart 상품이 들어있는지 확인
    if (user.userData && user.userData.cart) {
      if (user.userData.cart.length > 0) {
        user.userData.cart.forEach((item) => {
          cartItems.push(item.id)
        })

        dispatch(getCartItems(cartItems, user.userData.cart)).then(
          (response) => {
            calculateTotal(response.payload)
          }
        )
      }
    }
  }, [user.userData])

  const calculateTotal = (cartDetail) => {
    let total = 0
    cartDetail.map((item) => {
      total += parseInt(item.price, 10) * parseInt(item.quantity)
    })

    setTotal(total)
    setShowTotal(true)
  }

  const removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)).then((response) => {
      if (response.payload.productInfo.length <= 0) {
        setShowTotal(false)
      }
    })
  }

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <h1>My cart</h1>
      <div>
        <UserCardBlock products={user.cartDetail} removeItem={removeFromCart} />
      </div>

      {ShowTotal ? (
        <div style={{ marginTop: '3rem' }}>
          <h2>Total Amount: ${Total}</h2>
        </div>
      ) : (
        <>
          <br />
          <Empty description={false} />
        </>
      )}
    </div>
  )
}

export default CartPage
