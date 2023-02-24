import { createSlice } from "@reduxjs/toolkit";


const commonSlice = createSlice({
    name: 'common',
    initialState: {
        lastAccess: '',
        productNumber: '',
        serialNumber: '',
        MCUVer: '0.0.0',
        PS700DTUVer: '0.00',
        PS700FPGAVer: '0.00',
        PS800DTUVer: '0.00',
        PS800FPGAVer: '0.00',
        setTime: 0,
        temperatureTh: 0,
        temperature: 0,
        alarm: {
            systemTemperature: false,
            ACFail: false,
            DCFail: false,
            BATTLow: false,
            BATTChg: false,
            serviceANT: false,
            donorANT: false,
            ps700DTUPLL: false,
            ps700DTUDAC: false,
            ps700DTUADC: false,
            ps800DTUPLL: false,
            ps800DTUDAC: false,
            ps800DTUADC: false
        },
        network: {
            IP: new Array(4),
            subnetMask: new Array(4),
            gateway: new Array(4),
            port: 0,
            dhcp: false
        }

    },
    reducers: {
        LastAccessChange(state, action){ state.lastAccess = action.payload  },
        CommonSetChange(state, action){ 
            if( action.payload.name === 'productNumber' ){ state.productNumber = action.payload.value; }
            else if( action.payload.name === 'serialNumber' ){ state.serialNumber = action.payload.value; }
            else if( action.payload.name === 'MCUVer' ){ state.MCUVer = action.payload.value; }
            else if( action.payload.name === 'PS700DTUVer' ){ state.PS700DTUVer = action.payload.value; }
            else if( action.payload.name === 'PS700FPGAVer' ){ state.PS700FPGAVer = action.payload.value; }
            else if( action.payload.name === 'PS800DTUVer' ){ state.PS800DTUVer = action.payload.value; }
            else if( action.payload.name === 'PS800FPGAVer' ){ state.PS800FPGAVer = action.payload.value; }
            else if( action.payload.name === 'setTime' ){ state.setTime = action.payload.value; }
            else if( action.payload.name === 'temperatureTh' ){ state.temperatureTh = action.payload.value; }
            else if( action.payload.name === 'alarmSystemTemperature' ){ state.systemTemperature = action.payload.value; }
            else if( action.payload.name === 'alarmACFail' ){ state.alarm.ACFail = action.payload.value; }
            else if( action.payload.name === 'alarmDCFail' ){ state.alarm.DCFail = action.payload.value; }
            else if( action.payload.name === 'alarmBATTLow' ){ state.alarm.BATTLow = action.payload.value; }
            else if( action.payload.name === 'alarmBATTChg' ){ state.alarm.BATTChg = action.payload.value; }
            else if( action.payload.name === 'alarmserviceANT' ){ state.alarm.serviceANT = action.payload.value; }
            else if( action.payload.name === 'alarmdonorANT' ){ state.alarm.donorANT = action.payload.value; }
            else if( action.payload.name === 'alarmps700DTUPLL' ){ state.alarm.ps700DTUPLL = action.payload.value; }
            else if( action.payload.name === 'alarmps700DTUDAC' ){ state.alarm.ps700DTUDAC = action.payload.value; }
            else if( action.payload.name === 'alarmps700DTUADC' ){ state.alarm.ps700DTUADC = action.payload.value; }
            else if( action.payload.name === 'alarmps800DTUPLL' ){ state.alarm.ps800DTUPLL = action.payload.value; }
            else if( action.payload.name === 'alarmps800DTUDAC' ){ state.alarm.ps800DTUDAC = action.payload.value; }
            else if( action.payload.name === 'alarmps800DTUADC' ){ state.alarm.ps800DTUADC = action.payload.value; }
            else if( action.payload.name === 'netowrkIP' ){ state.network.IP = action.payload.value; }
            else if( action.payload.name === 'netowrkSubnetMask' ){ state.network.subnetMask = action.payload.value; }
            else if( action.payload.name === 'netowrkGateway' ){ state.network.gateway = action.payload.value; }
            else if( action.payload.name === 'netowrkPort' ){ state.network.port = action.payload.value; }
            else if( action.payload.name === 'netowrkDhcp' ){ state.network.dhcp = action.payload.value; }
        }
    },
})


export const { CommonSetChange, LastAccessChange } = commonSlice.actions;
export default commonSlice.reducer