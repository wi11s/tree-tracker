import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice.js'
import positionReducer from './slices/positionSlice.js'
import infoReducer from './slices/infoSlice.js'

export default configureStore({
  reducer: {
    user: userReducer,
    position: positionReducer,
    info: infoReducer
  }
})