import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminNavBarPage from '../AdminNavbarPage/AdminNavbarPage'
import { BsTable } from "react-icons/bs";
import { AttenTableChange } from '../../../../_reducers/AttenTableSlice'
// import { ErrorMessage } from '../../../Renderer/Renderer'
// const { ipcRenderer } = window.require('electron');

import { randomNumberInRange, useInterval, convertDataSerialToObject } from '../../../lib/common'

function AdminAttenTablePage() {
  const dispatch = useDispatch();
  const tableState = useSelector((state) => state.AttenTableSlice);
  const [ps700Table, setps700Table] = useState(tableState.ps700);
  const [ps800Table, setps800Table] = useState(tableState.ps800);
  const [psulTable, setpsulTable] = useState(tableState.psul);
  const [nowBand, setnowBand] = useState('ps700');
  const [nowAtten, setnowAtten] = useState(0);
  const [offset, setoffset] = useState(0);
  const [drawData, setdrawData] = useState(Array.from(Array(4), () => Array.from({length: 16}, () => 0 )));


  const NowAttenChange = (e) => {
    setnowAtten(e.target.name)
    let data = Array.from(Array(4), () => Array.from({length: 16}, () => 0 ));
    switch (nowBand) {
      case 'ps700':
        data[0].forEach((d,i) => { data[0][i] = ps700Table[e.target.name][i]; })
        data[1].forEach((d,i) => { data[1][i] = ps700Table[e.target.name][i+16]; })
        data[2].forEach((d,i) => { data[2][i] = ps700Table[e.target.name][i+32]; })
        data[3].forEach((d,i) => { data[3][i] = ps700Table[e.target.name][i+48]; })
        setdrawData(data);
        break;
      case 'ps800':
        data[0].forEach((d,i) => { data[0][i] = ps800Table[e.target.name][i]; })
        data[1].forEach((d,i) => { data[1][i] = ps800Table[e.target.name][i+16]; })
        data[2].forEach((d,i) => { data[2][i] = ps800Table[e.target.name][i+32]; })
        data[3].forEach((d,i) => { data[3][i] = ps800Table[e.target.name][i+48]; })
        setdrawData(data);
        break;
      case 'psul':
        data[0].forEach((d,i) => { data[0][i] = psulTable[e.target.name][i]; })
        data[1].forEach((d,i) => { data[1][i] = psulTable[e.target.name][i+16]; })
        data[2].forEach((d,i) => { data[2][i] = psulTable[e.target.name][i+32]; })
        data[3].forEach((d,i) => { data[3][i] = psulTable[e.target.name][i+48]; })
        setdrawData(data);
        break;
    
      default:
        break;
    }
  }

  const NowBandChange = (e) => {
    setnowBand(e.target.name)
    let data = Array.from(Array(4), () => Array.from({length: 16}, () => 0 ));

    switch (e.target.name) {
      case 'ps700':
        data[0].forEach((d,i) => { data[0][i] = ps700Table[nowAtten][i]; })
        data[1].forEach((d,i) => { data[1][i] = ps700Table[nowAtten][i+16]; })
        data[2].forEach((d,i) => { data[2][i] = ps700Table[nowAtten][i+32]; })
        data[3].forEach((d,i) => { data[3][i] = ps700Table[nowAtten][i+48]; })
        setdrawData(data);
        break;
      case 'ps800':
        data[0].forEach((d,i) => { data[0][i] = ps800Table[nowAtten][i]; })
        data[1].forEach((d,i) => { data[1][i] = ps800Table[nowAtten][i+16]; })
        data[2].forEach((d,i) => { data[2][i] = ps800Table[nowAtten][i+32]; })
        data[3].forEach((d,i) => { data[3][i] = ps800Table[nowAtten][i+48]; })
        setdrawData(data);
        break;
      case 'psul':
        data[0].forEach((d,i) => { data[0][i] = psulTable[nowAtten][i]; })
        data[1].forEach((d,i) => { data[1][i] = psulTable[nowAtten][i+16]; })
        data[2].forEach((d,i) => { data[2][i] = psulTable[nowAtten][i+32]; })
        data[3].forEach((d,i) => { data[3][i] = psulTable[nowAtten][i+48]; })
        setdrawData(data);
        break;
    
      default:
        break;
    }
  }

  const TableValueChange = (e) => {
    if( e.target.value != '' ){
      if( e.target.value > 10 ){ e.target.value = 10; }
      else if( e.target.value < -10 ){ e.target.value = -10 }
      e.target.value = Number((e.target.value/0.5).toFixed(0)*0.5).toFixed(1).toString();
      e.target.value = e.target.value*10;
    }

    let draw, tableData, secondTableData;
    switch (nowBand) {
      case 'ps700':
        tableData = [...ps700Table];
        secondTableData = [...tableData[nowAtten]];
        secondTableData[e.target.name] = e.target.value;
        tableData[nowAtten] = secondTableData;
        setps700Table(tableData);
        draw = [...drawData];
        draw[Math.floor(e.target.name/16)][e.target.name%16] = e.target.value;
        setdrawData(draw);

        break;
      case 'ps800':
        tableData = [...ps800Table];
        secondTableData = [...tableData[nowAtten]];
        secondTableData[e.target.name] = e.target.value;
        tableData[nowAtten] = secondTableData;
        setps800Table(tableData);
        draw = [...drawData];
        draw[Math.floor(e.target.name/16)][e.target.name%16] = e.target.value;
        setdrawData(draw);
        
        break;
      case 'psul':
        tableData = [...psulTable];
        secondTableData = [...tableData[nowAtten]];
        secondTableData[e.target.name] = e.target.value;
        tableData[nowAtten] = secondTableData;
        setpsulTable(tableData);
        draw = [...drawData];
        draw[Math.floor(e.target.name/16)][e.target.name%16] = e.target.value;
        setdrawData(draw);
        
        break;
    
      default:
        break;
    }
  }

  const OffsetChange = (e) => {
    if( e.target.value > 10 ){ e.target.value = 10; }
    else if( e.target.value < -10 ){ e.target.value = -10 }
    e.target.value = Number((e.target.value/0.5).toFixed(0)*0.5).toFixed(1);
    setoffset(Number(e.target.value*10));
  }

  const OffsetApplyClick = () =>{
    let ps700 = [...ps700Table];
    let ps800 = [...ps800Table];
    let psul = [...psulTable];
    let draw = [...drawData];
    let tableData

    switch (nowBand) {
      case 'ps700':
        tableData = [...ps700[nowAtten]]
        tableData.forEach((d,j) => { 
          if( offset > 0 ){
            if((d+offset) < 100) { tableData[j] = d+offset;  }
            else{ tableData[j] = 100; }
          }else{
            if((d+offset) > -100) { tableData[j] = d+offset; }
            else{ tableData[j] = -100; }
          }
        })
        ps700[nowAtten] = tableData;
        setps700Table(ps700);
        break;

      case 'ps800':
        tableData = [...ps800[nowAtten]]
        tableData.forEach((d,j) => { 
          if( offset > 0 ){
            if((d+offset) < 100) { tableData[j] = d+offset;  }
            else{ tableData[j] = 100; }
          }else{
            if((d+offset) > -100) { tableData[j] = d+offset; }
            else{ tableData[j] = -100; }
          }
        })
        ps800[nowAtten] = tableData;
        setps800Table(ps800);
        
        break;

      case 'psul':
        tableData = [...psul[nowAtten]]
        tableData.forEach((d,j) => { 
          if( offset > 0 ){
            if((d+offset) < 100) { tableData[j] = d+offset;  }
            else{ tableData[j] = 100; }
          }else{
            if((d+offset) > -100) { tableData[j] = d+offset; }
            else{ tableData[j] = -100; }
          }
        })
        psul[nowAtten] = tableData;
        setpsulTable(psul);
        break;
    
      default:
        break;
    }

    // ps700.forEach((d,i) => { 
    //   let secondTableData = [...d]
    //   secondTableData.forEach((d,j) => { 
    //     if( offset > 0 ){
    //       if((d+offset) < 100) { secondTableData[j] = d+offset;  }
    //       else{ secondTableData[j] = 100; }
    //     }else{
    //       if((ps700[i][j]+offset) > -100) { secondTableData[j] = d+offset; }
    //       else{ secondTableData[j] = -100; }
    //     }
    //   })
    //   ps700[i] = secondTableData;
    // })

    // ps800.forEach((d,i) => { 
    //   let secondTableData = [...d]
    //   secondTableData.forEach((d,j) => { 
    //     if( offset > 0 ){
    //       if((d+offset) < 100) { secondTableData[j] = d+offset;  }
    //       else{ secondTableData[j] = 100; }
    //     }else{
    //       if((ps700[i][j]+offset) > -100) { secondTableData[j] = d+offset; }
    //       else{ secondTableData[j] = -100; }
    //     }
    //   })
    //   ps800[i] = secondTableData;  
    // })

    // psul.forEach((d,i) => { 
    //   let secondTableData = [...d]
    //   secondTableData.forEach((d,j) => { 
    //     if( offset > 0 ){
    //       if((d+offset) < 100) { secondTableData[j] = d+offset;  }
    //       else{ secondTableData[j] = 100; }
    //     }else{
    //       if((ps700[i][j]+offset) > -100) { secondTableData[j] = d+offset; }
    //       else{ secondTableData[j] = -100; }
    //     }
    //   })
    //   psul[i] = secondTableData;
    // })

    draw.forEach((d,i) => { draw[i].forEach((d,j) => {
      if(offset > 0){
        if((draw[i][j]+offset) < 100){ draw[i][j] += offset; }
        else{ draw[i][j] = 100; }  
      }else{
        if((draw[i][j]+offset) > -100){ draw[i][j] += offset; }
        else{ draw[i][j] = -100; }
      }
    })})

    // setps700Table(ps700);
    // setps800Table(ps800);
    // setpsulTable(psul);
    setdrawData(draw);
  }



  const SpreadClick = () =>{
    let checkedAddress = [];
    let tableValue = [];
    let draw = [...drawData];
    for (let i = 0; i < 64; i++) {
      tableValue[i] = Number(drawData[Math.floor(i/16)][i%16]);
      if(document.getElementById('checkBox'+i).checked){
        checkedAddress = checkedAddress.concat(i);
      }
    }

    for(let i=0; i<checkedAddress.length-1; i++){
      // 체크박스 사이에 몇개의 데이터가 있는지 확인
      let lengthBetweenChecked = checkedAddress[i+1]-checkedAddress[i]; // 두 위치 사이의 테이블 값 수 확인
      let step = (tableValue[checkedAddress[i+1]]-tableValue[checkedAddress[i]]) / lengthBetweenChecked;  // 두 값간의 step구하기
      //console.log('step : ', step)

      for(let j=0; j<lengthBetweenChecked; j++){
        tableValue[j+checkedAddress[i]] = tableValue[checkedAddress[i]]+(step*j);
        tableValue[j+checkedAddress[i]] = ((tableValue[j+checkedAddress[i]]/5).toFixed(0)*5);
      }  
    }

    // draw형태로 복원 필요.
    draw.forEach((d,i) => { 
      draw[i].forEach((d,j) => {
        draw[i][j] = tableValue[(i*16)+j];
      })
    })
    setdrawData(draw);

    let data;
    switch (nowBand) {
      case 'ps700':
        data = [...ps700Table];
        data[nowAtten] = tableValue;
        setps700Table(data);
        break;
      case 'ps800':
        data = [...ps800Table];
        data[nowAtten] = tableValue;
        setps800Table(data);
        break;
      case 'psul':
        data = [...psulTable];
        data[nowAtten] = tableValue;
        setpsulTable(data);
        break;
    
      default:
        break;
    }    

    console.log(checkedAddress);
    console.log(data);
  }

  const ResetClick = () =>{
    // 모든값 초기화
    let draw = [...drawData];
    let data;
    draw.forEach((d,i) => { draw[i].forEach((d,j) => {draw[i][j] = 0;})})
    setdrawData(draw);
    switch (nowBand) {
      case 'ps700':
        data = [...ps700Table];
        data[nowAtten].forEach((d,i) => { data[nowAtten][i] = 0; });
        setps700Table(data);
        console.log(ps700Table);
        break;
      case 'ps800':
        data = [...ps800Table];
        data[nowAtten].forEach((d,i) => { data[nowAtten][i] = 0; });
        setps800Table(data);
        console.log(ps800Table);
        break;
    case 'psul':
      data = [...psulTable];
        data[nowAtten].forEach((d,i) => { data[nowAtten][i] = 0; });
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
      // 원랜 이런식으로 해야할것 같긴 한데.. band 구분이 안되어 있는 상태임..
      /*******************************************
      switch (responseData.band) {
        case 0: // ps700
          break;
        case 1: // ps800
          break;
        case 2: // psUL
          break;
      
        default:
          break;
      }
      /*******************************************/
    }
    // 따라서 현재 보고 있는 화면에서, recall 을 했다고 가정하고 그냥 덮어씌우는 형태..가 됨..
    switch (nowBand) {
      case 'ps700':
        dispatch(AttenTableChange({ name: nowBand, addr: nowAtten, value: ps700Table[nowAtten] }));
        break;
      case 'ps800':
        dispatch(AttenTableChange({ name: nowBand, addr: nowAtten, value: ps800Table[nowAtten] }));
        break;
      case 'psul':
        dispatch(AttenTableChange({ name: nowBand, addr: nowAtten, value: psulTable[nowAtten] }));
        break;
    
      default:
        break;
    }
    console.log("tableState ===> ", tableState)
  }
  const processOfResponseDataGet = (responseData) => {
    console.log("processOfResponseDataGet In.. responseData ===> ", responseData)
    // 받아온 데이터 처리 수행..
    let addr = 0;
    let attenselect = responseData.data[addr];  addr++;
    let tableData, secondTableData;
    let draw = [...drawData];

    draw.forEach((d,i) => { 
      draw[i].forEach((d,j) => {
        draw[i][j] = (responseData.data[addr]<<8);  addr++;
        draw[i][j] += responseData.data[addr];  addr++;
      })
    })
    setdrawData(draw);

    addr = 1;
    switch (responseData.band) {
      case 0:
        tableData = [...ps700Table];
        secondTableData = [...tableData[nowAtten]];
        secondTableData.forEach((d,i) => { 
          secondTableData[i] = responseData.data[addr]<<8;  addr++;
          secondTableData[i] += responseData.data[addr];  addr++;
        });
        tableData[nowAtten] = secondTableData;
        setps700Table(tableData);
        
        break;
      case 1:
        tableData = [...ps800Table];
        secondTableData = [...tableData[nowAtten]];
        secondTableData.forEach((d,i) => { 
          secondTableData[i] = responseData.data[addr]<<8;  addr++;
          secondTableData[i] += responseData.data[addr];  addr++;
        });
        setps800Table(tableData);

        break;
      case 2:
        tableData = [...psulTable];
        secondTableData = [...tableData[nowAtten]];
        secondTableData.forEach((d,i) => { 
          secondTableData[i] = responseData.data[addr]<<8;  addr++;
          secondTableData[i] += responseData.data[addr];  addr++;
        });
        setpsulTable(tableData);

        break;
    
      default:
        break;
    }
  }
  const postSerialCommunication = async(ipcData, act) => {
    try {
			// const datas = { ipcData: {
      //   command: 0xB0,
      //   numberOfCommand: 8,
      //   band: 0,            // 0:ps700, 1:ps800, 2:UL
      //   data: [0x30, 0x2A, 0x26, 0x1C, 0x1E, 0x20, 0x22, 0x32]
      // }}
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
        
        //
        //
        
      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }

  const ConfirmClick = async() =>{
    let addr = 0;
    let ipcData = { 
      command: 0x0A,
      numberOfCommand: 1,
      band: 0,
      data: []
    };
    ipcData.data[addr] = nowAtten;  addr++;
    if(nowBand == 'ps700'){ 
      ipcData.band = 0; 
      ps700Table[nowAtten].map((d,i) => { 
        ipcData.data[addr] = (d>>8)&0xFF;    addr++;
        ipcData.data[addr] = d&0xFF;         addr++;
      }) 
    }
    else if(nowBand == 'ps800'){ 
      ipcData.band = 1; 
      ps800Table[nowAtten].map((d,i) => { 
        ipcData.data[addr] = (d>>8)&0xFF;    addr++;
        ipcData.data[addr] = d&0xFF;         addr++;
      }) 
    }
    else if(nowBand == 'psul'){ 
      ipcData.band = 2; 
      psulTable[nowAtten].map((d,i) => { 
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
      command: 0x4C,
      numberOfCommand: 1,
      band: nowBand=='ps700'?0:(nowBand=='ps800'?1:2),
      data: [nowAtten]
    };

    // ipcRenderer.send('SerialTransmit', ipcData);
    // pakt87
    await postSerialCommunication(ipcData, "get")

    // let waitStac = 0;
    // const interval = setInterval(() => {
    //   let responseData = ipcRenderer.sendSync('SerialResponse');
    //   if( waitStac < 20 ) {
    //     waitStac++;
    //     if( responseData.flag ){
    //       clearInterval(interval);
    //       let addr = 0;
    //       let attenselect = responseData.data[addr];  addr++;
    //       let tableData, secondTableData;
    //       let draw = [...drawData];

    //       draw.forEach((d,i) => { 
    //         draw[i].forEach((d,j) => {
    //           draw[i][j] = responseData.data[addr];  addr++;
    //           draw[i][j] += responseData.data[addr];  addr++;
    //         })
    //       })
    //       setdrawData(draw);

    //       addr = 1;
    //       switch (responseData.band) {
    //         case 0:
    //           tableData = [...ps700Table];
    //           secondTableData = [...tableData[nowAtten]];
    //           secondTableData.forEach((d,i) => { 
    //             secondTableData[i] = responseData.data[addr]<<8;  addr++;
    //             secondTableData[i] += responseData.data[addr];  addr++;
    //           });
    //           tableData[nowAtten] = secondTableData;
    //           setps700Table(tableData);
              
    //           break;
    //         case 1:
    //           tableData = [...ps800Table];
    //           secondTableData = [...tableData[nowAtten]];
    //           secondTableData.forEach((d,i) => { 
    //             secondTableData[i] = responseData.data[addr]<<8;  addr++;
    //             secondTableData[i] += responseData.data[addr];  addr++;
    //           });
    //           setps800Table(tableData);

    //           break;
    //         case 2:
    //           tableData = [...psulTable];
    //           secondTableData = [...tableData[nowAtten]];
    //           secondTableData.forEach((d,i) => { 
    //             secondTableData[i] = responseData.data[addr]<<8;  addr++;
    //             secondTableData[i] += responseData.data[addr];  addr++;
    //           });
    //           setpsulTable(tableData);

    //           break;
          
    //         default:
    //           break;
    //       }
    //     }
    //   }else{ 
    //     ErrorMessage( 'Table Recall Error', "can't Recall Data from MCU");
    //     clearInterval(interval); 
    //   }
    // }, 100)

  }


  const renderCards = drawData.map((d, i) => {
    let rounded
    if( i==0 ){ rounded = 'rounded-tl-xl'; }
    else if( i==3 ){ rounded = 'rounded-tr-xl'; }

    const secondDraw = d.map((d, j) => {
      let bgColor =  j%2 ? 'bg-indigo-50 ':'bg-white ';
      let bottomRounded = j==15 ?'rounded-b-xl':'';

      return <div className={"w-full h-7 flex " + bgColor + bottomRounded} key={j+i}>
        <div className="w-1/2 h-full flex my-auto">
          <input 
            id={"checkBox"+((i*16)+j)}
            name={((i*16)+j)} 
            className="w-1/4 h-fit m-auto" 
            type={'checkbox'} />
          <p className="w-1/2 h-fit font-bold m-auto">{(((i*16)+j)/2).toFixed(1)}</p>
        </div>
        <input name={((i*16)+j)} 
          className={"w-2/5 h-fit text-center my-auto " + bgColor }
          type={'number'} 
          step={0.5}
          value={d===''?'':(d/10)}
          /* value={(d/10).toString()}  */
          onChange={TableValueChange} />
      </div>
    })
    
    return <div className={"w-1/4 h-fit " + rounded} key={'flexBox'+i}>
      {secondDraw}
    </div>
  })
  

  return (
    <div className="flex">
      <div> {/* NavBar */}
        <AdminNavBarPage />
      </div>
      <div style={{ width: "1030px", height: "100vh" }}>
        <div className="w-full h-1/10 flex font-sans font-bold">   {/* Header */}
          <BsTable className='text-gray-700 my-auto mr-5' size={50} />
          <p className="w-fit h-fit text-gray-700 text-4xl my-auto">Atten Table</p>
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
          <div className="w-full h-fit border-2 border-indigo-900 rounded-b-xl rounded-tr-xl">
            <div className="w-full h-7 flex justify-center mt-2">
              <button id="Atten1Button"
              className={'w-1/8 h-full text-white text-sm rounded-tl-xl hover:bg-indigo-900' + (nowAtten==0?' bg-indigo-900':' bg-indigo-500') }
              name={0}
              onClick={NowAttenChange}
              >ALC-Atten1</button>
              <button id="Atten2Button"
              className={'w-1/8 h-full text-white text-sm hover:bg-indigo-900' + (nowAtten==1?' bg-indigo-900':' bg-indigo-500') }
              name={1}
              onClick={NowAttenChange}
              >ALC-Atten2</button>
              <button id="Atten3Button"
              className={'w-1/8 h-full text-white text-sm hover:bg-indigo-900' + (nowAtten==2?' bg-indigo-900':' bg-indigo-500') }
              name={2}
              onClick={NowAttenChange}
              >AGC-Atten1</button>
              <button id="Atten4Button"
              className={'w-1/8 h-full text-white text-sm rounded-tr-xl hover:bg-indigo-900' + (nowAtten==3?' bg-indigo-900':' bg-indigo-500') }
              name={3}
              onClick={NowAttenChange}
              >AGC-Atten2</button>
            </div>
            <div className="w-full h-full flex border-t-2 border-indigo-900 bg-indigo-50 rounded-b-xl">
              {renderCards}
            </div>
          </div>

          <div className="w-full h-1/10 flex">
            <div className="w-1/3 h-fit flex mt-3">
              <p className="w-fit h-fit font-sans font-semibold text-gray-700 mr-3 my-auto">Offset</p>
              <input className="w-1/3 h-fit text-center border-b-2 mr-3 my-auto" 
                type={'number'}
                min={-10.0} max={10.0}
                step={0.5}
                value={(offset/10).toString()}
                onChange={OffsetChange} />
              <button className="w-1/4 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto" onClick={OffsetApplyClick}>Apply</button>
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
    </div>
  )
}

export default AdminAttenTablePage