import { createSlice } from '@reduxjs/toolkit'

export const userTreesSlice = createSlice({
    name: 'userTrees',
    initialState: {
        userTrees: []
    },
    reducers: {
        set: (state, action) => {
            state.userTrees = action.payload
        }
    }
})

export const { set } = userTreesSlice.actions
export const selectUserTrees = state => state.userTrees
export default userTreesSlice.reducer