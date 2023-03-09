import { combineReducers } from "@reduxjs/toolkit";
import commonSlice from "./commonSlice";
//import test from './testSlice';
import PS700SetSlice from "./PS700SetSlice";
import PS800SetSlice from "./PS800SetSlice";
import PSULSetSlice from "./PSULSetSlice";
import PS700Channel from "./PS700ChannelSlice";
import PS800Channel from "./PS800ChannelSlice";
import RegisterSlice from "./RegisterSlice";
import AttenTableSlice from "./AttenTableSlice";
import TemperatureAttenTableSlice from "./TemperatureAttenTableSlice";
import PowerAmpPowerTableSlice from "./PowerAmpPowerTableSlice";


export const rootReducer = combineReducers({
	PS700SetSlice,
	PS800SetSlice,
	PSULSetSlice,
	PS700Channel,
	PS800Channel,
	commonSlice,
	RegisterSlice,
	AttenTableSlice,
	TemperatureAttenTableSlice,
	PowerAmpPowerTableSlice,
});