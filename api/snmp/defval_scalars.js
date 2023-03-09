/*************************************************************
 * defval_scalars.js, skema_scalars, downloadable_snmp.mib
 * 위 3파일 중 수정요소 발생시, 3개 파일 모두를 변경해줘야만 한다.
 * 3개 파일이 유기적으로 작동되고 있음.
 */

const dvScalars = {
  // [1] :: rSNMPObjects :: rSystem
  "repeaterType": "PSR-SNMP",
  "firmwareVersion": "0.0.00",
  "productNumber": "123456789abc",
  "serialNumber": "123456789abc",
  "siteID": "123456789abc",
  "temperature": 0,

  // [2] :: rSNMPObjects :: rRFAnalysis
  "dl700InputPower": -1200,  // null, // NS
  "dl800InputPower": -1200,  // null, // NS
  "ulInputPower": -1200,  // null, // NS
  "dl700LowInputThreshold": -127,
  "dl800LowInputThreshold": -127,
  "dl700HighInputThreshold": -60,
  "dl800HighInputThreshold": -60,
  "dl700ALCLevel": 0,
  "dl800ALCLevel": 0,
  "ulALCLevel": 0,
  "dl700ALCEnable": 0,
  "dl800ALCEnable": 0,
  "ulALCEnable": 0,
  "dl700UserAttenuator1": 0,
  "dl800UserAttenuator1": 0,
  "ulUserAttenuator1": 0,
  "dl700OutputPower": 0, // NS
  "dl800OutputPower": 0, // NS
  "ulOutputPower": 0, // NS
  "dl700HighOutputThreshold": 30,
  "dl800HighOutputThreshold": 30,
  "ulHighOutputThreshold": 30,
  "dl700LowOutputThreshold": 0,
  "dl800LowOutputThreshold": 0,
  "dl700PAUEnable": 0,
  "dl800PAUEnable": 0,
  "ulPAUEnable": 0,
  "filterSelection": 1,

  // [3] :: rSNMPObjects :: rTrapState
  "acpowerAlarmState": 0,
  "tempAlarmState": 0,
  "dcFailAlarmState": 0,
  "batteryCapacityAlarmState": 0,
  "dcdcFailAlarmState": 0,
  // "pllAlarmState": 0,
  "dl700PllAlarmState": 0,
  "dl800PllAlarmState": 0,
  "ulPllAlarmState": 0,
  // "dl700PAUFailAlarmState": 0,
  // "dl800PAUFailAlarmState": 0,
  // "ulPAUFailAlarmState": 0,
  "dl700ANTFailAlarmState": 0,
  "dl800ANTFailAlarmState": 0,
  "ulANTFailAlarmState": 0,
  // "dl700HighInputAlarmState": 0,
  // "dl800HighInputAlarmState": 0,
  "dl700HighOutputAlarmState": 0,
  "dl800HighOutputAlarmState": 0,
  "ulHighOutputtAlarmState": 0,
  "testAlarmState":0,
  
  
  // [4] :: rSNMPObjects :: rNotification
  // rNotification 는 trap 이기 때문에, 따로 해야함.

  // [5] :: rSNMPObjects :: rNotificationinfo
  // "nNotificationString": "",
  // "nNotificationStatus": 0,

  // [5] :: rSNMPObjects :: rChannelFilter
  "filterControlPath": 1, // NS
  "filterControlChannelIndex": 1, // NS
  "filterControlChannelInputPower": 0, // NS
  "filterControlChannelAttenuator": 0, // NS
  // "filterControlChannelGain": 0, // NS
  "filterControlChannelOutputPower": 0, // NS
  "filterControlChannelFreqInfo": 769000000, // NS
  "filterControlChannelBandwidth": 0, // NS

  // [6] :: rSNMPObjects :: rIsolation
  // "dlRunIsolationCheck": 0,  // null, // NS
  // "ulRunIsolationCheck": 0,  // null, // NS
  // "dlIsolationCheckStatus": 0, // NS
  // "ulIsolationCheckStatus": 0, // NS
  "dl700IsolationValue": 0, // NS
  "dl800IsolationValue": 0, // NS
  "ulIsolationValue": 0, // NS

}


const oidAlarmScalars = {
  "1.3.6.1.4.1.19865.4.1":  "1.3.6.1.4.1.19865.3.1",
  "1.3.6.1.4.1.19865.4.2":  "1.3.6.1.4.1.19865.3.2",
  "1.3.6.1.4.1.19865.4.3":  "1.3.6.1.4.1.19865.3.3",
  "1.3.6.1.4.1.19865.4.4":  "1.3.6.1.4.1.19865.3.4",
  "1.3.6.1.4.1.19865.4.5":  "1.3.6.1.4.1.19865.3.5",
  "1.3.6.1.4.1.19865.4.6":  "1.3.6.1.4.1.19865.3.6",
  "1.3.6.1.4.1.19865.4.7":  "1.3.6.1.4.1.19865.3.7",
  "1.3.6.1.4.1.19865.4.8":  "1.3.6.1.4.1.19865.3.8",
  "1.3.6.1.4.1.19865.4.9":  "1.3.6.1.4.1.19865.3.9",
  "1.3.6.1.4.1.19865.4.10": "1.3.6.1.4.1.19865.3.10",
  "1.3.6.1.4.1.19865.4.11": "1.3.6.1.4.1.19865.3.11",
  "1.3.6.1.4.1.19865.4.12": "1.3.6.1.4.1.19865.3.12",
  "1.3.6.1.4.1.19865.4.13": "1.3.6.1.4.1.19865.3.13",
  "1.3.6.1.4.1.19865.4.14": "1.3.6.1.4.1.19865.3.14",
  // "1.3.6.1.4.1.19865.4.15": "1.3.6.1.4.1.19865.3.15",
  // "1.3.6.1.4.1.19865.4.16": "1.3.6.1.4.1.19865.3.16",
  // "1.3.6.1.4.1.19865.4.17": "1.3.6.1.4.1.19865.3.17",
  "1.3.6.1.4.1.19865.4.999": "1.3.6.1.4.1.19865.3.999",
}

const nmAlarmScalars = {
  "1.3.6.1.4.1.19865.4.1": "acpowerAlarmState",
  "1.3.6.1.4.1.19865.4.2": "tempAlarmState",
  "1.3.6.1.4.1.19865.4.3": "dcFailAlarmState",
  "1.3.6.1.4.1.19865.4.4": "batteryCapacityAlarmState",
  "1.3.6.1.4.1.19865.4.5": "dcdcFailAlarmState",
  // "1.3.6.1.4.1.19865.4.6": "pllAlarmState",
  "1.3.6.1.4.1.19865.4.6": "dl700PllAlarmState",
  "1.3.6.1.4.1.19865.4.7": "dl800PllAlarmState",
  "1.3.6.1.4.1.19865.4.8": "ulPllAlarmState",
  // "1.3.6.1.4.1.19865.4.7": "dl700PAUFailAlarmState",
  // "1.3.6.1.4.1.19865.4.8": "dl800PAUFailAlarmState",
  // "1.3.6.1.4.1.19865.4.9": "ulPAUFailAlarmState",
  "1.3.6.1.4.1.19865.4.9": "dl700ANTFailAlarmState",
  "1.3.6.1.4.1.19865.4.10": "dl800ANTFailAlarmState",
  "1.3.6.1.4.1.19865.4.11": "ulANTFailAlarmState",
  // "1.3.6.1.4.1.19865.4.13": "dl700HighInputAlarmState",
  // "1.3.6.1.4.1.19865.4.14": "dl800HighInputAlarmState",
  "1.3.6.1.4.1.19865.4.12": "dl700HighOutputAlarmState",
  "1.3.6.1.4.1.19865.4.13": "dl800HighOutputAlarmState",
  "1.3.6.1.4.1.19865.4.14": "ulHighOutputtAlarmState",
  "1.3.6.1.4.1.19865.4.999": "testAlarmState",
}


// 모듈로 내보내기..
export { dvScalars, nmAlarmScalars, oidAlarmScalars }