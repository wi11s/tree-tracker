import { createSlice } from '@reduxjs/toolkit'

export const positionSlice = createSlice({
    name: 'position',
    initialState: {
        userPosition: {
            lat: 0,
            lng: 0
        },
        center: { 
            lat: 40.74, 
            lng: -73.90 
        },
        zoom: 12
    },
    reducers: {
        set: (state, action) => {
            console.log(action.payload)
            state.userPosition = action.payload.userPosition
            state.center = action.payload.center
            state.zoom = action.payload.zoom
        }
    }
})

export const { set } = positionSlice.actions
export const selectPosition = state => state.position
export default positionSlice.reducer