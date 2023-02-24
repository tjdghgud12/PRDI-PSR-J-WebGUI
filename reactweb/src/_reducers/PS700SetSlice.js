import { createSlice } from "@reduxjs/toolkit";


const PS700SetSlice = createSlice({
    name: 'PS700Set',
    initialState: { 
        active: false,
        inputPower: 0,
        outputPower: 0,
        ALCEnable: false,
        ALCLevel: 0,
        ALCAtten: 0,
        AGCEnable: false,
        AGCLevel: 0,
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
        PS700Change(state, action){ state = action.payload; },
        PS700ActiveChange(state, action){ state.active = action.payload; },
        PS700InputPowerChange(state, action){ state.inputPower = action.payload; },
        PS700OutputPowerChange(state, action){ state.outputPower = action.payload; },
        PS700ALCEnableChange(state, action,){ state.ALCEnable = action.payload; },
        PS700ALCLevelChange(state, action){ state.ALCLevel = action.payload; },
        PS700AGCEnableChange(state, action){ state.AGCEnable = action.payload; },
        PS700AGCLevelChange(state, action){ state.AGCLevel = action.payload; },
        PS700ALCAttenChange(state, action){ state.Atten1 = action.payload; },
        PS700AttenChange(state, action){ state.Atten2 = action.payload; },
        PS700PAUEnableChange(state, action){ state.PAUEnable = action.payload; },
        PS700DisolChange(state, action){ state.disol = action.payload; },
        PS700AlarmMuteChange(state, action){ state.alarm.mute = action.payload; },
        PS700AlarmOverOutputChange(state, action){ state.alarm.overOutput = action.payload; },
        PS700AlarmOverInputChange(state, action){ state.alarm.overInput = action.payload; },
        PS700AlarmSWRChange(state, action){ state.alarm.swr = action.payload; },
        PS700AlarmALCChange(state, action){ state.alarm.alc = action.payload; },
        PS700AlarmPLLChange(state, action){ state.alarm.pll = action.payload; },
        PS700AlarmTemperatureChange(state, action){ state.alarm.temperature = action.payload; },
        PS700AlarmShotdownChange(state, action){ state.alarm.shotdown = action.payload; },
        PS700ThInputLowThChange(state, action){ state.th.inputLowTh = action.payload; },
        PS700ThInputHighThChange(state, action){ state.th.inputHighTh = action.payload; },
        PS700ThOutputLowThChange(state, action){ state.th.outputLowTh = action.payload; },
        PS700ThOutputHighThChange(state, action){ state.th.outputHighTh = action.payload; },
        PS700OffsetAtten1Change(state, action){ state.offset.atten1 = action.payload; },
        PS700OffsetAtten2Change(state, action){ state.offset.atten2 = action.payload; },
        PS700OffsetAtten3Change(state, action){ state.offset.atten3 = action.payload; },
        PS700OffsetAtten4Change(state, action){ state.offset.atten4 = action.payload; },
        PS700SetChange(state, action){ 
            if( action.payload.name === 'active' ){ state.active = action.payload.value; }
            else if( action.payload.name === 'inputPower' ){ state.inputPower = action.payload.value; }
            else if( action.payload.name === 'outputPower' ){ state.outputPower = action.payload.value; }
            else if( action.payload.name === 'ALCEnable' ){ state.ALCEnable = action.payload.value;}
            else if( action.payload.name === 'ALCLevel' ){ state.ALCLevel = action.payload.value; }
            else if( action.payload.name === 'AGCEnable' ){ state.AGCEnable = action.payload.value;}
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
    PS700ActiveChange,
    PS700InputPowerChange,
    PS700OutputPowerChange,
    PS700ALCEnableChange,
    PS700ALCLevelChange,
    PS700AGCEnableChange,
    PS700AGCLevelChange,
    PS700Atten1Change,
    PS700Atten2Change,
    PS700Atten3Change,
    PS700Atten4Change,
    PS700PAUEnableChange,
    PS700DisolChange,
    PS700AlarmMuteChange,
    PS700AlarmOverOutputChange,
    PS700AlarmOverInputChange,
    PS700AlarmSWRChange,
    PS700AlarmALCChange,
    PS700AlarmPLLChange,
    PS700AlarmTemperatureChange,
    PS700AlarmShotdownChange,
    PS700ThInputLowThChange,
    PS700ThInputHighThChange,
    PS700ThOutputLowThChange,
    PS700ThOutputHighThChange,
    PS700OffsetAtten1Change,
    PS700OffsetAtten2Change,
    PS700OffsetAtten3Change,
    PS700OffsetAtten4Change,
    PS700SetChange 
} = PS700SetSlice.actions

export default PS700SetSlice.reducer