import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserNavber from "../UserNavBar/UserNavbar";
import UserHeaderPage from "../UserHeaderPage/UserHeaderPage";
import { PS700SetChange } from "../../../../_reducers/PS700SetSlice";
import { PS800SetChange } from "../../../../_reducers/PS800SetSlice";
import { PSULSetChange } from "../../../../_reducers/PSULSetSlice";
import { CommonSetChange } from "../../../../_reducers/commonSlice";
// import { ErrorMessage } from '../../../Renderer/Renderer'
// const { ipcRenderer } = window.require('electron');

import { randomNumberInRange, useInterval, convertDataSerialToObject, ControlLED } from '../../../lib/common'


function UserSetAlarmPage() {
  const dispatch = useDispatch();
  const PS700state = useSelector((state) => state.PS700SetSlice);
  const PS800state = useSelector((state) => state.PS800SetSlice);
  const PSULstate = useSelector((state) => state.PSULSetSlice);
  const commonstate = useSelector((state) => state.commonSlice);
  const [ps700Alarm, setps700Alarm] = useState(PS700state);
  const [ps800Alarm, setps800Alarm] = useState(PS800state);
  const [psulAlarm, setpsulAlarm] = useState(PSULstate);
  const [commonAlarm, setcommonAlarm] = useState(commonstate);
  const [commonAlarmMute, setcommonAlarmMute] = useState(false);
  const [DTUAlarmMute, setDTUAlarmMute] = useState(false);

  useEffect(() => {
    const nowPage = document.getElementById("navbarButtonSetAlarms");
    nowPage.className = nowPage.className + " " + "bg-indigo-600 text-white";
    RecallClick();
  },[])
  
  const drawData = [
    {
      direction: "DL",
      title: "FirstNet + PS700",
      parameter: ps700Alarm,
    },
    {
      direction: "DL",
      title: "PS800",
      parameter: ps800Alarm,
    },
    {
      direction: "UL",
      title: "PSUL",
      parameter: psulAlarm,
    },
  ];

  const MuteChange = (e) => {
    let changeData;
    switch (e.target.name) {
      case "FirstNet + PS700":
        changeData = { ...ps700Alarm, alarm: {...ps700Alarm.alarm, mute: e.target.checked} };
        setps700Alarm(changeData);
        //dispatch(PS700SetChange({ name: 'alarmMute', value: e.target.checked }));
        break;
        
      case "PS800":
        changeData = { ...ps800Alarm, alarm: {...ps800Alarm.alarm, mute: e.target.checked} };
        setps800Alarm(changeData);
        //dispatch(PS800SetChange({ name: 'alarmMute', value: e.target.checked }));
        break;

      case "PSUL":
        changeData = { ...psulAlarm, alarm: {...psulAlarm.alarm, mute: e.target.checked} };
        setpsulAlarm(changeData);
        //dispatch(PSULSetChange({ name: "alarmMute", value: e.target.checked }));
        break;

      case "commonMute":
        setcommonAlarmMute(e.target.checked);
        break;

      case "DTUAlarmMute":
        setDTUAlarmMute(e.target.checked);
        break;

      default:
        break;
    }
  }

  const InputLowThChange = (e) => {
    let changeData;
    if( e.currentTarget.value > 128){ e.currentTarget.value = 128; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.currentTarget.value = Number(e.currentTarget.value).toFixed(1);
    switch (e.target.name) {
      case "FirstNet + PS700":        
        changeData = { ...ps700Alarm, th: {...ps700Alarm.th, inputLowTh: Number(e.target.value) * 10} };
        setps700Alarm(changeData);
        //dispatch(PS700SetChange({ name: "thInputLowTh", value: Number(e.target.value)*10 }));
        break;
        
      case "PS800":
        changeData = { ...ps800Alarm, th: {...ps800Alarm.th, inputLowTh: Number(e.target.value) * 10} };
        setps800Alarm(changeData);
        //dispatch(PS800SetChange({ name: "thInputLowTh", value: Number(e.target.value)*10 }));
        break;

      case "PSUL":
        changeData = { ...psulAlarm, th: {...psulAlarm.th, inputLowTh: Number(e.target.value) * 10} };
        setpsulAlarm(changeData);
        //dispatch(PSULSetChange({ name: "thInputLowTh", value: Number(e.target.value)*10 }));
        break;

      default:
        break;
    }
  }

  const InputHighThChange = (e) => {
    let changeData;
    if( e.currentTarget.value > 128){ e.currentTarget.value = 128; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.currentTarget.value = Number(e.currentTarget.value).toFixed(1);
    switch (e.target.name) {
      case "FirstNet + PS700":        
        changeData = { ...ps700Alarm, th: {...ps700Alarm.th, inputHighTh: Number(e.target.value) * 10} };
        setps700Alarm(changeData);
        //dispatch(PS700SetChange({ name: "thInputHighTh", value: Number(e.target.value)*10 }));
        break;
        
      case "PS800":
        changeData = { ...ps800Alarm, th: {...ps800Alarm.th, inputHighTh: Number(e.target.value) * 10} };
        setps800Alarm(changeData);
        //dispatch(PS800SetChange({ name: "thInputHighTh", value: Number(e.target.value)*10 }));
        break;

      case "PSUL":
        changeData = { ...psulAlarm, th: {...psulAlarm.th, inputHighTh: Number(e.target.value) * 10} };
        setpsulAlarm(changeData);
        //dispatch(PSULSetChange({ name: "thInputHighTh", value: Number(e.target.value)*10 }));
        break;

      default:
        break;
    }
  }

  const OutputLowThChange = (e) => {
    let changeData;
    if( e.currentTarget.value > 128){ e.currentTarget.value = 128; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.currentTarget.value = Number(e.currentTarget.value).toFixed(1);
    switch (e.target.name) {
      case "FirstNet + PS700":        
        changeData = { ...ps700Alarm, th: {...ps700Alarm.th, outputLowTh: Number(e.target.value) * 10} };
        setps700Alarm(changeData);
        //dispatch(PS700SetChange({ name: "thOutputLowTh", value: Number(e.target.value)*10 }));
        break;
        
      case "PS800":
        changeData = { ...ps800Alarm, th: {...ps800Alarm.th, outputLowTh: Number(e.target.value) * 10} };
        setps800Alarm(changeData);
        //dispatch(PS800SetChange({ name: "thOutputLowTh", value: Number(e.target.value)*10 }));
        break;

      case "PSUL":
        changeData = { ...psulAlarm, th: {...psulAlarm.th, outputLowTh: Number(e.target.value) * 10} };
        setpsulAlarm(changeData);
        //dispatch(PSULSetChange({ name: "thOutputLowTh", value: Number(e.target.value)*10 }));
        break;

      default:
        break;
    }
  }

  const OutputHighThChange = (e) => {
    let changeData;
    if( e.currentTarget.value > 128){ e.currentTarget.value = 128; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.currentTarget.value = Number(e.currentTarget.value).toFixed(1);
    switch (e.target.name) {
      case "FirstNet + PS700":        
        changeData = { ...ps700Alarm, th: {...ps700Alarm.th, outputHighTh: Number(e.target.value) * 10} };
        setps700Alarm(changeData);
        //dispatch(PS700SetChange({ name: "thOutputHighTh", value: Number(e.target.value)*10 }));
        break;
        
      case "PS800":
        changeData = { ...ps800Alarm, th: {...ps800Alarm.th, outputHighTh: Number(e.target.value) * 10} };
        setps800Alarm(changeData);
        //dispatch(PS800SetChange({ name: "thOutputHighTh", value: Number(e.target.value)*10 }));
        break;

      case "PSUL":
        changeData = { ...psulAlarm, th: {...psulAlarm.th, outputHighTh: Number(e.target.value) * 10} };
        setpsulAlarm(changeData);
        //dispatch(PSULSetChange({ name: "thOutputHighTh", value: Number(e.target.value)*10 }));
        break;

      default:
        break;
    }
  }

  const SystemTemperatureChange = (e) => {
    let changeData;
    if( e.currentTarget.value > 128){ e.currentTarget.value = 128; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.currentTarget.value = Math.floor(e.currentTarget.value);
    changeData = { ...commonAlarm, temperatureTh: Number(e.target.value) };
    setcommonAlarm(changeData);
    //dispatch(CommonSetChange({ name: "temperatureTh", value: Number(e.target.value) }));
  };


  const ResetClick = () => {
    let changeDataPs700 = { ...ps700Alarm,
      alarm: {...ps700Alarm.alarm, mute: false},
      th: { inputLowTh: 0, inputHighTh: 0, outputLowTh: 0, outputHighTh: 0, }
    };
    let changeDataPs800 = { ...ps800Alarm,
      alarm: {...ps800Alarm.alarm, mute: false},
      th: { inputLowTh: 0, inputHighTh: 0, outputLowTh: 0, outputHighTh: 0, }
    };
    let changeDataPsul = { ...psulAlarm,
      alarm: {...ps800Alarm.alarm, mute: false},
      th: { inputLowTh: 0, inputHighTh: 0, outputLowTh: 0, outputHighTh: 0, }
    };
    let changeDataCommon = {...commonAlarm, temperatureTh: 0 };
    
    setps700Alarm(changeDataPs700);
    //dispatch(PS700SetChange({ name: "alarmMute", value: changeDataPs700.alarm.mute }));
    //dispatch(PS700SetChange({ name: "thInputLowTh", value: changeDataPs700.th.inputLowTh }));
    //dispatch(PS700SetChange({ name: "thInputHighTh", value: changeDataPs700.th.inputHighTh }));
    //dispatch(PS700SetChange({ name: "thOutputLowTh", value: changeDataPs700.th.outputLowTh }));
    //dispatch(PS700SetChange({ name: "thOutputHighTh", value: changeDataPs700.th.outputHighTh }));

    setps800Alarm(changeDataPs800);
    //dispatch(PS800SetChange({ name: "alarmMute", value: changeDataPs800.alarm.mute }));
    //dispatch(PS800SetChange({ name: "thInputLowTh", value: changeDataPs800.th.inputLowTh }));
    //dispatch(PS800SetChange({ name: "thInputHighTh", value: changeDataPs800.th.inputHighTh }));
    //dispatch(PS800SetChange({ name: "thOutputLowTh", value: changeDataPs800.th.outputLowTh }));
    //dispatch(PS800SetChange({ name: "thOutputHighTh", value: changeDataPs800.th.outputHighTh }));

    setpsulAlarm(changeDataPsul);
    //dispatch(PSULSetChange({ name: "alarmMute", value: changeDataPsul.alarm.mute }));
    //dispatch(PSULSetChange({ name: "thInputLowTh", value: changeDataPsul.th.inputLowTh }));
    //dispatch(PSULSetChange({ name: "thInputHighTh", value: changeDataPsul.th.inputHighTh }));
    //dispatch(PSULSetChange({ name: "thOutputLowTh", value: changeDataPsul.th.outputLowTh }));
    //dispatch(PSULSetChange({ name: "thOutputHighTh", value: changeDataPsul.th.outputHighTh }));

    setcommonAlarm(changeDataCommon);
    //dispatch(CommonSetChange({ name: "temperatureTh", value: changeDataCommon.temperatureTh }));
  }

  const ConfirmClick = async() => {
    // let transStac = 0;
    const transData = [
      {title: 'ps700', band: 0, data: ps700Alarm},
      {title: 'ps800', band: 1, data: ps800Alarm},
      {title: 'psul', band: 2, data: psulAlarm},
      {title: 'common', band: 3, data: commonAlarm},
    ]
    for (let index = 0; index < transData.length; index++) {
      const ipcData = { 
        command: 0x06,
        numberOfCommand: 1,
        band: 0,
        data: []
      };
      // 밴드값 변경
      ipcData.band = transData[index].band;   
      // 넣어줄 값 설정
      //
      // 값들 주소에 맞게 넣어주기
      let addr = 0;
      // PS700, PS800, PSUL 이라면..
      if( ipcData.band == 0 || ipcData.band == 1 || ipcData.band == 2 ){   
        ipcData.data[addr] = transData[index].data.alarm.mute;                   addr++;
        ipcData.data[addr] = (transData[index].data.th.inputLowTh>>8)&0xFF;      addr++;
        ipcData.data[addr] = transData[index].data.th.inputLowTh&0xFF;           addr++;
        ipcData.data[addr] = (transData[index].data.th.inputHighTh>>8)&0xFF;     addr++;
        ipcData.data[addr] = transData[index].data.th.inputHighTh&0xFF;          addr++;
        ipcData.data[addr] = (transData[index].data.th.outputLowTh>>8)&0xFF;     addr++;
        ipcData.data[addr] = transData[index].data.th.outputLowTh&0xFF;          addr++;
        ipcData.data[addr] = (transData[index].data.th.outputHighTh>>8)&0xFF;    addr++;
        ipcData.data[addr] = transData[index].data.th.outputHighTh&0xFF;         addr++;
      }else if( ipcData.band == 3 ) {  // COMMON 이라면..
        ipcData.command = 0x0D;
        // ipcData.band = 3;
        // ipcData.data = [];
        ipcData.data[addr] = commonAlarmMute===true ? 1:0;             addr++;
        ipcData.data[addr] = DTUAlarmMute===true ? 1:0;                addr++;
        ipcData.data[addr] = commonAlarm.temperatureTh&0xFF;           // addr++;
      }
      // ipcRenderer.send('SerialTransmit', ipcData);
      // pakt87
      const postSuccessed = await postSerialCommunication(ipcData, "set")
      if( ! postSuccessed) { break; } // 어떤 통신이 실패했다면 for 문 종료후 빠져나가기..
    }



    /***************************************** *
    let ipcData = { 
      command: 0x06,
      numberOfCommand: 1,
      band: 0,
      data: []
    };
    let addr = 0;

    let transLoop = setInterval(() => {
      ipcData.band = transData[transStac].band;
      ipcData.data = [];
      ipcData.command = 0x06;
      addr = 0;
      ipcData.data[addr] = transData[transStac].data.alarm.mute;                   addr++;
      ipcData.data[addr] = (transData[transStac].data.th.inputLowTh>>8)&0xFF;      addr++;
      ipcData.data[addr] = transData[transStac].data.th.inputLowTh&0xFF;           addr++;
      ipcData.data[addr] = (transData[transStac].data.th.inputHighTh>>8)&0xFF;     addr++;
      ipcData.data[addr] = transData[transStac].data.th.inputHighTh&0xFF;          addr++;
      ipcData.data[addr] = (transData[transStac].data.th.outputLowTh>>8)&0xFF;     addr++;
      ipcData.data[addr] = transData[transStac].data.th.outputLowTh&0xFF;          addr++;
      ipcData.data[addr] = (transData[transStac].data.th.outputHighTh>>8)&0xFF;    addr++;
      ipcData.data[addr] = transData[transStac].data.th.outputHighTh&0xFF;         addr++;

      // ipcRenderer.send('SerialTransmit', ipcData);
      // pakt87
      // 
      // 
      // 
      
      transStac += 1;
      if( transStac > 2 ){ clearInterval(transLoop) }
    }, 500)
    
    ipcData.command = 0x0D;
    ipcData.band = 3;
    ipcData.data = [];
    ipcData.data[addr] = commonAlarm.temperatureTh&0xFF;           addr++;
    // ipcRenderer.sendSync('SerialTransmit', ipcData);
    // pakt87
    /***************************************** */

    /***************************************** *
    dispatch(CommonSetChange({ name: "temperatureTh", value: commonAlarm.temperatureTh }));

    dispatch(PS700SetChange({ name: "alarmMute", value: ps700Alarm.alarm.mute }));
    dispatch(PS700SetChange({ name: "thInputLowTh", value: ps700Alarm.th.inputLowTh }));
    dispatch(PS700SetChange({ name: "thInputHighTh", value: ps700Alarm.th.inputHighTh }));
    dispatch(PS700SetChange({ name: "thOutputLowTh", value: ps700Alarm.th.outputLowTh }));
    dispatch(PS700SetChange({ name: "thOutputHighTh", value: ps700Alarm.th.outputHighTh }));

    dispatch(PS800SetChange({ name: "alarmMute", value: ps800Alarm.alarm.mute }));
    dispatch(PS800SetChange({ name: "thInputLowTh", value: ps800Alarm.th.inputLowTh }));
    dispatch(PS800SetChange({ name: "thInputHighTh", value: ps800Alarm.th.inputHighTh }));
    dispatch(PS800SetChange({ name: "thOutputLowTh", value: ps800Alarm.th.outputLowTh }));
    dispatch(PS800SetChange({ name: "thOutputHighTh", value: ps800Alarm.th.outputHighTh }));

    dispatch(PSULSetChange({ name: "alarmMute", value: psulAlarm.alarm.mute }));
    dispatch(PSULSetChange({ name: "thInputLowTh", value: psulAlarm.th.inputLowTh }));
    dispatch(PSULSetChange({ name: "thInputHighTh", value: psulAlarm.th.inputHighTh }));
    dispatch(PSULSetChange({ name: "thOutputLowTh", value: psulAlarm.th.outputLowTh }));
    dispatch(PSULSetChange({ name: "thOutputHighTh", value: psulAlarm.th.outputHighTh }));
    /***************************************** */
  }
  const processOfResponseDataSet = (responseData) => {
    console.log("processOfResponseDataSet's responseData is ===> ", responseData)
    if(responseData.command === 0x11) {   // 0x11 is 17 : 정상처리 수신커맨드..
      console.log("processOfResponseDataSet's Command is Correct")
      switch (responseData.band) {
        case 0:   // PS700
          dispatch(PS700SetChange({ name: "alarmMute", value: ps700Alarm.alarm.mute }));
          dispatch(PS700SetChange({ name: "thInputLowTh", value: ps700Alarm.th.inputLowTh }));
          dispatch(PS700SetChange({ name: "thInputHighTh", value: ps700Alarm.th.inputHighTh }));
          dispatch(PS700SetChange({ name: "thOutputLowTh", value: ps700Alarm.th.outputLowTh }));
          dispatch(PS700SetChange({ name: "thOutputHighTh", value: ps700Alarm.th.outputHighTh }));
          break;
        case 1:   // PS800
          dispatch(PS800SetChange({ name: "alarmMute", value: ps800Alarm.alarm.mute }));
          dispatch(PS800SetChange({ name: "thInputLowTh", value: ps800Alarm.th.inputLowTh }));
          dispatch(PS800SetChange({ name: "thInputHighTh", value: ps800Alarm.th.inputHighTh }));
          dispatch(PS800SetChange({ name: "thOutputLowTh", value: ps800Alarm.th.outputLowTh }));
          dispatch(PS800SetChange({ name: "thOutputHighTh", value: ps800Alarm.th.outputHighTh }));
          break;
        case 2:   // PSUL
          dispatch(PSULSetChange({ name: "alarmMute", value: psulAlarm.alarm.mute }));
          dispatch(PSULSetChange({ name: "thInputLowTh", value: psulAlarm.th.inputLowTh }));
          dispatch(PSULSetChange({ name: "thInputHighTh", value: psulAlarm.th.inputHighTh }));
          dispatch(PSULSetChange({ name: "thOutputLowTh", value: psulAlarm.th.outputLowTh }));
          dispatch(PSULSetChange({ name: "thOutputHighTh", value: psulAlarm.th.outputHighTh }));
          break;
        case 3:   // COMMON
          dispatch(CommonSetChange({ name: "temperatureTh", value: commonAlarm.temperatureTh }));
          break;
      
        default:
          break;
      }
    }
  }
  const processOfResponseDataGet = (responseData) => {
    console.log("processOfResponseDataGet's responseData is ===> ", responseData)
    if(responseData.command == 0x2F){  // 0x2F is 47
      let th, changeData;
      th = { 
        inputLowTh: (responseData.data[1]<<8)+responseData.data[2], 
        inputHighTh: (responseData.data[3]<<8)+responseData.data[4], 
        outputLowTh: (responseData.data[5]<<8)+responseData.data[6], 
        outputHighTh: (responseData.data[7]<<8)+responseData.data[8], 
      }
      switch (responseData.band) {
        case 0:   // PS700
          changeData = { ...ps700Alarm,
            alarm: {...ps700Alarm.alarm, mute: responseData.data[0]},
            th: th
          };
          setps700Alarm(changeData)
          break;
        case 1:   // PS800
          changeData = { ...ps800Alarm,
            alarm: {...ps800Alarm.alarm, mute: responseData.data[0]},
            th: th
          };
          setps800Alarm(changeData)
          break;
        case 2:   // PSUL
          changeData = { ...psulAlarm,
            alarm: {...psulAlarm.alarm, mute: responseData.data[0]},
            th: th
          };
          setpsulAlarm(changeData)
          break;
      
        default:
          break;
      }
    }else if(responseData.command == 0x39){ // 0x39 is 57
      switch (responseData.band) {
        case 3:   // COMMON
          setcommonAlarmMute(responseData.data[0]===1 ? true:false);
          setDTUAlarmMute(responseData.data[1]===1 ? true:false);
          setcommonAlarm({...commonAlarm, temperatureTh: responseData.data[2] });
          break;
      
        default:
          break;
      }
    }else{
      console.log("processOfResponseDataGet's responseData's command is invalid.")
    }
    
    // let th, changeData;
    // th = { 
    //   inputLowTh: (responseData.data[1]<<8)+responseData.data[2], 
    //   inputHighTh: (responseData.data[3]<<8)+responseData.data[4], 
    //   outputLowTh: (responseData.data[5]<<8)+responseData.data[6], 
    //   outputHighTh: (responseData.data[7]<<8)+responseData.data[8], 
    // }
  }
  const postSerialCommunication = async(ipcData, act) => {
    try {
      ControlLED('Tx', 'on');
      const datas = { ipcData: ipcData }
			const res = await fetch("/api/serialCommunication", {
				timeout: 10000,		// 10초 타임아웃 제한..
        method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
        ControlLED('Tx', 'off');
        ControlLED('Rx', 'on');
        const result = await res.json()
				const responseData = result.result
        console.log("http okay ==> ", res.status, result, responseData)
				// 받아온 결과값들 가지고 처리하는 async/await 함수 넣어줄것..
        if(act === "set") processOfResponseDataSet(convertDataSerialToObject(responseData))
        else if(act === "get") processOfResponseDataGet(convertDataSerialToObject(responseData))
        
        ControlLED('Rx', 'off');
        return true   // 통신성공 했음을 true 로 리턴..
        
      } else { 
        ControlLED('Tx', 'off');
        ControlLED('Rx', 'off');
        console.log("http error ==> ", res.status) 
        return false  // 통신실패 했음을 false 로 리턴..
      }
    } catch (error) { 
      ControlLED('Tx', 'off');
      ControlLED('Rx', 'off');
      console.log("error catch ==> ", error) 
      return false    // 통신실패 했음을 false 로 리턴..
    }
  }
  const RecallClick = async() => {
    // let transStac = 0;
    const transData = [
      {title: 'ps700', band: 0,},
      {title: 'ps800', band: 1,},
      {title: 'psul', band: 2,},
      {title: 'common', band:3,}
    ]
    for (let index = 0; index < transData.length; index++) {
      const ipcData = { 
        command: 0x2E,
        numberOfCommand: 1,
        band: 0,
        data: []
      };
      ipcData.band = transData[index].band;   // 밴드값 변경
      if( ipcData.band === 3 ){
        ipcData.command = 0x38;
        ipcData.numberOfCommand = 1;
        ipcData.data = [];
      }
      // ipcRenderer.send('SerialTransmit', ipcData);
      // pakt87
      const postSuccessed = await postSerialCommunication(ipcData, "get")
      if( ! postSuccessed) { break; } // 어떤 통신이 실패했다면 for 문 종료후 빠져나가기..
    }

    /*************************************************************** *
    let ipcData = { 
      command: 0x2E,
      numberOfCommand: 1,
      band: 0,
      data: []
    };
    let waitStac = 0;
    let th, changeData;

    let transLoop = setInterval(() => {
      ipcData.band = transData[transStac].band;
      ipcData.command = 0x2E;
      ipcRenderer.send('SerialTransmit', ipcData);
      waitStac = 0;
        const interval = setInterval(() => {
          let responseData = ipcRenderer.sendSync('SerialResponse');
          waitStac++;
          if( waitStac < 4 ){
            if( responseData.flag ){
              waitStac = 0;
              clearInterval(interval);
              th = { 
                inputLowTh: (responseData.data[1]<<8)+responseData.data[2], 
                inputHighTh: (responseData.data[3]<<8)+responseData.data[4], 
                outputLowTh: (responseData.data[5]<<8)+responseData.data[6], 
                outputHighTh: (responseData.data[7]<<8)+responseData.data[8], 
              }
              
              switch (responseData.band) {
                case 0:
                  changeData = { ...ps700Alarm,
                    alarm: {...ps700Alarm.alarm, mute: responseData.data[0]},
                    th: th
                  };
                  setps700Alarm(changeData)

                  break;
                case 1:
                  changeData = { ...ps800Alarm,
                    alarm: {...ps800Alarm.alarm, mute: responseData.data[0]},
                    th: th
                  };
                  setps800Alarm(changeData)

                  break;
                case 2:
                  changeData = { ...psulAlarm,
                    alarm: {...psulAlarm.alarm, mute: responseData.data[0]},
                    th: th
                  };
                  setpsulAlarm(changeData)

                  break;
              
                default:
                  break;
              }
            }
          }else{
            waitStac = 0;
            clearInterval(interval);
            ErrorMessage('Recall Error', "can't Recall Data from MCU")
          }
        }, 20)
        transStac += 1;
      if( transStac > 2 ){ clearInterval(transLoop) }
    }, 200)
    /*************************************************************** */


    /*************************************************************** *
    ipcData.band = 3;
    ipcData.command = 0x38;
    ipcData.numberOfCommand = 1;
    ipcData.data = [];
    ipcRenderer.sendSync('SerialTransmit', ipcData);
    waitStac = 0;
    const interval = setInterval(() => {
      let responseData = ipcRenderer.sendSync('SerialResponse');
      waitStac++;

      if( waitStac < 4 ) {
        if( responseData.flag ){
          clearInterval(interval);
          console.log(responseData.data[0])
          setcommonAlarm({...commonAlarm, temperatureTh: responseData.data[0] });
        }
      }else{
        clearInterval(interval);
        ErrorMessage('temperatureTh Recall Error', "can't Recall Data from MCU");
      }
    }, 20)
    /*************************************************************** */
  }






  const alarmDraw = drawData.map((d,i) => {

    return (
      <div className="w-1/3 h-full" key={"alamr" + d.title}>
        <div className="w-9/10 h-1/7 bg-indigo-500 text-white rounded-t-lg mx-auto">
          <p className="w-full h-fit text-lg py-2.5">{d.title}</p>
        </div>
        <div className="w-9/10 h-1/7 flex mx-auto border-x-2 border-gray-500">
          <div className="w-1/2 h-full flex">
            <p className="w-full h-fit text-base my-auto">Mute</p>
          </div>
          <div className="w-fit h-fit m-auto">
            <label className="switch">
              <input
                id={d.title + "Mute"}
                name={d.title}
                type="checkbox"
                checked={d.parameter.alarm.mute}
                onChange={MuteChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="w-9/10 h-1/7 flex border-r-2 border-x-2 border-gray-500 bg-indigo-50 mx-auto ">
          <div className="w-1/2 h-full flex">
            <p className="w-full h-fit text-lg my-auto">RSSI(Low)</p>
          </div>
          <input
            className="w-5/12 h-2/3 text-center bg-indigo-50 m-auto"
            name={d.title}
            min="0.0"
            max="27.0"
            type="number"
            step="0.1"
            value={(d.parameter.th.inputLowTh / 10).toString()}
            onChange={InputLowThChange}
          />
        </div>

        <div className="w-9/10 h-1/7 flex mx-auto border-x-2 border-gray-500">
          <div className="w-1/2 h-full flex">
            <p className="w-full h-fit text-lg my-auto">RSSI(High)</p>
          </div>
          <input
            className="w-5/12 h-2/3 m-auto text-center"
            name={d.title}
            min="0"
            max="45"
            type="number"
            step="0.1"
            value={(d.parameter.th.inputHighTh / 10).toString()}
            onChange={InputHighThChange}
          />
        </div>

        <div className="w-9/10 h-1/6 flex mx-auto border-x-2 border-gray-500 bg-indigo-50">
          <div className="w-1/2 h-full flex">
            <p className="w-full h-fit text-base my-auto">
              Output
              <br /> Power(Low)
            </p>
          </div>
          <input
            className="w-5/12 h-2/3 m-auto text-center bg-indigo-50"
            name={d.title}
            min="0"
            max="45"
            type="number"
            step="0.1"
            value={(d.parameter.th.outputLowTh / 10).toString()}
            onChange={OutputLowThChange}
          />
        </div>
        <div className="w-9/10 h-1/6 flex mx-auto border-x-2 border-gray-500 border-b-2 rounded-b-lg">
          <div className="w-1/2 h-full flex">
            <p className="w-full h-fit text-base my-auto">
              Output
              <br /> Power(High)
            </p>
          </div>
          <input
            className="w-5/12 h-2/3 m-auto text-center"
            name={d.title}
            min="0"
            max="45"
            type="number"
            step="0.1"
            value={(d.parameter.th.outputHighTh / 10).toString()}
            onChange={OutputHighThChange}
          />
        </div>
      </div>
    );
  })

  return (
    <div style={{ display: "flex" }}>
      <div>
        <UserNavber />
      </div>
      <div style={{ width: "1030px", height: "820px", minWidth:'1030px' }}>
        <UserHeaderPage />
        <div className="w-full h-userMain font-sans font-bold text-stone-700">
          <div className="w-full h-1/2 flex justify-between text-center pt-7">
            {alarmDraw}
          </div>

          <div className="w-full h-1/4 border-2 border-gray-500">
            <p className="w-full h-1/4 text-4xl pl-7">Common</p>
            <div className="w-3/4 h-1/2 flex">
              <div className="w-1/2 h-full">
                <div className="w-9/10 h-1/4 flex">     {/* Common Alarm Mute */}
                  <div className="w-1/2 h-full flex">
                    <p className="w-fit h-fit text-xl m-auto">Alarm Mute : </p>
                  </div>
                  <div className="w-fit h-fit m-auto">
                    <label className="switch">
                      <input
                        id={"common"}
                        name={'commonMute'}
                        type="checkbox"
                        checked={commonAlarmMute}
                        onChange={MuteChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-1/2 flex">
                  <p className="w-fit h-fit text-xl m-auto">Temperature Th : </p>
                  <input className="w-1/2 h-2/3 border-b-2 border-gray-300 text-center m-auto " 
                    name='commonTemperatureTh'
                    min="0"
                    max="128"
                    type="number"
                    value={(commonAlarm.temperatureTh).toString()}
                    onChange={SystemTemperatureChange}
                  />
                </div>
              </div>

              <div className="w-1/2 h-full">
                <div className="w-9/10 h-1/4 flex">     {/* Common Alarm Mute */}
                  <div className="w-3/5 h-full flex">
                    <p className="w-fit h-fit text-xl m-auto">DTU Alarm Mute : </p>
                  </div>
                  <div className="w-fit h-fit m-auto">
                    <label className="switch">
                      <input
                        id={"DTU"}
                        name={'DTUAlarmMute'}
                        type="checkbox"
                        checked={DTUAlarmMute}
                        onChange={MuteChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>








          <div className="w-1/2 h-1/4 flex justify-between pt-16 mx-auto">
            <button className="w-1/3 h-9 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900" onClick={ConfirmClick}>
              Confirm
            </button>
            {/* <button className="w-1/4 h-9 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900" onClick={ResetClick}>
              Reset
            </button> */}
            <button className="w-1/3 h-9 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900" onClick={RecallClick}>
              Recall
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSetAlarmPage