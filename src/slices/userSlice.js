import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        email: null,
        friendships: null,
        name: null,
        posts: [],
        tree_types: [],
        user_trees: [],
        requests: [],
        username: null
    },
    reducers: {
        set: (state, action) => {
            state.id = action.payload.id
            state.email = action.payload.email
            state.friendships = action.payload.friendships
            state.name = action.payload.name
            state.posts = action.payload.posts
            state.tree_types = action.payload.tree_types
            state.user_trees = action.payload.user_trees
            state.requests = action.payload.requests
            state.username = action.payload.username
        }
    }
})

export const { set } = userSlice.actions
export const selectUser = state => state.user
export default userSlice.reducer