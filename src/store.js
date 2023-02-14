import { configureStore } from '@reduxjs/toolkit'
import userReducer from './components/userSlice.js'

export default configureStore({
  reducer: {
    user: userReducer
  }
})