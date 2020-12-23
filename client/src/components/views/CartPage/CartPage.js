import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  getCartItems,
  removeCartItem,
  onSuccessBuy,
} from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock'
import { Empty, Result } from 'antd'
import Paypal from '../../utils/Paypal'

function CartPage({ user }) {
  const [Total, setTotal] = useState(0)
  const [ShowTotal, setShowTotal] = useState(false)
  const [ShowSuccess, setShowSuccess] = useState(false)
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

  const transactionSuccess = (data) => {
    dispatch(
      onSuccessBuy({
        paymentData: data, // 결제 성공후 paypal에서 주는 정보
        cartDetail: user.cartDetail,
      })
    ).then((response) => {
      if (response.payload.success) {
        setShowTotal(false)
        setShowSuccess(true)
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
      ) : ShowSuccess ? (
        <Result status="success" title="Successfully Purchased items" />
      ) : (
        <>
          <br />
          <Empty description={false} />
        </>
      )}
      {ShowTotal && <Paypal total={Total} onSuccess={transactionSuccess} />}
    </div>
  )
}

export default CartPage
