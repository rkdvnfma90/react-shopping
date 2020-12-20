import axios from 'axios'
import { LOGIN_USER, REGISTER_USER, AUTH_USER, LOGOUT_USER } from './types'
import { USER_SERVER } from '../components/Config.js'

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
