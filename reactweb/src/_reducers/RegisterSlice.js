import { createSlice } from "@reduxjs/toolkit";

const RegisterSlice = createSlice({
  name:'Register',
  initialState: {
    owner: {
      company: "",
      contactName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      fax: "",
      email: "",
    },
    installBy: {
      company: "",
      contactName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      fax: "",
      email: "",
    },
    serviceProvider: ''
  },
  reducers: {
    RegisterChange(state, action){
      if( action.payload.name === 'owner' ){ state.owner = action.payload.value; }
      else if( action.payload.name === 'installBy' ){ state.installBy = action.payload.value; }
      else if( action.payload.name === 'serviceProvider' ){ state.serviceProvider = action.payload.value; }
    }
  }
})

export const { RegisterChange } = RegisterSlice.actions
export default RegisterSlice.reducer