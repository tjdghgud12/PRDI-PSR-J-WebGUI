import { createSlice } from "@reduxjs/toolkit";


const testSlice = createSlice({
    name: 'a',
    initialState: { value: 0 },
    reducers: {
        Change(state, action){
            state.value = action.payload;
        }
    }
})


export const { Change } = testSlice.actions
export default testSlice.reducer