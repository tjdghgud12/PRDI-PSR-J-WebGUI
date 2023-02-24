import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminNavBarPage from '../AdminNavbarPage/AdminNavbarPage'
import { BsCpu } from "react-icons/bs";
import { PS700SetChange } from "../../../../_reducers/PS700SetSlice";
import { PS800SetChange } from "../../../../_reducers/PS800SetSlice";
import { PSULSetChange } from "../../../../_reducers/PSULSetSlice";
// import { ErrorMessage } from '../../../Renderer/Renderer'
// const { ipcRenderer } = window.require('electron');

import { randomNumberInRange, useInterval, convertDataSerialToObject } from '../../../lib/common'
import { CommonSetChange } from "../../../../_reducers/commonSlice";

function AdminMCUControlPage() {
  const dispatch = useDispatch();
  const commonState = useSelector((state) => state.commonSlice);
  const ps700State = useSelector((state) => state.PS700SetSlice);
  const ps800State = useSelector((state) => state.PS800SetSlice);
  const psulState = useSelector((state) => state.PSULSetSlice);
  const [ps700Offset, setps700Offset] = useState(ps700State.offset);
  const [ps800Offset, setps800Offset] = useState(ps800State.offset);
  const [psulOffset, setpsulOffset] = useState(psulState.offset);
  const [ps700AmpEnable, setps700AmpEnable] = useState(ps700State.active);
  const [ps800AmpEnable, setps800AmpEnable] = useState(ps800State.active);
  const [psulAmpEnable, setpsulAmpEnable] = useState(psulState.active);
  const [autoRefresh, setautoRefresh] = useState(true);
  const [refreshStac, setrefreshStac] = useState(true)
  // const [atten, setatten] = useState({ 
  //   ps700: [ 0.0, 0.0, 0.0, 0.0],
  //   ps800: [ 0.0, 0.0, 0.0, 0.0],
  //   psul: [ 0.0, 0.0, 0.0, 0.0],
  // });
  const [ps700Atten, setps700Atten] = useState([0.0, 0.0, 0.0, 0.0])
  const [ps800Atten, setps800Atten] = useState([0.0, 0.0, 0.0, 0.0])
  const [psulAtten, setpsulAtten] = useState([0.0, 0.0, 0.0, 0.0])
  const [ps700Temperature, setps700Temperature] = useState(0)
  const [ps800Temperature, setps800Temperature] = useState(0)
  const [psulTemperature, setpsulTemperature] = useState(0)
  const [repeaterType, setrepeaterType] = useState('')
  const [productNumber, setproductNumber] = useState('')
  const [serialNumber, setserialNumber] = useState('')
  const [admin, setadmin] = useState(window.sessionStorage.getItem('loginId')==='admin' ? true:false) // 이거 관리자 계정이라면 보여줘야하기에 해줘야댐
  

  const autoRefreshChange = (e) => {
    setautoRefresh(e.target.checked);
  }
  const AttenOffsetChange = (e) => {
    let data;
    if(e.target.value > 5){ e.target.value = 5 }
    else if( e.target.value < 0 ){ e.target.value = 0 }
    e.target.value = Number(e.target.value).toFixed(1);

    switch (e.target.id) {
      case 'ps700Atten1Offset':
        data = { ...ps700Offset, atten1: Number(e.target.value*10) }
        setps700Offset(data);
        dispatch(PS700SetChange({ name: 'offsetAtten1', value: Number(e.target.value*10) }));
        
        break;
      case 'ps700Atten2Offset':
        data = { ...ps700Offset, atten2: Number(e.target.value*10) }
        setps700Offset(data);
        dispatch(PS700SetChange({ name: 'offsetAtten2', value: Number(e.target.value*10) }));
        
        break;
      case 'ps700Atten3Offset':
        data = { ...ps700Offset, atten3: Number(e.target.value*10) }
        setps700Offset(data);
        dispatch(PS700SetChange({ name: 'offsetAtten3', value: Number(e.target.value*10) }));
        
        break;
      case 'ps700Atten4Offset':
        data = { ...ps700Offset, atten4: Number(e.target.value*10) }
        setps700Offset(data);
        dispatch(PS700SetChange({ name: 'offsetAtten4', value: Number(e.target.value*10) }));
        
        break;
      case 'ps800Atten1Offset':
        data = { ...ps800Offset, atten1: Number(e.target.value*10) }
        setps800Offset(data);
        dispatch(PS800SetChange({ name: 'offsetAtten1', value: Number(e.target.value*10) }));
        break;
      case 'ps800Atten2Offset':
        data = { ...ps800Offset, atten2: Number(e.target.value*10) }
        setps800Offset(data);
        dispatch(PS800SetChange({ name: 'offsetAtten2', value: Number(e.target.value*10) }));
        
        break;
      case 'ps800Atten3Offset':
        data = { ...ps800Offset, atten3: Number(e.target.value*10) }
        setps800Offset(data);
        dispatch(PS800SetChange({ name: 'offsetAtten3', value: Number(e.target.value*10) }));
        
        break;
      case 'ps800Atten4Offset':
        data = { ...ps800Offset, atten4: Number(e.target.value*10) }
        setps800Offset(data);
        dispatch(PS800SetChange({ name: 'offsetAtten4', value: Number(e.target.value*10) }));
        
        break;
      case 'psulAtten1Offset':
        data = { ...psulOffset, atten1: Number(e.target.value*10) }
        setpsulOffset(data);
        dispatch(PSULSetChange({ name: 'offsetAtten1', value: Number(e.target.value*10) }));
        
        break;
      case 'psulAtten2Offset':
        data = { ...psulOffset, atten2: Number(e.target.value*10) }
        setpsulOffset(data);
        dispatch(PSULSetChange({ name: 'offsetAtten2', value: Number(e.target.value*10) }));
        
        break;
      case 'psulAtten3Offset':
        data = { ...psulOffset, atten3: Number(e.target.value*10) }
        setpsulOffset(data);
        dispatch(PSULSetChange({ name: 'offsetAtten3', value: Number(e.target.value*10) }));
        
        break;
      case 'psulAtten4Offset':
        data = { ...psulOffset, atten4: Number(e.target.value*10) }
        setpsulOffset(data);
        dispatch(PSULSetChange({ name: 'offsetAtten4', value: Number(e.target.value*10) }));
        
        break;
    
      default:
        break;
    }
  }
  const AmpEnable = (e) => {
    switch (e.target.id) {
      case 'ps700AmpEnable':
        setps700AmpEnable(e.target.checked);
        //dispatch(PS700SetChange({ name: 'active', value: e.target.checked }))
        break;
      case 'ps800AmpEnable':
        setps800AmpEnable(e.target.checked);
        //dispatch(PS800SetChange({ name: 'active', value: e.target.checked }))
        break;
      case 'psulAmpEnable':
        setpsulAmpEnable(e.target.checked);
        //dispatch(PSULSetChange({ name: 'active', value: e.target.checked }))
        break;
    
      default:
        break;
    }
  }
  const InputOffsetChange = (e) => {
    if( e.target.value != '' ){
      console.log(e.target.value)
      if(e.target.value > 127){ e.target.value = 127 }
      else if( e.target.value < -128 ){ e.target.value = -128 }
      e.target.value = Number(e.target.value).toFixed(1);
      e.target.value = e.target.value*10;
    }
    
    let data;
    switch (e.target.id) {
      case 'ps700InputPowerOffset':
        data = { ...ps700Offset, inputPower: e.target.value }
        setps700Offset(data);
        //dispatch(PS700SetChange({ name: 'offsetInputPower', value: Number(e.target.value*10) }));

        break;
      case 'ps800InputPowerOffset':
        data = { ...ps800Offset, inputPower: e.target.value }
        setps800Offset(data);
        //dispatch(PS800SetChange({ name: 'offsetInputPower', value: Number(e.target.value*10) }));
        
        break;
      case 'psulInputPowerOffset':
        data = { ...psulOffset, inputPower: e.target.value }
        setpsulOffset(data);
        //dispatch(PSULSetChange({ name: 'offsetInputPower', value: Number(e.target.value*10) }));
        
        break;
    
      default:
        break;
    }
  }
  const OutputOffsetChange = (e) => {
    if( e.target.value != '' ){
      console.log(e.target.value)
      if(e.target.value > 127){ e.target.value = 127 }
      else if( e.target.value < -128 ){ e.target.value = -128 }
      e.target.value = Number(e.target.value).toFixed(1);
      e.target.value = e.target.value*10;
    }

    let data;
    switch (e.target.id) {
      case 'ps700OutputPowerOffset':
        data = { ...ps700Offset, outputPower: e.target.value }
        setps700Offset(data);
        //dispatch(PS700SetChange({ name: 'offsetOutputPower', value: Number(e.target.value*10) }));

        break;
      case 'ps800OutputPowerOffset':
        data = { ...ps800Offset, outputPower: e.target.value }
        setps800Offset(data);
        //dispatch(PS800SetChange({ name: 'offsetOutputPower', value: Number(e.target.value*10) }));
        
        break;
      case 'psulOutputPowerOffset':
        data = { ...psulOffset, outputPower: e.target.value }
        setpsulOffset(data);
        //dispatch(PSULSetChange({ name: 'offsetOutputPower', value: Number(e.target.value*10) }));
        
        break;
    
      default:
        break;
    }
  }
  const SetOffClick = () => {

    let data = { atten1: 0, atten2: 0, atten3: 0, atten4: 0, inputPower: 0, outputPower: 0 }
    setps700Offset(data)
    setps700AmpEnable(false);
    //dispatch(PS700SetChange({ name: 'active', value: false }));
    //dispatch(PS700SetChange({ name: 'offsetAtten1', value: data.atten1 }));
    //dispatch(PS700SetChange({ name: 'offsetAtten2', value: data.atten2 }));
    //dispatch(PS700SetChange({ name: 'offsetAtten3', value: data.atten3 }));
    //dispatch(PS700SetChange({ name: 'offsetAtten4', value: data.atten4 }));
    //dispatch(PS700SetChange({ name: 'offsetInputPower', value: data.inputPower }));
    //dispatch(PS700SetChange({ name: 'offsetOutputPower', value: data.outputPower }));

    setps800Offset(data);
    setps800AmpEnable(false);
    //dispatch(PS800SetChange({ name: 'active', value: false }));
    //dispatch(PS800SetChange({ name: 'offsetAtten1', value: data.atten1 }));
    //dispatch(PS800SetChange({ name: 'offsetAtten2', value: data.atten2 }));
    //dispatch(PS800SetChange({ name: 'offsetAtten3', value: data.atten3 }));
    //dispatch(PS800SetChange({ name: 'offsetAtten4', value: data.atten4 }));
    //dispatch(PS800SetChange({ name: 'offsetInputPower', value: data.inputPower }));
    //dispatch(PS800SetChange({ name: 'offsetOutputPower', value: data.outputPower }));

    setpsulOffset(data);
    setpsulAmpEnable(false);
    //dispatch(PSULSetChange({ name: 'active', value: false }));
    //dispatch(PSULSetChange({ name: 'offsetAtten1', value: data.atten1 }));
    //dispatch(PSULSetChange({ name: 'offsetAtten2', value: data.atten2 }));
    //dispatch(PSULSetChange({ name: 'offsetAtten3', value: data.atten3 }));
    //dispatch(PSULSetChange({ name: 'offsetAtten4', value: data.atten4 }));
    //dispatch(PSULSetChange({ name: 'offsetInputPower', value: data.inputPower }));
    //dispatch(PSULSetChange({ name: 'offsetOutputPower', value: data.outputPower }));
  }
  
  const processOfResponseData = (responseData) => {
    if(responseData.command === 0xA1) {   // 0xA1 is 161 : 정상처리 수신커맨드..
      switch (responseData.band) {
        case 0: // ps700
          dispatch(PS700SetChange({ name: "active", value: ps700AmpEnable }));
          dispatch(PS700SetChange({ name: "offsetAtten1", value: ps700Offset.atten1 }));
          dispatch(PS700SetChange({ name: "offsetAtten2", value: ps700Offset.atten2 }));
          dispatch(PS700SetChange({ name: "offsetAtten3", value: ps700Offset.atten3 }));
          dispatch(PS700SetChange({ name: "offsetAtten4", value: ps700Offset.atten4 }));
          dispatch(PS700SetChange({ name: "offsetInputPower", value: ps700Offset.inputPower }));
          dispatch(PS700SetChange({ name: "offsetOutputPower", value: ps700Offset.outputPower }));
          break;
        case 1: // ps800
          dispatch(PS800SetChange({ name: "active", value: ps800AmpEnable }));
          dispatch(PS800SetChange({ name: "offsetAtten1", value: ps800Offset.atten1 }));
          dispatch(PS800SetChange({ name: "offsetAtten2", value: ps800Offset.atten2 }));
          dispatch(PS800SetChange({ name: "offsetAtten3", value: ps800Offset.atten3 }));
          dispatch(PS800SetChange({ name: "offsetAtten4", value: ps800Offset.atten4 }));
          dispatch(PS800SetChange({ name: "offsetInputPower", value: ps800Offset.inputPower }));
          dispatch(PS800SetChange({ name: "offsetOutputPower", value: ps800Offset.outputPower }));
          break;
        case 2: // psUL
          dispatch(PSULSetChange({ name: "active", value: psulAmpEnable }));
          dispatch(PSULSetChange({ name: "offsetAtten1", value: psulOffset.atten1 }));
          dispatch(PSULSetChange({ name: "offsetAtten2", value: psulOffset.atten2 }));
          dispatch(PSULSetChange({ name: "offsetAtten3", value: psulOffset.atten3 }));
          dispatch(PSULSetChange({ name: "offsetAtten4", value: psulOffset.atten4 }));
          dispatch(PSULSetChange({ name: "offsetInputPower", value: psulOffset.inputPower }));
          dispatch(PSULSetChange({ name: "offsetOutputPower", value: psulOffset.outputPower }));
          break;
      
        default:
          break;
      }
    }
  }

  const postSerialCommunication = async(ipcData) => {
    try {
			// const datas = { ipcData: {
      //   command: 0xB0,
      //   numberOfCommand: 8,
      //   band: 0,            // 0:ps700, 1:ps800, 2:UL
      //   data: [0x30, 0x2A, 0x26, 0x1C, 0x1E, 0x20, 0x22, 0x32]
      // }}
      const datas = { ipcData: ipcData }
			const res = await fetch("/api/serialCommunication", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
        const result = await res.json()
				const responseData = result.result
        console.log("http okay ==> ", res.status, result, responseData)
				// 받아온 결과값들 가지고 처리하는 async/await 함수 넣어줄것..
        processOfResponseData(convertDataSerialToObject(responseData))
        //
        //
        
      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }

  const ConfirmClick = async(e) => {
    console.log("ConfirmClick clicked..!")
    const transData = [
      {title: 'ps700', band: 0, data: ps700Offset, enable: ps700AmpEnable?1:0},
      {title: 'ps800', band: 1, data: ps800Offset, enable: ps800AmpEnable?1:0},
      {title: 'psul', band: 2, data: psulOffset, enable: psulAmpEnable?1:0},
    ]
    let ipcData = { 
      command: 0xA0,
      numberOfCommand: 3,
      band: 0,
      data: []
    };
    // 반복하여 post 통신..
    for (let index = 0; index < transData.length; index++) {
      // const element = array[index];
      ipcData.band = transData[index].band
      ipcData.data = [] // 초기화
      let addr = 0

      ipcData.data[addr] = 0x4E;  addr++;
      ipcData.data[addr] = transData[index].enable;   addr++;

      ipcData.data[addr] = 0x07;    addr++;
      ipcData.data[addr] = transData[index].data.atten1;    addr++;
      ipcData.data[addr] = transData[index].data.atten2;    addr++;
      ipcData.data[addr] = transData[index].data.atten3;    addr++;
      ipcData.data[addr] = transData[index].data.atten4;    addr++;

      ipcData.data[addr] = 0x08;    addr++;
      ipcData.data[addr] = (transData[index].data.inputPower>>8)&0xFF;    addr++;
      ipcData.data[addr] = transData[index].data.inputPower&0xFF;    addr++;
      ipcData.data[addr] = (transData[index].data.outputPower>>8)&0xFF;    addr++;
      ipcData.data[addr] = transData[index].data.outputPower&0xFF;    addr++;

      console.log('trans : ',ipcData)

      await postSerialCommunication(ipcData)

      /*** Original 코드..-start ****
      ipcData.band = transData[transStac].band;
      ipcData.data = [];
      let addr = 0;
      
      ipcData.data[addr] = 0x4E;    addr++;
      if( transData[transStac].band==0 ){ ipcData.data[addr] = ps700AmpEnable?1:0; addr++; }
      else if( transData[transStac].band==1 ){ ipcData.data[addr] = ps800AmpEnable?1:0; addr++; }
      else if( transData[transStac].band==2 ){ ipcData.data[addr] = psulAmpEnable?1:0; addr++; }
      
      ipcData.data[addr] = 0x07;    addr++;
      ipcData.data[addr] = transData[transStac].data.atten1;    addr++;
      ipcData.data[addr] = transData[transStac].data.atten2;    addr++;
      ipcData.data[addr] = transData[transStac].data.atten3;    addr++;
      ipcData.data[addr] = transData[transStac].data.atten4;    addr++;

      ipcData.data[addr] = 0x08;    addr++;
      ipcData.data[addr] = (transData[transStac].data.inputPower>>8)&0xFF;    addr++;
      ipcData.data[addr] = transData[transStac].data.inputPower&0xFF;    addr++;
      ipcData.data[addr] = (transData[transStac].data.outputPower>>8)&0xFF;    addr++;
      ipcData.data[addr] = transData[transStac].data.outputPower&0xFF;    addr++;

      console.log('trans : ',ipcData)
      /*** Original 코드..-end ****/
    }

  }
  const ParsingRecallData = async(responseData) => {
    let att1, att2, att3, att4, attOffset1, attOffset2, attOffset3, attOffset4;
    let alarmTemp, active;
    let inputPower, firstNetInputPower, outputPower, inputOffset, outputOffset;
    let addr = 1;
    let temperature, mute = false;

    attOffset1 = responseData.data[addr];    addr++;
    attOffset2 = responseData.data[addr];    addr++;
    attOffset3 = responseData.data[addr];    addr++;
    attOffset4 = responseData.data[addr];    addr++;
    addr++; addr++;     // Command + ALC Enable 스킵
    att1 = responseData.data[addr] + responseData.data[addr+1];   addr++; addr++;
    att2 = responseData.data[addr] + responseData.data[addr+1];   addr++; addr++;
    addr++; addr++;     // Command + AGC Enable 스킵 
    att3 = responseData.data[addr] + responseData.data[addr+1];   addr++; addr++;
    att4 = responseData.data[addr] + responseData.data[addr+1];   addr++; addr++;
    addr++;   //Command 스킵  
    alarmTemp = ((responseData.data[addr]>>3)&0x01) ? true:false;   addr++;
    addr++;   //Command 스킵
    active = responseData.data[addr] ? true:false;    addr++;
    addr++;   //Command 스킵
    inputPower = (responseData.data[addr]<<8)+responseData.data[addr+1];  addr++; addr++;
    if((inputPower&0x8000) == 0x8000) { inputPower = ((~inputPower&0xFFFF)+1)*(-1); }
    firstNetInputPower = (responseData.data[addr]<<8)+responseData.data[addr+1];  addr++; addr++;
    if((firstNetInputPower&0x8000) == 0x8000) { firstNetInputPower = ((~firstNetInputPower&0xFFFF)+1)*(-1); }
    addr++;   //Command 스킵
    outputPower = (responseData.data[addr]<<8)+responseData.data[addr+1]; addr++; addr++;
    addr++;   //Command 스킵
    inputOffset = (responseData.data[addr]<<8)+responseData.data[addr+1];   addr++; addr++;
    if((inputOffset&0x8000) == 0x8000) { inputOffset = ((~inputOffset&0xFFFF)+1)*(-1); }
    outputOffset = (responseData.data[addr]<<8)+responseData.data[addr+1];  addr++; addr++;
    if((outputOffset&0x8000) == 0x8000) { outputOffset = ((~outputOffset&0xFFFF)+1)*(-1); }
    addr++;   //Command 스킵
    temperature = responseData.data[addr];    addr++;
    addr++;   //Command 스킵
    mute = responseData.data[addr]===0 ? false:true;
    if(mute) { alarmTemp = false; }



    switch (responseData.band) {
      case 0:
        setps700Offset({ 
          atten1: attOffset1, 
          atten2: attOffset2, 
          atten3: attOffset3, 
          atten4: attOffset4, 
          inputPower: inputOffset, 
          outputPower: outputOffset 
        })
        setps700AmpEnable(active);
        // setatten({...atten, ps700: [att1, att2, att3, att4]})
        setps700Atten([att1, att2, att3, att4])
        setps700Temperature(temperature);
        // dispatch(PS700SetChange({ name: 'inputPower', value: inputPower })) //input Power
        // dispatch(PS700SetChange({ name: 'outputPower', value: outputPower })) //output Power
        dispatch(PS700SetChange({ name: 'alarmTemperature', value: alarmTemp })) //Band Temp alarm
        console.log("ps700Atten ===> ", ps700Atten);
        console.log("att1, att2, att3, att4 ===> ", att1, att2, att3, att4)
        break;
      case 1:
        setps800Offset({ 
          atten1: attOffset1, 
          atten2: attOffset2, 
          atten3: attOffset3, 
          atten4: attOffset4, 
          inputPower: inputOffset, 
          outputPower: outputOffset 
        })
        setps800AmpEnable(active);
        // setatten({...atten, ps800: [att1, att2, att3, att4]})
        setps800Atten([att1, att2, att3, att4])
        setps800Temperature(temperature);
        // dispatch(PS800SetChange({ name: 'inputPower', value: inputPower })) //input Power
        // dispatch(PS800SetChange({ name: 'outputPower', value: outputPower })) //output Power
        dispatch(PS800SetChange({ name: 'alarmTemperature', value: alarmTemp })) //Band Temp alarm
        console.log("ps800Atten ===> ", ps800Atten);
        console.log("att1, att2, att3, att4 ===> ", att1, att2, att3, att4)
        break;
      case 2:
        setpsulOffset({ 
          atten1: attOffset1, 
          atten2: attOffset2, 
          atten3: attOffset3, 
          atten4: attOffset4, 
          inputPower: inputOffset, 
          outputPower: outputOffset 
        })
        setpsulAmpEnable(active);
        // setatten({...atten, psul: [att1, att2, att3, att4]})
        setpsulAtten([att1, att2, att3, att4])
        setpsulTemperature(temperature);
        // dispatch(PSULSetChange({ name: 'inputPower', value: inputPower })) //input Power
        // dispatch(PSULSetChange({ name: 'outputPower', value: outputPower })) //output Power
        dispatch(PSULSetChange({ name: 'alarmTemperature', value: alarmTemp })) //Band Temp alarm
        console.log("psulAtten ===> ", psulAtten);
        console.log("att1, att2, att3, att4 ===> ", att1, att2, att3, att4)
        break;
    
      default:
        break;
    }
  }
  const RecallClick = async(e) => {
    console.log("RecallClick clicked..!")
    try {
			const datas = { ipcData: {
        command: 0xB0,
        numberOfCommand: 10,
        band: 0,            // 0:ps700, 1:ps800, 2:UL
        data: [0x30, 0x2A, 0x26, 0x1C, 0x1E, 0x20, 0x22, 0x32, 0x46, 0x2E]
      }}
			const res = await fetch("/api/serialCommunication", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){   
        const result = await res.json()
				const responseData = result.result
        console.log("http okay #ps700 ==> ", res.status, result, responseData)
				// 받아온 결과값들 가지고 처리하기..
        await ParsingRecallData(convertDataSerialToObject(responseData))
        //
        //
        datas.ipcData.band = 1
        const res_ = await fetch("/api/serialCommunication", {
          method: "POST",
          headers: { "Content-Type": "application/json;charset=utf-8" },
          body: JSON.stringify( datas ),
        })
        if(res_.ok){
          const result_ = await res_.json()
          const responseData_ = result_.result
          console.log("http okay #ps800 ==> ", res_.status, result_, responseData_)
          await ParsingRecallData(convertDataSerialToObject(responseData_))
          //
          //
          datas.ipcData.band = 2
          const res__ = await fetch("/api/serialCommunication", {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify( datas ),
          })
          if(res__.ok){
            const result__ = await res__.json()
            const responseData__ = result__.result
            console.log("http okay #ul ==> ", res__.status, result__, responseData__)
            await ParsingRecallData(convertDataSerialToObject(responseData__))
            //
            //
          }else { console.log("http error ==> ", res__.status) }
        }else { console.log("http error ==> ", res_.status) }
      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }



  const ProductConfirmClick = async() => {
    console.log("Product ConfirmClick clicked..!")
    let ipcData = { 
      command: 0x51,
      numberOfCommand: 1,
      band: 3,
      data: []
    };
    //post 통신..
    let addr = 0
    Array.from(repeaterType.toString()).map((d,i) => { ipcData.data = [...ipcData, d.charCodeAt(0)] })
    ipcData.data = [...ipcData.data, 0x00];
    Array.from(repeaterType.toString()).map((d,i) => { ipcData.data = [...ipcData, d.charCodeAt(0)] })
    ipcData.data = [...ipcData.data, 0x00];
    Array.from(repeaterType.toString()).map((d,i) => { ipcData.data = [...ipcData, d.charCodeAt(0)] })
    ipcData.data = [...ipcData.data, 0x00];

    dispatch(CommonSetChange({ name : "productNumber", value: productNumber }));
    dispatch(CommonSetChange({ name : "serialNumber", value: serialNumber }));

    console.log('trans : ',ipcData)
    await postSerialCommunication(ipcData)
  }

  const ParsingProductRecallData = async(responseData) => {
    let string = '';

    for( let i = 0; i<responseData.data.length; i++){
      string += responseData.data[i] === 0x00 ? 0x00:String.fromCharCode(responseData.data[i]);
    }

    let productData = string.split(0x00);
    
    setrepeaterType(productData[0]);
    setproductNumber(productData[1]);
    setserialNumber(productData[2]);

    dispatch(CommonSetChange({ name : "productNumber", value: productData[1] }));
    dispatch(CommonSetChange({ name : "serialNumber", value: productData[2] }));
  }

  const ProductRecallClick = async() => {
    console.log("RecallClick clicked..!")
    try {
			const datas = { ipcData: {
        command: 0x52,
        numberOfCommand: 1,
        band: 3,
        data: []
      }}
			const res = await fetch("/api/serialCommunication", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
        const result = await res.json()
				const responseData = result.result
        console.log("http okay #ps700 ==> ", res.status, result, responseData)
				// 받아온 결과값들 가지고 처리하기..
        await ParsingProductRecallData(convertDataSerialToObject(responseData))

      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }





  // 화면 1차적으로 그린뒤, 실행되는 곳..
  useEffect(() => {
		RecallClick()   // 최초 1회 MCU Control 페이지 정보 가져오기..
	},[])

  /*******************************************************
	* useInterval 타이머 사용 ...
	*******************************************************/
	useInterval(() => {
		// Your custom logic here
    console.log("interval...")
		if(autoRefresh){
      RecallClick()
    }
	}, 1800);

  return (
    <div className="flex">
      <div> {/* NavBar */}
        <AdminNavBarPage />
      </div>
      <div style={{ width: "1030px", height: "100vh" }}>
        <div className="w-full h-1/10 flex font-sans font-bold">   {/* Header */}
          <BsCpu className='text-gray-700 my-auto mr-5' size={50} />
          <p className="w-fit h-fit text-gray-700 text-4xl my-auto">MCU Control</p>
        </div>

        <div className="w-full h-userMain">   {/* body */}
          <div className="w-full h-fit flex">
            <input className="w-fit h-fit my-auto mr-2 ml-auto" style={{zoom:'1.4'}} name="autoRefresh" type='checkbox' checked={autoRefresh} onChange={autoRefreshChange} />
            <p className="w-fit h-fit text-lg font-sans font-bold text-gray-600 my-auto mr-3">Auto Refresh</p>
          </div>

          <div className="w-full h-2/5"> 
            <table className='w-full h-full table-auto text-center' >
              <thead className='w-full h-fit  '>
                <tr className='w-full h-full text-xl text-white bg-indigo-500'>
                  <th className='w-1/4 h-auto font-bold py-1.5 border-r-2 border-white rounded-tl-lg' > {'F/W Ver : ' + commonState.MCUVer } </th>
                  <th className='w-1/4 h-auto font-bold py-1.5 border-r-2 border-white' >FirstNet + PS700</th>
                  <th className='w-1/4 h-auto font-bold py-1.5 border-r-2 border-white' >PS800</th>
                  <th className='w-1/4 h-auto font-bold py-1.5 border-r-2 border-white rounded-tr-lg' >PSUL</th>
                </tr>
              </thead>
              <tbody className="w-full h-fit">
                <tr className="w-full h-fit">
                  <td className="w-1/4 h-auto font-semibold text-lg"> Power Amp Temp Alarm </td>
                  <td className="w-1/4">
                    <div className="w-full h-auto flex">
                      <div  /* LED */
                        id="ps700TemperatureAlarmLED" 
                        className={ "w-6 h-6 rounded-full border border-gray-500 m-auto " + (ps700State.alarm.temperature ? 'bg-red-400':'bg-gray-300')}  />
                      <p className="w-fit h-fit text-center font-semibold my-auto mr-auto">{ps700Temperature}</p>
                    </div>
                  </td> 
                  <td className="w-1/4">
                    <div className="w-full h-auto flex">
                      <div  /* LED */ 
                        id="ps800TemperatureAlarmLED" 
                        className={ "w-6 h-6 rounded-full border border-gray-500 m-auto " + (ps800State.alarm.temperature ? 'bg-red-400':'bg-gray-300')}  />
                      <p className="w-fit h-fit text-center font-semibold my-auto mr-auto">{ps800Temperature}</p>
                    </div>
                  </td>
                  <td className="w-1/4">
                    <div className="w-full h-auto flex">
                      <div  /* LED */
                        id="psulTemperatureAlarmLED" 
                        className={ "w-6 h-6 rounded-full border border-gray-500 m-auto " + (psulState.alarm.temperature ? 'bg-red-400':'bg-gray-300')}  />
                      <p className="w-fit h-fit text-center font-semibold my-auto mr-auto">{psulTemperature}</p>
                    </div>
                  </td>
                </tr>

                <tr className="w-full h-fit bg-indigo-50">
                  <td className="w-1/4 h-fit font-semibold text-lg">
                    1st ATTN(dB)
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(ps700Atten[0]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="ps700Atten1Offset"
                        name="atten1Offset"
                        className="w-1/2 h-fit text-center bg-indigo-50 font-semibold my-auto" 
                        type='number' 
                        min={0} max={5} 
                        step={0.1}
                        readOnly={autoRefresh}
                        value={(ps700Offset.atten1/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(ps800Atten[0]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="ps800Atten1Offset"
                        name="atten1Offset"
                        className="w-1/2 h-fit text-center bg-indigo-50 font-semibold my-auto" 
                        type='number' 
                        min={0} max={5} 
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={(ps800Offset.atten1/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(psulAtten[0]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="psulAtten1Offset"
                        name="atten1Offset"
                        className="w-1/2 h-fit text-center bg-indigo-50 font-semibold my-auto" 
                        type='number' 
                        min={0} max={5} 
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={(psulOffset.atten1/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                </tr>

                <tr className="w-full h-fit">
                  <td className="w-1/4 h-fit font-semibold text-lg">
                    2nd ATTN(dB)
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(ps700Atten[1]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="ps700Atten2Offset"
                        name="atten2Offset"
                        className="w-1/2 h-fit text-center font-semibold my-auto" 
                        type='number' 
                        min={0} max={5}
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={(ps700Offset.atten2/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(ps800Atten[1]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="ps800Atten2Offset"
                        name="atten2Offset"
                        className="w-1/2 h-fit text-center font-semibold my-auto" 
                        type='number' 
                        min={0} max={5} 
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={(ps800Offset.atten2/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(psulAtten[1]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="psulAtten2Offset"
                        name="atten2Offset"
                        className="w-1/2 h-fit text-center font-semibold my-auto" 
                        type='number' 
                        min={0} max={5} 
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={(psulOffset.atten2/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                </tr>

                <tr className="w-full h-fit bg-indigo-50">
                  <td className="w-1/4 h-fit font-semibold text-lg">
                    3rd ATTN/offset(dB)
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(ps700Atten[2]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="ps700Atten3Offset"
                        name="atten3Offset"
                        className="w-1/2 h-fit text-center bg-indigo-50 font-semibold my-auto" 
                        type='number' 
                        min={0} max={5} 
                        step={0.1}
                        readOnly={autoRefresh}
                        value={(ps700Offset.atten3/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(ps800Atten[2]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="ps800Atten3Offset"
                        name="atten3Offset"
                        className="w-1/2 h-fit text-center bg-indigo-50 font-semibold my-auto" 
                        type='number' 
                        min={0} max={5} 
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={(ps800Offset.atten3/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(psulAtten[2]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="psulAtten3Offset"
                        name="atten3Offset"
                        className="w-1/2 h-fit text-center bg-indigo-50 font-semibold my-auto" 
                        type='number' 
                        min={0} max={5} 
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={(psulOffset.atten3/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                </tr>

                <tr className="w-full h-fit">
                  <td className="w-1/4 h-fit font-semibold text-lg">
                    4th ATTN/offset(dB)
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(ps700Atten[3]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="ps700Atten4Offset"
                        name="atten4Offset"
                        className="w-1/2 h-fit text-center font-semibold my-auto" 
                        type='number' 
                        min={0} max={5}
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={(ps700Offset.atten4/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(ps800Atten[3]/10).toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="ps800Atten4Offset"
                        name="atten4Offset"
                        className="w-1/2 h-fit text-center font-semibold my-auto" 
                        type='number' 
                        min={0} max={5} 
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={(ps800Offset.atten4/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                  <td className="w-1/4 h-fit">
                    <div className="w-full h-full flex">
                      <p className="w-full h-fit text-center font-semibold my-auto">{(psulAtten[3]/10). toFixed(1)}</p> {/* atten의 모니터링 값 */}
                      {/* <input 
                        id="psulAtten4Offset"
                        name="atten4Offset"
                        className="w-1/2 h-fit text-center font-semibold my-auto" 
                        type='number' 
                        min={0} max={5} 
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={(psulOffset.atten4/10).toString()||0}
                        onChange={AttenOffsetChange} /> */}
                    </div>
                  </td>
                </tr>
              {/* ------------------------ Amp On/Off ------------------------- */}
                <tr className="w-full h-fit bg-indigo-50">
                  <td className="w-1/4 h-fit font-semibold text-lg rounded-bl-lg">
                    <p className="w-full h-fit">Power Amp On/Off</p>
                  </td>
                  <td className="w-1/4 h-fit">
                    <label className="switch">
                      <input
                        id="ps700AmpEnable"
                        type="checkbox"
                        disabled={autoRefresh}
                        checked={ps700AmpEnable}
                        onChange={AmpEnable}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="w-1/4 h-fit">
                    <label className="switch">
                      <input
                        id="ps800AmpEnable"
                        type="checkbox"
                        disabled={autoRefresh}
                        checked={ps800AmpEnable}
                        onChange={AmpEnable}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="w-1/4 h-fit rounded-br-lg">
                    <label className="switch">
                      <input
                        id="psulAmpEnable"
                        type="checkbox"
                        disabled={autoRefresh}
                        checked={psulAmpEnable}
                        onChange={AmpEnable}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


          <div className="w-full h-1/4 pt-8">
            <table className='w-full h-2/3 table-auto text-center' >
              <thead className='w-full h-fit'>
                <tr className='w-full h-full text-xl text-white bg-indigo-500'>
                  <th className='w-1/3 h-auto font-bold py-1.5 border-r-2 border-white rounded-tl-lg' >FirstNet + PS700</th>
                  <th className='w-1/3 h-auto font-bold py-1.5 border-r-2 border-white' >PS800</th>
                  <th className='w-1/3 h-auto font-bold py-1.5 border-r-2 border-white rounded-tr-lg' >PSUL</th>
                </tr>
              </thead>
              <tbody className="w-full h-fit">
                <tr className="w-full h-3/10">
                  <td className="w-1/3 h-fit">
                    <div className="w-full h-fit flex">
                      <p className="w-1/2 h-fit font-semibold"> Input Power/Offset </p>
                      <p className="w-1/4 h-fit text-center font-semibold my-auto">{(ps700State.inputPower/10.0).toFixed(1)}</p>
                      <input 
                        id="ps700InputPowerOffset"
                        name="inputPowerOffset"
                        className="w-1/4 h-fit text-center font-semibold my-auto" 
                        type={'number'}
                        min={-127} max={128}
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={ps700Offset.inputPower===''?'':(ps700Offset.inputPower/10)}
                        onChange={InputOffsetChange} />
                    </div>
                  </td>

                  <td className="w-1/3 h-fit">
                    <div className="w-full h-fit flex">
                      <p className="w-1/2 h-fit font-semibold"> Input Power/Offset </p>
                      <p className="w-1/4 h-fit text-center font-semibold my-auto">{(ps800State.inputPower/10.0).toFixed(1)}</p> {/* Input의 모니터링 값 */}
                      <input 
                        id="ps800InputPowerOffset"
                        name="inputPowerOffset"
                        className="w-1/4 h-fit text-center font-semibold my-auto" 
                        type={'number'}
                        min={-127} max={128}
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={ps800Offset.inputPower===''?'':(ps800Offset.inputPower/10)}
                        onChange={InputOffsetChange} />
                    </div>
                  </td>

                  <td className="w-1/3 h-fit">
                    <div className="w-full h-fit flex">
                      <p className="w-1/2 h-fit font-semibold"> Input Power/Offset </p>
                      <p className="w-1/4 h-fit text-center font-semibold my-auto">{(psulState.inputPower/10.0).toFixed(1)}</p> {/* Input의 모니터링 값 */}
                      <input 
                        id="psulInputPowerOffset"
                        name="inputPowerOffset"
                        className="w-1/4 h-fit text-center font-semibold my-auto" 
                        type={'number'} 
                        min={-127} max={128}
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={psulOffset.inputPower===''?'':(psulOffset.inputPower/10)}
                        onChange={InputOffsetChange} />
                    </div>
                  </td>
                </tr>

                <tr className="w-full h-3/10 bg-indigo-50">
                  <td className="w-1/3 h-fit">
                    <div className="w-full h-fit flex">
                      <p className="w-1/2 h-fit font-semibold"> Output Power/Offset </p>
                      <p className="w-1/4 h-fit text-center font-semibold my-auto">{(ps700State.outputPower/10.0).toFixed(1)}</p>
                      <input 
                        id="ps700OutputPowerOffset"
                        name="outputPowerOffset"
                        className="w-1/4 h-fit text-center font-semibold my-auto bg-indigo-50" 
                        type={'number'} 
                        min={-127} max={128}
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={ps700Offset.outputPower===''?'':(ps700Offset.outputPower/10)}
                        onChange={OutputOffsetChange} />
                    </div>
                  </td>

                  <td className="w-1/3 h-fit">
                    <div className="w-full h-fit flex">
                      <p className="w-1/2 h-fit font-semibold"> Output Power/Offset </p>
                      <p className="w-1/4 h-fit text-center font-semibold my-auto">{(ps800State.outputPower/10.0).toFixed(1)}</p> {/* Output의 모니터링 값 */}
                      <input 
                        id="ps800OutputPowerOffset"
                        name="outputPowerOffset"
                        className="w-1/4 h-fit text-center font-semibold my-auto bg-indigo-50"
                        type={'number'} 
                        min={-127} max={128}
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={ps800Offset.outputPower===''?'':(ps800Offset.outputPower/10)}
                        onChange={OutputOffsetChange} />
                    </div>
                  </td>

                  <td className="w-1/3 h-fit">
                    <div className="w-full h-fit flex">
                      <p className="w-1/2 h-fit font-semibold"> Output Power/Offset </p>
                      <p className="w-1/4 h-fit text-center font-semibold my-auto">{(psulState.outputPower/10.0).toFixed(1)}</p> {/* Output의 모니터링 값 */}
                      <input 
                        id="psulOutputPowerOffset"
                        name="outputPowerOffset"
                        className="w-1/4 h-fit text-center font-semibold my-auto bg-indigo-50"
                        type={'number'} 
                        min={-127} max={128}
                        step={0.1} 
                        readOnly={autoRefresh}
                        value={psulOffset.outputPower===''?'':(psulOffset.outputPower/10)}
                        onChange={OutputOffsetChange} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='w-full h-1/10 flex mb-0'> {/* BUTTON */}
            <div className='w-1/2 h-full flex items-center ml-auto mr-0'>
              {/* <button className='w-3/10 h-1/2 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900 mr-3' disabled={autoRefresh} onClick={SetOffClick}>Set Off</button> */}
              <button className='w-3/10 h-1/2 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900 mr-3 ml-auto' disabled={autoRefresh} onClick={ConfirmClick}>Confirm</button>
              <button className='w-3/10 h-1/2 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900 mr-10' disabled={autoRefresh} onClick={RecallClick}>Recall</button>
            </div>
          </div>


          {/* Product Information */}
          <div className={"w-full h-1/5 " + (admin ? '':'hidden')}>
            <div className={"w-full h-1/2 flex"}>
              <div className="w-1/5 h-full">
                <p className="w-full h-fit my-anto text-lg font-medium text-slate-700">Repeater Type</p>
                <input className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-lg" 
                      name={'repeaterType'} 
                      type='text'
                      id={'repeaterType'}
                      value={repeaterType}
                      readOnly={autoRefresh}
                      onChange={(e) => { setrepeaterType(e.target.value) }} />
              </div>

              <div className="w-1/5 h-full">
                <p className="w-full h-fit my-anto text-lg font-medium text-slate-700">Product Number</p>
                <input className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-lg" 
                      name={'productNumber'} 
                      type='text'
                      id={'productNumber'}
                      value={productNumber}
                      readOnly={autoRefresh}
                      onChange={(e) => { setproductNumber(e.target.value) }} />
              </div>

              <div className="w-1/5 h-full">
                <p className="w-full h-fit my-anto text-lg font-medium text-slate-700">Serial Number</p>
                <input className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-lg" 
                      name={'serialNumber'}
                      type='text'
                      id={'serialNumber'}
                      value={serialNumber}
                      readOnly={autoRefresh}
                      onChange={(e) => { setserialNumber(e.target.value) }} />
              </div>
            </div>
            
            {/* BUTTON */}
            <div className='w-full h-1/2 flex mb-0'> 
              <div className='w-1/2 h-full flex items-center ml-auto mr-0'>
                <button className='w-3/10 h-1/2 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900 mr-3 ml-auto' disabled={autoRefresh} onClick={ProductConfirmClick}>Confirm</button>
                <button className='w-3/10 h-1/2 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900 mr-10' disabled={autoRefresh} onClick={ProductRecallClick}>Recall</button>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default AdminMCUControlPage