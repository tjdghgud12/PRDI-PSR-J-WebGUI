import { createSlice } from "@reduxjs/toolkit";

const TemperatureAttenTableSlice = createSlice({
  name:'TemperatureAttenTable',
  initialState: {
    ps700: Array.from(Array(28), () => 0 ),
    ps800: Array.from(Array(28), () => 0 ),
    psul: Array.from(Array(28), () => 0 ),
  },
  reducers: {
    TemperatureAttenTableChange(state, action){
      if( action.payload.name === 'ps700' ){ state.ps700 = action.payload.value; }
      else if( action.payload.name === 'ps800' ){ state.ps800 = action.payload.value; }
      else if( action.payload.name === 'psul' ){ state.psul = action.payload.value; }
    }
  }
})

export const { TemperatureAttenTableChange } = TemperatureAttenTableSlice.actions
export default TemperatureAttenTableSlice.reducer