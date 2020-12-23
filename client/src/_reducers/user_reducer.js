import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_TO_CART,
  GET_CART_ITEMS,
  REMOVE_CART_ITEM,
  ON_SUCCESS_BUY,
} from '../_actions/types'

// 리듀서에서 리턴된 값이 스토어로 들어감
export default function (state = {}, action) {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, register: action.payload }
    case LOGIN_USER:
      // payload에는 로그인 후 서버에서 보내준 response.data 값이 들어있다.
      return { ...state, loginSucces: action.payload }
    case AUTH_USER:
      // 서버에서 인증 후 사용자의 도큐먼트가 response 되므로 userData라고 명칭함
      return { ...state, userData: action.payload }
    case LOGOUT_USER:
      return { ...state }
    case ADD_TO_CART:
      return {
        ...state,
        userData: {
          ...state.userData,
          cart: action.payload, // userInfo의 cart
        },
      }
    case GET_CART_ITEMS:
      return { ...state, cartDetail: action.payload }
    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartDetail: action.payload.productInfo,
        userData: {
          ...state.userData,
          cart: action.payload.cart,
        },
      }
    case ON_SUCCESS_BUY:
      return {
        ...state,
        cartDetail: action.payload.cartDetail,
        userData: {
          ...state.userData,
          cart: action.payload.cart,
        },
      }

    default:
      return state
  }
}
