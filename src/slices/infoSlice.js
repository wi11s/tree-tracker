import { createSlice } from '@reduxjs/toolkit'

export const infoSlice = createSlice({
    name: 'info',
    initialState: {
        id: null,
        pet_name: null,
        spc_common: null, 
        wiki: null, 
        image: null, 
        userAdded: null,
        showInfo: false
    },
    reducers: {
        set: (state, action) => {
            console.log(action.payload)
            state.id = action.payload.id
            state.pet_name = action.payload.pet_name
            state.spc_common = action.payload.spc_common
            state.wiki = action.payload.wiki
            state.image = action.payload.image
            state.userAdded = action.payload.userAdded
        },
        setShowInfo: (state, action) => {
            console.log(action.payload)
            state.showInfo = action.payload
        }
    }
})

export const { set, setShowInfo } = infoSlice.actions
export const selectInfo = state => state.info
export default infoSlice.reducer