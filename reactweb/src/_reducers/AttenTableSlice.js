import { createSlice } from "@reduxjs/toolkit";

const AttenTableSlice = createSlice({
  name:'AttenTable',
  initialState: {
    ps700: Array.from(Array(4), () => Array.from({length: 64}, () => 0 )),
    ps800: Array.from(Array(4), () => Array.from({length: 64}, () => 0 )),
    psul: Array.from(Array(4), () => Array.from({length: 64}, () => 0 )),
  },
  reducers: {
    AttenTableChange(state, action){
      if( action.payload.name === 'ps700' ){ state.ps700[action.payload.addr] = action.payload.value; }
      else if( action.payload.name === 'ps800' ){ state.ps800[action.payload.addr] = action.payload.value; }
      else if( action.payload.name === 'psul' ){ state.psul[action.payload.addr] = action.payload.value; }
    }
  }
})

export const { AttenTableChange } = AttenTableSlice.actions
export default AttenTableSlice.reducer