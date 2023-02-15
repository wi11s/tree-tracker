import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice.js'
import positionReducer from './slices/positionSlice.js'

export default configureStore({
  reducer: {
    user: userReducer,
    position: positionReducer
  }
})