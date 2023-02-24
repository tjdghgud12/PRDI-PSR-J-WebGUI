/*************************************************************
 * defval_scalars.js, skema_scalars, downloadable_snmp.mib
 * 위 3파일 중 수정요소 발생시, 3개 파일 모두를 변경해줘야만 한다.
 * 3개 파일이 유기적으로 작동되고 있음.
 */

import snmp from "net-snmp"         // node모듈 - net-snmp 사용 선언

const skScalars = [
    /******************************************************************
     * rSNMPObjects :: rSystem
     ******************************************************************/
    // rSNMPObjects :: rSystem :: 1 :: repeaterType
    {
        name: "repeaterType",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.1.1",
        scalarType: snmp.ObjectType.OctetString,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { sizes: [ { min: 1, max: 25 } ] },
        defVal: "PSR-SNMP"
    },
    // rSNMPObjects :: rSystem :: 2 :: firmwareVersion
    {
        name: "firmwareVersion",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.1.2",
        scalarType: snmp.ObjectType.OctetString,
        maxAccess: snmp.MaxAccess['read-only'],
        defVal: "0.0.00"
    },
    // rSNMPObjects :: rSystem :: 3 :: productNumber
    {
        name: "productNumber",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.1.3",
        scalarType: snmp.ObjectType.OctetString,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { sizes: [ { min: 1, max: 25 } ] },
        defVal: "123456789abc"
    },
    // rSNMPObjects :: rSystem :: 4 :: serialNumber
    {
        name: "serialNumber",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.1.4",
        scalarType: snmp.ObjectType.OctetString,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { sizes: [ { min: 1, max: 25 } ] },
        defVal: "123456789abc"
    },
    // rSNMPObjects :: rSystem :: 5 :: siteID
    {
        name: "siteID",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.1.5",
        scalarType: snmp.ObjectType.OctetString,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { sizes: [ { min: 1, max: 25 } ] },
        defVal: "123456789abc"
    },
    // rSNMPObjects :: rSystem :: 6 :: temperature
    {
        name: "temperature",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.1.6",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: -128, max: 127 } ] },
        defVal: 0
    },













    /******************************************************************
     * rSNMPObjects :: rRFAnalysis
     ******************************************************************/
    // rSNMPObjects :: rRFAnalysis :: 1 :: dl700InputPower
    {
        name: "dl700InputPower",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.1",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: -1200, max: 0 } ] },
        defVal: -1200   // defVal: NS
    },
    // rSNMPObjects :: rRFAnalysis :: 2 :: dl800InputPower
    {
        name: "dl800InputPower",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.2",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: -1200, max: 0 } ] },
        defVal: -1200   // defVal: NS
    },
    // rSNMPObjects :: rRFAnalysis :: 3 :: ulInputPower
    {
        name: "ulInputPower",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.3",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: -1200, max: 0 } ] },
        defVal: -1200   // defVal: NS
    },
    // rSNMPObjects :: rRFAnalysis :: 4 :: dl700LowInputThreshold
    {
        name: "dl700LowInputThreshold",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.4",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: -127, max: 128 } ] },
        defVal: -127
    },
    // rSNMPObjects :: rRFAnalysis :: 5 :: dl800LowInputThreshold
    {
        name: "dl800LowInputThreshold",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.5",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: -127, max: 128 } ] },
        defVal: -127
    },
    // rSNMPObjects :: rRFAnalysis :: 6 :: dl700HighInputThreshold
    {
        name: "dl700HighInputThreshold",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.6",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: -127, max: 128 } ] },
        defVal: -60
    },
    // rSNMPObjects :: rRFAnalysis :: 7 :: dl800HighInputThreshold
    {
        name: "dl800HighInputThreshold",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.7",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: -127, max: 128 } ] },
        defVal: -60
    },
    // rSNMPObjects :: rRFAnalysis :: 8 :: dl700ALCLevel
    {
        name: "dl700ALCLevel",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.8",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 270 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 9 :: dl800ALCLevel
    {
        name: "dl800ALCLevel",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.9",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 270 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 10 :: ulALCLevel
    {
        name: "ulALCLevel",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.10",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 270 } ] },
        defVal: 0
    },



    // rSNMPObjects :: rRFAnalysis :: 11 :: dl700ALCEnable
    {
        name: "dl700ALCEnable",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.11",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:ALC OFF, 1:ALC ON
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 12 :: dl800ALCEnable
    {
        name: "dl800ALCEnable",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.12",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:ALC OFF, 1:ALC ON
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 13 :: ulALCEnable
    {
        name: "ulALCEnable",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.13",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:ALC OFF, 1:ALC ON
        defVal: 0
    },


    // rSNMPObjects :: rRFAnalysis :: 14 :: dl700UserAttenuator1
    {
        name: "dl700UserAttenuator1",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.14",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 450 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 15 :: dl800UserAttenuator1
    {
        name: "dl800UserAttenuator1",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.15",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 450 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 16 :: ulUserAttenuator1
    {
        name: "ulUserAttenuator1",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.16",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 450 } ] },
        defVal: 0
    },


    
    // rSNMPObjects :: rRFAnalysis :: 17 :: dl700OutputPower
    {
        name: "dl700OutputPower",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.17",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 300 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 18 :: dl800OutputPower
    {
        name: "dl800OutputPower",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.18",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 300 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 19 :: ulOutputPower
    {
        name: "ulOutputPower",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.19",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 300 } ] },
        defVal: 0
    },



    // rSNMPObjects :: rRFAnalysis :: 20 :: dl700HighOutputThreshold
    {
        name: "dl700HighOutputThreshold",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.20",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 30 } ] },
        defVal: 30
    },
    // rSNMPObjects :: rRFAnalysis :: 21 :: dl800HighOutputThreshold
    {
        name: "dl800HighOutputThreshold",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.21",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 30 } ] },
        defVal: 30
    },
    // rSNMPObjects :: rRFAnalysis :: 22 :: ulHighOutputThreshold
    {
        name: "ulHighOutputThreshold",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.22",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 30 } ] },
        defVal: 30
    },



    // rSNMPObjects :: rRFAnalysis :: 23 :: dl700LowOutputThreshold
    {
        name: "dl700LowOutputThreshold",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.23",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: -127, max: 128 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 24 :: dl800LowOutputThreshold
    {
        name: "dl800LowOutputThreshold",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.24",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: -127, max: 128 } ] },
        defVal: 0
    },



    // rSNMPObjects :: rRFAnalysis :: 25 :: dl700PAUEnable
    {
        name: "dl700PAUEnable",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.25",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:PAU OFF, 1:PAU ON
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 26 :: dl800PAUEnable
    {
        name: "dl800PAUEnable",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.26",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:PAU OFF, 1:PAU ON
        defVal: 0
    },
    // rSNMPObjects :: rRFAnalysis :: 27 :: ulPAUEnable
    {
        name: "ulPAUEnable",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.27",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:PAU OFF, 1:PAU ON
        defVal: 0
    },



    // rSNMPObjects :: rRFAnalysis :: 28 :: filterSelection
    {
        name: "filterSelection",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.2.28",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 1, max: 2 } ] },
        // 0 : 64 Configuable Filter + LTE 10MHz
        // 1 : 64 Configuable Filter + LTE 5MHz x 2
        // 2 : 10MHz + 6MHz + LTE 10MHz
        // 3 : 10MHz + 6MHz + LTE 5MHz x 2
        defVal: 1
    },















    /******************************************************************
     * rSNMPObjects :: rTrapState
     ******************************************************************/
    // rSNMPObjects :: rTrapState :: 1 :: acpowerAlarmState
    {
        name: "acpowerAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.1",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },




    // rSNMPObjects :: rTrapState :: 2 :: tempAlarmState
    {
        name: "tempAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.2",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 3 :: dcFailAlarmState
    {
        name: "dcFailAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.3",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 4 :: batteryCapacityAlarmState
    {
        name: "batteryCapacityAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.4",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 5 :: dcdcFailAlarmState
    {
        name: "dcdcFailAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.5",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },



    
    // rSNMPObjects :: rTrapState :: 6 :: dl700PllAlarmState
    {
        name: "dl700PllAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.6",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 7 :: dl800PllAlarmState
    {
        name: "dl800PllAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.7",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 8 :: ulPllAlarmState
    {
        name: "ulPllAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.8",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 9 :: dl700ANTFailAlarmState
    {
        name: "dl700ANTFailAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.9",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 10 :: dl800ANTFailAlarmState
    {
        name: "dl800ANTFailAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.10",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 11 :: ulANTFailAlarmState
    {
        name: "ulANTFailAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.11",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 12 :: dl700HighOutputAlarmState
    {
        name: "dl700HighOutputAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.12",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    



    // rSNMPObjects :: rTrapState :: 13 :: dl800HighOutputAlarmState
    {
        name: "dl800HighOutputAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.13",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 14 :: ulHighOutputtAlarmState
    {
        name: "ulHighOutputtAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.14",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 999 :: testAlarmState
    {
        name: "testAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.999",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },


    /********************************************************************************** *
    // rSNMPObjects :: rTrapState :: 15 :: dl700HighOutputAlarmState
    {
        name: "dl700HighOutputAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.15",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 16 :: dl800HighOutputAlarmState
    {
        name: "dl800HighOutputAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.16",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    // rSNMPObjects :: rTrapState :: 17 :: ulHighOutputtAlarmState
    {
        name: "ulHighOutputtAlarmState",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.3.17",
        scalarType: snmp.ObjectType.Integer,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 1 } ] },    // 0:normalState, 1:alarmState
        defVal: 0
    },
    /********************************************************************************** */
    

    








    /******************************************************************
     * rSNMPObjects :: rNotification
     ******************************************************************/
    // rNotification 는 trap 이기 때문에, 따로 해야함.
    









    // /******************************************************************
    //  * rSNMPObjects :: rNotificationinfo
    //  ******************************************************************/
    // // rSNMPObjects :: rNotificationinfo :: 1 :: nNotificationString
    // {
    //     name: "nNotificationString",
    //     type: snmp.MibProviderType.Scalar,
    //     oid: "1.3.6.1.4.1.19865.5.1",
    //     scalarType: snmp.ObjectType.OctetString,
    //     maxAccess: snmp.MaxAccess['read-only'],
    //     constraints: { sizes: [ { min: 1, max: 25 } ] },
    //     defVal: ""
    // },
    // // rSNMPObjects :: rNotificationinfo :: 2 :: nNotificationStatus
    // {
    //     name: "nNotificationStatus",
    //     type: snmp.MibProviderType.Scalar,
    //     oid: "1.3.6.1.4.1.19865.5.2",
    //     scalarType: snmp.ObjectType.Integer32,
    //     maxAccess: snmp.MaxAccess['read-only'],
    //     constraints: { ranges: [ { min: 0, max: 1 } ] },        // 0:Clear, 1:Set
    //     defVal: 0
    // },




    /******************************************************************
     * rSNMPObjects :: rChannelFilter
     ******************************************************************/
    // rSNMPObjects :: rChannelFilter :: 1 :: filterControlPath
    {
        name: "filterControlPath",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.5.1",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 1, max: 2 } ] },        // 1:Downlink, 2:Uplink
        defVal: 1
    },
    // rSNMPObjects :: rChannelFilter :: 2 :: filterControlChannelIndex
    {
        name: "filterControlChannelIndex",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.5.2",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 1, max: 64 } ] },
        defVal: 1
    },
    // rSNMPObjects :: rChannelFilter :: 3 :: filterControlChannelInputPower
    {
        name: "filterControlChannelInputPower",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.5.3",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: -1200, max: 0 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rChannelFilter :: 4 :: filterControlChannelAttenuator
    {
        name: "filterControlChannelAttenuator",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.5.4",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 60 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rChannelFilter :: 5 :: filterControlChannelGain
    // {
    //     name: "filterControlChannelGain",
    //     type: snmp.MibProviderType.Scalar,
    //     oid: "1.3.6.1.4.1.19865.5.5",
    //     scalarType: snmp.ObjectType.Integer32,
    //     maxAccess: snmp.MaxAccess['read-only'],
    //     constraints: { ranges: [ { min: 0, max: 180 } ] },
    //     defVal: 0
    // },
    // rSNMPObjects :: rChannelFilter :: 5 :: filterControlChannelOutputPower
    {
        name: "filterControlChannelOutputPower",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.5.5",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 380 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rChannelFilter :: 6 :: filterControlChannelFreqInfo
    {
        name: "filterControlChannelFreqInfo",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.5.6",
        scalarType: snmp.ObjectType.Gauge32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 769000000, max: 861000000 } ] },
        defVal: 769000000
    },
    // rSNMPObjects :: rChannelFilter :: 7 :: filterControlChannelBandwidth
    {
        name: "filterControlChannelBandwidth",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.5.7",
        scalarType: snmp.ObjectType.Gauge32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 18000000 } ] },
        defVal: 0
    },



    /******************************************************************
     * rSNMPObjects :: rIsolation
     ******************************************************************/
    // rSNMPObjects :: rIsolation :: 1 :: dl700IsolationValue
    {
        name: "dl700IsolationValue",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.6.1",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 120 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rIsolation :: 2 :: dl800IsolationValue
    {
        name: "dl800IsolationValue",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.6.2",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 120 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rIsolation :: 3 :: ulIsolationValue
    {
        name: "ulIsolationValue",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.6.3",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 120 } ] },
        defVal: 0
    },

    /********************************************************************************** *
    // rSNMPObjects :: rIsolation :: 1 :: dlRunIsolationCheck
    {
        name: "dlRunIsolationCheck",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.6.1",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 5 } ] },
        defVal: 0   // defVal: NS
    },
    // rSNMPObjects :: rIsolation :: 2 :: ulRunIsolationCheck
    {
        name: "ulRunIsolationCheck",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.6.2",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-write'],
        constraints: { ranges: [ { min: 0, max: 5 } ] },
        defVal: 0   // defVal: NS
    },
    // rSNMPObjects :: rIsolation :: 3 :: dlIsolationCheckStatus
    {
        name: "dlIsolationCheckStatus",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.6.3",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 3 } ] },
        defVal: 0
    },
    // rSNMPObjects :: rIsolation :: 4 :: ulIsolationCheckStatus
    {
        name: "ulIsolationCheckStatus",
        type: snmp.MibProviderType.Scalar,
        oid: "1.3.6.1.4.1.19865.6.4",
        scalarType: snmp.ObjectType.Integer32,
        maxAccess: snmp.MaxAccess['read-only'],
        constraints: { ranges: [ { min: 0, max: 3 } ] },
        defVal: 0
    },
    /********************************************************************************** */

]


// 모듈로 내보내기..
export { skScalars }