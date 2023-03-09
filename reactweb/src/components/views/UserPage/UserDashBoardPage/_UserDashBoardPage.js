import React, { useState, useEffect} from 'react'
import UserNavber from '../UserNavBar/UserNavbar'
import UserHeaderPage from '../UserHeaderPage/UserHeaderPage'
import { useDispatch, useSelector } from 'react-redux'
import { PS700SetChange } from '../../../../_reducers/PS700SetSlice'
import { PS800SetChange } from '../../../../_reducers/PS800SetSlice'
import { PSULSetChange } from '../../../../_reducers/PSULSetSlice'
import CreateGauge from './_UserGauge'
import { AiOutlinePoweroff } from "react-icons/ai";
// const { ipcRenderer } = window.require('electron');


function UserDashBoardPage() {
  //const [test, settest] = useState(0);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [ps700State, setps700State] = useState(state.PS700SetSlice);
  const [ps800State, setps800State] = useState(state.PS800SetSlice);
  const [psulState, setpsulState] = useState(state.PSULSetSlice);
  const [commonState, setcommonState] = useState(state.commonSlice);
  const [ps700Channel, setps700Channel] = useState(state.PS700Channel);
  const [ps800Channel, setps800Channel] = useState(state.PS800Channel);
  const [refreshStac, setrefreshStac] = useState(true);
  const [ps700NumbersOfSleep, setps700NumbersOfSleep] = useState(0);
  const [ps800NumbersOfSleep, setps800NumbersOfSleep] = useState(0);
  let firstNetGauge, PS700Gauge, PS800Gauge, PSULGauge;


  // pakt87 >>> useEffect 되살려야함..
  //
  //
  /********************************************************************************************* */
  useEffect(() => {
    setTimeout(() => { setrefreshStac(!refreshStac) },1000)
    const nowPage = document.getElementById("navbarButtonDashboard");
    nowPage.className = nowPage.className + " " + "bg-indigo-600 text-white";

    ////////////////////////////////////////////////// 게이지 그리기 ///////////////////////////////////////////////////
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


    ////////////////////////////////////////////////// 데이터 요청 ///////////////////////////////////////////////////
    let transStac = 0;
    const transData = [
      {
        title: 'ps700',
        band: 0,
      },
      {
        title: 'ps800',
        band: 1,
      },
      {
        title: 'psul',
        band: 2,
      },
      {
        title: 'common',
        band: 3,
      },
    ]
    let ipcData = {
      command: 0xB0,
      numberOfCommand: 6,
      band: 2,
      data: [0x1E, 0x20, 0x22, 0x26, 0x1C, 0x2C]
    };
    let waitStac = 0;

    
    // band : active, input, agc, atten, output, shotdown, Alarms, DISOL, sleepStatus
    // active(1E), input(20), output(22), att34(26), alarms(1C), DISOL(2C), sleepStatus(1A)
    // common : Alarms
    let transLoop = setInterval(() => {
      if(transData[transStac].title == 'common'){ 
        ipcData = {       // comman Alarm, System Temperature 값 요청
          command: 0xB0,
          numberOfCommand: 2,
          band: 3,
          data: [0x36, 0x44]
        };
      }else {   // 각 밴드 데이터 요청
        if(transData[transStac].title != 'psul'){   // 700, 800 일 경우에..
          ipcData.numberOfCommand = 7;
          ipcData.band = transData[transStac].band;
          ipcData.data[6] = 0x1A; 
        }
      }
      ipcData.band = transData[transStac].band;
      ipcRenderer.send('SerialTransmit', ipcData);
      waitStac = 0;
      const interval = setInterval(() => {
        let responseData = ipcRenderer.sendSync('SerialResponse');
        waitStac++;
        if( waitStac < 4 ){
          if( responseData.flag ){
            clearInterval(interval);

            // 여기서부터 실제 받아온데이터로 조작..
            if( responseData.band == 3 ){
              let addr = 1;   //command byte 스킵
              let alarm = responseData.data[addr];    addr++;
              addr++; // command byte 스킵
              let temperature = responseData.data[addr];    addr++;

              setcommonState({...commonState, 
                temperature: temperature, 
                alarm: {...commonState.alarm,
                  systemTemperature: alarm&0x01?true:false,
                  ACFail: (alarm>>1)&0x01?true:false,
                  DCFail: (alarm>>2)&0x01?true:false,
                  BATTLow: (alarm>>3)&0x01?true:false,
                  BATTChg: (alarm>>4)&0x01?true:false,
                }
              })
            }else{
              //console.log(responseData)
              let addr = 1;
              let bandState;
              let channelData, numberOfSleep = 0;

              let active = responseData.data[addr];   addr++;
              addr++;   // command 스킵
              
              let input = (responseData.data[addr]<<8) + responseData.data[addr+1];   addr++;   addr++;
              if((input&0x8000) == 0x8000) { input = ((~input&0xFFFF)+1)*(-1); }
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
                case 0:
                  firstNetGauge.value = (output/10).toFixed(1);
                  PS700Gauge.value = (output/10).toFixed(1);
                  alarmState.mute = ps700State.alarm.mute;
                  bandState = {...ps700State, 
                    active: active, 
                    firstNetActive: active,
                    inputPower: input,
                    outputPower: output,
                    AGCEnable: agc ? true:false,
                    Atten: atten,
                    alarm: alarmState,
                    disol: disol
                  };
                  channelData = [...ps700Channel.channelData]
                  channelData.map((d,i) => { channelData[i] = {...d, sleepStatus: ((sleepStatus>>i)&0x01?true:false)}; })
                  for (let i = 0; i < 32; i++) {  if( (sleepStatus>>i)&0x01 ){ numberOfSleep++; } }
                  setps700NumbersOfSleep(numberOfSleep);
                  setps700State(bandState);
                  setps700Channel({...ps700Channel, channelData: channelData});
                  if( alarmState.swr ){ setcommonState({...commonState, alarm: {...commonState.alarm, serviceANT: true}}) }

                  break;
                case 1:
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
                  channelData = [...ps800Channel.channelData]
                  channelData.map((d,i) => { channelData[i] = {...d, sleepStatus: ((sleepStatus>>i)&0x01?true:false)}; })
                  for (let i = 0; i < 32; i++) {  if( (sleepStatus>>i)&0x01 ){ numberOfSleep++; } }
                  setps800NumbersOfSleep(numberOfSleep);
                  setps800State(bandState);
                  setps800Channel({...ps800Channel, channelData: channelData});
                  if( alarmState.swr ){ setcommonState({...commonState, alarm: {...commonState.alarm, serviceANT: true}}) }

                  break;
                case 2:
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
                  setpsulState(bandState);
                  if( alarmState.swr ){ setcommonState({...commonState, alarm: {...commonState.alarm, donorANT: true}}) }
                  break;
              
                default:
                  break;
              }
            }
            }
        }else{ clearInterval(interval); }
      }, 20)
      transStac += 1;
      if( transStac > 3 ){ clearInterval(transLoop) }
    }, 100)
  }, [refreshStac])

  /********************************************************************************************* */

  /* const TestInputChange = (e) => {
    if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    settest(e.currentTarget.value);
    firstNetGauge.value = e.currentTarget.value;
    PS700Gauge.value = e.currentTarget.value;
    PS800Gauge.value = e.currentTarget.value;
    PSULGauge.value = e.currentTarget.value;
  } */

  return (
    <div style={{ display: "flex" }}>
      <div>
        <UserNavber page="dashboard" />
      </div>
      <div style={{ width: "1030px", height: "100vh" }}>
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
                className={"w-full h-1/2 border-2 border-gray-500 rounded-lg " + (commonState.alarm.donorANT ? 'bg-red-200':'bg-green-200')}
              ></div>
            </div>
          </div>

          {/* Band 모니터링부 */}
          <div className="w-full h-43/100 flex justify-between text-sm text-center mb-3">
            <div className="w-3/10 h-full border-2 border-gray-500 rounded-lg">
              {" "}
              {/* FirstNet+PS700 */}
              <div className="w-full h-1/10 flex bg-indigo-500 text-white">
                <p className="w-1/3 h-fit border-r-2 border-white text-lg my-auto ml-auto mr-0">
                  FirstNet
                </p>
                <p className="w-1/3 h-fit text-lg my-auto mr-0">PS700</p>
              </div>
              <div className="w-full h-1/10 justify-between bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-1.5px">
                  Active
                </p>
                <input
                  id="dashboard-FirstNet-Active"
                  className={"w-3/10 h-8/10 text-center mt-3px border-r-2 border-white " + (ps700State.firstNetActive ? 'bg-green-200':'bg-gray-200')}
                  type="text"
                  value={ps700State.firstNetActive ? 'ON':'OFF'}
                  readOnly
                />
                <input
                  id="dashboard-PS700-Active"
                  className={"w-3/10 h-8/10 text-center mt-3px border-r-2 border-white " + (ps700State.active ? 'bg-green-200':'bg-gray-200')}
                  type="text"
                  value={ps700State.active ? 'ON':'OFF'}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  RSSI(dBm)
                </p>
                <input
                  id="dashboard-FirstNet-RSSI"
                  className={"w-3/10 h-8/10 text-center mt-3px border-r-2 border-indigo-100 " + (ps700State.alarm.alc ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps700State.firstNetInputPower/10}
                  readOnly
                />
                <input
                  id="dashboard-PS700-RSSI"
                  className={"w-3/10 h-8/10 text-center mt-3px " + (ps700State.alarm.alc ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps700State.inputPower/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10 bg-indigo-50">
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
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Atten(dB)
                </p>
                <input
                  id="dashboard-PS700-Atten"
                  className="w-3/5 h-8/10 text-center mt-3px mx-2.5"
                  type="text"
                  value={ps700State.Atten}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5 tracking-tighter">
                  OPT PWR(dBm)
                </p>
                <input
                  id="dashboard-FirstNet-OPTPWR"
                  className={"w-3/10 h-8/10 text-center mt-3px border-r-2 border-white " + (ps700State.alarm.overOutput ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps700State.outputPower/10}
                  readOnly
                />
                <input
                  id="dashboard-PS700-OPTPWR"
                  className={"w-3/10 h-8/10 text-center mt-3px " + (ps700State.alarm.overOutput ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps700State.outputPower/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Shotdown
                </p>
                <input
                  id="dashboard-PS700-Shotdown"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps700State.alarm.shotdown ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  readOnly
                />
              </div>
              <div className="w-full h-1/10 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Alarms
                </p>
                <input
                  id="dashboard-PS700-Alarms"
                  className={"w-3/5 h-8/10 mt-3px mx-2.5 text-center " + (ps700State.alarm.pll ? 'bg-red-200':'bg-green-200')}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Isolation
                </p>
                <input
                  id="dashboard-FirnstNet-Isolation"
                  className="w-3/10 h-8/10 mt-3px text-center border-r-2 border-indigo-100"
                  type="text"
                  value={ps700State.disol}
                  readOnly
                />
                <input
                  id="dashboard-PS700-Isolation"
                  className="w-3/10 h-8/10 mt-3px text-center"
                  type="text"
                  value={ps700State.disol}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10 rounded-b-lg bg-indigo-50"></div>
            </div>

            <div className="w-3/10 h-full border-2 border-gray-500 rounded-lg">
              {" "}
              {/* PS800 */}
              <div className="w-full h-1/10 flex bg-indigo-500 text-white">
                <p className="w-2/3 h-fit text-lg text-center my-auto ml-auto mr-0">
                  PS800
                </p>
              </div>
              <div className="w-full h-1/10 justify-between bg-indigo-50">
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
              <div className="w-full h-1/10 bg-indigo-50">
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
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Atten(dB)
                </p>
                <input
                  id="dashboard-PS800-Atten"
                  className="w-3/5 h-8/10 text-center mt-3px mx-2.5"
                  type="text"
                  value={ps800State.Atten}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5 tracking-tighter">
                  OPT PWR(dBm)
                </p>
                <input
                  id="dashboard-PS800-OPTPWR"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 bg-indigo-50 " + (ps800State.alarm.overOutput ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={ps800State.outputPower/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Shotdown
                </p>
                <input
                  id="dashboard-PS800-Shotdown"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (ps800State.alarm.shotdown ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  readOnly
                />
              </div>
              <div className="w-full h-1/10 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Alarms
                </p>
                <input
                  id="dashboard-PS800-Alarms"
                  className={"w-3/5 h-8/10 mt-3px mx-2.5 text-center " + (ps800State.alarm.pll ? 'bg-red-200':'bg-green-200')}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Isolation
                </p>
                <input
                  id="dashboard-PS800-Isolation"
                  className="w-3/5 h-8/10 mt-3px mx-2.5 text-center"
                  type="text"
                  value={ps800State.disol}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10 rounded-b-lg bg-indigo-50"></div>
            </div>

            <div className="w-3/10 h-full border-2 border-gray-500 rounded-lg">
              {" "}
              {/* UL */}
              <div className="w-full h-1/10 flex bg-indigo-500 text-white">
                <p className="w-2/3 h-9/10 text-lg text-center mt-1.5px ml-auto mr-0">
                  UL
                </p>
              </div>
              <div className="w-full h-1/10 justify-between bg-indigo-50">
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
              <div className="w-full h-1/10">
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
              <div className="w-full h-1/10 bg-indigo-50">
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
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Atten(dB)
                </p>
                <input
                  id="dashboard-UL-Atten"
                  className="w-3/5 h-8/10 text-center mt-3px mx-2.5"
                  type="text"
                  value={psulState.Atten}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5 tracking-tighter">
                  OPT PWR(dBm)
                </p>
                <input
                  id="dashboard-UL-OPTPWR"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 bg-indigo-50 " + (psulState.alarm.overOutput ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  value={psulState.outputPower/10}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Shotdown
                </p>
                <input
                  id="dashboard-UL-Shotdown"
                  className={"w-3/5 h-8/10 text-center mt-3px mx-2.5 " + (psulState.alarm.shotdown ? 'bg-red-200':'bg-green-200')}
                  type="text"
                  readOnly
                />
              </div>
              <div className="w-full h-1/10 bg-indigo-50">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Alarms
                </p>
                <input
                  id="dashboard-UL-Alarms"
                  className={"w-3/5 h-8/10 mt-3px mx-2.5 text-center " + (psulState.alarm.pll ? 'bg-red-200':'bg-green-200')}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10">
                <p className="w-1/3 h-9/10 inline-block align-middle mt-0.5">
                  Isolation
                </p>
                <input
                  id="dashboard-UL-Isolation"
                  className="w-3/5 h-8/10 mt-3px mx-2.5 text-center"
                  type="text"
                  value={psulState.disol}
                  readOnly
                />
              </div>
              <div className="w-full h-1/10 rounded-b-lg bg-indigo-50">
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
            <table className="w-full h-full border-separate rounded-lg">
              <thead className="w-full h-1/2">
                <tr className="w-full h-full border-b-2 border-indigo-50 bg-indigo-50">
                  <th className="border-r-2 border-white">LEC Status</th>
                  <th className="border-r-2 border-white bg-yellow-200">
                    Yellow
                  </th>
                  <th className="border-r-2 border-white bg-green-200">
                    Green
                  </th>
                  <th className="border-r-2 border-white bg-orange-200">
                    Orange
                  </th>
                  <th className="border-r-2 border-white bg-red-200">Red</th>
                  <th className="bg-gray-200">Gray</th>
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







