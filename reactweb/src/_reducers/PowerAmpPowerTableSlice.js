import { createSlice } from "@reduxjs/toolkit";

const PowerAmpPowerTableSlice = createSlice({
  name:'PowerAmpPowerTable',
  initialState: {
    ps700: { max: 0, min: 0, step: 0.1, table:[] },
    ps800: { max: 0, min: 0, step: 0.1, table:[] },
    psul: { max: 0, min: 0, step: 0.1, table:[] },
  },
  reducers: {
    PowerAmpPowerTableChange(state, action){
      if( action.payload.name === 'ps700' ){ state.ps700 = action.payload.value; }
      else if( action.payload.name === 'ps800' ){ state.ps800 = action.payload.value; }
      else if( action.payload.name === 'psul' ){ state.psul = action.payload.value; }
    }
  }
})

export const { PowerAmpPowerTableChange } = PowerAmpPowerTableSlice.actions
export default PowerAmpPowerTableSlice.reducer