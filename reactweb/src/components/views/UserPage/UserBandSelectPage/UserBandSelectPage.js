import React, { useState, useMemo, useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserNavber from '../UserNavBar/UserNavbar'
import UserHeaderPage from '../UserHeaderPage/UserHeaderPage'
import { PS700ChannelChange } from '../../../../_reducers/PS700ChannelSlice'
import { PS800ChannelChange } from '../../../../_reducers/PS800ChannelSlice'
// import { ErrorMessage } from '../../../Renderer/Renderer'
// const { ipcRenderer } = window.require('electron');

import { randomNumberInRange, useInterval, convertDataSerialToObject, ControlLED } from '../../../lib/common'
import { GlobalContext } from '../../../context/GlobalContext'

function UserBandSelectPage(props) {
  const PS700state = useSelector((state) => state.PS700Channel);
  const PS800state = useSelector((state) => state.PS800Channel);
  const dispatch = useDispatch();
  const [numberOfChannels, setnumberOfChannels] = useState(Number(PS700state.numberOfChannels)-1);
  const [channelData, setchannelData] = useState([PS700state.channelData[0]]);
  const [channelInputPower, setchannelInputPower] = useState([PS700state.channelData[0]]);
  const [bandSelect, setbandSelect] = useState('ps700');
  const [bandClass, setbandClass] = useState('classA');
  const [refreshStac, setrefreshStac] = useState(true);
  const [autoRefresh, setautoRefresh] = useState(false);
  const [test, settest] = useState(0);

  // const [tempTotalData, setTempTotalData] = useState(null);
  let tempTotalData;

  const { globalIsProgress } = useContext(GlobalContext)  // 전역 Context 가져오기..

  // 화면 1차적으로 그린뒤, 실행되는 곳..
  useEffect(() => {
    const nowPage = document.getElementById("navbarButtonBandSelect");
    nowPage.className = nowPage.className + " " + "bg-indigo-600 text-white";

    if(globalIsProgress.isPosting !== true) {
      console.log("useEffect... First, RecallClick Auto Clicked..")
      RecallClick();
    }else{
      let first = setTimeout(()=>{ 
        globalIsProgress.isPosting = false
        RecallClick();
      }, 1500)
    }
	}, [])

  /*******************************************************
	* useInterval 타이머 사용 ...
	*******************************************************/
	useInterval(() => {
		// Your custom logic here
    console.log("interval...")
		if(autoRefresh){
      if(globalIsProgress.isPosting !== true){
        // 이거 떄문에 계속 페이지 그 난리 남
        RecallInputPower();
      }
    }
	}, 1800);

  const RecallInputPower = async() => {
    // let transStac = 0;
    //e.preventDefault();
    
    const transData = [
      {title: '', command: 0x14,},
      {title: '', command: 0x1A,},
    ]
    for (let index = 0; index < transData.length; index++) {
      const ipcData = { 
        command: 0x14,
        numberOfCommand: 1,
        band: bandSelect=='ps700' ? 0:1,
        data: []
      };
      // 밴드값 변경
      //ipcData.band = transData[index].band;   
      // ipcRenderer.send('SerialTransmit', ipcData);
      // pakt87
      const postSuccessed = await postSerialCommunication(ipcData, "getInputPower")
      if( ! postSuccessed) { break; } // 어떤 통신이 실패했다면 for 문 종료후 빠져나가기..
    }
  }
  const processOfResponseDataGetInputPower = (responseData) => {
    console.log("processOfResponseDataGetInputPower's responseData is ===> ", responseData)
    let totalData = [...channelData];
    let addr = 0;
    switch (responseData.command) {
      case 0x15:
        totalData.forEach((d,i) => {      // channel Power 입력
          let dlInputPower = (responseData.data[addr]<<8)+responseData.data[addr+1];
          if((dlInputPower&0x8000) == 0x8000) { dlInputPower = ((~dlInputPower&0xFFFF)+1)*(-1); }
          let ulInputPower = (responseData.data[addr+2]<<8)+responseData.data[addr+3];
          if((ulInputPower&0x8000) == 0x8000) { ulInputPower = ((~ulInputPower&0xFFFF)+1)*(-1); }
          totalData[i] = { ...totalData[i],
            DLinput: dlInputPower,
            DLoutput: dlInputPower,
            ULinput: ulInputPower,
            ULoutput: ulInputPower,
          }
          addr += 4;
        })
        setchannelInputPower(totalData);
        break;

      case 0x1B:
        let sleepStatus = (responseData.data[addr]<<24)+(responseData.data[addr+1]<<16)+(responseData.data[addr+2]<<8)+responseData.data[addr+3];
        addr++;  addr++;  addr++;  addr++;
        totalData.forEach((d,i) => {      // sleep Status 입력
          totalData[i] = { ...totalData[i], sleepStatus: ((sleepStatus>>i)&0x01)?true:false }
        })
        setchannelInputPower(totalData);
        break;
    
      default:
        console.log("processOfResponseDataGet's responseData's command is invalid.")
        break;
    }
  }
  const postSerialCommunication = async(ipcData, act) => {
    try {
      ControlLED('Tx', 'on');
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
        else if(act === "getInputPower") { processOfResponseDataGetInputPower(convertDataSerialToObject(responseData)) }
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
  const processOfResponseDataGet = (responseData) => {
    console.log("processOfResponseDataGet's responseData is ===> ", responseData)
    let addr = 0;
    let totalData;
    switch (responseData.command) {
      case 0x13:
        console.log("processOfResponseDataGet's case 0x13 in...")
        console.log("tempTotalData is ===> ", tempTotalData)
        responseData.band==1 ? setbandSelect('ps800'):setbandSelect('ps700');  // Band 입력
        responseData.data[addr]===1 ? setbandClass('classB'):setbandClass('classA');    addr++;   //class 입력
        setnumberOfChannels(responseData.data[addr]);    addr++;  // 채널 수 입력.
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
          // 각체널 데이터 및 number Of Channels넣어야함
          // 700 800을 구분해줘야하네????
          if( responseData.band == 0 ){ dispatch(PS700ChannelChange({number: i ? i:'firstNet', value: totalData[i]})); }
          else{ dispatch(PS800ChannelChange({number: i ? i:'firstNet', value: totalData[i]})); }
        })
        tempTotalData = totalData;   // pakt87
        // setchannelData(totalData);
        //channelLength = totalData.length;
        if( responseData.band == 0 ){ dispatch(PS700ChannelChange({number: 'numberOfChannels', value: totalData.length})); }
        else{ dispatch(PS800ChannelChange({number: 'numberOfChannels', value: totalData.length})); }
        break;

      case 0x15:
        console.log("processOfResponseDataGet's case 0x15 in...")
        console.log("tempTotalData is ===> ", tempTotalData)
        totalData = tempTotalData   // pakt87
        totalData.forEach((d,i) => {      // channel Power 입력
          let dlInputPower = (responseData.data[addr]<<8)+responseData.data[addr+1];
          if((dlInputPower&0x8000) == 0x8000) { dlInputPower = ((~dlInputPower&0xFFFF)+1)*(-1); }
          let ulInputPower = (responseData.data[addr+2]<<8)+responseData.data[addr+3];
          if((ulInputPower&0x8000) == 0x8000) { ulInputPower = ((~ulInputPower&0xFFFF)+1)*(-1); }
          totalData[i] = { ...totalData[i],
            DLinput: dlInputPower,
            DLoutput: dlInputPower,
            ULinput: ulInputPower,
            ULoutput: ulInputPower,
          }
          addr += 4;
        })
        tempTotalData = totalData;   // pakt87
        // setchannelData(totalData);
        break;

      case 0x1B:
        console.log("processOfResponseDataGet's case 0x1B in...")
        console.log("tempTotalData is ===> ", tempTotalData)
        let sleepStatus = (responseData.data[addr]<<24)+(responseData.data[addr+1]<<16)+(responseData.data[addr+2]<<8)+responseData.data[addr+3];
        addr++;  addr++;  addr++;  addr++;
        totalData = tempTotalData   // pakt87
        totalData.forEach((d,i) => {      // sleep Status 입력
          totalData[i] = { ...totalData[i], sleepStatus: ((sleepStatus>>i)&0x01)?true:false }
        })
        tempTotalData = totalData;   // pakt87
        setchannelData(totalData);
        setchannelInputPower(totalData);

        setautoRefresh(true); // 모든 내용 전부 읽기 완료 후 input Power값 요청 시작.
        break;
    
      default:
        break;
    }
    return;
  }
  const processOfResponseDataSet = (responseData) => {
    console.log("processOfResponseDataSet's responseData is ===> ", responseData)
    // 여긴 따로 안함.. 앞쪽에서 다 처리해버림..
  }


  
  /************************************************************************** *
  useEffect(() => {
    setTimeout(() => { setrefreshStac(!refreshStac) }, 1000)
    const nowPage = document.getElementById("navbarButtonBandSelect");
    nowPage.className = nowPage.className + " " + "bg-indigo-600 text-white";
    
    //여기서 주기적으로 input Power를 읽어와야하네 ㅋㅋㅋㅋ
    if( autoRefresh ){
      let transStac = 0;
      let ipcData = { 
        command: 0x14,
        numberOfCommand: 1,
        band: bandSelect=='ps700' ? 0:1,
        data: []
      }
      const transData = [
        {...ipcData, command: 0x14},
        {...ipcData, command: 0x1A},
      ]
      let totalData = [...channelData];

      let transLoop = setInterval(() => {
        ipcRenderer.send('SerialTransmit', transData[transStac]);
        let waitStac = 0;
          const interval = setInterval(() => {
            let responseData = ipcRenderer.sendSync('SerialResponse');
            waitStac++;
            if( waitStac < 10 ){
              if( responseData.flag ){
                clearInterval(interval);
                let addr = 0;

                switch (responseData.command) {
                  case 0x15:
                    totalData.forEach((d,i) => {      // channel Power 입력
                      totalData[i] = { ...totalData[i],
                        DLinput: (responseData.data[addr]<<8)+responseData.data[addr+1],
                        DLoutput: (responseData.data[addr]<<8)+responseData.data[addr+1],
                        ULinput: (responseData.data[addr+2]<<8)+responseData.data[addr+3],
                        ULoutput: (responseData.data[addr+2]<<8)+responseData.data[addr+3],
                      }
                      addr += 4;
                    })
                    setchannelData(totalData);

                    break;
                  case 0x1B:
                    let sleepStatus = (responseData.data[addr]<<24)+(responseData.data[addr+1]<<16)+(responseData.data[addr+2]<<8)+responseData.data[addr+3];
                    addr++;  addr++;  addr++;  addr++;
                    totalData.forEach((d,i) => {      // sleep Status 입력
                      totalData[i] = { ...totalData[i], sleepStatus: ((sleepStatus>>i)&0x01)?true:false }
                    })
                    setchannelData(totalData);
                    break;
                
                  default:
                    break;
                }
              }
            }else{ clearInterval(interval); }
          }, 10)
          transStac += 1;
        if( transStac > 1 ){ clearInterval(transLoop) }
      }, 200)
    }
  },[refreshStac])
  /************************************************************************** */

  
  const classChange = (e) => {
    let totalData = [], data

    console.log(channelData.length)
    if( e.currentTarget.value == 'classB'){
      let arrayLength;
      if( channelData.length > 4 ){
        setnumberOfChannels(4);
        
        if( bandSelect == 'ps700' ){ arrayLength = 5; }
        else{ arrayLength = 4; }
      }else{ arrayLength = channelData.length; }
      
      for (let i = 0; i < arrayLength; i++) {
        data = {...channelData[i], BW: 0.25}
        totalData[i] = data;
        /* if( bandSelect == 'ps700' ){
          if( i ){
            dispatch(PS700ChannelChange({ number: i, value: totalData[i] }));  // PS700 dispatch
          }else{
            dispatch(PS700ChannelChange({ number: 'firstNet', value: totalData[i] }));  // PS700 dispatch
          } 
        }else{
          dispatch(PS800ChannelChange({ number: i, value: totalData[i] }));
        } */
         
      }
    }else{
      for (let i = 0; i < channelData.length; i++) {
        data = {...channelData[i], BW: 0.0125}
        totalData[i] = data;
        /* if( i ){
          dispatch(PS700ChannelChange({ number: i, value: totalData[i] }));  // PS700 dispatch
        }else{
          dispatch(PS700ChannelChange({ number: 'firstNet', value: totalData[i] }));  // PS700 dispatch
        }   */
      }
    }
    console.log(totalData);
    setchannelData(totalData);
    setbandClass(e.currentTarget.value);
  }
  


  const NumberOfChannelsChange = (e) => {
    if(bandClass == 'classB'){
      if(e.currentTarget.value > 4){ e.currentTarget.value = 4; }
      else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    }else{
      if(e.currentTarget.value > 32){ e.currentTarget.value = 32; }
      else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    }
    
    e.currentTarget.value = Number(e.currentTarget.value).toFixed(0);
    setnumberOfChannels(e.currentTarget.value);
  }
  const EnterCustomApply = (e) => {
    e.preventDefault();
    if( e.key == 'Enter' ){
      CreateChannel();
      //setautoRefresh(false);
    }
  }



  const CreateChannel = (e) => {
    if( bandSelect == 'ps700' ){
      let length = Number(numberOfChannels)+1;
      let data = new Array(length);
      data[0] = PS700state.channelData[0];
      for (let i = 1; i < (length); i++) {
        data[i] = PS700state.channelData[i];  
      }
      setchannelInputPower(data);
      setchannelData(data);
      //dispatch(PS700ChannelChange({ number: 'numberOfChannels', value: length }));

    }else if( bandSelect == 'ps800' ){
      let length = Number(numberOfChannels);
      let data = new Array(length);
      for (let i = 0; i < (length); i++) {
        data[i] = PS800state.channelData[i];
      }
      setchannelInputPower(data);
      setchannelData(data);
      //dispatch(PS800ChannelChange({ number: 'numberOfChannels', value: length }));
    }
    //setautoRefresh(false);
  }

  const SetOffClick = () => {
    let data = channelData.map((d,i) => ({...d, BW: 0}));
    setchannelData(data);

    /* switch (bandSelect) {
      case 'ps700':
        data.forEach((d, i) => { dispatch(PS700ChannelChange({ number: i, value: d })) })
        
        break;
      case 'ps800':
        data.forEach((d, i) => { dispatch(PS800ChannelChange({ number: i, value: d })) })
        
        break;
    
      default:
        break;
    } */
  }

  const ConfirmClick = async() => {
    //console.log("####################################1");
    let addr = 2;
    let ipcData = { 
      command: 0x01,
      numberOfCommand: 1,
      band: bandSelect=='ps700' ? 0:1,
      data: [
        bandClass=='classA' ? 0:1, 
        Number(numberOfChannels),
      ]
    }
    
    channelData.map((d,i) => {
      let DLfreqInfo = d.DLfreqInfo*1000000;
      let BW = d.BW*1000000;
      let ULfreqInfo = d.ULfreqInfo*1000000;

      ipcData.data[addr] = (d.DLatten>>8)&0xFF;       addr++;
      ipcData.data[addr] = d.DLatten&0xFF;            addr++;
      ipcData.data[addr] = (DLfreqInfo>>24)&0xFF;     addr++;
      ipcData.data[addr] = (DLfreqInfo>>16)&0xFF;     addr++;
      ipcData.data[addr] = (DLfreqInfo>>8)&0xFF;      addr++;
      ipcData.data[addr] = DLfreqInfo&0xFF;           addr++;
      ipcData.data[addr] = (BW>>24)&0xFF;             addr++;
      ipcData.data[addr] = (BW>>16)&0xFF;             addr++;
      ipcData.data[addr] = (BW>>8)&0xFF;              addr++;
      ipcData.data[addr] = BW&0xFF;                   addr++;
      ipcData.data[addr] = (d.ULatten>>8)&0xFF;       addr++;
      ipcData.data[addr] = d.ULatten&0xFF;            addr++;
      ipcData.data[addr] = (ULfreqInfo>>24)&0xFF;     addr++;
      ipcData.data[addr] = (ULfreqInfo>>16)&0xFF;     addr++;
      ipcData.data[addr] = (ULfreqInfo>>8)&0xFF;      addr++;
      ipcData.data[addr] = ULfreqInfo&0xFF;           addr++;
      ipcData.data[addr] = (BW>>24)&0xFF;             addr++;
      ipcData.data[addr] = (BW>>16)&0xFF;             addr++;
      ipcData.data[addr] = (BW>>8)&0xFF;              addr++;
      ipcData.data[addr] = BW&0xFF;                   addr++;
      if( bandSelect == 'ps700' ){
        if(i){ dispatch(PS700ChannelChange({ number: i, value: d })); }
        else{ dispatch(PS700ChannelChange({ number: 'firstNet', value: d })); }
      }else{
        dispatch(PS800ChannelChange({ number: i, value: d }));
      }
    })
    if( bandSelect == 'ps700' ){
      dispatch(PS700ChannelChange({ number: 'numberOfChannels', value: channelData.length }));
    }else{
      dispatch(PS800ChannelChange({ number: 'numberOfChannels', value: channelData.length }));
    }
    console.log(ipcData);
    // ipcRenderer.sendSync('SerialTransmit', ipcData);
    // pakt87
    const postSuccessed = await postSerialCommunication(ipcData, "set")
    if(postSuccessed) setautoRefresh(true);
  }

  const RecallClick = async() => {
    // let transStac = 0;
    const bandCurrent = (bandSelect=='ps700' ? 0:1)
    const transData = [
      {band: bandCurrent, command: 0x12},
      {band: bandCurrent, command: 0x14},
      {band: bandCurrent, command: 0x1A},
    ]
    for (let index = 0; index < transData.length; index++) {
      const ipcData = { 
        command: transData[index].command,
        numberOfCommand: 1,
        band: transData[index].band,
        data: []
      };
      // ipcRenderer.send('SerialTransmit', ipcData);
      // pakt87
      const postSuccessed = await postSerialCommunication(ipcData, "get")
      if( ! postSuccessed) { break; } // 어떤 통신이 실패했다면 for 문 종료후 빠져나가기..
    }
    
    
    
    // let totalData;
    
    //
    // pakt87 
    //
    /**************************************************************** *
    let transLoop = setInterval(() => {
      ipcRenderer.send('SerialTransmit', transData[transStac]);
      let waitStac = 0;
        const interval = setInterval(() => {
          let responseData = ipcRenderer.sendSync('SerialResponse');
          waitStac++;
          if( waitStac < 20 ){
            if( responseData.flag ){
              clearInterval(interval);
              let addr = 0;
              console.log(transData[transStac-1].command + ' : ', responseData);

              switch (responseData.command) {
                case 0x13:
                  responseData.band==1 ? setbandSelect('ps800'):setbandSelect('ps700');  // Band 입력
                  responseData.data[addr] ? setbandClass('classB'):setbandClass('classA');    addr++;   //class 입력
                  setnumberOfChannels(responseData.data[addr]);    addr++;  // 채널 수 입력.
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
                    // 각체널 데이터 및 number Of Channels넣어야함
                    // 700 800을 구분해줘야하네????
                    if( responseData.band == 0 ){ dispatch(PS700ChannelChange({number: i ? i:'firstNet', value: totalData[i]})); }
                    else{ dispatch(PS800ChannelChange({number: i ? i:'firstNet', value: totalData[i]})); }
                  })
                  setchannelData(totalData);
                  //channelLength = totalData.length;
                  if( responseData.band == 0 ){ dispatch(PS700ChannelChange({number: 'numberOfChannels', value: totalData.length})); }
                  else{ dispatch(PS800ChannelChange({number: 'numberOfChannels', value: totalData.length})); }
                  
                  break;
                case 0x15:
                  totalData.forEach((d,i) => {      // channel Power 입력
                    totalData[i] = { ...totalData[i],
                      DLinput: (responseData.data[addr]<<8)+responseData.data[addr+1],
                      DLoutput: (responseData.data[addr]<<8)+responseData.data[addr+1],
                      ULinput: (responseData.data[addr+2]<<8)+responseData.data[addr+3],
                      ULoutput: (responseData.data[addr+2]<<8)+responseData.data[addr+3],
                    }
                    addr += 4;
                  })
                  setchannelData(totalData);

                  break;
                case 0x1B:
                  let sleepStatus = (responseData.data[addr]<<24)+(responseData.data[addr+1]<<16)+(responseData.data[addr+2]<<8)+responseData.data[addr+3];
                  addr++;  addr++;  addr++;  addr++;
                  totalData.forEach((d,i) => {      // sleep Status 입력
                    totalData[i] = { ...totalData[i], sleepStatus: ((sleepStatus>>i)&0x01)?true:false }
                  })
                  setchannelData(totalData);

                  setautoRefresh(true); // 모든 내용 전부 읽기 완료 후 input Power값 요청 시작.
                  break;
              
                default:
                  break;
              }
            }
          }else{
            clearInterval(interval);
            ErrorMessage('Recall Error', "can't Recall Data from MCU")
          }
        }, 20)
        transStac += 1;
      if( transStac > 2 ){ clearInterval(transLoop) }
    }, 500)
    /**************************************************************** */
  }



  const ChannelAttenChange = (e) => {
    if( e.currentTarget.value > 30 ){ e.currentTarget.value = 30; }
    else if( e.currentTarget.value < 0 ){ e.currentTarget.value = 0; }
    e.target.value = Number((e.target.value/0.5).toFixed(0)*0.5).toFixed(1);

    let number = e.target.name;
    let band = e.target.id.substr(0,2);
    let totalData;

    if( band == 'DL' ){
      if( number != 'firstNet' ){
        number = Number(number);
        let data = bandSelect == 'ps700' ? {...channelData[number], DLatten: Number((e.currentTarget.value*10))}
                                        : {...channelData[number-1], DLatten: Number((e.currentTarget.value*10))}
        totalData = channelData.map((d) => d != null ? (d.index == number ? { ...d, ...data } : d)  : undefined );
      }else{
        let data = {...channelData[number], DLatten: Number((e.currentTarget.value*10))}
        totalData = channelData.map((d) => d != null ? (d.index == 'firstNet' ? { ...d, ...data } : d)  : undefined );
      }
      
    }else if( band == 'UL' ){
      let data = bandSelect == 'ps700' ? {...channelData[number], ULatten: Number((e.currentTarget.value*10))} 
                                        : {...channelData[number-1], ULatten: Number((e.currentTarget.value*10))}
      totalData = channelData.map((d) => d.index == number ? {...d, ...data} : d, );
    }
    setchannelData(totalData);
    
    /* if( bandSelect == 'ps700' ){
      dispatch(PS700ChannelChange({ number: number, value: totalData[number] }));  // PS700 dispatch
    }else{
      dispatch(PS800ChannelChange({ number: number, value: totalData[number-1] }));   // PS800 dispatch
    } */
  }



  const ChannelFreqChange = (e) => {
    let band = e.target.id.substr(0,2);
    let number = Number(e.target.name);
    let totalData;
    if( band === 'DL' ){
      if( bandSelect === 'ps700' ){
        let data = {...channelData[number], DLfreqInfo: e.currentTarget.value 
          , ULfreqInfo: Number((e.currentTarget.value))+30}
        totalData = channelData.map((d) => d != null ? (d.index === number ? { ...d, ...data } : d)  : undefined );
        //setchannelData(totalData);
      }else{
        let data = {...channelData[number-1], DLfreqInfo: e.currentTarget.value 
                  , ULfreqInfo: Number((e.currentTarget.value))-45}
        totalData = channelData.map((d) => d != null ? (d.index === number ? { ...d, ...data } : d)  : undefined );
        //setchannelData(totalData);
      }
    }else{  // band === 'UL'
      if( bandSelect === 'ps700' ){
        let data = {...channelData[number], DLfreqInfo: Number((e.currentTarget.value))-30 
                  , ULfreqInfo: e.currentTarget.value}
        totalData = channelData.map((d) => d != null ? (d.index === number ? { ...d, ...data } : d)  : undefined );
        //totalData = channelData.map((d) => d.index === Number(number) ? {...d, ...data} : d, );
      }else{
        let data = {...channelData[number-1], DLfreqInfo: Number((e.currentTarget.value))+45
                  , ULfreqInfo: e.currentTarget.value}
        totalData = channelData.map((d) => d != null ? (d.index === number ? { ...d, ...data } : d)  : undefined );

        console.log('data => ',data);
        console.log('totalData => ',totalData)
        console.log('number => ',number);
      }
    }
    console.log(totalData);
    setchannelData(totalData);
  }

  const FocusOutFreqInfo = (e) => {
    let DLmin, DLMax, DLBeforMax, DLAftermin, ULmin, ULMax, ULBeforMax, ULAftermin;
    let totalData;
    let number = Number(e.target.name);
    let band = e.target.id.substr(0,2);
    if(e.currentTarget.value === ''){ e.currentTarget.value = 0; }
    var pattern2 = /^\d*[.]\d{7}$/;
    if( pattern2.test(e.target.value) ){
      e.target.value = Number(e.target.value).toFixed(6);
    }
    let addr;
    if( bandSelect == 'ps700' ){ addr = number; }
    else{ addr = number-1; }
    if( band == 'DL' ){
      if( number < numberOfChannels){
        DLMax = Number(e.currentTarget.value) + Number(channelData[addr].BW/2);
        DLmin = Number(e.currentTarget.value) - Number(channelData[addr].BW/2);
        DLAftermin = Number(channelData[addr+1].DLfreqInfo) - Number(channelData[addr+1].BW/2);
        if( addr > 0){
          DLBeforMax = Number(channelData[addr-1].DLfreqInfo) + Number(channelData[addr-1].BW/2);  
        }else{ 
          if( bandSelect === 'ps700' ){ DLBeforMax = 768.000001; }
          else{ DLBeforMax = 851.000001; }
        }
        
      }else{  // 마지막 번호의 채널일 경우
        DLMax = Number(e.currentTarget.value) + Number(channelData[addr].BW/2);
        DLmin = Number(e.currentTarget.value) - Number(channelData[addr].BW/2);
        DLBeforMax = Number(channelData[addr-1].DLfreqInfo) + Number(channelData[addr-1].BW/2)
        if( bandSelect == 'ps700' ){  DLAftermin = 776.000001; }
        else{ DLAftermin = 869.000001; }
      }
      let freqMax, freqMin, freqWeight;
      if( bandSelect === 'ps700' ){ 
        freqMax = 776.000000;
        freqMin = 768.000000;
        freqWeight = 30;
      }else{ 
        freqMax = 869.000000;
        freqMin = 851.000000;
        freqWeight = -45;
      }
      
      if( (DLMax < freqMax)&&(DLmin > freqMin) ){ // 영역 내에 들어갈 경우
        if( (DLMax > DLAftermin)||(DLmin < DLBeforMax) ){// 앞 뒤 채널과 중복될 경우
          e.currentTarget.value = (((DLAftermin-DLBeforMax)/2)+DLBeforMax).toFixed(6);
          alert('Duplicate with other Channels!!');
          //console.log('Duplicate with other Channels!!!!!!!');
        }else{ /* e.currentTarget.value = Number(e.currentTarget.value).toFixed(6); */ }
      }else{  // 영역 밖으로 벗어난 경우
        e.currentTarget.value = (((DLAftermin-DLBeforMax)/2)+DLBeforMax).toFixed(6);
        alert('Out of frequency area');
        //console.log('Out of frequency area');
      }
      let data = {...channelData[addr], DLfreqInfo: e.currentTarget.value
                  , ULfreqInfo: Number((e.currentTarget.value))+freqWeight}
      totalData = channelData.map((d) => d != null ? (d.index == number ? { ...d, ...data } : d)  : undefined );
      setchannelData(totalData);

      // if( (DLMax < DLAftermin) && (DLmin > DLBeforMax) ){ // 1. 앞뒤 채널과 중복되는지 
      //   //console.log("#1")
      //   if( bandSelect == 'ps700' ){
      //     if( DLMax > 776.000000 ){ 
      //       console.log('max error');   // 에러 메세지
      //       //e.currentTarget.value = 
      //     }   
      //     else if( DLmin < 768.000000 ){ console.log('min error') }  // 에러 메세지
      //     let data = {...channelData[number], DLfreqInfo: e.currentTarget.value 
      //                 , ULfreqInfo: Number((e.currentTarget.value))+30}
      //     totalData = channelData.map((d) => d != null ? (d.index == number ? { ...d, ...data } : d)  : undefined );
      //     setchannelData(totalData);
      //     //dispatch(PS700ChannelChange({ number: number, value: totalData[number] }));  // PS700 dispatch
          
      //   }else{  // PS800 부분
      //     if( DLMax > 869.000000 ){ console.log("max error"); }   // 에러 메세지
      //     else if( DLmin < 851.000000 ){ console.log("min error"); }  // 에러 메세지
      //     else { 
      //       let data = {...channelData[number-1], DLfreqInfo: e.currentTarget.value 
      //                   , ULfreqInfo: Number((e.currentTarget.value))-45}
      //       totalData = channelData.map((d) => d != null ? (d.index == number ? { ...d, ...data } : d)  : undefined );
      //       setchannelData(totalData);
      //       //dispatch(PS800ChannelChange({ number: number, value: totalData[number] }));  // PS700 dispatch
      //     }
      //   }
      // }

    }else if( band == 'UL' ){
      if( number < numberOfChannels){
        ULMax = Number(e.currentTarget.value) + Number(channelData[addr].BW/2);
        ULmin = Number(e.currentTarget.value) - Number(channelData[addr].BW/2);
        ULAftermin = Number(channelData[addr+1].ULfreqInfo) - Number(channelData[addr+1].BW/2)  
        if(addr > 0){
          ULBeforMax = Number(channelData[addr-1].ULfreqInfo) + Number(channelData[addr-1].BW/2)
        }else{ 
          if( bandSelect === 'ps700' ){ ULBeforMax = 798.000001; }
          else{ ULBeforMax = 806.000001; }
        }
      }else{
        ULMax = Number(e.currentTarget.value) + Number(channelData[addr].BW/2);
        ULmin = Number(e.currentTarget.value) - Number(channelData[addr].BW/2);
        ULBeforMax = Number(channelData[addr].ULfreqInfo) + Number(channelData[addr].BW/2)  
        if( bandSelect == 'ps700' ){ ULAftermin = 806.000001; }
        else{ ULAftermin = 824.000001; }
      }

      let freqMax, freqMin, freqWeight;
      if( bandSelect === 'ps700' ){ 
        freqMax = 806.000000;
        freqMin = 798.000000;
        freqWeight = -30;
      }else{ 
        freqMax = 824.000000;
        freqMin = 806.000000;
        freqWeight = 45;
      }
      console.log('ULMax  => ', ULMax);
          console.log('ULAftermin  => ', ULAftermin);
          console.log('ULmin  => ', ULmin);
          console.log('ULBeforMax  => ', ULBeforMax);
      if( (ULMax < freqMax)&&(ULmin > freqMin) ){ // 영역 내에 들어갈 경우
        if( (ULMax > ULAftermin)||(ULmin < ULBeforMax) ){// 앞 뒤 채널과 중복된 경우.
          e.currentTarget.value = (((ULAftermin-ULBeforMax)/2)+ULBeforMax).toFixed(6);
          alert('Duplicate with other Channels!!');
          //console.log('Duplicate with other Channels!!!!!!!');
        }else{ /* e.currentTarget.value = Number(e.currentTarget.value).toFixed(6); */ }
      }else{  // 영역 밖으로 벗어난 경우
        e.currentTarget.value = (((ULAftermin-ULBeforMax)/2)+ULBeforMax).toFixed(6);
        console.log(e.currentTarget.value);
        alert('UL Out of frequency area');
        //console.log('Out of frequency area');
      }
      let data = {...channelData[addr], DLfreqInfo: Number((e.currentTarget.value))+freqWeight, 
                  ULfreqInfo: e.currentTarget.value}  
      totalData = channelData.map((d) => d != null ? (d.index == number ? { ...d, ...data } : d)  : undefined );
      setchannelData(totalData);


      // if( (ULMax < ULAftermin) && (ULmin > ULBeforMax) ){ // 1. 앞뒤 채널과 중복되는지 
      //   if( bandSelect == 'ps700' ){  // PS700
      //     if( ULMax > 806.000000 ){ console.log('max error') }   // 에러 메세지
      //     else if( ULmin < 798.000000 ){ console.log('min error') }  // 에러 메세지
      //     else { 
      //       let data = {...channelData[number], DLfreqInfo: Number((e.currentTarget.value))-30 
      //                   , ULfreqInfo: e.currentTarget.value}
      //       totalData = channelData.map((d) => d.index === Number(number) ? {...d, ...data} : d, );
      //     }
      //     setchannelData(totalData);
      //     //dispatch(PS700ChannelChange({ number: number, value: totalData[number] }));  // PS700 dispatch
      //   }else{  // PS800
      //     if( DLMax > 824.000000 ){ console.log('max error') }   // 에러 메세지
      //     else if( DLmin < 806.000000 ){ console.log('min error') }  // 에러 메세지
      //     else { 
      //       let data = {...channelData[number], DLfreqInfo: Number((e.currentTarget.value))+45
      //                   , ULfreqInfo: e.currentTarget.value}
      //       totalData = channelData.map((d) => d.index === Number(number) ? {...d, ...data} : d, );
      //     }
      //     setchannelData(totalData);
      //     //dispatch(PS700ChannelChange({ number: number, value: totalData[number] }));  // PS700 dispatch
      //   }
      // }
    }
  }



  const ChannelBWChange = (e) => {
    let DLmin, DLMax, DLBeforMax, DLAftermin; 
    let number = e.target.name;
    if( number == 'firstNet' ){ number = 0; }
    else{number = Number(number);}
    let band = e.target.id.substr(0,2);
    let totalData;

    let addr;
    if( bandSelect == 'ps700' ){ addr = number; }
    else{ addr = number-1; }
    if( number ){
      if( number < numberOfChannels ){
        DLMax = Number(channelData[addr].DLfreqInfo) + Number(e.currentTarget.value/2);
        DLmin = Number(channelData[addr].DLfreqInfo) - Number(e.currentTarget.value/2);
        DLBeforMax = Number(channelData[addr-1].DLfreqInfo) + Number(channelData[addr-1].BW/2)
        DLAftermin = Number(channelData[addr+1].DLfreqInfo) - Number(channelData[addr+1].BW/2)
      }else{
        //console.log(channelData)

        DLMax = Number(channelData[addr].DLfreqInfo) + Number(e.currentTarget.value/2); 
        DLmin = Number(channelData[addr].DLfreqInfo) - Number(e.currentTarget.value/2);
        DLBeforMax = Number(channelData[addr-1].DLfreqInfo) + Number(channelData[addr-1].BW/2)
        if( bandSelect == 'ps700' ){  DLAftermin = 776.000001; }
        else{ DLAftermin = 869.000001; }
      }
  
      if( bandSelect == 'ps700' ){
        if( DLMax > 776.000000 ){ alert('Out of frequency area'); }   // 에러 메세지
        else if( DLmin < 768.000000 ){ alert('Out of frequency area'); }  // 에러 메세지
        else { 
          if( (DLMax < DLAftermin)&&(DLmin > DLBeforMax) ){
            let data = {...channelData[number], BW: Number(e.currentTarget.value)}
            totalData = channelData.map((d) => {
              if(d != null){ return d.index == number ? { ...d, ...data } : d; }
            });
            setchannelData(totalData);
          }else{ alert('Duplicate with other Channels!!'); }
          //dispatch(PS700ChannelChange({ number: number, value: totalData[number] }));  // PS700 dispatch
        }
      }else{  // PS800 부분
        if( DLMax > 869.000000 ){ alert('Out of frequency area'); }   // 에러 메세지
        else if( DLmin < 851.000000 ){ alert('Out of frequency area'); }  // 에러 메세지
        else { 
          if( (DLMax < DLAftermin)&&(DLmin > DLBeforMax) ){
            let data = {...channelData[number-1], BW: Number(e.currentTarget.value)}
            totalData = channelData.map((d) => d != null ? (d.index == number ? { ...d, ...data } : d)  : undefined );
            /* totalData = channelData.map((d) => {
              if(d != null){ return d.index == number ? { ...d, ...data } : d; }
            }); */
            setchannelData(totalData);
          }else{ alert('Duplicate with other Channels!!'); }
          //dispatch(PS800ChannelChange({ number: number, value: totalData[number] }));
        }
      }
    }else{
      let data = {...channelData[number], BW: Number(e.currentTarget.value)}
      totalData = channelData.map((d) => d != null ?  (d.index == 'firstNet' ? { ...d, ...data } : d)  : undefined );
      setchannelData(totalData);
      //dispatch(PS700ChannelChange({ number: number, value: totalData[number] }));
    }
  }



  const BandSelectChange = (e) => { 
    if(e.currentTarget.value == 'ps700'){
      console.log(PS700state)
      let totalData = [];
      for (let i = 0; i < PS700state.numberOfChannels; i++) { totalData[i] = PS700state.channelData[i]; }
      setchannelData(totalData);
      setnumberOfChannels(PS700state.numberOfChannels-1);
    }else{
      let totalData = [];
      for (let i = 0; i < PS800state.numberOfChannels; i++) { totalData[i] = PS800state.channelData[i]; }
      setchannelData(totalData);
      setnumberOfChannels(PS800state.numberOfChannels);
    }
    setbandSelect(e.currentTarget.value);
  }

  const autoRefreshChange = (e) => {
    setautoRefresh(e.target.checked);
  }


  



  const renderCards = channelData.map((channel, index, array) => {
    //console.log(channel);
    if( channel != null ){
      let bgcolor = 'bg-white';
      if( index % 2 != 0 ) { bgcolor = 'bg-indigo-50'; }
      let tdClassName = 'w-auto h-full ' + bgcolor;
      let inputClassName = 'w-11/12 h-auto text-13px text-center ' + bgcolor;
      let channelNumber = '';
      if( (index == 0) && (bandSelect=='ps700') ){
        channelNumber = 'firstNet'
      }else { channelNumber = channel.index; }
      
      const CreateBW = (props) => {
        if( channel.index == 'firstNet' ){
          return <select className='w-full h-auto text-center text-sm border-2 rounded-lg' name={props.name} value={channel.BW} disabled={autoRefresh? true:false} onChange={ChannelBWChange}>
            <option className='font-sans font-bold' key='OFF' value='0'>OFF</option>
            <option className='font-sans font-bold' key='10M' value='10'>10MHz</option>
          </select>
        }else if( bandClass == 'classA' ){
          return <select className='w-full h-auto text-center text-sm border-2 rounded-lg' name={props.name} value={channel.BW} disabled={autoRefresh? true:false} onChange={ChannelBWChange}>
            <option className='font-sans font-bold' key='OFF' value='0'>OFF</option>
            <option className='font-sans font-bold' key='12.5K' value='0.0125'>12.5KHz</option>
            <option className='font-sans font-bold' key='25K' value='0.025'>25KHz</option>
            <option className='font-sans font-bold' key='50K' value='0.05'>50KHz</option>
            <option className='font-sans font-bold' key='75K' value='0.075'>75KHz</option>
            {/* <option className='font-sans font-bold' key='100K' value='0.1'>100KHz</option> */}
          </select>
        }else {
          if( bandSelect == 'ps700' ){
            return <select className='w-full h-auto text-center text-sm border-2 rounded-lg' name={props.name} value={channel.BW} disabled={autoRefresh? true:false} onChange={ChannelBWChange}>
              <option className='font-sans font-bold' key='OFF' value='0'>OFF</option>
              <option className='font-sans font-bold' key='250K' value='0.25'>250KHz</option>
              <option className='font-sans font-bold' key='500K' value='0.5'>500KHz</option>
              <option className='font-sans font-bold' key='1M' value='1'>1MHz</option>
              <option className='font-sans font-bold' key='2M' value='2'>2MHz</option>
              <option className='font-sans font-bold' key='3M' value='3'>3MHz</option>
              <option className='font-sans font-bold' key='7M' value='7'>7MHz</option>
            </select>
          }else{
            return <select className='w-full h-auto text-center text-sm border-2 rounded-lg' name={props.name} value={channel.BW} disabled={autoRefresh? true:false} onChange={ChannelBWChange}>
              <option className='font-sans font-bold' key='OFF' value='0'>OFF</option>
              <option className='font-sans font-bold' key='25K' value='0.25'>250KHz</option>
              <option className='font-sans font-bold' key='50K' value='0.5'>500KHz</option>
              <option className='font-sans font-bold' key='1M' value='1'>1MHz</option>
              <option className='font-sans font-bold' key='2M' value='2'>2MHz</option>
              <option className='font-sans font-bold' key='3M' value='3'>3MHz</option>
              <option className='font-sans font-bold' key='7M' value='7'>7MHz</option>
              <option className='font-sans font-bold' key='10M' value='1'>10MHz</option>
              <option className='font-sans font-bold' key='18M' value='18'>18MHz</option>
            </select>
          }
        }
      }

      if( channelNumber == 'firstNet' ){
          return <tr id={index} key={index}>  
          <td className={tdClassName} ><p className='text-xs'>{channelNumber}</p></td>
          <td className={tdClassName} ><input id={'ULinput'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channelInputPower[index].ULinput/10).toString()||0} readOnly /></td>
          <td className={tdClassName} ><input id={'ULatten'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channel.ULatten/10).toString()||0} onChange={ChannelAttenChange} readOnly={autoRefresh? true:false} step='0.5' /></td>
          <td className={tdClassName} ><input id={'ULoutput'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channelInputPower[index].ULoutput/10).toString()||0} readOnly /></td>
          <td className={tdClassName} ><input id={'ULfreqInfo'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={((channel.ULfreqInfo).toFixed(6).toString())||0} readOnly onChange={ChannelFreqChange} step='0.000001' /></td>
          <td className={tdClassName} ><p id={'SleepStatus'+channelNumber} name={channelNumber} className={'w-full h-auto ' + (channelInputPower[index].sleepStatus===false ? 'bg-green-400':'bg-yellow-400')} readOnly >{channelInputPower[index].sleepStatus===false ? 'Awake':'Sleep'}</p></td>

          <td className={tdClassName} ><p className='text-xs'>{channelNumber}</p></td>
          <td className={tdClassName} ><input id={'DLinput'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channelInputPower[index].DLinput/10).toString()||0} readOnly /></td>
          <td className={tdClassName} ><input id={'DLatten'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channel.DLatten/10).toString()||0} onChange={ChannelAttenChange} readOnly={autoRefresh? true:false} step='0.5' /></td>
          <td className={tdClassName} ><input id={'DLoutput'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channelInputPower[index].DLoutput/10).toString()||0} readOnly /></td>
          <td className={tdClassName} ><input id={'DLfreqInfo'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={((channel.DLfreqInfo).toFixed(6).toString())||0} readOnly onChange={ChannelFreqChange} step='0.000001' /></td>
          <td>
            <CreateBW name={channelNumber} />
          </td>
        </tr>
      }else{
        return <tr id={index} key={index}>
          <td className={tdClassName + ' text-13px'} ><p>{'UL'+bandSelect.substring(2) + ' ' +channelNumber}</p></td>
          <td className={tdClassName} ><input id={'ULinput'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channelInputPower[index].ULinput/10).toString()||0} readOnly /></td>
          <td className={tdClassName} ><input id={'ULatten'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channel.ULatten/10).toString()||0} onChange={ChannelAttenChange} readOnly={autoRefresh? true:false} step='0.5' /></td>
          <td className={tdClassName} ><input id={'ULoutput'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channelInputPower[index].ULoutput/10).toString()||0} readOnly /></td>
          <td className={tdClassName} ><input id={'ULfreqInfo'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channel.ULfreqInfo===''?'':channel.ULfreqInfo.toString())} onChange={ChannelFreqChange} onBlur={FocusOutFreqInfo} readOnly={autoRefresh? true:false} step='0.000001' /></td>
          <td className={tdClassName} ><p id={'SleepStatus'+channelNumber} name={channelNumber} className={'w-full h-auto ' + (channelInputPower[index].sleepStatus===false ? 'bg-green-400':'bg-yellow-400')} readOnly >{channelInputPower[index].sleepStatus===false ? 'Awake':'Sleep'}</p></td>

          <td className={tdClassName + ' text-13px'} ><p>{'DL'+bandSelect.substring(2) + ' ' +channelNumber}</p></td>
          <td className={tdClassName} ><input id={'DLinput'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channelInputPower[index].DLinput/10).toString()||0} readOnly /></td>
          <td className={tdClassName} ><input id={'DLatten'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channel.DLatten/10).toString()||0} onChange={ChannelAttenChange} readOnly={autoRefresh? true:false} step='0.5' /></td>
          <td className={tdClassName} ><input id={'DLoutput'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channelInputPower[index].DLoutput/10).toString()||0} readOnly /></td>
          <td className={tdClassName} ><input id={'DLfreqInfo'+channelNumber} name={channelNumber} className={inputClassName} type='number' value={(channel.DLfreqInfo===''?'':channel.DLfreqInfo.toString())} onChange={ChannelFreqChange} onBlur={FocusOutFreqInfo} readOnly={autoRefresh? true:false} step='0.000001' /></td>
          <td>
            <CreateBW name={channelNumber}/>
          </td>
        </tr>
      }
    }else{ return null }
  })


  return (
    <div style={{display: 'flex'}}>
      <div>
        <UserNavber />
      </div>
      <div style={{width:'1030px', height:'820px', minWidth:'1030px'}}>
        <UserHeaderPage />
        <div className='w-full h-userMain font-sans font-bold text-stone-700'>
          <div className='flex h-1/16'>
            <div className='w-1/6 h-full inline-block flex items-center'>
              <select className='w-28 h-8/10 text-center text-lg border-2 border-gray-500 rounded-lg' value={bandClass} disabled={autoRefresh? true:false} onChange={classChange}>
                <option className='font-sans font-bold' key='classA' value='classA'>Class A</option>
                <option className='font-sans font-bold' key='classB' value='classB'>Class B</option>
              </select>
            </div>
            <div className="w-full h-fit flex">
              <input className="w-fit h-fit my-auto mr-2 ml-auto" style={{zoom:'1.4'}} name="autoRefresh" type='checkbox' checked={autoRefresh} onChange={autoRefreshChange} />
              <p className="w-fit h-fit text-lg font-sans font-bold text-gray-600 my-auto mr-3">Auto Refresh</p>
            </div>
          </div>

          <div className='w-full h-1/10 flex'>
            <div className='w-1/6 h-full inline-block align-bottom flex items-center'>
              <select className='w-28 h-1/2 text-center text-lg border-2 border-gray-500 rounded-lg' value={bandSelect} disabled={autoRefresh? true:false} onChange={BandSelectChange}>
                <option className='font-sans font-bold' key='PS700' value='ps700'>PS700</option>
                <option className='font-sans font-bold' key='PS800' value='ps800'>PS800</option>
              </select>
            </div>

            <div className='w-1/5 h-full flex items-center'>
              <p className='w-full h-auto text-center font-sans text-3xl font-bold text-stone-700 '>Up Link</p>
            </div>

            <div className='w-3/10 h-full flex items-center'>
              <p className='w-1/3 h-auto text-center font-sans text-2xl font-bold text-stone-600'>Custom: </p>
              <input className='w-3/10 h-1/2 border-2 border-gray-500 rounded-lg text-center mr-2' type='number' value={numberOfChannels.toString()} readOnly={autoRefresh? true:false} onKeyUp={EnterCustomApply} onChange={NumberOfChannelsChange}></input>
              <button className='w-1/3 h-1/2 text-white rounded-xl bg-indigo-500 hover:bg-indigo-900' disabled={autoRefresh? true:false} onClick={CreateChannel}>Apply</button>
            </div>

            <div className='w-1/5 h-full flex items-center'>
              <p className='w-full h-auto text-center font-sans text-3xl font-bold text-stone-700 '>Down Link</p>
            </div>
          </div>

          <div className='scroll w-full h-2/5 text-center text-sm border-l-2 border-b-2 border-gray-500 rounded-lg overflow-y-scroll'>  {/* 채널 Table */}
            <table className='w-full h-auto table-auto' >
              <thead className='w-full h-1/5'>
                <tr className='w-full h-full text-sm text-white bg-indigo-500'>
                  <th className='w-auto font-normal border-r-2 border-white rounded-tl-lg' >Channel</th>
                  <th className='w-1/10 font-normal border-r-2 border-white' >Input Power</th>
                  <th className='w-1/20 font-normal border-r-2 border-white' >Atten</th>
                  <th className='w-1/10 font-normal border-r-2 border-white' >Output Power</th>
                  <th className='w-1/10 font-normal border-r-2 border-white' >Freq.Info</th>
                  <th className='w-auto font-normal border-r-2 border-white rounded-tr-lg' >SleepStatus</th>

                  <th className='w-auto font-normal py-1.5 border-r-2 border-white rounded-tl-lg' >Channel</th>
                  <th className='w-1/10 font-normal py-1.5 border-r-2 border-white' >Input Power</th>
                  <th className='w-1/20 font-normal py-1.5 border-r-2 border-white' >Atten</th>
                  <th className='w-1/10 font-normal py-1.5 border-r-2 border-white' >Output Power</th>
                  <th className='w-1/10 font-normal py-1.5 border-r-2 border-white' >Freq.Info</th>
                  <th className='w-1/10 font-normal py-1.5 border-r-2 border-white rounded-tr-lg' >BW</th>
                </tr>
              </thead>
              <tbody id='ChannelTableBody' className='w-full h-9/10'>
                {renderCards}
                {
                  // bandSelect == 'ps800' ? (numberOfChannels > 0 ? renderCards : null) : renderCards
                }
              </tbody>
            </table>
          </div>

          <div className='w-10/12 h-auto text-center mt-5 mb-0 mx-auto border-b-2 border-gray-500 rounded-b-xl'>
            <p className='text-4xl'>NOTICE</p>
            <table className='w-full h-auto table-auto mt-2'>
                <thead className='w-full h-1/5'>
                  <tr className='w-full h-full text-white bg-indigo-500'>
                    <th className='w-1/4 font-normal py-1.5 border-r-2 border-white rounded-tl-lg'>Band</th>
                    <th className='w-1/4 font-normal py-1.5 border-r-2 border-white'>Downlink[MHz]</th>
                    <th className='w-1/4 font-normal py-1.5 border-r-2 border-white'>Uplink[MHz]</th>
                    <th className='w-1/4 font-normal py-1.5 rounded-tr-lg'>BadnWidth[MHz]</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='w-full h-full'>
                    <td className='w-auto h-auto border-b-2 border-gray-200'>firstNet</td>
                    <td className='w-auto h-auto border-b-2 border-gray-200'>758~768</td>
                    <td className='w-auto h-auto border-b-2 border-gray-200'>788~798</td>
                    <td className='w-auto h-auto border-b-2 border-gray-200'>10</td>
                  </tr>
                  <tr className='w-full h-full'>
                    <td className='w-auto h-auto border-b-2 border-gray-200'>PS700</td>
                    <td className='w-auto h-auto border-b-2 border-gray-200'>769~775</td>
                    <td className='w-auto h-auto border-b-2 border-gray-200'>799~805</td>
                    <td className='w-auto h-auto border-b-2 border-gray-200'>6</td>
                  </tr>
                  <tr className='w-full h-full'>
                    <td className='w-auto h-auto'>PS800</td>
                    <td className='w-auto h-auto'>851~869</td>
                    <td className='w-auto h-auto'>806~824</td>  
                    <td className='w-auto h-auto'>18</td>
                  </tr>

                </tbody>
            </table>                

          </div>

          <div className='w-full h-1/10 flex mt-3 mb-0'> {/* BUTTON */}
            <div className='w-1/2 h-full flex items-center ml-auto mr-0'>
              <button className='w-3/10 h-1/2 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900 mr-3' disabled={autoRefresh? true:false} onClick={SetOffClick} >Set Off</button>
              <button className='w-3/10 h-1/2 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900 mr-3' disabled={autoRefresh? true:false} onClick={ConfirmClick} >Confirm</button>
              <button className='w-3/10 h-1/2 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900' disabled={autoRefresh? true:false} onClick={RecallClick} >Recall</button>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default UserBandSelectPage