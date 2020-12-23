import axios from 'axios'
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_TO_CART,
  GET_CART_ITEMS,
} from './types'
import { USER_SERVER, PRODUCT_SERVER } from '../components/Config.js'

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then((response) => response.data)

  return {
    type: REGISTER_USER,
    payload: request,
  }
}

export function loginUser(dataToSubmit) {
  // 서버에서 보낸 response를 request에 담는다.
  // 현재 request는 resolve에 response.data가 담긴 Promise이다.
  // body : dataToSubmit
  const request = axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then((response) => response.data)

  // 리듀서로 리턴
  return {
    type: LOGIN_USER,
    payload: request,
  }
}

// GET 방식으로 요청하기 때문에 body는 필요없다.
export function auth() {
  const request = axios
    .get(`${USER_SERVER}/auth`)
    .then((response) => response.data)

  return {
    type: AUTH_USER,
    payload: request,
  }
}

export function logoutUser() {
  const request = axios
    .get(`${USER_SERVER}/logout`)
    .then((response) => response.data)

  return {
    type: LOGOUT_USER,
    payload: request,
  }
}

export function addTocart(id) {
  const body = {
    productId: id,
  }
  const request = axios
    .post(`${USER_SERVER}/addToCart`, body)
    .then((response) => response.data)

  return {
    type: ADD_TO_CART,
    payload: request,
  }
}

export function getCartItems(cartItems, userCart) {
  const request = axios
    .get(`${PRODUCT_SERVER}/products_by_id?id=${cartItems}&type=array`)
    .then((response) => {
      // cartitems들에 해당하는 정보들을
      // Product Collection에서 가져온 후에
      // Quantity 등의 필요한 정보를 합쳐 준다.
      userCart.forEach((cartItem) => {
        response.data.product.forEach((productDetail, index) => {
          if (cartItem.id === productDetail._id) {
            // productDetail에 quantity 정보를 넣어준다.(product에는 quantity 정보가 없음)
            response.data.product[index].quantity = cartItem.quantity
          }
        })
      })
      return response.data // 리듀서에서 action.payload로 값을 사용할 수 있음
    })

  return {
    type: GET_CART_ITEMS,
    payload: request,
  }
}
