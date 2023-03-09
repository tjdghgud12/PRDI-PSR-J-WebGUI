import { createSlice } from "@reduxjs/toolkit";


const PS800SetSlice = createSlice({
    name: 'PS800Set',
    initialState: { 
        active: false,
        inputPower: 0,
        outputPower: 0,
        ALCEnable: false,
        ALCLevel: 0,
        AGCEnable: false,
        AGCLevel: 0,
        ALCAtten: 0,
        Atten: 0,
        PAUEnable: false,
        disol: 0,
        alarm: {
            mute: false,
            overOutput: false,
            overInput: false,
            swr: false,
            alc: false,
            pll: false,
            temperature: false,
            shotdown: false
        },
        th: {
            inputLowTh: 0,
            inputHighTh: 0,
            outputLowTh: 0,
            outputHighTh: 0
        },
        offset: {
            atten1: 0,
            atten2: 0,
            atten3: 0,
            atten4: 0,
            inputPower: 0,
            outputPower: 0,
        }
    },
    reducers: {
        PS800ActiveChange(state, action){ state.active = action.payload; },
        PS800InputPowerChange(state, action){ state.inputPower = action.payload; },
        PS800OutputPowerChange(state, action){ state.outputPower = action.payload; },
        PS800ALCEnableChange(state, action,){ state.ALCEnable = action.payload; },
        PS800ALCLevelChange(state, action){ state.ALCLevel = action.payload; },
        PS800AGCEnableChange(state, action){ state.AGCEnable = action.payload; },
        PS800AGCLevelChange(state, action){ state.AGCLevel = action.payload; },
        PS800ALCAttenChange(state, action){ state.Atten1 = action.payload; },
        PS800AttenChange(state, action){ state.Atten2 = action.payload; },
        PS800PAUEnableChange(state, action){ state.PAUEnable = action.payload; },
        PS800DisolChange(state, action){ state.disol = action.payload; },
        PS800AlarmMuteChange(state, action){ state.alarm.mute = action.payload; },
        PS800AlarmOverOutputChange(state, action){ state.alarm.overOutput = action.payload; },
        PS800AlarmOverInputChange(state, action){ state.alarm.overInput = action.payload; },
        PS800AlarmSWRChange(state, action){ state.alarm.swr = action.payload; },
        PS800AlarmALCChange(state, action){ state.alarm.alc = action.payload; },
        PS800AlarmPLLChange(state, action){ state.alarm.pll = action.payload; },
        PS800AlarmTemperatureChange(state, action){ state.alarm.temperature = action.payload; },
        PS800AlarmShotdownChange(state, action){ state.alarm.shotdown = action.payload; },
        PS800ThInputLowThChange(state, action){ state.th.inputLowTh = action.payload; },
        PS800ThInputHighThChange(state, action){ state.th.inputHighTh = action.payload; },
        PS800ThOutputLowThChange(state, action){ state.th.outputLowTh = action.payload; },
        PS800ThOutputHighThChange(state, action){ state.th.outputHighTh = action.payload; },
        PS800OffsetAtten1Change(state, action){ state.offset.atten1 = action.payload; },
        PS800OffsetAtten2Change(state, action){ state.offset.atten2 = action.payload; },
        PS800OffsetAtten3Change(state, action){ state.offset.atten3 = action.payload; },
        PS800OffsetAtten4Change(state, action){ state.offset.atten4 = action.payload; },
        PS800SetChange(state, action){ 
            if( action.payload.name === 'active' ){ state.active = action.payload.value; }
            else if( action.payload.name === 'inputPower' ){ state.inputPower = action.payload.value; }
            else if( action.payload.name === 'outputPower' ){ state.outputPower = action.payload.value; }
            else if( action.payload.name === 'ALCEnable' ){ state.ALCEnable = action.payload.value; }
            else if( action.payload.name === 'ALCLevel' ){ state.ALCLevel = action.payload.value; }
            else if( action.payload.name === 'AGCEnable' ){ state.AGCEnable = action.payload.value; }
            else if( action.payload.name === 'AGCLevel' ){ state.AGCLevel = action.payload.value; }
            else if( action.payload.name === 'ALCAtten' ){ state.ALCAtten = action.payload.value; }
            else if( action.payload.name === 'Atten' ){ state.Atten = action.payload.value; }
            else if( action.payload.name === 'PAUEnable' ){ state.PAUEnable = action.payload.value; }
            else if( action.payload.name === 'disol' ){ state.disol = action.payload.value; }
            else if( action.payload.name === 'alarmMute' ){ state.alarm.mute = action.payload.value; }
            else if( action.payload.name === 'alarmOverOutput' ){ state.alarm.overOutput = action.payload.value; }
            else if( action.payload.name === 'alarmOverInput' ){ state.alarm.overInput = action.payload.value; }
            else if( action.payload.name === 'alarmSWR' ){ state.alarm.swr = action.payload.value; }
            else if( action.payload.name === 'alarmALC' ){ state.alarm.alc = action.payload.value; }
            else if( action.payload.name === 'alarmPLL' ){ state.alarm.pll = action.payload.value; }
            else if( action.payload.name === 'alarmTemperature' ){ state.alarm.temperature = action.payload.value; }
            else if( action.payload.name === 'alarmShotdown' ){ state.alarm.shotdown = action.payload.value; }
            else if( action.payload.name === 'thInputLowTh' ){ state.th.inputLowTh = action.payload.value; }
            else if( action.payload.name === 'thInputHighTh' ){ state.th.inputHighTh = action.payload.value; }
            else if( action.payload.name === 'thOutputLowTh' ){ state.th.outputLowTh = action.payload.value; }
            else if( action.payload.name === 'thOutputHighTh' ){ state.th.outputHighTh = action.payload.value; }
            else if( action.payload.name === 'offsetAtten1' ){ state.offset.atten1 = action.payload.value; }
            else if( action.payload.name === 'offsetAtten2' ){ state.offset.atten2 = action.payload.value; }
            else if( action.payload.name === 'offsetAtten3' ){ state.offset.atten3 = action.payload.value; }
            else if( action.payload.name === 'offsetAtten4' ){ state.offset.atten4 = action.payload.value; }
            else if( action.payload.name === 'offsetInputPower' ){ state.offset.inputPower = action.payload.value; }
            else if( action.payload.name === 'offsetOutputPower' ){ state.offset.outputPower = action.payload.value; }
        }
    }
})


export const { 
    PS800ActiveChange,
    PS800InputPowerChange,
    PS800OutputPowerChange,
    PS800ALCEnableChange,
    PS800ALCLevelChange,
    PS800AGCEnableChange,
    PS800AGCLevelChange,
    PS800Atten1Change,
    PS800Atten2Change,
    PS800Atten3Change,
    PS800Atten4Change,
    PS800PAUEnableChange,
    PS800DisolChange,
    PS800AlarmMuteChange,
    PS800AlarmOverOutputChange,
    PS800AlarmOverInputChange,
    PS800AlarmSWRChange,
    PS800AlarmALCChange,
    PS800AlarmPLLChange,
    PS800AlarmTemperatureChange,
    PS800AlarmShotdownChange,
    PS800ThInputLowThChange,
    PS800ThInputHighThChange,
    PS800ThOutputLowThChange,
    PS800ThOutputHighThChange,
    PS800OffsetAtten1Change,
    PS800OffsetAtten2Change,
    PS800OffsetAtten3Change,
    PS800OffsetAtten4Change, 
    PS800SetChange 
} = PS800SetSlice.actions

export default PS800SetSlice.reducer