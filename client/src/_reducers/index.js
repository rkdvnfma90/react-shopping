import { combineReducers } from 'redux'
import user from './user_reducer'

// 여러 리듀서들을 합쳐서 스토어에서 사용할 수 있게 함
const rootReducer = combineReducers({
  user,
})

export default rootReducer
