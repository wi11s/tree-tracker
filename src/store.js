import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice.js'
import positionReducer from './slices/positionSlice.js'
import infoReducer from './slices/infoSlice.js'
import userTreesReducer from './slices/userTreesSlice.js'

export default configureStore({
  reducer: {
    user: userReducer,
    position: positionReducer,
    info: infoReducer,
    userTrees: userTreesReducer
    }
})