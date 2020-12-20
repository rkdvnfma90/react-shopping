/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { auth } from '../_actions/user_actions'
import { useSelector, useDispatch } from 'react-redux'

export default function (SpecificComponent, option, adminRoute = null) {
  // option
  // null => 아무나 출입 가능
  // true => 로그인 한 유저만 출입이 가능한 페이지
  // false => 로그인 한 유저는 출입 불가

  function AuthenticationCheck(props) {
    // 페이지 이동할 때 마다 서버에서 auth체크를 항상 함
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(auth()).then((response) => {
        // 로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          // 로그인을 하지 않았는데 로그인 한 유저만 출입가능한 페이지에 접근하려는 경우
          if (option) {
            props.history.push('/login')
          }
          // 로그인 한 상태
        } else {
          // 로그인 했고, 어드민 페이지에 접근하려 하는데 어드민 권한이 없을 경우
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push('/')
          } else {
            // 로그인 한 유저는 출입 불가한 페이지에 접근하려는 경우
            if (option === false) {
              props.history.push('/')
            }
          }
        }
      })
    }, [])

    return <SpecificComponent {...props} user={user} />
  }
  return AuthenticationCheck
}
