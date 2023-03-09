import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminNavBarPage from '../AdminNavbarPage/AdminNavbarPage'
import { BsDownload } from "react-icons/bs";
import { randomNumberInRange, useInterval, convertDataSerialToObject } from '../../../lib/common'
import wait from 'waait'

function AdminDataExportDownloadPage() {
  const state = useSelector((state) => state);
  const [allSelect, setallSelect] = useState(false)
  const [importFile, setimportFetfile] = useState({ name: '', size: 0, data: [] })
  const [backUpdata, setbackUpdata] = useState([
    { title: 'bandSelect', data: {} },
    { title: 'Params', data: {} },
    { title: 'Alarms', data: {} },
    { title: 'Register', data: {} },
    /* { title: 'DTUStatus', data: {} }, */
    { title: 'MCUControl', data: {} },
    { title: 'attenTable', data: {ps700: [], ps800: [], psul: []} },
    { title: 'temperatureAttenTable', data: {} },
    { title: 'powerAmpPowerTable', data: {} },
  ])
  const [bandSelectBackUp, setbandSelectBackup] = useState({ title: 'bandSelect', data: {} });
  const [paramsBackUp, setparamsBackUp] = useState({ title: 'Params', data: {} });
  const [alarmsBackUp, setalarmsBackUp] = useState({ title: 'Alarms', data: {} });
  const [registerBackUp, setregisterBackUp] = useState({ title: 'Register', data: {} });
  const [mcuControlBackUp, setmcuControlBackUp] = useState({ title: 'MCUControl', data: {} });
  const [attenTableBackUp, setattenTableBackUp] = useState({ title: 'attenTable', data: {} });
  const [temperatureTableBackUp, settemperatureTableBackUp] = useState({ title: 'temperatureAttenTable', data: {} });
  const [outputPowerTableBackUp, setoutputPowerTableBackUp] = useState({ title: 'powerAmpPowerTable', data: {} });

  const [exportState, setexportState] = useState([
    { checked: false, name: 'Band Select', lastExportTime: '', exportStatus: false, downloadStatus: false },
    { checked: false, name: 'Params', lastExportTime: '', exportStatus: false, downloadStatus: false },
    { checked: false, name: 'Alarms', lastExportTime: '', exportStatus: false, downloadStatus: false },
    { checked: false, name: 'Register', lastExportTime: '', exportStatus: false, downloadStatus: false },
    /* { checked: false, name: 'DTU Status', lastExportTime: '', exportStatus: false, downloadStatus: false }, */
    { checked: false, name: 'MCU Control', lastExportTime: '', exportStatus: false, downloadStatus: false },
    { checked: false, name: 'Atten Table', lastExportTime: '', exportStatus: false, downloadStatus: false },
    { checked: false, name: 'Temperature Atten Table', lastExportTime: '', exportStatus: false, downloadStatus: false },
    { checked: false, name: 'Power Amp Power Table', lastExportTime: '', exportStatus: false, downloadStatus: false },
  ])

  const Download = (name, value, type) => {
    const blob = new Blob([value], {type: type});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url
    a.download = name
    a.click();
    a.remove()
  }

  const CheckChange = (e) => {
    let data = [...exportState];
    data[e.target.name].checked = e.target.checked;
    setexportState(data);
  }

  const AllSelectChange = (e) => {
    setallSelect(e.target.checked)
    let data = [...exportState];
    data.forEach((d,i) => { data[i].checked = e.target.checked; })
    setexportState(data);
  }

  const FileLoad = ( Extention, cb ) => {
    let input = document.createElement("input");

    input.type = "file";
    input.accept = ".txt";

    input.onchange = async function(event) {
      let reader = new FileReader();
      let name = await event.target.files[0].name
      let size = await event.target.files[0].size
      let fileExtension = name.substr(name.length-3, 3)
      
      if(fileExtension == 'txt') {
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
          let fileData = JSON.parse(reader.result);
          console.log(fileData);
          setimportFetfile({name: name, size: size, data: fileData.data});

          let draw = [];
          exportState.map((d,i) => { draw[i] = { ...d, lastExportTime: fileData.lastExportTime }})
          setexportState(draw);
        }
      }else {
        console.log(" 확장자 에러 ")
        //ErrorMessage("File Opne Error", "Please Check file Extention")
      }
    }
    input.click();
    input.remove();
  }

  const ExcuteBackUpClick = async() => {
    // 데이터 요청 프로토콜
    const transData = [
      {index: 0,title: 'Channel', band: 0, command:0x12, data: []},  // 700 Channel
      {index: 1,title: 'Channel', band: 1, command:0x12, data: []},  // 800 Channel
      {index: 2,title: 'Params', band: 0, command:0xB0, data: [0x24, 0x26, 0x28, 0x2A]},  // 700 Params
      {index: 3,title: 'Params', band: 1, command:0xB0, data: [0x24, 0x26, 0x28, 0x2A]},  // 800 Params
      {index: 4,title: 'Params', band: 2, command:0xB0, data: [0x24, 0x26, 0x28, 0x2A, 0x34]},  // ul Params
      {index: 5,title: 'Alarms', band: 0, command:0x2E, data: []},  // 700 alarms
      {index: 6,title: 'Alarms', band: 1, command:0x2E, data: []},  // 800 alarms
      {index: 7,title: 'Alarms', band: 2, command:0x2E, data: []},  // ul alarms
      {index: 8,title: 'Alarms', band: 3, command:0x38, data: []},  // common alarms
      {index: 9,title: 'Register', band: 3, command:0x3A, data: []},   // Register
      {index: 10,title: 'MCUControl', band: 0, command:0x32, data: []},  // 700 MCUControl
      {index: 11,title: 'MCUControl', band: 1, command:0x32, data: []},  // 800 MCUControl
      {index: 12,title: 'MCUControl', band: 2, command:0x32, data: []},  // ul MCUControl
      {index: 13,title: 'Atten Table', band: 0, command:0x4C, data: [0x00]},  // 700 Atten Table#1
      {index: 14,title: 'Atten Table', band: 1, command:0x4C, data: [0x00]},  // 800 Atten Table#1
      {index: 15,title: 'Atten Table', band: 2, command:0x4C, data: [0x00]},   // ul Atten Table#1
      {index: 16,title: 'Atten Table', band: 0, command:0x4C, data: [0x01]},  // 700 Atten Table#2
      {index: 17,title: 'Atten Table', band: 1, command:0x4C, data: [0x01]},  // 800 Atten Table#2
      {index: 18,title: 'Atten Table', band: 2, command:0x4C, data: [0x01]},   // ul Atten Table#2
      {index: 19,title: 'Atten Table', band: 0, command:0x4C, data: [0x02]},  // 700 Atten Table#3
      {index: 20,title: 'Atten Table', band: 1, command:0x4C, data: [0x02]},  // 800 Atten Table#3
      {index: 21,title: 'Atten Table', band: 2, command:0x4C, data: [0x02]},   // ul Atten Table#3
      {index: 22,title: 'Atten Table', band: 0, command:0x4C, data: [0x03]},  // 700 Atten Table#4
      {index: 23,title: 'Atten Table', band: 1, command:0x4C, data: [0x03]},  // 800 Atten Table#4
      {index: 24,title: 'Atten Table', band: 2, command:0x4C, data: [0x03]},   // ul Atten Table#4
      {index: 25,title: 'Temp Table', band: 0, command:0x4A, data: []},  // 700 Temp Table#4
      {index: 26,title: 'Temp Table', band: 1, command:0x4A, data: []},  // 800 Temp Table#4
      {index: 27,title: 'Temp Table', band: 2, command:0x4A, data: []},   // ul Temp Table#4
      {index: 28,title: 'Output Table', band: 0, command:0x48, data: []},  // 700 Output Table#4
      {index: 29,title: 'Output Table', band: 1, command:0x48, data: []},  // 800 Output Table#4
      {index: 30,title: 'Output Table', band: 2, command:0x48, data: []},   // ul Output Table#4
    ]
    let state = [...exportState]
    state[0].exportStatus = true;
    state[1].exportStatus = true;
    state[2].exportStatus = true;
    state[3].exportStatus = true;
    state[4].exportStatus = true;
    state[5].exportStatus = true;
    state[6].exportStatus = true;
    state[7].exportStatus = true;
    setexportState(state);
    let backUp = [...backUpdata]
    for (let i = 0; i < transData.length; i++) {
      console.log( transData[i].title +" Back up clicked..!")
      const ipcData = {
        command: transData[i].command,
        numberOfCommand: transData[i].data.length<2 ? 1:transData[i].data.length,
        band: transData[i].band,
        data: transData[i].data
      }
      let page;
      let returnData;

      await postSerialCommunication(ipcData, (res) => {
        switch (transData[i].title) {
          case 'Channel':
            returnData = ParsingChannel(res);
            page = 0;
            //await wait(2000);
            break;
  
          case 'Params':
            returnData = ParsingParams(res);
            page = 1;
            //await wait(2000);
            break;
  
          case 'Alarms':
            returnData = ParsingAlarms(res);
            page = 2;
            //await wait(2000);
            break;
  
          case 'Register':
            returnData = ParsingRegister(res);
            page = 3;
            //await wait(2000);
            break;
  
          case 'MCUControl':
            returnData = ParsingMCUControl(res);
            page = 4;
            //await wait(2000);
            break;
  
          case 'Atten Table':
            returnData = ParsingAttenTable(res);
            page = 5;
            //await wait(2000);
            break;
  
          case 'Temp Table':
            returnData = ParsingTemperatureTable(res);
            page = 6;
            //await wait(2000);
            break;
  
          case 'Output Table':
            returnData = ParsingOutputPowerTable(res);
            page = 7;
            //await wait(2000);
            break;
        
          default:
            console.log('#1111111111111111111111111111111')
            break;
        }
        // 1. atten page만 별도로 취급 진행.
        if( page === 5 ){   // atten table page
          let tableAddr = transData[i].data[0];
          //console.log('returnData ===>', returnData)
          if( ipcData.band === 0 ){
            backUp[page].data.ps700[tableAddr] = returnData;
          }else if( ipcData.band === 1 ){
            backUp[page].data.ps800[tableAddr] = returnData;
          }else if( ipcData.band === 2 ){
            backUp[page].data.psul[tableAddr] = returnData;
          }
          console.log(backUp[page]);
        }else{
          if( ipcData.band === 0 ){
            backUp[page].data.ps700 = returnData;
          }else if( ipcData.band === 1 ){
            backUp[page].data.ps800 = returnData;
          }else if( ipcData.band === 2 ){
            backUp[page].data.psul = returnData;
          }else if( ipcData.band === 3 ){
            backUp[page].data.common = returnData;
          }
        }
        //backUp = res;
      });
      await wait(100);
    }
    console.log(backUp);
    state[0].exportStatus = false;
    state[1].exportStatus = false;
    state[2].exportStatus = false;
    state[3].exportStatus = false;
    state[4].exportStatus = false;
    state[5].exportStatus = false;
    state[6].exportStatus = false;
    state[7].exportStatus = false;
    setexportState(state);
    setbackUpdata(backUp);
  }

  const postSerialCommunication = async(ipcData, cb) => {
    try {
      const datas = { ipcData: ipcData }
			const res = await fetch("/api/serialCommunication", {
        timeout: 1000,		// 1초 타임아웃 제한..
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
        const result = await res.json()
				const responseData_ = result.result
        console.log("http okay ==> ", res.status, result, responseData_)
				// 받아온 결과값들 가지고 처리하는 async/await 함수 넣어줄것..
        console.log('now Command!!!!!!!!!!!!!!!!!!!! ====> ' ,ipcData.command);
        const responseData = convertDataSerialToObject(responseData_);

        cb(responseData);
        return true
      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }

  const ParsingChannel = (responseData) => {
    console.log("ParsingChannel's responseData is ===> ", responseData)
    let addr = 0;
    let totalData;
    let bandClass, numberOfChannels;
    console.log("ParsingChannel's case 0x13 in...")
    //responseData.band==1 ? setbandSelect('ps800'):setbandSelect('ps700');  // Band 입력
    responseData.data[addr] ? bandClass = 'classB':bandClass = 'classA';    addr++;   //class 입력
    numberOfChannels = responseData.data[addr];    addr++;  // 채널 수 입력.
    let length = responseData.band ? responseData.data[1]:responseData.data[1]+1;
    totalData = Array.from( {length: length}, () => new Object({
      index: 0,
      DLinput: 0, 
      DLatten: 0,
      DLoutput: 0, 
      DLfreqInfo: 0,
      ULinput: 0, 
      ULatten: 0, 
      ULoutput: 0, 
      ULfreqInfo: 0, 
      BW : 0, 
      sleepStatus: false
    }));
    // 자료 입력 부분..        
    totalData.forEach((d,i) => {      //channel Setting 입력
      if( responseData.band ){ totalData[i].index = i; }
      else{ totalData[i].index = i ? i:'firstNet'; }
      totalData[i].DLatten = Number((responseData.data[addr]<<8)+responseData.data[addr+1]);
      addr++;  addr++;
      totalData[i].DLfreqInfo = Number((responseData.data[addr]<<24)+(responseData.data[addr+1]<<16)+(responseData.data[addr+2]<<8)+responseData.data[addr+3]);
      totalData[i].DLfreqInfo = totalData[i].DLfreqInfo/1000000;
      addr++;  addr++;  addr++;  addr++;
      totalData[i].BW = (responseData.data[addr]<<24)+(responseData.data[addr+1]<<16)+(responseData.data[addr+2]<<8)+responseData.data[addr+3];
      totalData[i].BW = totalData[i].BW/1000000;
      addr++;  addr++;  addr++;  addr++;
      totalData[i].ULatten = Number((responseData.data[addr]<<8)+responseData.data[addr+1]);
      addr++;  addr++;
      totalData[i].ULfreqInfo = Number((responseData.data[addr]<<24)+(responseData.data[addr+1]<<16)+(responseData.data[addr+2]<<8)+responseData.data[addr+3]);
      totalData[i].ULfreqInfo = totalData[i].ULfreqInfo/1000000;
      addr++;  addr++;  addr++;  addr++;
      addr++;  addr++;  addr++;  addr++;  //bw 한번 더 넘기기
    })
    let data = {
     class: bandClass,
     numberOfChannels: numberOfChannels,
     channel: totalData
    }

    return data
  }

  const ParsingParams = (responseData) => {    // AGC, ALC, In out Th, In out Offset
    console.log("ParsingMix's responseData is ===> ", responseData)
    //let backUp = [...backUpdata]

    /*-----------------------------------------------AGC-----------------------------------------------*/
    let addr = 1;   // 1번 command 스킵
    let parameterData = {};
    parameterData.AGCEnable = responseData.data[addr];    addr++;
    parameterData.AGCLevel = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
    addr++; // 2번 Commanmd 스킵
    addr++; // Enable이 한번 더 넘어오기 때문
    parameterData.Atten = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
    parameterData.Atten += (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
    
    /*-----------------------------------------------ALC-----------------------------------------------*/
    addr++; // 3번 Commanmd 스킵
    parameterData.ALCEnable = responseData.data[addr];    addr++;
    parameterData.ALCLevel = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
    addr++; // 4번 Commanmd 스킵
    addr++; // Enable이 한번 더 넘어오기 때문
    parameterData.ALCAtten = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;   //att1
    parameterData.ALCAtten += (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;    //att2

    /*-----------------------------------------------Sleep-----------------------------------------------*/
    if( responseData.band == 0x02 ){
      addr++; // 5번 Commanmd 스킵
      parameterData.sleepEnable = responseData.data[addr];    addr++;
      parameterData.sleepLevel = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
      if((parameterData.sleepLevel&0x8000) === 0x8000){ parameterData.sleepLevel = ((~parameterData.sleepLevel&0xFFFF)+1)*(-1); }
      parameterData.sleepTime = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
    }
    
    return parameterData
  }

  const ParsingAlarms = (responseData) => {
    console.log("ParsingAlarms's responseData is ===> ", responseData)
    let addr = 0;
    if( responseData.band === 3 ){
      let commonAlarmData = {};
      commonAlarmData.commonAlarmMute = responseData.data[0]===1 ? true:false;
      commonAlarmData.DTUAlarmMute = responseData.data[1]===1 ? true:false;
      commonAlarmData.temperatureTh = responseData.data[2];

      return commonAlarmData
    }else{
      let alarmsData = {};
      alarmsData.mute = responseData.data[addr]===1 ? true:false;   addr++;
      alarmsData.inputLowTh = (responseData.data[addr]<<8)+responseData.data[addr+1];    addr++; addr++;
      alarmsData.inputHighTh = (responseData.data[addr]<<8)+responseData.data[addr+1];    addr++; addr++;
      alarmsData.outputLowTh = (responseData.data[addr]<<8)+responseData.data[addr+1];    addr++; addr++;
      alarmsData.outputHighTh = (responseData.data[addr]<<8)+responseData.data[addr+1];    addr++; addr++;

      return alarmsData
    }
  }

  const ParsingRegister = (responseData) => {
    //let backUp = [...backUpdata]
    let registerData = {};
    console.log("Parsing Register's responseData is ===> ", responseData)
    
    let string = ''

    if( responseData.data[0]==0 ){ registerData.serviceProvider = 'VERIZON'; }
    else if( responseData.data[0]==1 ){ registerData.serviceProvider = 'AT&T'; }
    else if( responseData.data[0]==2 ){ registerData.serviceProvider = 'SPRINT'; }
    else if( responseData.data[0]==3 ){ registerData.serviceProvider = 'T-MOBILE'; }
    else if( responseData.data[0]==4 ){ registerData.serviceProvider = 'OTHER'; }

    for (let i = 1; i < responseData.data.length; i++) {
      string += responseData.data[i] === 0x00 ? 0x00:String.fromCharCode(responseData.data[i]);
    }
    let splitData = string.split(0x00);
    console.log(string)
    console.log(registerData)
    registerData.owner = {};
    registerData.owner.company = splitData[0];
    registerData.owner.contactName = splitData[1];
    registerData.owner.address1 = splitData[2];
    registerData.owner.address2 = splitData[3];
    registerData.owner.city = splitData[4];
    registerData.owner.state = splitData[5];
    registerData.owner.zip = splitData[6];
    registerData.owner.phone = splitData[7];
    registerData.owner.fax = splitData[8];
    registerData.owner.email = splitData[9];

    registerData.installBy = {};
    registerData.installBy.company = splitData[10];
    registerData.installBy.contactName = splitData[11];
    registerData.installBy.address1 = splitData[12];
    registerData.installBy.address2 = splitData[13];
    registerData.installBy.city = splitData[14];
    registerData.installBy.state = splitData[15];
    registerData.installBy.zip = splitData[16];
    registerData.installBy.phone = splitData[17];
    registerData.installBy.fax = splitData[18];
    registerData.installBy.email = splitData[19];

    return registerData
    //backUp[3].data = registerData;
    //setbackUpdata(backUp);
  }

  const ParsingMCUControl = (responseData) => {
    console.log("Parsing MCUControl's responseData is ===> ", responseData)
    let addr = 0;
    let mcuControlData = {};

    mcuControlData.inputPowerOffset = (responseData.data[addr]<<8)+responseData.data[addr+1];    addr++; addr++;
    mcuControlData.outputPowerOffset = (responseData.data[addr]<<8)+responseData.data[addr+1];    addr++; addr++;
    addr++; // Command 스킵
    mcuControlData.ampEnable = responseData.data[addr]===1 ? true:false;   addr++;

    return mcuControlData
  }

  const ParsingAttenTable = (responseData) => {
    let backUp = [...backUpdata]
    let AttenTableData = [];
    let addr = 0;
    let number = responseData.data[addr];   addr++;
    console.log("Parsing Atten Table's responseData is ===> ", responseData)

    for (let i = 0; i < 64; i++) {
      AttenTableData[i] = (responseData.data[addr]<<8);  addr++;
      AttenTableData[i] += responseData.data[addr];      addr++;
    }
    return AttenTableData

    // if(responseData.band===0){
    //   if(number===1){
    //     backUp[5].data.ps700.atten1 = AttenTableData;
    //   }else if(number===2){
    //     backUp[5].data.ps700.atten2 = AttenTableData;
    //   }else if(number===3){
    //     backUp[5].data.ps700.atten3 = AttenTableData;
    //   }else if(number===4){
    //     backUp[5].data.ps700.atten4 = AttenTableData;
    //   }
    // }else if(responseData.band===1){
    //   if(number===1){
    //     backUp[5].data.ps800.atten1 = AttenTableData;
    //   }else if(number===2){
    //     backUp[5].data.ps800.atten2 = AttenTableData;
    //   }else if(number===3){
    //     backUp[5].data.ps800.atten3 = AttenTableData;
    //   }else if(number===4){
    //     backUp[5].data.ps800.atten4 = AttenTableData;
    //   }
    // }else if(responseData.band===2){
    //   if(number===1){
    //     backUp[5].data.psul.atten1 = AttenTableData;
    //   }else if(number===2){
    //     backUp[5].data.psul.atten2 = AttenTableData;
    //   }else if(number===3){
    //     backUp[5].data.psul.atten3 = AttenTableData;
    //   }else if(number===4){
    //     backUp[5].data.psul.atten4 = AttenTableData;
    //   }
    // }
    
    // setbackUpdata(backUp);
  }

  const ParsingTemperatureTable = (responseData) => {
    let backUp = [...backUpdata]
    let tempTableData = [];
    let addr = 0;
    console.log("Parsing Temperature Table's responseData is ===> ", responseData)

    for (let i = 0; i < 28; i++) {
      tempTableData[i] = (responseData.data[addr]<<8);  addr++;
      tempTableData[i] += responseData.data[addr];      addr++;
    }

    return tempTableData

    // if(responseData.backUp===0){
    //   backUp[6].data.ps700 = tempTableData;
    // }else if(responseData.backUp===1){
    //   backUp[6].data.ps800 = tempTableData;
    // }else if(responseData.backUp===2){
    //   backUp[6].data.psul = tempTableData;
    // }
    
    // setbackUpdata(backUp);
  }

  const ParsingOutputPowerTable = (responseData) => {
    let backUp = [...backUpdata]
    let outputTableData = {};
    let data;
    let addr = 0;
    let max, min, step;

    max = (responseData.data[addr]<<8);  addr++;
    max += responseData.data[addr];  addr++;
    min = (responseData.data[addr]<<8);  addr++;
    min += responseData.data[addr];  addr++;
    step = responseData.data[addr];  addr++;

    max = max/10;
    min = min/10;
    step = step/10;

    let tableLength = max==0 ? 0:(max-min)/step+1;

    outputTableData = {max: max, min: min, step: step, table: Array.from({length:tableLength}, () => 0)};
    outputTableData.table.forEach((d,i) => { 
      outputTableData.table[i] = (responseData.data[addr]<<8);  addr++;
      outputTableData.table[i] += responseData.data[addr];  addr++;
    });

    return outputTableData

    // if(responseData.backUp===0){
    //   backUp[7].data.ps700 = outputTableData;
    // }else if(responseData.backUp===1){
    //   backUp[7].data.ps800 = outputTableData;
    // }else if(responseData.backUp===2){
    //   backUp[7].data.psul = outputTableData;
    // }
    
    // setbackUpdata(backUp);
  }

  const FileDownloadClick = () => {
    let downloadData = {};
    const nowDate = new Date();
    console.log(backUpdata);
    downloadData.lastExportTime = nowDate.toLocaleString('en-us');
    downloadData.data = backUpdata;
    Download( 'backUp'+nowDate.toLocaleString('en-us'), JSON.stringify(downloadData), 'text');
  }


  const importTransData = [
    {title: 'bandSelect', band: 0, command:0x01, numberOfCommand:1, data: []},  // 700 Channel
    {title: 'bandSelect', band: 1, command:0x01, numberOfCommand:1, data: []},  // 800 Channel

    {title: 'parameter', band: 0, command:0xA0, numberOfCommand:4, data: []},  // 700 parameter
    {title: 'parameter', band: 1, command:0xA0, numberOfCommand:4, data: []},  // 800 parameter
    {title: 'parameter', band: 2, command:0xA0, numberOfCommand:5, data: []},  // ul parameter

    {title: 'alarm', band: 0, command:0x06, numberOfCommand:1, data: []},  // 700 alarm
    {title: 'alarm', band: 1, command:0x06, numberOfCommand:1, data: []},  // 800 alarm
    {title: 'alarm', band: 2, command:0x06, numberOfCommand:1, data: []},  // ul alarm
    {title: 'alarm', band: 3, command:0x0D, numberOfCommand:1, data: []},  // common alarm

    {title: 'register', band: 3, command:0x0E, numberOfCommand:1, data: []},  // register

    {title: 'mcuControl', band: 0, command:0xA0, numberOfCommand:3, data: []},  // 700 mcuControl
    {title: 'mcuControl', band: 1, command:0xA0, numberOfCommand:3, data: []},  // 800 mcuControl
    {title: 'mcuControl', band: 2, command:0xA0, numberOfCommand:3, data: []},  // ul mcuControl

    {title: 'attenTable', band: 0, command:0x0A, numberOfCommand:1, data: [0x00]},  // 700 AttenTable#1
    {title: 'attenTable', band: 0, command:0x0A, numberOfCommand:1, data: [0x01]},  // 700 AttenTable#2
    {title: 'attenTable', band: 0, command:0x0A, numberOfCommand:1, data: [0x02]},  // 700 AttenTable#3
    {title: 'attenTable', band: 0, command:0x0A, numberOfCommand:1, data: [0x03]},  // 700 AttenTable#4
    {title: 'attenTable', band: 1, command:0x0A, numberOfCommand:1, data: [0x00]},  // 800 AttenTable#1
    {title: 'attenTable', band: 1, command:0x0A, numberOfCommand:1, data: [0x01]},  // 800 AttenTable#2
    {title: 'attenTable', band: 1, command:0x0A, numberOfCommand:1, data: [0x02]},  // 800 AttenTable#3
    {title: 'attenTable', band: 1, command:0x0A, numberOfCommand:1, data: [0x03]},  // 800 AttenTable#4
    {title: 'attenTable', band: 2, command:0x0A, numberOfCommand:1, data: [0x00]},  // UL AttenTable#1
    {title: 'attenTable', band: 2, command:0x0A, numberOfCommand:1, data: [0x01]},  // UL AttenTable#2
    {title: 'attenTable', band: 2, command:0x0A, numberOfCommand:1, data: [0x02]},  // UL AttenTable#3
    {title: 'attenTable', band: 2, command:0x0A, numberOfCommand:1, data: [0x03]},  // UL AttenTable#4

    {title: 'temperatureTable', band: 0, command:0x0B, numberOfCommand:1, data: []},  // 700 temperatureTable
    {title: 'temperatureTable', band: 1, command:0x0B, numberOfCommand:1, data: []},  // 800 temperatureTable
    {title: 'temperatureTable', band: 2, command:0x0B, numberOfCommand:1, data: []},  // ul temperatureTable

    {title: 'outputPowerTable', band: 0, command:0x09, numberOfCommand:1, data: []},  // 700 outputPowerTable
    {title: 'outputPowerTable', band: 1, command:0x09, numberOfCommand:1, data: []},  // 800 outputPowerTable
    {title: 'outputPowerTable', band: 2, command:0x09, numberOfCommand:1, data: []},  // ul outputPowerTable
  ]
  const ImportAllClick = async() => {
    //console.log(importFile);
    for (let i = 0; i < importTransData.length; i++) {
      await setMCUFunction(i);
    }
  }
  const ImportSelectedClick = async() => {
    for (let i = 0; i < importTransData.length; i++) {
      let checkedAddr;
      if(importTransData[i].title === 'bandSelect'){ checkedAddr = 0; }
      else if(importTransData[i].title === 'parameter'){ checkedAddr = 1; }
      else if(importTransData[i].title === 'alarm'){ checkedAddr = 2; }
      else if(importTransData[i].title === 'register'){ checkedAddr = 3; }
      else if(importTransData[i].title === 'mcuControl'){ checkedAddr = 4; }
      else if(importTransData[i].title === 'attenTable'){ checkedAddr = 5; }
      else if(importTransData[i].title === 'temperatureTable'){ checkedAddr = 6; }
      else if(importTransData[i].title === 'outputPowerTable'){ checkedAddr = 7; }

      if(exportState[checkedAddr].checked){
        await setMCUFunction(i);
      }
    }
  }

  const setMCUFunction = async(i) => {
    let ipcData = { 
      command: importTransData[i].command,
      numberOfCommand: importTransData[i].numberOfCommand,
      band: importTransData[i].band,
      data: importTransData[i].data
    }
    
    switch (importTransData[i].title) {
      case 'bandSelect':
        ipcData.data = SetSerialDataBandSelect(ipcData);

        break;
      case 'parameter':
        ipcData.data = SetSerialDataParameter(ipcData);
        break;

      case 'alarm':
        ipcData.data = SetSerialDataAlarm(ipcData);
        break;

      case 'register':
        ipcData.data = SetSerialDataRegister(ipcData);
        break;

      case 'mcuControl':
        ipcData.data = SetSerialDataMCUControl(ipcData);
        break;

      case 'attenTable':
        ipcData.data = SetSerialDataAttenTable(ipcData);
        break;

      case 'temperatureTable':
        ipcData.data = SetSerialDataTemperatureTable(ipcData);
        break;

      case 'outputPowerTable':
        ipcData.data = SetSerialDataOutputPowerTable(ipcData);
        break;
    
      default:
        break;
    }

    console.log(importTransData[i].title + ' Trans Data ==================================> ', ipcData)
    let result =  await postSerialCommunication(ipcData, (res)=> {
      console.log('postSerialCommunication 응답 ===>', res);
    }); // Serial 전송
    //console.log(result);
  }


  const SetSerialDataBandSelect = (data) => {
    let serialData = [];
    let addr = 0;
    let bandData;
    if(data.band === 0){
      bandData = importFile.data[0].data.ps700;
    }else{
      bandData = importFile.data[0].data.ps800;
    }
    
    serialData[addr] = bandData.class==='classA' ? 0x00:0x01;   addr++;
    serialData[addr] = bandData.numberOfChannels;             addr++;

    for (let i = 0; i < bandData.numberOfChannels; i++) {
      serialData[addr] = (bandData.channel[i].DLatten>>8)&0xFF;    addr++;
      serialData[addr] = bandData.channel[i].DLatten&0xFF;         addr++;

      serialData[addr] = (bandData.channel[i].DLfreqInfo>>24)&0xFF;   addr++;
      serialData[addr] = (bandData.channel[i].DLfreqInfo>>16)&0xFF;   addr++;
      serialData[addr] = (bandData.channel[i].DLfreqInfo>>8)&0xFF;    addr++;
      serialData[addr] = bandData.channel[i].DLfreqInfo&0xFF;         addr++;

      serialData[addr] = (bandData.channel[i].BW>>24)&0xFF;   addr++;
      serialData[addr] = (bandData.channel[i].BW>>16)&0xFF;   addr++;
      serialData[addr] = (bandData.channel[i].BW>>8)&0xFF;    addr++;
      serialData[addr] = bandData.channel[i].BW&0xFF;         addr++;

      serialData[addr] = (bandData.channel[i].ULatten>>8)&0xFF;    addr++;
      serialData[addr] = bandData.channel[i].ULatten&0xFF;         addr++;

      serialData[addr] = (bandData.channel[i].ULfreqInfo>>24)&0xFF;   addr++;
      serialData[addr] = (bandData.channel[i].ULfreqInfo>>16)&0xFF;   addr++;
      serialData[addr] = (bandData.channel[i].ULfreqInfo>>8)&0xFF;    addr++;
      serialData[addr] = bandData.channel[i].ULfreqInfo&0xFF;         addr++;

      serialData[addr] = (bandData.channel[i].BW>>24)&0xFF;   addr++;
      serialData[addr] = (bandData.channel[i].BW>>16)&0xFF;   addr++;
      serialData[addr] = (bandData.channel[i].BW>>8)&0xFF;    addr++;
      serialData[addr] = bandData.channel[i].BW&0xFF;         addr++;
    }

    return serialData
  }

  const SetSerialDataParameter = (data) => {
    let serialData = [];
    let addr = 0;
    let bandData;
    if(data.band === 0){
      bandData = importFile.data[1].data.ps700;
    }else if(data.band === 1){
      bandData = importFile.data[1].data.ps800;
    }else if(data.band === 2){
      bandData = importFile.data[1].data.psul;
    }

    let att1 = 0, att2 = 0, att3 = 0, att4 = 0;
    att1 = bandData.ALCAtten>300 ? 300:bandData.ALCAtten;
    att2 = bandData.ALCAtten-att1;
    att3 = bandData.Atten>300 ? 300:bandData.Atten;
    att4 = bandData.Atten-att3;

    serialData[addr] = 0x02;  addr++;
    serialData[addr] = bandData.ALCEnable;  addr++;
    serialData[addr] = (bandData.ALCLevel>>8)&0xFF;  addr++;
    serialData[addr] = bandData.ALCLevel&0xFF;       addr++;

    serialData[addr] = 0x03;  addr++;
    serialData[addr] = bandData.ALCEnable;  addr++;
    serialData[addr] = (att1>>8)&0xFF;  addr++;
    serialData[addr] = att1&0xFF;       addr++;
    serialData[addr] = (att2>>8)&0xFF;  addr++;
    serialData[addr] = att2&0xFF;       addr++;

    serialData[addr] = 0x04;  addr++;
    serialData[addr] = bandData.AGCEnable;  addr++;
    serialData[addr] = (bandData.AGCAtten>>8)&0xFF;  addr++;
    serialData[addr] = bandData.AGCAtten&0xFF;       addr++;

    serialData[addr] = 0x05;  addr++;
    serialData[addr] = bandData.AGCEnable;  addr++;
    serialData[addr] = (att3>>8)&0xFF;  addr++;
    serialData[addr] = att3&0xFF;       addr++;
    serialData[addr] = (att4>>8)&0xFF;  addr++;
    serialData[addr] = att4&0xFF;       addr++;

    if(data.band === 2){
      serialData[addr] = 0x0C;    addr++;
      serialData[addr] = bandData.sleepEnable?1:0;        addr++;
      serialData[addr] = (bandData.sleepLevel>>8)&0xFF;   addr++;
      serialData[addr] = bandData.sleepLevel&0xFF;        addr++;
      serialData[addr] = (bandData.sleepTime>>8)&0xFF;    addr++;
      serialData[addr] = bandData.sleepTime&0xFF;         addr++;
    }
    
    return serialData
  }

  const SetSerialDataAlarm = (data) => {
    let serialData = [];
    let addr = 0;
    let bandData;
    if(data.band === 0){
      bandData = importFile.data[2].data.ps700;
    }else if(data.band === 1){
      bandData = importFile.data[2].data.ps800;
    }else if(data.band === 2){
      bandData = importFile.data[2].data.psul;
    }else if(data.band === 3){
      bandData = importFile.data[2].data.common;
    }

    if( data.band === 3 ){
      serialData[addr] = bandData.commonAlarmMute;  addr++;
      serialData[addr] = bandData.DTUAlarmMute;  addr++;
      serialData[addr] = bandData.temperatureTh;  addr++;
    }else{
      serialData[addr] = bandData.mute;  addr++;
      serialData[addr] = (bandData.inputLowTh>>8)&0xFF;    addr++;
      serialData[addr] = bandData.inputLowTh&0xFF;         addr++;
      serialData[addr] = (bandData.inputHighTh>>8)&0xFF;    addr++;
      serialData[addr] = bandData.inputHighTh&0xFF;         addr++;
      serialData[addr] = (bandData.outputLowTh>>8)&0xFF;    addr++;
      serialData[addr] = bandData.outputLowTh&0xFF;         addr++;
      serialData[addr] = (bandData.outputHighTh>>8)&0xFF;    addr++;
      serialData[addr] = bandData.outputHighTh&0xFF;         addr++;
    }
  
    return serialData
  }

  const SetSerialDataRegister = (data) => {
    let serialData = [];
    let addr = 0;
    let bandData;
    bandData = importFile.data[3].data.common;
    const trasnData = [
      {title: 'owner', band: 3, data: bandData.owner},
      {title: 'installBy', band: 3, data: bandData.installBy},
    ]

    if( bandData.serviceProvider=='VERIZON' ){ serialData[addr] = 0; }
    else if( bandData.serviceProvider=='AT&T' ){ serialData[addr] = 1; }
    else if( bandData.serviceProvider=='SPRINT' ){ serialData[addr] = 2; }
    else if( bandData.serviceProvider=='T-MOBILE' ){ serialData[addr] = 3; }
    else if( bandData.serviceProvider=='OTHER' ){ serialData[addr] = 4; }
    addr++;

    trasnData.map((d,i) => {
      Array.from(d.data.company.toString()).map((d,i) => { serialData = [...serialData, d.charCodeAt(0)] })
      serialData = [...serialData, 0x00];
      Array.from(d.data.contactName.toString()).map((d,i) => { serialData = [...serialData, d.charCodeAt(0)] })
      serialData = [...serialData, 0x00];
      Array.from(d.data.address1.toString()).map((d,i) => { serialData = [...serialData, d.charCodeAt(0)] })
      serialData = [...serialData, 0x00];
      Array.from(d.data.address2.toString()).map((d,i) => { serialData = [...serialData, d.charCodeAt(0)] })
      serialData = [...serialData, 0x00];
      Array.from(d.data.city.toString()).map((d,i) => { serialData = [...serialData, d.charCodeAt(0)] })
      serialData = [...serialData, 0x00];
      Array.from(d.data.state.toString()).map((d,i) => { serialData = [...serialData, d.charCodeAt(0)] })
      serialData = [...serialData, 0x00];
      Array.from(d.data.zip.toString()).map((d,i) => { serialData = [...serialData, d.charCodeAt(0)] })
      serialData = [...serialData, 0x00];
      Array.from(d.data.phone.toString()).map((d,i) => { serialData = [...serialData, d.charCodeAt(0)] })
      serialData = [...serialData, 0x00];
      Array.from(d.data.fax.toString()).map((d,i) => { serialData = [...serialData, d.charCodeAt(0)] })
      serialData = [...serialData, 0x00];
      Array.from(d.data.email.toString()).map((d,i) => { serialData = [...serialData, d.charCodeAt(0)] })
      serialData = [...serialData, 0x00];
    })

    serialData.map((d,i) => { 
      //console.log(i, isNaN(d));
      if( isNaN(d) ){ serialData[i] = d.charCodeAt(0); }
    })

    return serialData
  }

  const SetSerialDataMCUControl = (data) => {
    let serialData = [];
    let addr = 0;
    let bandData;
    if(data.band === 0){
      bandData = importFile.data[4].data.ps700;
    }else if(data.band === 1){
      bandData = importFile.data[4].data.ps800;
    }else if(data.band === 2){
      bandData = importFile.data[4].data.psul;
    }

    serialData[addr] = 0x4E;    addr++;
    serialData[addr] = bandData.ampEnable;    addr++;

    serialData[addr] = 0x07;    addr++;
    serialData[addr] = 0x00;    addr++;     //att1 offset => 사용 X
    serialData[addr] = 0x00;    addr++;     //att2 offset => 사용 X
    serialData[addr] = 0x00;    addr++;     //att3 offset => 사용 X
    serialData[addr] = 0x00;    addr++;     //att4 offset => 사용 X

    serialData[addr] = 0x08;    addr++;
    serialData[addr] = (bandData.inputPowerOffset>>8)&0xFF;    addr++;
    serialData[addr] = bandData.inputPowerOffset&0xFF;         addr++;
    serialData[addr] = (bandData.outputPowerOffset>>8)&0xFF;    addr++;
    serialData[addr] = bandData.outputPowerOffset&0xFF;         addr++;

    return serialData
  }

  const SetSerialDataAttenTable = (data) => {
    let serialData = [];
    let addr = 1;
    let bandData;
    if(data.band === 0){
      bandData = importFile.data[5].data.ps700;
    }else if(data.band === 1){
      bandData = importFile.data[5].data.ps800;
    }else if(data.band === 2){
      bandData = importFile.data[5].data.psul;
    }

    bandData[data.data[0]].map((d,i) => {
      serialData[addr] = (d>>8)&0xFF;    addr++;
      serialData[addr] = d&0xFF;         addr++;
    })

    return serialData
  }

  const SetSerialDataTemperatureTable = (data) => {
    let serialData = [];
    let addr = 0;
    let bandData;

    if(data.band === 0){
      bandData = importFile.data[6].data.ps700;
    }else if(data.band === 1){
      bandData = importFile.data[6].data.ps800;
    }else if(data.band === 2){
      bandData = importFile.data[6].data.psul;
    }
    bandData.map((d,i) => {
      serialData[addr] = (d>>8)&0xFF;    addr++;
      serialData[addr] = d&0xFF;         addr++;
    })

    return serialData
  }

  const SetSerialDataOutputPowerTable = (data) => {
    let serialData = [];
    let addr = 0;
    let bandData;

    if(data.band === 0){
      bandData = importFile.data[7].data.ps700;
    }else if(data.band === 1){
      bandData = importFile.data[7].data.ps800;
    }else if(data.band === 2){
      bandData = importFile.data[7].data.psul;
    }

    serialData[addr] = (bandData.max>>8)&0xFF;    addr++;
    serialData[addr] = bandData.max&0xFF;         addr++;
    serialData[addr] = (bandData.min>>8)&0xFF;    addr++;
    serialData[addr] = bandData.min&0xFF;         addr++;
    serialData[addr] = bandData.step;      addr++;

    bandData.table.map((d,i) => {
      serialData[addr] = (d>>8)&0xFF;    addr++;
      serialData[addr] = d&0xFF;         addr++;
    })

    return serialData
  }


  
  const renderCards = exportState.map((d,i) => {
    let bgColor = i%2 ? 'bg-indigo-50':'bg-white'

    return <tr className={"w-full h-fit " + bgColor} key={i}>
      <td className="w-1/20 h-fit">
        <input name={i}
              className="w-fit h-fit m-auto" 
              id="selectBox" 
              type='checkbox' 
              checked={d.checked} 
              onChange={CheckChange}
        />
      </td>
      <td className="w-1/6 h-fit"> {d.name} </td>
      <td className="w-1/4 h-fit"> {d.lastExportTime} </td>
      <td className="w-1/6 h-fit"> 
        <div id={ d.name + "ExportStatusLED"}
            className={ "w-4 h-4 rounded-full border border-gray-500 m-auto " + (d.exportStatus ? 'bg-green-400':'bg-gray-400')}  
        />
      </td>
      <td className="w-1/6 h-fit">
        <div id={ d.name + "DownloadStatusLED"}
            className={ "w-4 h-4 rounded-full border border-gray-500 m-auto " + (d.downloadStatus ? 'bg-green-400':'bg-gray-400')}  
        />
      </td>
    </tr>
  })


  return (
    <div className="flex">
      <div> {/* NavBar */}
        <AdminNavBarPage />
      </div>
      <div style={{ width: "1030px", height: "100vh" }}>
        <div className="w-full h-1/10 flex font-sans font-bold">   {/* Header */}
          <BsDownload className='text-gray-700 my-auto mr-5' size={50} />
          <p className="w-fit h-fit text-gray-700 text-4xl my-auto">Data Export & Import</p>
        </div>
          
        <div className="w-full h-userMain">   {/* body */}
          <div className="w-full h-45/100 fonst-sans font-semibold"> {/* Table */}
            <table className="w-full h-fit table-auto text-center border-b-2 rounded-lg ">
              <thead className="w-full h-fit">
                <tr className='w-full h-full text-lg text-white bg-indigo-500'>
                  <th className="w-1/20 h-fit">  {/* All CheckBox */}
                    <input name='selectAll'
                           className="w-fit h-fit m-auto" 
                           id="selectAll" 
                           type='checkbox' 
                           checked={allSelect} 
                           onChange={AllSelectChange}
                    />
                  </th> 
                  <th className="w-1/6 h-fit" >Data Name</th>
                  <th className="w-1/4 h-fit" >Last Export Time</th>
                  <th className="w-1/6 h-fit" >Export Status</th>
                  <th className="w-1/6 h-fit" >Download Status</th>
                </tr>
              </thead>
              <tbody className="w-full h-fit">
                {renderCards}
              </tbody>
            </table>
            <div className="w-full h-1/7 flex border-t-2 border-b-2 text-gray-700">
              <p className="w-1/3 h-fit text-xl text-center my-auto ">Import file</p>
              <button className="w-32 h-7 text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mx-8"
                      onClick={FileLoad}
              >Choose File</button>
              <p className="w-fit h-fit text-xl text-center my-auto ">{importFile.name=='' ? 'No file Chosen':importFile.name}</p>
            </div>
          </div>

          <div className="w-full h-1/20 font-sans font-semibold"> {/* Button */}
            <div className="w-fit h-full flex ml-auto mr-0">
              <button className="w-36 h-8 text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mx-4"
                      onClick={ExcuteBackUpClick}
              >Execute Backup</button>
              <button className="w-36 h-8 text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mx-4"
                      onClick={FileDownloadClick}
              >File Download</button>
              <button className="w-36 h-8 text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mx-4"
                      onClick={ImportAllClick}
              >Import All</button>
              <button className="w-36 h-8 text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mx-4"
                      onClick={ImportSelectedClick}
              >Import Selected</button>
            </div>
          </div>

          <div className="w-full h-1/6 mt-5 font-sans font-semibold border-2 rounded-xl"> {/* Notice */}
            <p className="w-full h-fit text-5xl text-center font-bold text-gray-800 mt-1">NOTICE</p>
            <p className="w-full h-fit text-xl text-center font-bold mt-3 ">
              Export uses the value read from the set value in MCU.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDataExportDownloadPage