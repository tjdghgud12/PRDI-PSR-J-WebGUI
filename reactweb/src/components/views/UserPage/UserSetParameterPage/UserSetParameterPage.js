import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserNavber from "../UserNavBar/UserNavbar";
import UserHeaderPage from "../UserHeaderPage/UserHeaderPage";
import { PS700SetChange } from "../../../../_reducers/PS700SetSlice";
import { PS800SetChange } from "../../../../_reducers/PS800SetSlice";
import { PSULSetChange } from "../../../../_reducers/PSULSetSlice";
// import { ErrorMessage } from '../../../Renderer/Renderer'
// const { ipcRenderer } = window.require('electron');

import { randomNumberInRange, useInterval, convertDataSerialToObject, ControlLED } from '../../../lib/common'


function UserSetParameterPage() {
  const dispatch = useDispatch();
  const PS700state = useSelector((state) => state.PS700SetSlice);
  const PS800state = useSelector((state) => state.PS800SetSlice);
  const PSULstate = useSelector((state) => state.PSULSetSlice);
  const [ps700Parameter, setps700Parameter] = useState(PS700state);
  const [ps800Parameter, setps800Parameter] = useState(PS800state);
  const [psulParameter, setpsulParameter] = useState(PSULstate);

  // 화면 1차적으로 그린뒤, 한번만 실행되는 곳..
  useEffect(() => {
    const nowPage = document.getElementById("navbarButtonSetParameter");
    nowPage.className = nowPage.className + " " + "bg-indigo-600 text-white";
    RecallClick();
  },[]);

  const drawData = [
    {
      direction: "DL",
      title: "FirstNet + PS700",
      parameter: ps700Parameter,
    },
    {
      direction: "DL",
      title: "PS800",
      parameter: ps800Parameter,
    },
    {
      direction: "UL",
      title: "PSUL",
      parameter: psulParameter,
    },
  ];

  const ALCEnableChange = (e) => {
    let changeData;
    switch (e.target.name) {
      case "FirstNet + PS700":
        changeData = { ...ps700Parameter, ALCEnable: e.target.checked };
        setps700Parameter(changeData);
        //dispatch(PS700SetChange({ name: 'ALCEnable', value: e.target.checked }));
        break;
        
      case "PS800":
        changeData = { ...ps800Parameter, ALCEnable: e.target.checked };
        setps800Parameter(changeData);
        //dispatch(PS800SetChange({ name: 'ALCEnable', value: e.target.checked }));
        break;

      case "PSUL":
        changeData = { ...psulParameter, ALCEnable: e.target.checked };
        setpsulParameter(changeData);
        //dispatch(PSULSetChange({ name: "ALCEnable", value: e.target.checked }));
        break;

      default:
        break;
    }
  }

  
  const ALCLevelChange = (e) => {
    let changeData;
    if( e.target.value > 27 ){ e.target.value = 27; }
    else if( e.target.value < 0 ){ e.target.value = 0; }
    e.currentTarget.value = Number(e.currentTarget.value).toFixed(1);
    
    switch (e.target.name) {
      case "FirstNet + PS700":
        changeData = { ...ps700Parameter, ALCLevel: Number(e.target.value)*10 };
        setps700Parameter(changeData);
        //dispatch(PS700SetChange({ name: "ALCLevel", value: e.currentTarget.value*10 }));
        break;
        
      case "PS800":
        changeData = { ...ps800Parameter, ALCLevel: Number(e.target.value)*10 };
        setps800Parameter(changeData);
        //dispatch(PS800SetChange({ name: "ALCLevel", value: Number(e.currentTarget.value)*10 }));
        break;

      case "PSUL":
        changeData = { ...psulParameter, ALCLevel: Number(e.target.value)*10 };
        setpsulParameter(changeData);
        //dispatch(PSULSetChange({ name: "ALCLevel", value: Number(e.currentTarget.value)*10 }));
        break;

      default:
        break;
    }
  }

  const ALCAttenChange = (e) => {
    let changeData;
    if( e.currentTarget.value > 45){ e.currentTarget.value = 45; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.target.value = Number((e.target.value/0.5).toFixed(0)*0.5).toFixed(1);
    switch (e.target.name) {
      case "FirstNet + PS700":        
        changeData = { ...ps700Parameter, ALCAtten: Number(e.currentTarget.value)*10 };
        setps700Parameter(changeData);
        //dispatch(PS700SetChange({ name: "ALCAtten", value: Number(e.currentTarget.value)*10 }));
        break;
        
      case "PS800":
        changeData = { ...ps800Parameter, ALCAtten: Number(e.target.value)*10 };
        setps800Parameter(changeData);
        //dispatch(PS800SetChange({ name: "ALCAtten", value: Number(e.currentTarget.value)*10 }));
        break;

      case "PSUL":
        changeData = { ...psulParameter, ALCAtten: Number(e.target.value)*10 };
        setpsulParameter(changeData);
        //dispatch(PSULSetChange({ name: "ALCAtten", value: Number(e.currentTarget.value)*10 }));
        break;

      default:
        break;
    }
  };

  const AGCEnableChange = (e) => {
    let changeData;
    switch (e.target.name) {
      case "FirstNet + PS700":
        changeData = { ...ps700Parameter, AGCEnable: e.target.checked };
        setps700Parameter(changeData);
        //dispatch(PS700SetChange({ name: 'AGCEnable', value: e.target.checked }));
        break;
        
      case "PS800":
        changeData = { ...ps800Parameter, AGCEnable: e.target.checked };
        setps800Parameter(changeData);
        //dispatch(PS800SetChange({ name: 'AGCEnable', value: e.target.checked }));
        break;

      case "PSUL":
        changeData = { ...psulParameter, AGCEnable: e.target.checked };
        setpsulParameter(changeData);
        //dispatch(PSULSetChange({ name: "AGCEnable", value: e.target.checked }));
        break;

      default:
        break;
    }
  };

  const AGCLevelChange = (e) => {
    let changeData;
    if( e.currentTarget.value > 27){ e.currentTarget.value = 27; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.currentTarget.value = Number(e.currentTarget.value).toFixed(1);
    switch (e.target.name) {
      case "FirstNet + PS700":        
        changeData = { ...ps700Parameter, AGCLevel: Number(e.currentTarget.value)*10 };
        setps700Parameter(changeData);
        //dispatch(PS700SetChange({ name: "AGCLevel", value: Number(e.currentTarget.value)*10 }));
        break;
        
      case "PS800":
        changeData = { ...ps800Parameter, AGCLevel: Number(e.target.value)*10 };
        setps800Parameter(changeData);
        //dispatch(PS800SetChange({ name: "AGCLevel", value: Number(e.currentTarget.value)*10 }));
        break;

      case "PSUL":
        changeData = { ...psulParameter, AGCLevel: Number(e.target.value)*10 };
        setpsulParameter(changeData);
        //dispatch(PSULSetChange({ name: "AGCLevel", value: Number(e.currentTarget.value)*10 }));
        break;

      default:
        break;
    }
  };

  const AttenChange = (e) => {
    let changeData;
    if( e.currentTarget.value > 45){ e.currentTarget.value = 45; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.target.value = Number((e.target.value/0.5).toFixed(0)*0.5).toFixed(1);
    switch (e.target.name) {
      case "FirstNet + PS700":        
        changeData = { ...ps700Parameter, Atten: Number(e.currentTarget.value)*10 };
        setps700Parameter(changeData);
        //dispatch(PS700SetChange({ name: "Atten", value: Number(e.currentTarget.value)*10 }));
        //console.log(ps700Parameter);
        break;
        
      case "PS800":
        changeData = { ...ps800Parameter, Atten: Number(e.target.value) * 10 };
        setps800Parameter(changeData);
        //dispatch(PS800SetChange({ name: "Atten", value: Number(e.currentTarget.value)*10 }));
        break;

      case "PSUL":
        changeData = { ...psulParameter, Atten: Number(e.target.value) * 10 };
        setpsulParameter(changeData);
        //dispatch(PSULSetChange({ name: "Atten", value: Number(e.currentTarget.value)*10 }));
        break;

      default:
        break;
    }
  };

  const sleepEnableChange = (e) => {
    let changeData;
    changeData = { ...psulParameter, sleep: {...psulParameter.sleep, enable: e.target.checked} };
    setpsulParameter(changeData);
    //dispatch(PSULSetChange({ name: "sleepEnable", value: e.target.checked }));
  };

  const sleepLevelChange = (e) => {
    if( e.target.value != '' ){
      console.log(e.target.value)
      if(e.target.value > 0){ e.target.value = 0 }
      else if( e.target.value < -90 ){ e.target.value = -90 }
      e.target.value = Number(e.target.value).toFixed(1);
      e.target.value = e.target.value*10;
    }
    /* if( e.currentTarget.value > 27){ e.currentTarget.value = 27; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.currentTarget.value = Number(e.currentTarget.value).toFixed(1); */
    let changeData;
    changeData = { ...psulParameter, sleep: {...psulParameter.sleep, level: e.target.value} };
    setpsulParameter(changeData);
    //dispatch(PSULSetChange({ name: "sleepLevel", value: Number(e.target.value)*10 }));
  };

  const sleepTimeChange = (e) => {
    if( e.currentTarget.value > 10000){ e.currentTarget.value = 10000; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.currentTarget.value = Number(e.currentTarget.value).toFixed(1);
    let changeData;
    changeData = { ...psulParameter, sleep: {...psulParameter.sleep, time: Number(e.target.value)} };
    setpsulParameter(changeData);
    //dispatch(PSULSetChange({ name: "sleepTime", value: Number(e.target.value) }));
  };


  const ResetClick = () => {
    let changeDataPs700 = { ...ps700Parameter, 
      ALCEnable: false, 
      ALCAtten: 50,
      ALCLevel: 0,
      AGCEnable: false,
      Atten: 50,
      AGCLevel: 0
    };
    let changeDataPs800 = { ...ps800Parameter, 
      ALCEnable: false, 
      ALCAtten: 50,
      ALCLevel: 0,
      AGCEnable: false,
      Atten: 50,
      AGCLevel: 0
    };
    let changeDataPsul = { ...psulParameter, 
      ALCEnable: false, 
      ALCAtten: 50,
      ALCLevel: 0,
      AGCEnable: false,
      Atten: 50,
      AGCLevel: 0,
      sleep: {enable: false, level: 0, time: 0}
    };
    
    setps700Parameter(changeDataPs700);
    //dispatch(PS700SetChange({ name: "ALCEnable", value: changeDataPs700.ALCEnable }));
    //dispatch(PS700SetChange({ name: "ALCLevel", value: changeDataPs700.ALCLevel }));
    //dispatch(PS700SetChange({ name: "AGCEnable", value: changeDataPs700.AGCEnable }));
    //dispatch(PS700SetChange({ name: "AGCLevel", value: changeDataPs700.AGCLevel }));
    //dispatch(PS700SetChange({ name: "ALCAtten", value: changeDataPs700.ALCAtten }));
    //dispatch(PS700SetChange({ name: "Atten", value: changeDataPs700.Atten }));

    setps800Parameter(changeDataPs800);
    //dispatch(PS800SetChange({ name: "ALCEnable", value: changeDataPs800.ALCEnable }));
    //dispatch(PS800SetChange({ name: "ALCLevel", value: changeDataPs800.ALCLevel }));
    //dispatch(PS800SetChange({ name: "AGCEnable", value: changeDataPs800.AGCEnable }));
    //dispatch(PS800SetChange({ name: "AGCLevel", value: changeDataPs800.AGCLevel }));
    //dispatch(PS800SetChange({ name: "ALCAtten", value: changeDataPs800.ALCAtten }));
    //dispatch(PS800SetChange({ name: "Atten", value: changeDataPs800.Atten }));

    setpsulParameter(changeDataPsul);
    //dispatch(PSULSetChange({ name: "ALCEnable", value: changeDataPsul.ALCEnable }));
    //dispatch(PSULSetChange({ name: "ALCLevel", value: changeDataPsul.ALCLevel }));
    //dispatch(PSULSetChange({ name: "AGCEnable", value: changeDataPsul.AGCEnable }));
    //dispatch(PSULSetChange({ name: "AGCLevel", value: changeDataPsul.AGCLevel }));
    //dispatch(PSULSetChange({ name: "ALCAtten", value: changeDataPsul.ALCAtten }));
    //dispatch(PSULSetChange({ name: "Atten", value: changeDataPsul.Atten }));

    //dispatch(PSULSetChange({ name: "sleepEnable", value: changeDataPsul.sleep.enable }));
    //dispatch(PSULSetChange({ name: "sleepLevel", value: changeDataPsul.sleep.level }));
    //dispatch(PSULSetChange({ name: "sleepTime", value: changeDataPsul.sleep.time }));
  }

  const processOfResponseDataSet = (responseData) => {
    console.log("processOfResponseDataSet's responseData.command is ===> ", responseData.command)
    if(responseData.command === 0xA1) {   // 0xA1 is 161 : 정상처리 수신커맨드..
      console.log("processOfResponseDataSet's Command is Correct")
      switch (responseData.band) {
        case 0:   // PS700
          dispatch(PS700SetChange({ name: "ALCEnable", value: ps700Parameter.ALCEnable }));
          dispatch(PS700SetChange({ name: "ALCLevel", value: ps700Parameter.ALCLevel }));
          dispatch(PS700SetChange({ name: "AGCEnable", value: ps700Parameter.AGCEnable }));
          dispatch(PS700SetChange({ name: "AGCLevel", value: ps700Parameter.AGCLevel }));
          dispatch(PS700SetChange({ name: "ALCAtten", value: ps700Parameter.ALCAtten }));
          dispatch(PS700SetChange({ name: "Atten", value: ps700Parameter.Atten }));
          break;
        case 1:   // PS800
          dispatch(PS800SetChange({ name: "ALCEnable", value: ps800Parameter.ALCEnable }));
          dispatch(PS800SetChange({ name: "ALCLevel", value: ps800Parameter.ALCLevel }));
          dispatch(PS800SetChange({ name: "AGCEnable", value: ps800Parameter.AGCEnable }));
          dispatch(PS800SetChange({ name: "AGCLevel", value: ps800Parameter.AGCLevel }));
          dispatch(PS800SetChange({ name: "ALCAtten", value: ps800Parameter.ALCAtten }));
          dispatch(PS800SetChange({ name: "Atten", value: ps800Parameter.Atten }));
          break;
        case 2:   // PSUL
          dispatch(PSULSetChange({ name: "ALCEnable", value: psulParameter.ALCEnable }));
          dispatch(PSULSetChange({ name: "ALCLevel", value: psulParameter.ALCLevel }));
          dispatch(PSULSetChange({ name: "AGCEnable", value: psulParameter.AGCEnable }));
          dispatch(PSULSetChange({ name: "AGCLevel", value: psulParameter.AGCLevel }));
          dispatch(PSULSetChange({ name: "ALCAtten", value: psulParameter.ALCAtten }));
          dispatch(PSULSetChange({ name: "Atten", value: psulParameter.Atten }));
          break;
      
        default:
          break;
      }
    }
  }
  const ConfirmClick = async() => {
    // let transStac = 0;
    const transData = [
      {title: 'ps700', band: 0, data: ps700Parameter},
      {title: 'ps800', band: 1, data: ps800Parameter},
      {title: 'psul', band: 2, data: psulParameter},
    ]
    for (let index = 0; index < transData.length; index++) {
      const ipcData = { 
        command: 0xA0,
        numberOfCommand: 4,
        band: 0,
        data: []
      };
      // 밴드값 변경
      ipcData.band = transData[index].band;   
      // 넣어줄 값 설정
      let att1 = 0, att2 = 0, att3 = 0, att4 = 0;
      att1 = transData[index].data.ALCAtten>300 ? 300:transData[index].data.ALCAtten;
      att2 = transData[index].data.ALCAtten-att1;
      att3 = transData[index].data.Atten>300 ? 300:transData[index].data.Atten;
      att4 = transData[index].data.Atten-att3;
      // 값들 주소에 맞게 넣어주기
      let addr = 0;
      ipcData.data[addr] = 0x02;    addr++;
      ipcData.data[addr] = transData[index].data.ALCEnable?1:0;    addr++;
      ipcData.data[addr] = (transData[index].data.ALCLevel>>8)&0xFF;    addr++;
      ipcData.data[addr] = transData[index].data.ALCLevel&0xFF;    addr++;
      ipcData.data[addr] = 0x03;    addr++;
      ipcData.data[addr] = transData[index].data.ALCEnable?1:0;    addr++;
      ipcData.data[addr] = (att1>>8)&0xFF;    addr++;
      ipcData.data[addr] = att1&0xFF;    addr++;
      ipcData.data[addr] = (att2>>8)&0xFF;    addr++;
      ipcData.data[addr] = att2&0xFF;    addr++;
      // 
      ipcData.data[addr] = 0x04;    addr++;
      ipcData.data[addr] = transData[index].data.AGCEnable?1:0;    addr++;
      ipcData.data[addr] = (transData[index].data.AGCLevel>>8)&0xFF;    addr++;
      ipcData.data[addr] = transData[index].data.AGCLevel&0xFF;    addr++;
      ipcData.data[addr] = 0x05;    addr++;
      ipcData.data[addr] = transData[index].data.AGCEnable?1:0;    addr++;
      ipcData.data[addr] = (att3>>8)&0xFF;    addr++;
      ipcData.data[addr] = att3&0xFF;    addr++;
      ipcData.data[addr] = (att4>>8)&0xFF;    addr++;
      ipcData.data[addr] = att4&0xFF;    addr++;
      // psul 이라면..
      if( ipcData.band === 2 ){   
        ipcData.numberOfCommand = 5;
        ipcData.data[addr] = 0x0C;    addr++;
        ipcData.data[addr] = transData[index].data.sleep.enable?1:0;    addr++;
        ipcData.data[addr] = (transData[index].data.sleep.level>>8)&0xFF;    addr++;
        ipcData.data[addr] = transData[index].data.sleep.level&0xFF;    addr++;
        ipcData.data[addr] = (transData[index].data.sleep.time>>8)&0xFF;    addr++;
        ipcData.data[addr] = transData[index].data.sleep.time&0xFF;    addr++;
      }
      // ipcRenderer.send('SerialTransmit', ipcData);
      // pakt87
      const postSuccessed = await postSerialCommunication(ipcData, "set")
      if( ! postSuccessed) { break; } // 어떤 통신이 실패했다면 for 문 종료후 빠져나가기..
    }



    
    /***************************************** *
    let ipcData = { 
      command: 0xA0,
      numberOfCommand: 4,
      band: 0,
      data: []
    };
    let transLoop = setInterval(() => {
      let att1 = 0, att2 = 0, att3 = 0, att4 = 0;
      let addr = 0;
      att1 = transData[transStac].data.ALCAtten>300 ? 300:transData[transStac].data.ALCAtten;
      att2 = transData[transStac].data.ALCAtten-att1;
      att3 = transData[transStac].data.Atten>300 ? 300:transData[transStac].data.Atten;
      att4 = transData[transStac].data.Atten-att3;

      ipcData.band = transData[transStac].band;
      ipcData.data = [];

      ipcData.data[addr] = 0x02;    addr++;
      ipcData.data[addr] = transData[transStac].data.ALCEnable?1:0;    addr++;
      ipcData.data[addr] = (transData[transStac].data.ALCLevel>>8)&0xFF;    addr++;
      ipcData.data[addr] = transData[transStac].data.ALCLevel&0xFF;    addr++;
      ipcData.data[addr] = 0x03;    addr++;
      ipcData.data[addr] = transData[transStac].data.ALCEnable?1:0;    addr++;
      ipcData.data[addr] = (att1>>8)&0xFF;    addr++;
      ipcData.data[addr] = att1&0xFF;    addr++;
      ipcData.data[addr] = (att2>>8)&0xFF;    addr++;
      ipcData.data[addr] = att2&0xFF;    addr++;

      ipcData.data[addr] = 0x04;    addr++;
      ipcData.data[addr] = transData[transStac].data.AGCEnable?1:0;    addr++;
      ipcData.data[addr] = (transData[transStac].data.AGCLevel>>8)&0xFF;    addr++;
      ipcData.data[addr] = transData[transStac].data.AGCLevel&0xFF;    addr++;
      ipcData.data[addr] = 0x05;    addr++;
      ipcData.data[addr] = transData[transStac].data.AGCEnable?1:0;    addr++;
      ipcData.data[addr] = (att3>>8)&0xFF;    addr++;
      ipcData.data[addr] = att3&0xFF;    addr++;
      ipcData.data[addr] = (att4>>8)&0xFF;    addr++;
      ipcData.data[addr] = att4&0xFF;    addr++;

      if(transData[transStac].title == 'psul'){
        ipcData.numberOfCommand = 5;
        ipcData.data[addr] = 0x0C;    addr++;
        ipcData.data[addr] = transData[transStac].data.sleep.enable?1:0;    addr++;
        ipcData.data[addr] = (transData[transStac].data.sleep.level>>8)&0xFF;    addr++;
        ipcData.data[addr] = transData[transStac].data.sleep.level&0xFF;    addr++;
        ipcData.data[addr] = (transData[transStac].data.sleep.time>>8)&0xFF;    addr++;
        ipcData.data[addr] = transData[transStac].data.sleep.time&0xFF;    addr++;
      }
      console.log(ipcData.data);
      ipcData.band = transData[transStac].band;
      // ipcRenderer.send('SerialTransmit', ipcData);
      // pakt87
      
      transStac += 1;
      if( transStac > 2 ){ clearInterval(transLoop) }
    }, 500)

    /***************************************** */

    /***************************************** *
    dispatch(PS700SetChange({ name: "ALCEnable", value: ps700Parameter.ALCEnable }));
    dispatch(PS700SetChange({ name: "ALCLevel", value: ps700Parameter.ALCLevel }));
    dispatch(PS700SetChange({ name: "AGCEnable", value: ps700Parameter.AGCEnable }));
    dispatch(PS700SetChange({ name: "AGCLevel", value: ps700Parameter.AGCLevel }));
    dispatch(PS700SetChange({ name: "ALCAtten", value: ps700Parameter.ALCAtten }));
    dispatch(PS700SetChange({ name: "Atten", value: ps700Parameter.Atten }));

    dispatch(PS800SetChange({ name: "ALCEnable", value: ps800Parameter.ALCEnable }));
    dispatch(PS800SetChange({ name: "ALCLevel", value: ps800Parameter.ALCLevel }));
    dispatch(PS800SetChange({ name: "AGCEnable", value: ps800Parameter.AGCEnable }));
    dispatch(PS800SetChange({ name: "AGCLevel", value: ps800Parameter.AGCLevel }));
    dispatch(PS800SetChange({ name: "ALCAtten", value: ps800Parameter.ALCAtten }));
    dispatch(PS800SetChange({ name: "Atten", value: ps800Parameter.Atten }));

    dispatch(PSULSetChange({ name: "ALCEnable", value: psulParameter.ALCEnable }));
    dispatch(PSULSetChange({ name: "ALCLevel", value: psulParameter.ALCLevel }));
    dispatch(PSULSetChange({ name: "AGCEnable", value: psulParameter.AGCEnable }));
    dispatch(PSULSetChange({ name: "AGCLevel", value: psulParameter.AGCLevel }));
    dispatch(PSULSetChange({ name: "ALCAtten", value: psulParameter.ALCAtten }));
    dispatch(PSULSetChange({ name: "Atten", value: psulParameter.Atten }));
    /***************************************** */
  }
  const processOfResponseDataGet = (responseData) => {
    let addr = 1;   // 1번 command 스킵
    let ALCEnable, ALCAtten, ALCLevel, AGCEnable, AGCLevel, Atten, sleepEnable, sleepLevel, sleepTime;
    
    ALCEnable = responseData.data[addr];    addr++;
    ALCLevel = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
    addr++; // 2번 Commanmd 스킵
    addr++; // Enable이 한번 더 넘어오기 때문
    ALCAtten = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;   //att1
    ALCAtten += (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;    //att2

    addr++; // 3번 Commanmd 스킵
    AGCEnable = responseData.data[addr];    addr++;
    AGCLevel = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
    addr++; // 4번 Commanmd 스킵
    addr++;
    Atten = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
    Atten += (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;

    if( responseData.band == 0x02 ){
      addr++; // 5번 Commanmd 스킵
      sleepEnable = responseData.data[addr];    addr++;
      sleepLevel = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
      if((sleepLevel&0x8000) === 0x8000){ sleepLevel = ((~sleepLevel&0xFFFF)+1)*(-1); }
      sleepTime = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
    }

    switch (responseData.band) {
      case 0:
        setps700Parameter({ ...ps700Parameter, 
          ALCEnable: ALCEnable,
          ALCAtten: ALCAtten,
          ALCLevel: ALCLevel,
          AGCEnable: AGCEnable,
          Atten: Atten,
          AGCLevel: AGCLevel
        })

        break;
      case 1:
        setps800Parameter({ ...ps700Parameter, 
          ALCEnable: ALCEnable,
          ALCAtten: ALCAtten,
          ALCLevel: ALCLevel,
          AGCEnable: AGCEnable,
          Atten: Atten,
          AGCLevel: AGCLevel
        })

        break;
      case 2:
        setpsulParameter({ ...ps700Parameter, 
          ALCEnable: ALCEnable,
          ALCAtten: ALCAtten,
          ALCLevel: ALCLevel,
          AGCEnable: AGCEnable,
          Atten: Atten,
          AGCLevel: AGCLevel,
          sleep: {enable: sleepEnable?true:false, level: sleepLevel, time: sleepTime}
        })
        break;
    
      default:
        break;
    }
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
    ]
    for (let index = 0; index < transData.length; index++) {
      const ipcData = { 
        command: 0xB0,
        numberOfCommand: 4,
        band: 0,
        data: [0x28, 0x2A, 0x24, 0x26]
      };
      ipcData.band = transData[index].band;   // 밴드값 변경
      if( ipcData.band === 2 ){
        ipcData.numberOfCommand = 5;
        ipcData.data[4] = 0x34;
      }
      // ipcRenderer.send('SerialTransmit', ipcData);
      // pakt87
      const postSuccessed = await postSerialCommunication(ipcData, "get")
      if( ! postSuccessed) { break; } // 어떤 통신이 실패했다면 for 문 종료후 빠져나가기..
    }




    /********************* *
    let transLoop = setInterval(() => {
      ipcData.band = transData[transStac].band;
      if( transData[transStac].band == 0x02 ){
        ipcData.numberOfCommand = 5;
        ipcData.data[4] = 0x34;
      }
      ipcRenderer.send('SerialTransmit', ipcData);
      let waitStac = 0;
        const interval = setInterval(() => {
          let responseData = ipcRenderer.sendSync('SerialResponse');
          waitStac++;
          if( waitStac < 4 ){
            if( responseData.flag ){
              waitStac = 0;
              console.log(responseData);
              clearInterval(interval);
              let addr = 1;   // 1번 command 스킵
              let ALCEnable, ALCAtten, ALCLevel, AGCEnable, AGCLevel, Atten, sleepEnable, sleepLevel, sleepTime;
              
              ALCEnable = responseData.data[addr];    addr++;
              ALCLevel = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
              addr++; // 2번 Commanmd 스킵
              addr++; // Enable이 한번 더 넘어오기 때문
              ALCAtten = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;   //att1
              ALCAtten += (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;    //att2

              addr++; // 3번 Commanmd 스킵
              AGCEnable = responseData.data[addr];    addr++;
              AGCLevel = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
              addr++; // 4번 Commanmd 스킵
              addr++;
              Atten = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
              Atten += (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;

              if( responseData.band == 0x02 ){
                addr++; // 5번 Commanmd 스킵
                sleepEnable = responseData.data[addr];    addr++;
                sleepLevel = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
                sleepLevel = ((~sleepLevel&0xFFFF)+1)*(-1)
                sleepTime = (responseData.data[addr]<<8) + responseData.data[addr+1];    addr++; addr++;
              }

              switch (responseData.band) {
                case 0:
                  setps700Parameter({ ...ps700Parameter, 
                    ALCEnable: ALCEnable,
                    ALCAtten: ALCAtten,
                    ALCLevel: ALCLevel,
                    AGCEnable: AGCEnable,
                    Atten: Atten,
                    AGCLevel: AGCLevel
                  })

                  break;
                case 1:
                  setps800Parameter({ ...ps700Parameter, 
                    ALCEnable: ALCEnable,
                    ALCAtten: ALCAtten,
                    ALCLevel: ALCLevel,
                    AGCEnable: AGCEnable,
                    Atten: Atten,
                    AGCLevel: AGCLevel
                  })

                  break;
                case 2:
                  setpsulParameter({ ...ps700Parameter, 
                    ALCEnable: ALCEnable,
                    ALCAtten: ALCAtten,
                    ALCLevel: ALCLevel,
                    AGCEnable: AGCEnable,
                    Atten: Atten,
                    AGCLevel: AGCLevel,
                    sleep: {enable: sleepEnable?true:false, level: sleepLevel, time: sleepTime}
                  })
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
      if( transStac > 2 ){ clearInterval(transLoop); }
    }, 200)
    /********************* */
  }

  const parameterDraw = drawData.map((d) => {
    return (
      <div className="w-1/3 h-full" key={"parameter" + d.title}>
        <div className="w-9/10 h-1/10 bg-indigo-500 text-white rounded-t-lg mx-auto">
          <p className="w-full h-fit text-lg py-2.5">{d.title}</p>
        </div>
        <div className="w-9/10 h-1/10 flex mx-auto border-x-2 border-gray-500">
          <div className="w-1/2 h-full flex">
            <p className="w-full h-fit text-base my-auto">
              Input ALC <br /> On/Off
            </p>
          </div>
          <div className="w-fit h-fit m-auto">
            <label className="switch">
              <input
                id={d.title + "ps700ALCEnable"}
                name={d.title}
                type="checkbox"
                checked={d.parameter.ALCEnable}
                onChange={ALCEnableChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="w-9/10 h-1/10 flex border-r-2 border-x-2 border-gray-500 bg-indigo-50 mx-auto ">
          <div className="w-1/2 h-full flex">
            <p className="w-full h-fit text-lg my-auto">ALC Level</p>
          </div>
          <input
            className="w-5/12 h-2/3 text-center bg-indigo-50 m-auto"
            name={d.title}
            min="0"
            max="27"
            type={'number'}
            step="0.1"
            value={(d.parameter.ALCLevel / 10).toString()}
            onChange={ALCLevelChange}
            readOnly={d.parameter.ALCEnable? false:true}
          />
        </div>

        <div className="w-9/10 h-1/10 flex mx-auto border-x-2 border-gray-500">
          <div className="w-1/2 h-full flex">
            <p className="w-full h-fit text-lg my-auto">ALC Atten</p>
          </div>
          <input
            className="w-5/12 h-2/3 m-auto text-center"
            name={d.title}
            min="0"
            max="45"
            type="number"
            step="0.5"
            value={(d.parameter.ALCAtten / 10).toString()}
            onChange={ALCAttenChange}
            readOnly={d.parameter.ALCEnable? true:false}
          />
        </div>

        <div className="w-9/10 h-1/10 flex mx-auto bg-indigo-50 border-x-2 border-gray-500">
          <div className="w-1/2 h-full flex">
            <p className="w-full h-fit text-base my-auto">
              Output AGC <br /> On/Off
            </p>
          </div>
          <div className="w-fit h-fit m-auto">
            <label className="switch">
              <input
                id={d.title + "AGCEnable"}
                name={d.title}
                type="checkbox"
                checked={d.parameter.AGCEnable}
                onChange={AGCEnableChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="w-9/10 h-1/10 flex mx-auto border-x-2 border-gray-500">
          <div className="w-1/2 h-full flex">
            <p className="w-full h-fit text-lg my-auto">AGC Level</p>
          </div>
          <input
            className="w-5/12 h-2/3 m-auto text-center"
            name={d.title}
            min="0"
            max="27"
            type="number"
            step="0.1"
            value={(d.parameter.AGCLevel / 10).toString()}
            onChange={AGCLevelChange}
            readOnly={d.parameter.AGCEnable? false:true}
          />
        </div>
        {d.direction == "DL" ? (
          <div className="w-9/10 h-1/10 flex mx-auto bg-indigo-50 border-x-2 border-b-2 border-gray-500 rounded-b-lg">
            <div className="w-1/2 h-full flex">
              <p className="w-full h-fit text-lg my-auto">Atten</p>
            </div>
            <input
              className="w-5/12 h-2/3 m-auto text-center bg-indigo-50"
              name={d.title}
              min="0"
              max="45"
              type="number"
              step="0.5"
              value={(d.parameter.Atten / 10).toString()}
              onChange={AttenChange}
              readOnly={d.parameter.AGCEnable? true:false}
            />
          </div>
        ) : (
          [
            <div
              key={"ULAtten"}
              className="w-9/10 h-1/10 flex mx-auto bg-indigo-50 border-x-2 border-gray-500"
            >
              <div className="w-1/2 h-full flex">
                <p className="w-full h-fit text-lg my-auto">Atten</p>
              </div>
              <input
                className="w-5/12 h-2/3 m-auto text-center bg-indigo-50"
                name={d.title}
                min="0"
                max="45"
                type="number"
                step="0.5"
                value={(d.parameter.Atten / 10).toString()}
                onChange={AttenChange}
                readOnly={d.parameter.AGCEnable? true:false}
              />
            </div>,
            <div
              key={"ULsleepEnable"}
              className="w-9/10 h-1/10 flex mx-auto border-x-2 border-gray-500"
            >
              <div className="w-1/2 h-full flex">
                <p className="w-full h-fit text-lg my-auto">Sleep Enable</p>
              </div>
              <div className="w-fit h-fit m-auto">
                <label className="switch">
                  <input
                    id="PSULSleepEnable"
                    type="checkbox"
                    name={d.title}
                    checked={d.parameter.sleep.enable}
                    onChange={sleepEnableChange}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>,
            <div
              key={"ULsleepLevel"}
              className="w-9/10 h-1/10 flex mx-auto bg-indigo-50 border-x-2 border-gray-500"
            >
              <div className="w-1/2 h-full flex">
                <p className="w-full h-fit text-lg my-auto">Sleep Level</p>
              </div>
              <input
                className="w-5/12 h-2/3 m-auto text-center bg-indigo-50"
                name={d.title}
                min="-150"
                max="0"
                type="number"
                step="0.1"
                value={d.parameter.sleep.level===''?'':(d.parameter.sleep.level/10)}
                /* value={(d.parameter.sleep.level / 10).toString()} */
                onChange={sleepLevelChange}
              />
            </div>,
            <div
              key={"ULsleepTime"}
              className="w-9/10 h-1/10 flex mx-auto border-x-2 border-b-2 border-gray-500 rounded-b-lg"
            >
              <div className="w-1/2 h-full flex">
                <p className="w-full h-fit text-lg my-auto">Sleep Time</p>
              </div>
              <input
                className="w-5/12 h-2/3 m-auto text-center"
                name={d.title}
                min="0"
                max="3600"
                type="number"
                value={d.parameter.sleep.time.toString()}
                onChange={sleepTimeChange}
              />
            </div>,
          ]
        )}
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
          <div className="w-full h-2/3 flex justify-between text-center pt-7">
            {parameterDraw}
          </div>

          <div className="w-1/2 h-1/3 flex justify-between pt-16 mx-auto">
            {/* Button */}
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

export default UserSetParameterPage;