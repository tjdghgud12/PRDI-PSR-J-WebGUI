import { createSlice } from "@reduxjs/toolkit";


const PSULSetSlice = createSlice({
    name: 'PSULSet',
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
        },
        sleep: {
            enable: false,
            level: 0,
            time: 0,
        }
    },
    reducers: {
        PSULActiveChange(state, action){ state.active = action.payload; },
        PSULInputPowerChange(state, action){ state.inputPower = action.payload; },
        PSULOutputPowerChange(state, action){ state.outputPower = action.payload; },
        PSULALCEnableChange(state, action,){ state.ALCEnable = action.payload; },
        PSULALCLevelChange(state, action){ state.ALCLevel = action.payload; },
        PSULAGCEnableChange(state, action){ state.AGCEnable = action.payload; },
        PSULAGCLevelChange(state, action){ state.AGCLevel = action.payload; },
        PSULALCAttenChange(state, action){ state.Atten1 = action.payload; },
        PSULAttenChange(state, action){ state.Atten2 = action.payload; },
        PSULPAUEnableChange(state, action){ state.PAUEnable = action.payload; },
        PSULDisolChange(state, action){ state.disol = action.payload; },
        PSULAlarmMuteChange(state, action){ state.alarm.mute = action.payload; },
        PSULAlarmOverOutputChange(state, action){ state.alarm.overOutput = action.payload; },
        PSULAlarmOverInputChange(state, action){ state.alarm.overInput = action.payload; },
        PSULAlarmSWRChange(state, action){ state.alarm.swr = action.payload; },
        PSULAlarmALCChange(state, action){ state.alarm.alc = action.payload; },
        PSULAlarmPLLChange(state, action){ state.alarm.pll = action.payload; },
        PSULAlarmTemperatureChange(state, action){ state.alarm.temperature = action.payload; },
        PSULAlarmShotdownChange(state, action){ state.alarm.shotdown = action.payload; },
        PSULThInputLowThChange(state, action){ state.th.inputLowTh = action.payload; },
        PSULThInputHighThChange(state, action){ state.th.inputHighTh = action.payload; },
        PSULThOutputLowThChange(state, action){ state.th.outputLowTh = action.payload; },
        PSULThOutputHighThChange(state, action){ state.th.outputHighTh = action.payload; },
        PSULOffsetAtten1Change(state, action){ state.offset.atten1 = action.payload; },
        PSULOffsetAtten2Change(state, action){ state.offset.atten2 = action.payload; },
        PSULOffsetAtten3Change(state, action){ state.offset.atten3 = action.payload; },
        PSULOffsetAtten4Change(state, action){ state.offset.atten4 = action.payload; },
        PSULSleepEnableChange(state, action){ state.sleep.enable = action.payload; },
        PSULSleepLevelChange(state, action){ state.sleep.level = action.payload; },
        PSULSleepTimeChange(state, action){ state.sleep.time = action.payload; },
        PSULSetChange(state, action){ 
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
            else if( action.payload.name === 'sleepEnable' ){ state.sleep.enable = action.payload.value; }
            else if( action.payload.name === 'sleepLevel' ){ state.sleep.level = action.payload.value; }
            else if( action.payload.name === 'sleepTime' ){ state.sleep.time = action.payload.value; }
        }
    },
})


export const { 
    PSULActiveChange,
    PSULInputPowerChange,
    PSULOutputPowerChange,
    PSULALCEnableChange,
    PSULALCLevelChange,
    PSULAGCEnableChange,
    PSULAGCLevelChange,
    PSULAtten1Change,
    PSULAtten2Change,
    PSULAtten3Change,
    PSULAtten4Change,
    PSULPAUEnableChange,
    PSULDisolChange,
    PSULAlarmMuteChange,
    PSULAlarmOverOutputChange,
    PSULAlarmOverInputChange,
    PSULAlarmSWRChange,
    PSULAlarmALCChange,
    PSULAlarmPLLChange,
    PSULAlarmTemperatureChange,
    PSULAlarmShotdownChange,
    PSULThInputLowThChange,
    PSULThInputHighThChange,
    PSULThOutputLowThChange,
    PSULThOutputHighThChange,
    PSULOffsetAtten1Change,
    PSULOffsetAtten2Change,
    PSULOffsetAtten3Change,
    PSULOffsetAtten4Change, 
    PSULSetChange 

} = PSULSetSlice.actions
export default PSULSetSlice.reducer