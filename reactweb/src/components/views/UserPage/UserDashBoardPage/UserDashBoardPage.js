import React, { useState, useEffect, useContext} from 'react'
import UserNavber from '../UserNavBar/UserNavbar'
import UserHeaderPage from '../UserHeaderPage/UserHeaderPage'
import { useDispatch, useSelector } from 'react-redux'
import { PS700SetChange } from '../../../../_reducers/PS700SetSlice'
import { PS800SetChange } from '../../../../_reducers/PS800SetSlice'
import { PSULSetChange } from '../../../../_reducers/PSULSetSlice'
import CreateGauge from './UserGauge'
import { AiOutlinePoweroff } from "react-icons/ai";
// const { ipcRenderer } = window.require('electron');

// pakt87..
import {useInterval, randomNumberInRange, convertDataSerialToObject, ControlLED} from "../../../lib/common"
import { GlobalContext } from '../../../context/GlobalContext'

function UserDashBoardPage() {
  // const [test, settest] = useState(0);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [ps700State, setps700State] = useState(state.PS700SetSlice);
  const [ps800State, setps800State] = useState(state.PS800SetSlice);
  const [psulState, setpsulState] = useState(state.PSULSetSlice);
  const [commonState, setcommonState] = useState(state.commonSlice);
  // const ps700Channel = useSelector((state) => state.PS700Channel);
  // const ps800Channel = useSelector((state) => state.PS800Channel);
  const [ps700Channel, setps700Channel] = useState(state.PS700Channel);
  const [ps800Channel, setps800Channel] = useState(state.PS800Channel);
  const [refreshStac, setrefreshStac] = useState(true);
  // const [numbersOfSleep, setnumbersOfSleep] = useState(0);
  const [ps700NumbersOfSleep, setps700NumbersOfSleep] = useState(0);
  const [ps800NumbersOfSleep, setps800NumbersOfSleep] = useState(0);
  let firstNetGauge, PS700Gauge, PS800Gauge, PSULGauge;

  const { globalIsProgress } = useContext(GlobalContext)  // 전역 Context 가져오기..
  
  useEffect(() => {
    const nowPage = document.getElementById("navbarButtonDashboard");
    nowPage.className = nowPage.className + " " + "bg-indigo-600 text-white";

    let majorTicks = [ '0','5','10','15','20','25','30','35','40' ];
    let highlights = [
      {"from": 0, "to": 16.9, "color": "rgba(250, 230, 50, .75)"},
      {"from": 17, "to": 37.4, "color": "rgba(50, 240, 50, .75)"},
      {"from": 37.5, "to": 40, "color": "rgba(250, 50, 50, .75)"},
    ]
    firstNetGauge = CreateGauge('firstNetCanvas', 'firstNet', majorTicks, 40, highlights, (ps700State.outputPower/10).toFixed(1));
    firstNetGauge.draw();

    PS700Gauge = CreateGauge('PS700Canvas', 'PS700', majorTicks, 40, highlights, (ps700State.outputPower/10).toFixed(1));
    PS700Gauge.draw();

    PS800Gauge = CreateGauge('PS800Canvas', 'PS800', majorTicks, 40, highlights, (ps800State.outputPower/10).toFixed(1));
    PS800Gauge.draw();

    majorTicks = [ '0','5','10','15','20','25','30' ];
    highlights = [
      {"from": 0, "to": 6.9, "color": "rgba(250, 230, 50, .75)"},
      {"from": 7, "to": 27.4, "color": "rgba(50, 240, 50, .75)"},
      {"from": 27.5, "to": 30, "color": "rgba(250, 50, 50, .75)"},
    ];
    PSULGauge = CreateGauge('ULCanvas', 'PSUL', majorTicks, 30, highlights, (psulState.outputPower/10).toFixed(1));
    PSULGauge.draw();

    // band : active, input, agc, atten, output, shotdown, Alarms, DISOL, sleepStatus
    // active(1E), input(20), output(22), att34(26), alarms(1C), DISOL(2C), sleepStatus(1A)
    // common : Alarms

    
    // setTimeout(() => {
    //   setrefreshStac(!refreshStac);
      
    //   const trasnData = [
    //   {
    //     title: 'ps700',
    //     band: 0,
    //   },
    //   {
    //     title: 'ps800',
    //     band: 1,
    //   },
    //   {
    //     title: 'psul',
    //     band: 2,
    //   },
    // ]
    // let ipcData = { 
    //   command: 0x2E,
    //   numberOfCommand: 4,
    //   band: 0,
    //   data: [0x24, 0x26, 0x28, 0x2A]
    // };
    // let waitStac = 0;

    // trasnData.map((d,i) => {
    //   setTimeout(() => {
    //     ipcData.band = d.band;
    //     if(d.title == 'psul'){ 
    //       ipcData.numberOfCommand = 5;
    //       ipcData.data[4] = 0x35; 
    //     }
    //     //ipcRenderer.sendSync('SerialTransmit', ipcData);

    //     waitStac = 0;
    //     const interval = setInterval(() => {
    //       let responseData = ipcRenderer.sendSync('SerialResponse');
    //       waitStac++;
    //       let th, changeData;

    //       if( waitStac < 25 ) {
    //         if( responseData.flag ){
    //           clearInterval(interval);
    //         }
    //       }else{
    //         clearInterval(interval);
    //       }
    //     }, 10)
    //   }, 500)
    // })

    // }, 2000)
    
  })

  // const TestInputChange = (e) => {
  //   settest(e.currentTarget.value);
  //   firstNetGauge.value = e.currentTarget.value;
  //   PS700Gauge.value = e.currentTarget.value;
  //   PS800Gauge.value = e.currentTarget.value;
  //   PSULGauge.value = e.currentTarget.value;
  // }

  /*******************************************************
	* useInterval 타이머 사용 ...
	*******************************************************/
	useInterval(() => {
		// Your custom logic here
    console.log("interval..........")
    if(globalIsProgress.isPosting !== true) {
      console.log("interval...RecallClick Auto Clicked..")
      RecallClick()
    }
    firstNetGauge.value = (ps700State.outputPower/10).toFixed(1)
    PS700Gauge.value = (ps700State.outputPower/10).toFixed(1)
    PS800Gauge.value = (ps800State.outputPower/10).toFixed(1)
    PSULGauge.value = (psulState.outputPower/10).toFixed(1)
	}, 1800);

  // 최초 1회만 실행..
  useEffect(()=>{
    let first = setTimeout(()=>{ 
      if(globalIsProgress.isPosting === true){
        globalIsProgress.isPosting = false
        RecallClick()
      }
    }, 700)

    if(globalIsProgress.isPosting !== true) {
      console.log("useEffect... First, RecallClick Auto Clicked..")
      RecallClick()
    }
  }, [])



  const RecallClick = async() => {
    ControlLED('Tx', 'on');
    const data700800 = [0x1E, 0x20, 0x22, 0x26, 0x1C, 0x2C, 0x2E, 0x38, 0x1A]
    const dataUl = [0x1E, 0x20, 0x22, 0x26, 0x1C, 0x2C, 0x2E, 0x38]
    const dataCommon = [0x36, 0x44, 0x38]
    const transData = [
      {title: "ps700", band: 0, command: 0xB0, numberOfCommand: 9, data: data700800},
      {title: "ps800", band: 1, command: 0xB0, numberOfCommand: 9, data: data700800},
      {title: "psul",  band: 2, command: 0xB0, numberOfCommand: 8, data: dataUl},
      {title: "common",band: 3, command: 0xB0, numberOfCommand: 3, data: dataCommon},
    ]
    for (let index = 0; index < transData.length; index++) {
      const ipcData = { 
        command: transData[index].command,
        numberOfCommand: transData[index].numberOfCommand,
        band: transData[index].band,
        data: transData[index].data
      };
      // ipcRenderer.send('SerialTransmit', ipcData);
      // pakt87
      console.log('Serial Transmit.........')
      const postSuccessed = await postSerialCommunication(ipcData, "get")
      if( ! postSuccessed) { break; } // 어떤 통신이 실패했다면 for 문 종료후 빠져나가기..
    }
  }
  const postSerialCommunication = async(ipcData, act) => {
    if(globalIsProgress.isPosting === true) { return false }
    globalIsProgress.isPosting = true
    try {
      const datas = { ipcData: ipcData }
			const res = await fetch("/api/serialCommunication", {
				timeout: 1000,		// 1초 타임아웃 제한..
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
        if(act === "set") { processOfResponseDataSet(convertDataSerialToObject(responseData)) }
        else if(act === "get") { processOfResponseDataGet(convertDataSerialToObject(responseData)) }
        
        globalIsProgress.isPosting = false
        ControlLED('Rx', 'off');
        return true   // 통신성공 했음을 true 로 리턴..
        
      } else { 
        console.log("http error ==> ", res.status) 
        globalIsProgress.isPosting = false
        ControlLED('Tx', 'off');
        ControlLED('Rx', 'off');
        return false  // 통신실패 했음을 false 로 리턴..
      }
    } catch (error) { 
      console.log("error catch ==> ", error) 
      globalIsProgress.isPosting = false
      ControlLED('Tx', 'off');
      ControlLED('Rx', 'off');
      return false    // 통신실패 했음을 false 로 리턴..
    }
  }
  const processOfResponseDataSet = (responseData) => {
    console.log("processOfResponseDataSet's responseData is ===> ", responseData)
  }
  const processOfResponseDataGet = (responseData) => {
    console.log("processOfResponseDataGet's responseData is ===> ", responseData)
    if(responseData.command === 0xB1) { // Command 0xB1 is 177
      switch (responseData.band) {
        case 0:   // PS700 인 경우..
          if(responseData.data.length !== 39) {break}       // 데이터 길이로, 정상적인 데이터를 받아온건지 확인..
          processOfResponseDataGetNoneCommon(responseData)
          break;
        case 1:   // PS800 인 경우..
          if(responseData.data.length !== 39) {break}       // 데이터 길이로, 정상적인 데이터를 받아온건지 확인..
          processOfResponseDataGetNoneCommon(responseData)
          break;
        case 2:   // PSUL 인 경우..
          if(responseData.data.length !== 34) {break}       // 데이터 길이로, 정상적인 데이터를 받아온건지 확인..
          processOfResponseDataGetNoneCommon(responseData)
          break;
        case 3:   // COMMON 인 경우..
          if(responseData.data.length !== 8) {break}        // 데이터 길이로, 정상적인 데이터를 받아온건지 확인..
          let addr = 1;   //command byte 스킵
          let alarm = responseData.data[addr];    addr++;
          addr++; // command byte 스킵
          let temperature = responseData.data[addr];    addr++;
          addr++; // command byte 스킵
          let commonAlarmMute = responseData.data[addr]===1 ? true:false;

          if( commonAlarmMute ) { alarm = 0; }

          setcommonState({...commonState, 
            temperature: temperature, 
            alarm: {...commonState.alarm,
              systemTemperature: alarm&0x01?true:false,
              ACFail: (alarm>>1)&0x01?true:false,
              DCFail: (alarm>>2)&0x01?true:false,
              BATTLow: (alarm>>3)&0x01?true:false,
              BATTChg: (alarm>>4)&0x01?true:false,
              donorANT: psulState.alarm.swr,
            }
          })
          break;
      
        default:
          break;
      }
    }
  }
  const processOfResponseDataGetNoneCommon = (responseData) => {
    let addr = 1;
    let bandState;
    let channelData, numberOfSleep = 0;
    let bandAlarmMute;
    let commonAlarmMute;

    let active = responseData.data[addr];   addr++;
    addr++;   // command 스킵
    
    let input = (responseData.data[addr]<<8) + responseData.data[addr+1];   addr++;   addr++;
    if((input&0x8000) == 0x8000) { input = ((~input&0xFFFF)+1)*(-1); }
    let firstNetInput = (responseData.data[addr]<<8) + responseData.data[addr+1];   addr++;   addr++;
    if((firstNetInput&0x8000) == 0x8000) { firstNetInput = ((~firstNetInput&0xFFFF)+1)*(-1); }
    addr++;   // command 스킵

    let output = (responseData.data[addr]<<8) + responseData.data[addr+1];   addr++;   addr++;
    addr++;   // command 스킵

    let agc = responseData.data[addr];   addr++;
    let atten = (responseData.data[addr]<<8) + responseData.data[addr+1];   addr++;   addr++;
    atten = atten + (responseData.data[addr]<<8) + responseData.data[addr+1];   addr++;   addr++;
    addr++;   // command 스킵

    let alarmValue = responseData.data[addr];   addr++;
    addr++;   // command 스킵
    
    let disol = responseData.data[addr];   addr++;
    addr++;   // command 스킵

    bandAlarmMute = responseData.data[addr]===1 ? true:false;  addr++;
    if( bandAlarmMute ){ alarmValue = alarmValue&0x10; }
    addr++;   addr++;   // Input Low Th 스킵
    addr++;   addr++;   // Input High Th 스킵
    addr++;   addr++;   // Output Low Th 스킵
    addr++;   addr++;   // Output High Th 스킵
    addr++;   // command 스킵

    commonAlarmMute = responseData.data[addr]===1 ? true:false;   addr++;
    if( commonAlarmMute ){ alarmValue = alarmValue&0xEF; }    // 0xEF === 1110 1111 => SWR 알람 비트 off

    addr++;   // DTU Mute 스킵
    addr++;   // Temperature Th 스킵
    addr++;   // command 스킵

    let sleepStatus;
    if( responseData.band < 2 ){
      sleepStatus = (responseData.data[addr]<<24);   addr++;
      sleepStatus += (responseData.data[addr]<<16);   addr++;
      sleepStatus += (responseData.data[addr]<<8);   addr++;
      sleepStatus += responseData.data[addr];   addr++;
    }

    let alarmState = {
      shotdown: alarmValue&0x01 ? true:false,
      overOutput: (alarmValue>>1)&0x01 ? true:false,
      overInput: (alarmValue>>2)&0x01 ? true:false,
      temperature: (alarmValue>>3)&0x01 ? true:false,
      swr: (alarmValue>>4)&0x01 ? true:false,
      alc: (alarmValue>>5)&0x01 ? true:false,
      pll: (alarmValue>>6)&0x01 ? true:false,
      mute: false,
    }

    switch (responseData.band) {
      case 0:   // PS700 인 경우..
        firstNetGauge.value = (output/10).toFixed(1);
        PS700Gauge.value = (output/10).toFixed(1);
        alarmState.mute = ps700State.alarm.mute;
        bandState = {...ps700State, 
          active: active, 
          firstNetActive: active,
          firstNetInputPower: firstNetInput,
          inputPower: input,
          outputPower: output,
          AGCEnable: agc ? true:false,
          Atten: atten,
          alarm: alarmState,
          disol: disol
        };
        //console.log('/*-----------------------------------------PS700------------------------------------------------*/')
        channelData = [...ps700Channel.channelData]
        channelData.map((d,i) => { channelData[i] = {...d, sleepStatus: ((sleepStatus>>i)&0x01?true:false)}; })
        for (let i = 0; i < 32; i++) {  if( (sleepStatus>>i)&0x01 ){ numberOfSleep++; } }
        setps700NumbersOfSleep(numberOfSleep);
        setps700State(bandState);
        setps700Channel({...ps700Channel, channelData: channelData}); // 슬립 상태 적용을 위함.
        if( alarmState.swr ){ setcommonState({...commonState, alarm: {...commonState.alarm, serviceANT: true}}) }
        break;
      case 1:   // PS800 인 경우..
        PS800Gauge.value = (output/10).toFixed(1);
        alarmState.mute = ps800State.alarm.mute;
        bandState = {...ps800State, 
          active: active, 
          firstNetActive: active,
          inputPower: input,
          outputPower: output,
          AGCEnable: agc ? true:false,
          Atten: atten,
          alarm: alarmState,
          disol: disol
        };
        //console.log('/*-----------------------------------------PS800------------------------------------------------*/')
        channelData = [...ps800Channel.channelData]
        channelData.map((d,i) => { channelData[i] = {...d, sleepStatus: ((sleepStatus>>i)&0x01?true:false)}; })
        for (let i = 0; i < 32; i++) {  if( (sleepStatus>>i)&0x01 ){ numberOfSleep++; } }
        setps800NumbersOfSleep(numberOfSleep);
        console.log('ps800 =====>>> ', bandState);
        setps800State(bandState);
        setps800Channel({...ps800Channel, channelData: channelData});
        if( alarmState.swr ){ setcommonState({...commonState, alarm: {...commonState.alarm, serviceANT: true}}) }

        break;
      case 2:   // PSUL 인 경우..
        PSULGauge.value = (output/10).toFixed(1);
        alarmState.mute = psulState.alarm.mute;
        bandState = {...psulState, 
          active: active, 
          firstNetActive: active,
          inputPower: input,
          outputPower: output,
          AGCEnable: agc ? true:false,
          Atten: atten,
          alarm: alarmState,
          disol: disol
        };
        //console.log('/*-----------------------------------------PSul------------------------------------------------*/')
        setpsulState(bandState);
        // DonarAnt 알람 깜빡임 문제로 제거..
        // if( alarmState.swr ){ setcommonState({...commonState, alarm: {...commonState.alarm, donorANT: true}}) }
        break;
    
      default:
        break;
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <div>
        <UserNavber page="dashboard" />
      </div>
      <div style={{ width: "1030px", height: "820px", minWidth:'1030px' }}>
        <UserHeaderPage />
        <div className="w-full h-userMain font-sans font-bold text-stone-700">
          <div className="w-full h-1/10 flex justify-between text-center">
            {/* 공통 알람부 */}
            <div className="w-1/8 h-full">
              {" "}
              {/* System temperature */}
              <p className="w-full h-1/3">System Temp</p>
              <div
                id="alarmSystemTemp"
                className={"w-full h-1/2 border-2 border-gray-500 rounded-lg  " + (commonState.alarm.systemTemperature ? 'bg-red-200':'bg-green-200')}
              >
                <p className='w-fit h-fit m-auto mt-1'>{commonState.temperature}</p>
              </div>
            </div>
            <div className="w-1/8 h-full">
              <p className="w-full h-1/3">AC Fail</p>
              <div
                id="alarmACFail"
                className={"w-full h-1/2 border-2 border-gray-500 rounded-lg " + (commonState.alarm.ACFail ? 'bg-red-200':'bg-green-200')}
              ></div>
            </div>
            <div className="w-1/8 h-full">
              <p className="w-full h-1/3">DC Fail</p>
              <div
                id="alarmDCFail"
                className={"w-full h-1/2 border-2 border-gray-500 rounded-lg " + (commonState.alarm.DCFail ? 'bg-red-200':'bg-green-200')}
              ></div>
            </div>
            <div className="w-1/8 h-full">
              <p className="w-full h-1/3">BATT Low</p>
              <div
                id="alarmBATTLow"
                className={"w-full h-1/2 border-2 border-gray-500 rounded-lg " + (commonState.alarm.BATTLow ? 'bg-red-200':'bg-green-200')}
              ></div>
            </div>
            <div className="w-1/8 h-full">
              <p className="w-full h-1/3">BATT CHG</p>
              <div
                id="alarmBATTCHG"
                className={"w-full h-1/2 border-2 border-gray-500 rounded-lg " + (commonState.alarm.BATTChg ? 'bg-red-200':'bg-green-200')}
              ></div>
            </div>
            <div className="w-1/8 h-full">
              <p className="w-full h-1/3">Service ANT</p>
              <div
                id="alarmServiceANT"
                className={"w-full h-1/2 border-2 border-gray-500 rounded-lg " + (ps700State.alarm.swr|ps800State.alarm.swr ? 'bg-red-200':'bg-green-200')}
              ></div>
            </div>
            <div className="w-1/8 h-full">
              <p className="w-full h-1/3">Donor ANT</p>
              <div
                id="alarmDonorANT"
                className={"w-full h-1/2 border-2 border-gray-500 rounded-lg " + (psulState.alarm.swr ? 'bg-red-200':'bg-green-200')}
              ></div>
            </div>
          </div>

          {/* Band 모니터링부 */}
          <div className="w-full h-45/100 flex justify-between text-sm text-center mb-3">
            <div className="w-3/10 h-full border-2 border-gray-500 rounded-lg">
              {" "}
              {/* FirstNet+PS700 */}
              <div className="w-full h-1/11 flex bg-indigo-500 text-white">
                <p className="w-1/3 h-fit border-r-2 border-white text-lg my-auto ml-auto mr-0">
                  FirstNet
                </p>
                <p className="w-1/3 h-fit text-lg my-auto mr-0">PS700</p>
              </div>
              <div className="w-full h-1/11 justify-between bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-1.5px">
                  Active
                </p>
                {/* <input
                  id="dashboard-FirstNet-Active"
                  className={"w-3/10 h-8/10 text-center mt-3px border-r-2 border-white " + (ps700State.firstNetActive ? 'bg-green-200':'bg-gray-200')}
                  type="text"
                  value={ps700State.firstNetActive ? 'ON':'OFF'}
                  readOnly
                /> */}
                <input
                  id="dashboard-PS700-Active"
                  className={"w-3/5 h-8/10 text-center mt-3px " + (ps700State.active ? 'bg-green-200':'bg-gray-200')}
                  type="text"
                  value={ps700State.active ? 'ON':'OFF'}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  RSSI(dBm)
                </p>
                {/* <input
                  id="dashboard-FirstNet-RSSI"
                  className={"w-3/10 h-8/10 text-center mt-3px border-r-2 border-indigo-100 " + (ps700State.alarm.alc ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps700State.firstNetInputPower/10}
                  readOnly
                /> */}
                <input
                  id="dashboard-PS700-RSSI"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps700State.alarm.alc ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps700State.inputPower/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  AGC
                </p>
                <input
                  id="dashboard-PS700-AGCEnable"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps700State.AGCEnable ? 'bg-green-200':'bg-gray-200')}
                  type="text"
                  value={ps700State.AGCEnable ? 'ON':'OFF'}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Atten(dB)
                </p>
                <input
                  id="dashboard-PS700-Atten"
                  className="w-3/5 h-8/10 text-center mt-3px mx-2.5"
                  type="text"
                  value={ps700State.Atten/10}
                  readOnly
                />
              </div>

              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Gain(dB)
                </p>
                <input
                  id="dashboard-PS700-Gain"
                  className="w-3/5 h-8/10 text-center mt-3px mx-2.5 bg-indigo-50"
                  type="text"
                  value={90.0 - ps700State.Atten/10}
                  readOnly
                />
              </div>

              <div className="w-full h-1/11 ">
                <p className="w-1/3 h-fit inline-block align-middle my-auto tracking-tighter text-xs">
                  Output PWR(dBm)
                </p>
                {/* <input
                  id="dashboard-FirstNet-OPTPWR"
                  className={"w-3/10 h-8/10 text-center mt-3px border-r-2 border-white " + (ps700State.alarm.overOutput ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps700State.outputPower/10}
                  readOnly
                /> */}
                <input
                  id="dashboard-PS700-OPTPWR"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps700State.alarm.overOutput ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps700State.outputPower/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Shutdown
                </p>
                <input
                  id="dashboard-PS700-Shotdown"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps700State.alarm.shotdown ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 ">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Alarms
                </p>
                <input
                  id="dashboard-PS700-Alarms"
                  className={"w-3/5 h-8/10 mt-3px mx-2.5 text-center " + (ps700State.alarm.pll ? 'bg-red-200':'bg-green-200')}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50 flex">
                <p className="w-1/3 h-fit my-auto">
                  Isolation
                </p>
                {/* <input
                  id="dashboard-FirnstNet-Isolation"
                  className="w-3/10 h-8/10 mt-3px text-center border-r-2 border-indigo-100"
                  type="text"
                  value={ps700State.disol}
                  readOnly
                /> */}
                <input
                  id="dashboard-PS700-Isolation"
                  className="w-3/5 h-8/10 mt-3px text-center bg-indigo-50"
                  type="text"
                  value={ps700State.disol}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 rounded-b-lg "></div>
            </div>

            <div className="w-3/10 h-full border-2 border-gray-500 rounded-lg">
              {" "}
              {/* PS800 */}
              <div className="w-full h-1/11 flex bg-indigo-500 text-white">
                <p className="w-2/3 h-fit text-lg text-center my-auto ml-auto mr-0">
                  PS800
                </p>
              </div>
              <div className="w-full h-1/11 justify-between bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-1.5px">
                  Active
                </p>
                <input
                  id="dashboard-PS800-Active"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps800State.active ? 'bg-green-200':'bg-gray-200')}
                  type="text"
                  value={ps800State.active ? 'ON':'OFF'}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  RSSI(dBm)
                </p>
                <input
                  id="dashboard-PS800-RSSI"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps800State.alarm.alc ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps800State.inputPower/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  AGC
                </p>
                <input
                  id="dashboard-PS800-AGCEnable"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps800State.AGCEnable ? 'bg-green-200':'bg-gray-200')}
                  type="text"
                  value={ps800State.AGCEnable ? 'ON':'OFF'}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Atten(dB)
                </p>
                <input
                  id="dashboard-PS800-Atten"
                  className="w-3/5 h-8/10 text-center mt-3px mx-2.5"
                  type="text"
                  value={ps800State.Atten/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Gain(dB)
                </p>  
                <input
                  id="dashboard-PS800-Gain"
                  className="w-3/5 h-8/10 text-center mt-3px mx-2.5 bg-indigo-50"
                  type="text"
                  value={90.0 - ps800State.Atten/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 ">
                <p className="w-1/3 h-fit inline-block align-middle my-auto tracking-tighter text-xs">
                  Output PWR(dBm)
                </p>
                <input
                  id="dashboard-PS800-OPTPWR"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps800State.alarm.overOutput ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps800State.outputPower/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Shutdown
                </p>
                <input
                  id="dashboard-PS800-Shotdown"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps800State.alarm.shotdown ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 ">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Alarms
                </p>
                <input
                  id="dashboard-PS800-Alarms"
                  className={"w-3/5 h-8/10 mt-3px mx-2.5 text-center " + (ps800State.alarm.pll ? 'bg-red-200':'bg-green-200')}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Isolation
                </p>
                <input
                  id="dashboard-PS800-Isolation"
                  className="w-3/5 h-8/10 mt-3px mx-2.5 text-center bg-indigo-50"
                  type="text"
                  value={ps800State.disol}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 rounded-b-lg "></div>
            </div>

            <div className="w-3/10 h-full border-2 border-gray-500 rounded-lg">
              {" "}
              {/* UL */}
              <div className="w-full h-1/11 flex bg-indigo-500 text-white">
                <p className="w-2/3 h-9/10 text-lg text-center mt-1.5px ml-auto mr-0">
                  UL
                </p>
              </div>
              <div className="w-full h-1/11 justify-between bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-1.5px">
                  Active
                </p>
                <input
                  id="dashboard-UL-Active"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (psulState.active ? 'bg-green-200':'bg-gray-200')}
                  type="text"
                  value={psulState.active ? 'ON':'OFF'}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  RSSI(dBm)
                </p>
                <input
                  id="dashboard-UL-RSSI"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (psulState.alarm.alc ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={psulState.inputPower/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  AGC
                </p>
                <input
                  id="dashboard-UL-AGCEnable"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (psulState.AGCEnable ? 'bg-green-200':'bg-gray-200')}
                  type="text"
                  value={psulState.AGCEnable ? 'ON':'OFF'}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Atten(dB)
                </p>
                <input
                  id="dashboard-UL-Atten"
                  className="w-3/5 h-8/10 text-center mt-3px mx-2.5"
                  type="text"
                  value={psulState.Atten/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Gain(dB)
                </p>
                <input
                  id="dashboard-UL-Gain"
                  className="w-3/5 h-8/10 text-center mt-3px mx-2.5 bg-indigo-50"
                  type="text"
                  value={90.0 - psulState.Atten/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 ">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5 tracking-tighter text-xs">
                  Output PWR(dBm)
                </p>
                <input
                  id="dashboard-UL-OPTPWR"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 bg-indigo-50 " + (psulState.alarm.overOutput ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={psulState.outputPower/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Shutdown
                </p>
                <input
                  id="dashboard-UL-Shotdown"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (psulState.alarm.shotdown ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 ">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Alarms
                </p>
                <input
                  id="dashboard-UL-Alarms"
                  className={"w-3/5 h-8/10 mt-3px mx-2.5 text-center " + (psulState.alarm.pll ? 'bg-red-200':'bg-green-200')}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Isolation
                </p>
                <input
                  id="dashboard-UL-Isolation"
                  className="w-3/5 h-8/10 mt-3px mx-2.5 text-center bg-indigo-50"
                  type="text"
                  value={psulState.disol}
                  readOnly
                />
              </div>
              <div className="w-full h-1/11 ">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Sleep Mode
                </p>
                <input
                  id="dashboard-UL-SleepMode"
                  className={"w-3/5 h-8/10 mt-3px mx-2.5 text-center " + ((ps700NumbersOfSleep+ps800NumbersOfSleep) ? 'bg-yellow-200':'bg-gray-200')}
                  type="text"
                  value={ps700NumbersOfSleep+ps800NumbersOfSleep}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* 색상 설명 */}
          <div className="w-full h-1/10 flex justify-between text-sm text-center bg-white border-2 border-gray-500 rounded-lg m-0">
            <table className="w-full h-full border-separate rounded-lg table-auto">
              <thead className="w-full h-1/2">
                <tr className="w-full h-full border-b-2 border-indigo-50 bg-indigo-50">
                  <th className="w-1/6 border-r-2 border-white">LED Status</th>
                  <th className="w-1/6 border-r-2 border-white bg-yellow-200">
                    Yellow
                  </th>
                  <th className="w-1/6 border-r-2 border-white bg-green-200">
                    Green
                  </th>
                  <th className="w-1/6 border-r-2 border-white bg-orange-200">
                    Orange
                  </th>
                  <th className="w-1/6 border-r-2 border-white bg-red-200">Red</th>
                  <th className="w-1/6 bg-gray-200">Gray</th>
                </tr>
              </thead>
              <tbody className="w-full h-1/2">
                <tr>
                  <td className="border-r-2 border-indigo-50">Colors</td>
                  <td className="border-r-2 border-indigo-50">
                    UL Sleep Active
                  </td>
                  <td className="border-r-2 border-indigo-50">Good</td>
                  <td className="border-r-2 border-indigo-50">Minor Alarm</td>
                  <td className="border-r-2 border-indigo-50">Severe Alarm</td>
                  <td className="">Mute</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 출력값 게이지 */}
          <div className="w-full h-1/3 flex justify-between text-sm text-center bg-white border-2 border-gray-500 rounded-lg mt-3">
            <div className="w-1/4 h-full text-black">
              {" "}
              {/* FirstNet */}
              <p className="text-stone-500 text-lg font-semibold font-sans">
                FirstNet
              </p>
              <canvas id="firstNetCanvas" className="ml-6"></canvas>
              <AiOutlinePoweroff
                id="firstNetRunLed"
                className="text-stone-400 font-semibold mx-auto"
                size={30}
              />
            </div>
            <div className="w-1/4 h-full text-black">
              {" "}
              {/* PS700 */}
              <p className="text-stone-500 text-lg font-semibold font-sans">
                PS700
              </p>
              <canvas id="PS700Canvas" className="ml-6"></canvas>
              <AiOutlinePoweroff
                id="PS700RunLed"
                className="text-stone-400 font-semibold mx-auto"
                size={30}
              />
            </div>

            <div className="w-1/4 h-full text-black">
              {" "}
              {/* PS800 */}
              <p className="text-stone-500 text-lg font-semibold font-sans">
                PS800
              </p>
              <canvas id="PS800Canvas" className="ml-6"></canvas>
              <AiOutlinePoweroff
                id="PS800RunLed"
                className="text-stone-400 font-semibold mx-auto"
                size={30}
              />
            </div>

            <div className="w-1/4 h-full text-black">
              {" "}
              {/* UL */}
              <p className="text-stone-500 text-lg font-semibold font-sans">
                UL
              </p>
              <canvas id="ULCanvas" className="ml-6"></canvas>
              <AiOutlinePoweroff
                id="PSULRunLed"
                className="text-stone-400 font-semibold mx-auto"
                size={30}
              />
            </div>
          </div>
          {/* <input value={test} onChange={TestInputChange}></input> */}
        </div>
      </div>
    </div>
  );
}

export default UserDashBoardPage