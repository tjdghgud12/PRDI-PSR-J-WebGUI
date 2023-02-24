import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminNavBarPage from '../AdminNavbarPage/AdminNavbarPage'
import { BsTable } from "react-icons/bs";
import { PowerAmpPowerTableChange } from '../../../../_reducers/PowerAmpPowerTableSlice'
// import { ErrorMessage } from '../../../Renderer/Renderer'
// const { ipcRenderer } = window.require('electron');

import { randomNumberInRange, useInterval, convertDataSerialToObject } from '../../../lib/common'

function AdminPowerAmpPowerTablePage() {
  const dispatch = useDispatch();
  const tableState = useSelector((state) => state.PowerAmpPowerTableSlice);
  const [ps700Table, setps700Table] = useState( tableState.ps700 );
  const [ps800Table, setps800Table] = useState( tableState.ps800 );
  const [psulTable, setpsulTable] = useState( tableState.psul );
  const [nowBand, setnowBand] = useState('ps700');
  const [currntVoltage, setcurrntVoltage] = useState(0);
  const [powerMin, setpowerMin] = useState(0);
  const [powerMax, setpowerMax] = useState(0);
  const [powerStep, setpowerStep] = useState(0.1)
  const [drawData, setdrawData] = useState({ max: 0, min: 0, step: 0, table: Array.from(Array(3), () => []) });
  const [refreshStac, setrefreshStac] = useState(true);

  // useEffect(() => {
    
  //   setTimeout(() => { setrefreshStac(!refreshStac); }, 1000)
  //   // output Power 값 요청해야함.
  //   let ipcData = { 
  //     command: 0x4F,
  //     numberOfCommand: 1,
  //     band: nowBand=='ps700'?0:(nowBand=='ps800'?1:2),
  //     data: []
  //   };

  //   ipcRenderer.send('SerialTransmit', ipcData);

  //   let waitStac = 0;
  //   const interval = setInterval(() => {
  //     let responseData = ipcRenderer.sendSync('SerialResponse');
  //     if( waitStac < 20 ) {
  //       waitStac++;
  //       if( responseData.flag ){
  //         clearInterval(interval);
  //         //출력 값 입력
  //         let outputPower = responseData.data[0]<<8;
  //         outputPower += responseData.data[1];
  //         setcurrntVoltage(outputPower);
  //       }
  //     }else{ clearInterval(interval); }
  //   }, 10)
  // }, [refreshStac])

  const NowBandChange = (e) => {
    setnowBand(e.target.name)
    let data, length;
    let tableAddr = 0;

    switch (e.target.name) {
      case 'ps700':
        
        setpowerMin(ps700Table.min);
        setpowerMax(ps700Table.max);
        setpowerStep(ps700Table.step);
        length = ps700Table.max==0 ? 0:(ps700Table.max-ps700Table.min)/ps700Table.step + 1;
        data = {...ps700Table, table: Array.from(Array(3), () => Array.from({length: length/3}, () => 0 ))};
        if( length%3==1 ){ data.table[0][data.table[0].length] = 0; }
        else if( length%3==2 ){ 
          data.table[0][data.table[0].length] = 0;
          data.table[1][data.table[1].length] = 0;
        }
        data.table[0].forEach((d,i) => { data.table[0][i] = ps700Table.table[tableAddr];  tableAddr++;})
        data.table[1].forEach((d,i) => { data.table[1][i] = ps700Table.table[tableAddr];  tableAddr++;})
        data.table[2].forEach((d,i) => { data.table[2][i] = ps700Table.table[tableAddr];  tableAddr++;})
        setdrawData(data);
        console.log(ps700Table);
        break;
      case 'ps800':
        setpowerMin(ps800Table.min);
        setpowerMax(ps800Table.max);
        setpowerStep(ps800Table.step);
        length = ps800Table.max==0 ? 0:(ps800Table.max-ps800Table.min)/ps800Table.step + 1;
        data = {...ps800Table, table: Array.from(Array(3), () => Array.from({length: length/3}, () => 0 ))};
        if( length%3==1 ){ data.table[0][data.table[0].length] = 0; }
        else if( length%3==2 ){ 
          data.table[0][data.table[0].length] = 0;
          data.table[1][data.table[1].length] = 0;
        }
        data.table[0].forEach((d,i) => { data.table[0][i] = ps800Table.table[tableAddr];  tableAddr++;})
        data.table[1].forEach((d,i) => { data.table[1][i] = ps800Table.table[tableAddr];  tableAddr++;})
        data.table[2].forEach((d,i) => { data.table[2][i] = ps800Table.table[tableAddr];  tableAddr++;})
        setdrawData(data);
        
        break;
      case 'psul':
        setpowerMin(psulTable.min);
        setpowerMax(psulTable.max);
        setpowerStep(psulTable.step);
        length = ps800Table.max==0 ? 0:(psulTable.max-psulTable.min)/psulTable.step + 1;
        data = {...psulTable, table: Array.from(Array(3), () => Array.from({length: length/3}, () => 0 ))};
        if( length%3==1 ){ data.table[0][data.table[0].length] = 0; }
        else if( length%3==2 ){ 
          data.table[0][data.table[0].length] = 0;
          data.table[1][data.table[1].length] = 0;
        }
        data.table[0].forEach((d,i) => { data.table[0][i] = psulTable.table[tableAddr];  tableAddr++;})
        data.table[1].forEach((d,i) => { data.table[1][i] = psulTable.table[tableAddr];  tableAddr++;})
        data.table[2].forEach((d,i) => { data.table[2][i] = psulTable.table[tableAddr];  tableAddr++;})
        setdrawData(data);

        break;
    
      default:
        break;
    }
  }

  const CreatePowerTable = (e) => {
    let length = ((powerMax-powerMin)/powerStep)+1;
    length = Math.floor(length);
    let data = Array.from(Array(3), () => Array.from({length: length/3}, () => 0 ));
    if( length%3==1 ){ data[0][data[0].length] = 0; }
    else if( length%3==2 ){ 
      data[0][data[0].length] = 0;
      data[1][data[1].length] = 0;
     }

    switch (nowBand) {
      case 'ps700':
        if( ps700Table[0]!=undefined ){ 
          data[0].forEach((d,i) => { if( i < ps700Table.table.length ){data[0][i] = ps700Table.table[i];} });
          data[1].forEach((d,i) => { if( (i+((length/3)+1)) < ps700Table.table.length ){data[1][i] = ps700Table.table[i+((length/3)+1)];} });
          data[2].forEach((d,i) => { if( (i+(((length>>1)/3)+1)) < ps700Table.table.length ){data[2][i] = ps700Table.table[i+(((length>>1)/3)+1)];} });
        }else{
          setps700Table({ max: powerMax, min: powerMin, step: powerStep, table: Array.from({length: length}, () => 0 ) })
        }
        setdrawData( {max: powerMax, min: powerMin, step: powerStep, table: data} );
        
        break;
      case 'ps800':
        if( ps800Table[0]!=undefined ){ 
          data[0].forEach((d,i) => { if( i < ps800Table.table.length ){data[0][i] = ps800Table.table[i];} });
          data[1].forEach((d,i) => { if( (i+((length/3)+1)) < ps800Table.table.length ){data[1][i] = ps800Table.table[i+((length/3)+1)];} });
          data[2].forEach((d,i) => { if( (i+(((length>>1)/3)+1)) < ps800Table.table.length ){data[2][i] = ps800Table.table[i+(((length>>1)/3)+1)];} });
        }else{
          setps800Table({ max: powerMax, min: powerMin, step: powerStep, table: Array.from({length: length}, () => 0 ) })
        }
        setdrawData( {max: powerMax, min: powerMin, step: powerStep, table: data} );
        
        break;
      case 'psul':
        if( psulTable[0]!=undefined ){ 
          data[0].forEach((d,i) => { if( i < psulTable.table.length ){data[0][i] = psulTable.table[i];} });
          data[1].forEach((d,i) => { if( (i+((length/3)+1)) < psulTable.table.length ){data[1][i] = psulTable.table[i+((length/3)+1)];} });
          data[2].forEach((d,i) => { if( (i+(((length>>1)/3)+1)) < psulTable.table.length ){data[2][i] = psulTable.table[i+(((length>>1)/3)+1)];} });
        }else{
          setpsulTable({ max: powerMax, min: powerMin, step: powerStep, table: Array.from({length: length}, () => 0 ) })
        }
        setdrawData( {max: powerMax, min: powerMin, step: powerStep, table: data} );
        
        break;
    
      default:
        break;
    } 
  }

  const PowerMaxChange = (e) => {
    if( e.target.value > 100 ){ e.target.value = 100; }
    else if( e.target.value < 0 ){ e.target.value = 0 }
    var pattern2 = /^\d*[.]\d{2}$/;       // 소수점 한자리까지만 적용
    if( pattern2.test(e.target.value) ){
      e.target.value = Number(e.target.value).toFixed(1);
    }
    setpowerMax(e.target.value)
  }
  const PowerMinChange = (e) => {
    if( e.target.value > 100 ){ e.target.value = 100; }
    else if( e.target.value < 0 ){ e.target.value = 0 }
    var pattern2 = /^\d*[.]\d{2}$/;       // 소수점 한자리까지만 적용
    if( pattern2.test(e.target.value) ){
      e.target.value = Number(e.target.value).toFixed(1);
    }
    setpowerMin(e.target.value)
  }
  const PowerStepChange = (e) => {
    if( e.target.value > 10 ){ e.target.value = 10; }
    else if( e.target.value < 0 ){ e.target.value = 0 }
    var pattern2 = /^\d*[.]\d{2}$/;       // 소수점 한자리까지만 적용
    if( pattern2.test(e.target.value) ){
      e.target.value = Number(e.target.value).toFixed(1);
    }
    setpowerStep(e.target.value)
  }

  const TableValueChange = (e) => {
    if( e.target.value > 65535 ){ e.target.value = 65535; }
    else if( e.target.value < 0 ){ e.target.value = 0 }
    e.target.value = (e.target.value*1).toFixed(0)
    
    let data, data2, length, addr1, addr2, table;

    switch (nowBand) {
      case 'ps700':
        table = [...ps700Table.table];
        table[e.target.name] = Number(e.target.value);
        data2 = {...ps700Table, table: table};
        setps700Table(data2);
        data = {...drawData};
        length = (data.max-data.min)/data.step+1;
        addr1 = Math.floor(e.target.name/(length/3));
        addr2 = Math.floor(e.target.name%(length/3));
        data.table[addr1][addr2] = e.target.value;
        setdrawData(data);

        break;
      case 'ps800':
        table = [...ps800Table.table];
        table[e.target.name] = Number(e.target.value);
        data2 = {...ps800Table, table:table};
        setps800Table(data2);
        data = {...drawData};
        length = (data.max-data.min)/data.step+1;
        addr1 = Math.floor(e.target.name/(length/3));
        addr2 = Math.floor(e.target.name%(length/3));
        data.table[addr1][addr2] = e.target.value;
        setdrawData(data);
        
        break;
      case 'psul':
        table = [...psulTable.table];
        table[e.target.name] = Number(e.target.value);
        data2 = {...psulTable, table:table};
        setpsulTable(data2);
        data = {...drawData};
        length = (data.max-data.min)/data.step+1;
        addr1 = Math.floor(e.target.name/(length/3));
        addr2 = Math.floor(e.target.name%(length/3));
        data.table[addr1][addr2] = e.target.value;
        setdrawData(data);
        
        break;
    
      default:
        break;
    }
  }

  
  const SpreadClick = () =>{
    let arrayLength = ((powerMax-powerMin)/powerStep)+1;

    let checkedAddress = [];
    let tableValue = [];
    let draw = {...drawData};
    for (let i = 0; i < arrayLength; i++) {
      if(document.getElementById('checkBox'+i).checked){
        checkedAddress = checkedAddress.concat(i);
      }
    }
    tableValue = tableValue.concat(drawData.table[0]);
    tableValue = tableValue.concat(drawData.table[1]);
    tableValue = tableValue.concat(drawData.table[2]);

    for(let i=0; i<checkedAddress.length-1; i++){
      let lengthBetweenChecked = checkedAddress[i+1]-checkedAddress[i]; // 두 위치 사이의 테이블 값의 갯수 확인
      let step = Number(tableValue[checkedAddress[i+1]]-tableValue[checkedAddress[i]]) / lengthBetweenChecked;  // 두 값간의 step구하기
      console.log('step : ', step)

      for(let j=0; j<lengthBetweenChecked+1; j++){
        tableValue[j+checkedAddress[i]] = Math.round(Number(tableValue[checkedAddress[i]]+(step*j)));
      }
    }
    console.log(tableValue);

    // draw형태로 복원 필요.
    let addr = 0;
    draw.table.forEach((d,i) => { 
      draw.table[i].forEach((d,j) => {
        draw.table[i][j] = tableValue[addr];  addr++;
      })
    })
    setdrawData(draw);

    let data;
    switch (nowBand) {
      case 'ps700':
        data = {...ps700Table};
        data.table = tableValue;
        setps700Table(data);
        break;
      case 'ps800':
        data = {...ps800Table};
        data.table = tableValue;
        setps800Table(data);
        break;
      case 'psul':
        data = {...psulTable};
        data.table = tableValue;
        setpsulTable(data);
        break;
    
      default:
        break;
    }    

    console.log(checkedAddress);
    console.log(data);
    // console.log(checkedAddress);
    // console.log(draw);
  }
  const ResetClick = () =>{
    // 모든값 초기화
    let draw = {...drawData};
    let data;

    draw.table.forEach((d,i) => { draw.table[i].forEach((d,j) => {draw.table[i][j] = 0;})})
    setdrawData(draw);
    switch (nowBand) {
      case 'ps700':
        data = {...ps700Table};
        data.table.forEach((d,i) => { data.table[i] = 0; });
        setps700Table(data);
        console.log(ps700Table);
        break;
      case 'ps800':
        data = {...ps800Table};
        data.table.forEach((d,i) => { data.table[i] = 0; });
        setps800Table(data);
        console.log(ps800Table);
        break;
    case 'psul':
        data = {...psulTable};
        data.table.forEach((d,i) => { data.table[i] = 0; });
        setpsulTable(data);
        console.log(psulTable);
        break;
    
      default:
        break;
    }
  }
  
  const processOfResponseDataSet = (responseData) => {
    console.log("processOfResponseDataSet's responseData.command is ===> ", responseData.command)
    if(responseData.command === 0x11) {   // 0x11 is 17 : 정상처리 수신커맨드..
      // 일단 비워둠..
    }
    switch (nowBand) {
      case 'ps700':
        dispatch(PowerAmpPowerTableChange({ name: nowBand, value: ps700Table }));
        console.log('ps700 : ', ps700Table);
        break;
      case 'ps800':
        dispatch(PowerAmpPowerTableChange({ name: nowBand, value: ps800Table }));
        console.log('ps800 : ', ps800Table);
        break;
      case 'psul':
        dispatch(PowerAmpPowerTableChange({ name: nowBand, value: psulTable }));
        console.log('psul : ', psulTable);
        break;
    
      default:
        break;
    }
  }
  const processOfResponseDataGet = (responseData) => {
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
    setpowerMax(max);
    setpowerMin(min);
    setpowerStep(step);
    
    let tableLength = max==0 ? 0:(max-min)/step+1;
    let draw = { 
      max: max, 
      min: min, 
      step: step, 
      table: Array.from(Array(3), () => Array.from({length: tableLength/3}, () => 0 ))
    }
    if( tableLength%3==1 ){ draw.table[0][draw.table[0].length] = 0; }
    else if( tableLength%3==2 ){ 
      draw.table[0][draw.table[0].length] = 0;
      draw.table[1][draw.table[1].length] = 0;
    }
    
    draw.table.forEach((d,i) => { 
      draw.table[i].forEach((d,j) => {
        draw.table[i][j] = (responseData.data[addr]<<8);  addr++;
        draw.table[i][j] += responseData.data[addr];  addr++;
      })
    })
    setdrawData(draw);
    addr = 5;
    switch (responseData.band) {
      case 0:
        data = {max: max, min: min, step: step, table: Array.from({length:tableLength}, () => 0)};
        data.table.forEach((d,i) => { 
          data.table[i] = (responseData.data[addr]<<8);  addr++;
          data.table[i] += responseData.data[addr];  addr++;
        });
        console.log(data.table);
        setps700Table(data);
        
        break;
      case 1:
        data = {max: max, min: min, step: step, table: Array.from({length:tableLength}, () => 0)};
        data.table.forEach((d,i) => { 
          data.table[i] = (responseData.data[addr]<<8);  addr++;
          data.table[i] += responseData.data[addr];  addr++;
        });
        setps800Table(data);
        
        break;
      case 2:
        data = {max: max, min: min, step: step, table: Array.from({length:tableLength}, () => 0)};
        data.table.forEach((d,i) => { 
          data.table[i] = (responseData.data[addr]<<8);  addr++;
          data.table[i] += responseData.data[addr];  addr++;
        });
        setpsulTable(data);
        
        break;
    
      default:
        break;
    }
  }
  const processOfResponseDataGetCurrentVoltage = (responseData) => {
    let outputPower = responseData.data[0]<<8;
    outputPower += responseData.data[1];
    setcurrntVoltage(outputPower);
  }
  const postSerialCommunication = async(ipcData, act) => {
    try {
      const datas = { ipcData: ipcData }
			const res = await fetch("/api/serialCommunication", {
				timeout: 10000,		// 10초 타임아웃 제한..
        method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
        const result = await res.json()
				const responseData = result.result
        console.log("http okay ==> ", res.status, result, responseData)
				// 받아온 결과값들 가지고 처리하는 async/await 함수 넣어줄것..
        if(act === "set") processOfResponseDataSet(convertDataSerialToObject(responseData))
        else if(act === "get") processOfResponseDataGet(convertDataSerialToObject(responseData))
        else if(act === "getCurrentVoltage") processOfResponseDataGetCurrentVoltage(convertDataSerialToObject(responseData))
        
      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }
  const ConfirmClick = async() =>{
    let addr = 0;
    let ipcData = { 
      command: 0x09,
      numberOfCommand: 1,
      band: 0,
      data: []
    };
    
    if(nowBand == 'ps700'){ 
      ipcData.band = 0; 
      ipcData.data[addr] = ((ps700Table.max*10)>>8)&0xFF;   addr++;
      ipcData.data[addr] = (ps700Table.max*10)&0xFF;   addr++;
      ipcData.data[addr] = ((ps700Table.min*10)>>8)&0xFF;   addr++;
      ipcData.data[addr] = (ps700Table.min*10)&0xFF;   addr++;
      ipcData.data[addr] = ps700Table.step*10;   addr++;
      ps700Table.table.map((d,i) => { 
        ipcData.data[addr] = (d>>8)&0xFF;    addr++;
        ipcData.data[addr] = d&0xFF;         addr++;
      }) 
    }
    else if(nowBand == 'ps800'){ 
      ipcData.band = 1; 
      ipcData.data[addr] = ((ps800Table.max*10)>>8)&0xFF;   addr++;
      ipcData.data[addr] = (ps800Table.max*10)&0xFF;   addr++;
      ipcData.data[addr] = ((ps800Table.min*10)>>8)&0xFF;   addr++;
      ipcData.data[addr] = (ps800Table.min*10)&0xFF;   addr++;
      ipcData.data[addr] = ps800Table.step*10;   addr++;
      ps800Table.table.map((d,i) => { 
        ipcData.data[addr] = (d>>8)&0xFF;    addr++;
        ipcData.data[addr] = d&0xFF;         addr++;
      }) 
    }
    else if(nowBand == 'psul'){ 
      ipcData.band = 2; 
      ipcData.data[addr] = ((psulTable.max*10)>>8)&0xFF;   addr++;
      ipcData.data[addr] = (psulTable.max*10)&0xFF;   addr++;
      ipcData.data[addr] = ((psulTable.min*10)>>8)&0xFF;   addr++;
      ipcData.data[addr] = (psulTable.min*10)&0xFF;   addr++;
      ipcData.data[addr] = psulTable.step*10;   addr++;
      psulTable.table.map((d,i) => { 
        ipcData.data[addr] = (d>>8)&0xFF;    addr++;
        ipcData.data[addr] = d&0xFF;         addr++;
      }) 
    }
    // ipcRenderer.send('SerialTransmit', ipcData);
    // pakt87
    await postSerialCommunication(ipcData, "set")
    
  }

  const RecallClick = async() =>{
    let ipcData = { 
      command: 0x48,
      numberOfCommand: 1,
      band: nowBand=='ps700'?0:(nowBand=='ps800'?1:2),
      data: []
    };

    // ipcRenderer.send('SerialTransmit', ipcData);
    // pakt87
    await postSerialCommunication(ipcData, "get")

    /***************************** *
    let waitStac = 0;
    const interval = setInterval(() => {
      let responseData = ipcRenderer.sendSync('SerialResponse');
      if( waitStac < 20 ) {
        waitStac++;
        if( responseData.flag ){
          clearInterval(interval);
          let data;
          let addr = 0;
          let max, min, step;

          max = responseData.data[addr];  addr++;
          max += responseData.data[addr];  addr++;
          min = responseData.data[addr];  addr++;
          min += responseData.data[addr];  addr++;
          step = responseData.data[addr];  addr++;

          max = max/10;
          min = min/10;
          step = step/10;
          setpowerMax(max);
          setpowerMin(min);
          setpowerStep(step);
          
          let tableLength = max==0 ? 0:(max-min)/step+1;
          let draw = { 
            max: max, 
            min: min, 
            step: step, 
            table: Array.from(Array(3), () => Array.from({length: tableLength/3}, () => 0 ))
          }
          if( tableLength%3==1 ){ draw.table[0][draw.table[0].length] = 0; }
          else if( tableLength%3==2 ){ 
            draw.table[0][draw.table[0].length] = 0;
            draw.table[1][draw.table[1].length] = 0;
          }
          
          draw.table.forEach((d,i) => { 
            draw.table[i].forEach((d,j) => {
              draw.table[i][j] = responseData.data[addr];  addr++;
              draw.table[i][j] += responseData.data[addr];  addr++;
            })
          })
          setdrawData(draw);
          addr = 5;
          switch (responseData.band) {
            case 0:
              data = {max: max, min: min, step: step, table: Array.from({length:tableLength}, () => 0)};
              data.table.forEach((d,i) => { 
                data.table[i] = responseData.data[addr];  addr++;
                data.table[i] += responseData.data[addr];  addr++;
              });
              console.log(data.table);
              setps700Table(data);
              
              break;
            case 1:
              data = {max: max, min: min, step: step, table: Array.from({length:tableLength}, () => 0)};
              data.table.forEach((d,i) => { 
                data.table[i] = responseData.data[addr];  addr++;
                data.table[i] += responseData.data[addr];  addr++;
              });
              setps800Table(data);
              
              break;
            case 2:
              data = {max: max, min: min, step: step, table: Array.from({length:tableLength}, () => 0)};
              data.table.forEach((d,i) => { 
                data.table[i] = responseData.data[addr];  addr++;
                data.table[i] += responseData.data[addr];  addr++;
              });
              setpsulTable(data);
              
              break;
          
            default:
              break;
          }
        }
      }else{
        clearInterval(interval);
        ErrorMessage( 'Table Recall Error', "can't Recall Data from MCU");
      }
    }, 100)
    /***************************** */

  }
  const RecallCurrentVoltage = async() => {
    // output Power 값 요청해야함.
    let ipcData = { 
      command: 0x4F,
      numberOfCommand: 1,
      band: nowBand=='ps700'?0:(nowBand=='ps800'?1:2),
      data: []
    };
    // ipcRenderer.send('SerialTransmit', ipcData);
    // pakt87
    await postSerialCommunication(ipcData, "getCurrentVoltage")
  }

  const renderCards = drawData.table.map((d, i) => {
    let rounded
    if( i==0 ){ rounded = 'rounded-tl-xl '; }
    else if( i==2 ){ rounded = 'rounded-tr-xl '; }
    let tableBgColor = (d.length%2==0) ? ' bg-indigo-50 ':' bg-white ';

    const secondDraw = d.map((v, j) => {
      let bgColor =  j%2 ? 'bg-indigo-50 ':'bg-white ';
      let bottomRounded = j==(d.length-1) ?'rounded-b-xl':'';
      let name = ((i*d.length)+j);
      
      if(i == 1){
        if( drawData.table[0].length != drawData.table[1].length ){ name++; }
      }else if( i == 2 ){
        if( drawData.table[0].length != drawData.table[2].length ){ name++; }
        if( drawData.table[1].length != drawData.table[2].length ){ name++; }
      }
      let power = Number(drawData.min)
      power += (drawData.step*name)
      
      return <div className={"w-full h-7 flex " + bgColor + bottomRounded} key={j+i}>
        <div className="w-1/2 h-full flex">
          <input 
            id={"checkBox" + name}
            name={name} 
            className="w-1/4 h-fit my-auto ml-auto" 
            type={'checkbox'} />
          <p className="w-fit h-fit font-bold text-center my-auto mr-auto">{power.toFixed(1)}</p>
        </div>
        <div className="w-1/2 h-fit m-auto">
          <div className="w-3/4 h-fit mx-auto">
            <input name={name} 
              className={"w-full h-fit text-center font-semibold " + bgColor }
              type={'number'}
              value={v||0}
              onChange={TableValueChange} />
          </div>
        </div>
      </div>
    })

    return <div className={"w-1/3 h-fit " + rounded + tableBgColor} key={'flexBox'+i}>
      <div className={"w-full h-fit bg-indigo-900 text-white text-center " + (i==2?'rounded-tr-lg':null)}>
        <div className="w-4/5 h-fit flex mx-auto">
          <p className="w-1/2 h-fit">Power(dBm)</p>
          <p className="w-1/2 h-fit">Voltage</p>
        </div>
      </div>
      <div className="w-full h-fit " >
        {secondDraw}
      </div>
      
    </div>
  })


  /*******************************************************
	* useInterval 타이머 사용 ...
	*******************************************************/
	useInterval(() => {
		// Your custom logic here
    console.log("interval...")
		RecallCurrentVoltage()
    
	}, 1500);



  return (
    <div className="flex">
      <div> {/* NavBar */}
        <AdminNavBarPage />
      </div>
      <div style={{ width: "1030px", height: "100vh" }}>
        <div className="w-full h-1/10 flex font-sans font-bold">   {/* Header */}
          <BsTable className='text-gray-700 my-auto mr-5' size={50} />
          <p className="w-fit h-fit text-gray-700 text-4xl my-auto">Power Amp Output Power Table</p>
        </div>

        <div className="w-full h-userMain">   {/* body */}
          <div className="w-full h-1/20">
            <button id="ps700Button"
              className={'w-1/10 h-full text-white text-sm rounded-tl-xl hover:bg-indigo-900' + (nowBand=='ps700'?' bg-indigo-900':' bg-indigo-500') }
              name="ps700"
              onClick={NowBandChange}
              >PS700+FirstNet</button>
            <button id="ps800Button" 
              className={'w-1/10 h-full text-white text-sm hover:bg-indigo-900' + (nowBand=='ps800'?' bg-indigo-900':' bg-indigo-500') }
              name="ps800"
              onClick={NowBandChange}
              >PS800</button>
            <button id="psulButton" 
              className={'w-1/10 h-full text-white text-sm rounded-tr-xl hover:bg-indigo-900' + (nowBand=='psul'?' bg-indigo-900':' bg-indigo-500') }
              name="psul"
              onClick={NowBandChange}
              >UL</button>
          </div>
          <div className="w-full h-1/8 border">
            <div className="w-full h-1/2 font-sans font-semibold flex">
              <p className="w-fit h-fit text-lg text-gray-700 mr-4 my-auto ml-auto">Currnt Voltage: </p>
              <input className="w-1/6 h-fit text-center border-b-2 border-gray-500 my-auto mr-auto"
                type={'number'}
                readOnly
                value={currntVoltage}
              />
            </div>
            <div className="w-full h-1/2 font-sans font-semibold text-center flex">
              <div className="w-1/5 h-fit my-auto flex mr-10 ml-auto">
                <p className="w-fit h-fit mr-4">Max: </p>
                <input className="w-4/5 h-fit text-center border-b-2 border-gray-500" 
                  type={'number'}
                  value={powerMax}
                  onChange={PowerMaxChange}
                />
              </div>
              <div className="w-1/5 h-fit my-auto flex mr-10">
                <p className="w-fit h-fit mr-4">Min: </p>
                <input className="w-4/5 h-fit text-center border-b-2 border-gray-500" 
                  type={'number'}
                  value={powerMin}
                  onChange={PowerMinChange}
                />
              </div>
              <div className="w-1/5 h-fit my-auto flex mr-10">
                <p className="w-fit h-fit mr-4">Step: </p>
                <input className="w-4/5 h-fit text-center border-b-2 border-gray-500" 
                  type={'number'}
                  value={powerStep}
                  step={0.1}
                  onChange={PowerStepChange}
                />
              </div>
              <button className="w-32 h-8 text-white text-lg text-center rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-auto"
                onClick={CreatePowerTable}
              >Apply</button>

            </div>

          </div>

          <div className="scroll overflow-y-scroll w-full h-1/2 border-b-2 border-gray-500 rounded-xl">
            <div className="w-full h-fit flex">
              {renderCards}
            </div>
          </div>
          <div className="w-3/5 h-fit mt-3 mr-0 ml-auto"> {/* button */}
              <div className="w-fit h-fit mr-0 ml-auto">
                <button className="w-24 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={SpreadClick}>Spread</button>
                <button className="w-24 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={ConfirmClick}>Confirm</button>
                <button className="w-24 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={ResetClick}>Reset</button>
                <button className="w-24 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={RecallClick}>Recall</button>  
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPowerAmpPowerTablePage