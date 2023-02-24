import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminNavBarPage from '../AdminNavbarPage/AdminNavbarPage'
import { BsTable } from "react-icons/bs";
import { TemperatureAttenTableChange } from '../../../../_reducers/TemperatureAttenTableSlice'
// import { ErrorMessage } from '../../../Renderer/Renderer'
// const { ipcRenderer } = window.require('electron');

import { randomNumberInRange, useInterval, convertDataSerialToObject } from '../../../lib/common'

function AdminTemperatureAttenTablePage() {
  const dispatch = useDispatch();
  const tableState = useSelector((state) => state.TemperatureAttenTableSlice);
  const [ps700Table, setps700Table] = useState(tableState.ps700);
  const [ps800Table, setps800Table] = useState(tableState.ps800);
  const [psulTable, setpsulTable] = useState(tableState.psul);
  const [nowBand, setnowBand] = useState('ps700');
  const [offset, setoffset] = useState(0);
  const [drawData, setdrawData] = useState(Array.from(Array(2), () => Array.from({length: 14}, () => 0 )));

  const NowBandChange = (e) => {
    setnowBand(e.target.name)
    let data = Array.from(Array(2), () => Array.from({length: 14}, () => 0 ));

    switch (e.target.name) {
      case 'ps700':
        data[0].forEach((d,i) => { data[0][i] = ps700Table[i];})
        data[1].forEach((d,i) => { data[1][i] = ps700Table[i+14]; })
        setdrawData(data);
        
        break;
      case 'ps800':
        data[0].forEach((d,i) => { data[0][i] = ps800Table[i]; })
        data[1].forEach((d,i) => { data[1][i] = ps800Table[i+14]; })
        setdrawData(data);
        
        break;
      case 'psul':
        data[0].forEach((d,i) => { data[0][i] = psulTable[i]; })
        data[1].forEach((d,i) => { data[1][i] = psulTable[i+14]; })
        setdrawData(data);
        break;
    
      default:
        break;
    }
  }

  const TableValueChange = (e) => {
    if(e.target.value != '' ){
      if( e.target.value > 10 ){ e.target.value = 10; }
      else if( e.target.value < -10 ){ e.target.value = -10 }
      e.target.value = Number((e.target.value/0.5).toFixed(0)*0.5).toFixed(1);
      e.target.value = e.target.value*10;
    }
    

    let data, tableData;

    switch (nowBand) {
      case 'ps700':
        tableData = [...ps700Table];
        tableData[e.target.name] = e.target.value;
        setps700Table(tableData);
        data = [...drawData];
        data[Math.floor(e.target.name/14)][e.target.name%14] = e.target.value;
        setdrawData(data);

        break;
      case 'ps800':
        tableData = [...ps800Table];
        tableData[e.target.name] = e.target.value;
        setps800Table(tableData);
        data = [...drawData];
        data[Math.floor(e.target.name/14)][e.target.name%14] = e.target.value;
        setdrawData(data);
        
        break;
      case 'psul':
        tableData = [...psulTable];
        tableData[e.target.name] = e.target.value;
        setpsulTable(tableData);
        data = [...drawData];
        data[Math.floor(e.target.name/14)][e.target.name%14] = e.target.value;
        setdrawData(data);
        
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
    switch (nowBand) {
      case 'ps700':
        ps700.forEach((d,i) => { 
          if(offset > 0){
            if((ps700[i]+offset) < 100) {ps700[i] += offset;}
            else{ ps700[i] = 100; }
          }else if(offset < 0){
            if((ps700[i]+offset) > -100) {ps700[i] += offset;}
            else{ ps700[i] = -100; }
          }
        })
        setps700Table(ps700);
        break;

      case 'ps800':
        ps800.forEach((d,i) => { 
          if(offset > 0){
            if((ps800[i]+offset) < 100){ ps800[i] += offset; }
            else{ ps800[i] = 100; }
          }else if(offset < 0){
            if((ps800[i]+offset) > -100){ ps800[i] += offset; }
            else{ ps800[i] = -100; }
          }
        })
        setps800Table(ps800);
        break;

      case 'psul':
        psul.forEach((d,i) => { 
          if(offset > 0){
            if((psul[i]+offset) < 100){ psul[i] += offset; }
            else{ psul[i] = 100; }
          }else if(offset < 0){
            if((psul[i]+offset) > -100){ psul[i] += offset; }
            else{ psul[i] = -100; }
          }
        })
        setpsulTable(psul);
        break;
    
      default:
        break;
    }
    
    draw.forEach((d,i) => { draw[i].forEach((d,j) => {
      if(offset > 0){
        if((draw[i][j]+offset) < 100){ draw[i][j] += offset; }
        else{ draw[i][j] = 100; }
      }else if(offset < 0){
        if((draw[i][j]+offset) > -100){ draw[i][j] += offset; }
        else{ draw[i][j] = -100; }
      }
      
    })})
    
    setdrawData(draw);
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
        data.forEach((d,i) => { data[i] = 0; });
        setps700Table(data);
        console.log(ps700Table);
        break;
      case 'ps800':
        data = [...ps800Table];
        data.forEach((d,i) => { data[i] = 0; });
        setps800Table(data);
        console.log(ps800Table);
        break;
    case 'psul':
      data = [...psulTable];
        data.forEach((d,i) => { data[i] = 0; });
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
        dispatch(TemperatureAttenTableChange({ name: nowBand, value: ps700Table }));
        break;
      case 'ps800':
        dispatch(TemperatureAttenTableChange({ name: nowBand, value: ps800Table }));
        break;
      case 'psul':
        dispatch(TemperatureAttenTableChange({ name: nowBand, value: psulTable }));
        break;
    
      default:
        break;
    }
  }
  const processOfResponseDataGet = (responseData) => {
    // 받아온 데이터 처리 수행..
    let draw = [...drawData];
    let data;
    let addr = 0;

    draw.forEach((d,i) => { 
      draw[i].forEach((d,j) => {
        draw[i][j] = (responseData.data[addr]<<8);  addr++;
        draw[i][j] += responseData.data[addr];  addr++;
        if((draw[i][j]&0x8000) == 0x8000) { draw[i][j] = ((~draw[i][j]&0xFFFF)+1)*(-1); }
      })
    })
    setdrawData(draw);

    addr = 0;
    switch (responseData.band) {
      case 0:
        data = [...ps700Table];
        data.forEach((d,i) => { 
          data[i] = (responseData.data[addr]<<8);  addr++;
          data[i] += responseData.data[addr];  addr++;
          if((data[i]&0x8000) == 0x8000) { data[i] = ((~data[i]&0xFFFF)+1)*(-1); }
        });
        setps700Table(data);
        break;
      case 1:
        data = [...ps800Table];
        data.forEach((d,i) => { 
          data[i] = (responseData.data[addr]<<8);  addr++;
          data[i] += responseData.data[addr];  addr++;
          if((data[i]&0x8000) == 0x8000) { data[i] = ((~data[i]&0xFFFF)+1)*(-1); }
        });
        setps800Table(data);
        break;
      case 2:
        data = [...psulTable];
        data.forEach((d,i) => { 
          data[i] = (responseData.data[addr]<<8);  addr++;
          data[i] += responseData.data[addr];  addr++;
          if((data[i]&0x8000) == 0x8000) { data[i] = ((~data[i]&0xFFFF)+1)*(-1); }
        });
        setpsulTable(data);
        break;
    
      default:
        break;
    }
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
        
      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }
  const ConfirmClick = async() =>{
    let addr = 0;
    let ipcData = { 
      command: 0x0B,
      numberOfCommand: 1,
      band: 0,
      data: []
    };
    if(nowBand == 'ps700'){ 
      ipcData.band = 0; 
      ps700Table.map((d,i) => { 
        ipcData.data[addr] = (d>>8)&0xFF;    addr++;
        ipcData.data[addr] = d&0xFF;         addr++;
      }) 
    }
    else if(nowBand == 'ps800'){ 
      ipcData.band = 1; 
      ps800Table.map((d,i) => { 
        ipcData.data[addr] = (d>>8)&0xFF;    addr++;
        ipcData.data[addr] = d&0xFF;         addr++;
      }) 
    }
    else if(nowBand == 'psul'){ 
      ipcData.band = 2; 
      psulTable.map((d,i) => { 
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
      command: 0x4A,
      numberOfCommand: 1,
      band: nowBand=='ps700'?0:(nowBand=='ps800'?1:2),
      data: []
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
    //       let draw = [...drawData];
    //       let data;
    //       let addr = 0;

    //       draw.forEach((d,i) => { 
    //         draw[i].forEach((d,j) => {
    //           draw[i][j] = responseData.data[addr];  addr++;
    //           draw[i][j] += responseData.data[addr];  addr++;
    //         })
    //       })
    //       setdrawData(draw);

    //       addr = 0;
    //       switch (responseData.band) {
    //         case 0:
    //           data = [...ps700Table];
    //           data.forEach((d,i) => { 
    //             data[i] = responseData.data[addr];  addr++;
    //             data[i] += responseData.data[addr];  addr++;
    //           });
    //           setps700Table(data);
    //           break;
    //         case 1:
    //           data = [...ps800Table];
    //           data.forEach((d,i) => { 
    //             data[i] = responseData.data[addr];  addr++;
    //             data[i] += responseData.data[addr];  addr++;
    //           });
    //           setps800Table(data);
    //           break;
    //         case 2:
    //           data = [...psulTable];
    //           data.forEach((d,i) => { 
    //             data[i] = responseData.data[addr];  addr++;
    //             data[i] += responseData.data[addr];  addr++;
    //           });
    //           setpsulTable(data);
    //           break;
          
    //         default:
    //           break;
    //       }
    //     }
    //   }else{
    //     clearInterval(interval);
    //     ErrorMessage( 'Table Recall Error', "can't Recall Data from MCU");
    //   }
    // }, 100)
  }


  const renderCards = drawData.map((d, i) => {
    let rounded
    if( i==0 ){ rounded = 'rounded-tl-xl'; }
    else if( i==1 ){ rounded = 'rounded-tr-xl'; }

    const secondDraw = d.map((d, j) => {
      let bgColor =  j%2 ? 'bg-indigo-50 ':'bg-white ';
      let bottomRounded = j==13 ?'rounded-b-xl':'';
      let temperatureRange = ((i*14)+j)==0 ? 'T < -40':(((i*14)+j)==27 ? '90 <= T': ((((i*14)+j)*5)-45)+' <= T < '+((((i*14)+j)*5)-40));

      return <div className={"w-full h-7 " + bgColor + bottomRounded} key={j+i}>
        <div className="w-3/5 h-full flex mx-auto ">
          <div className="w-1/2 h-full flex my-auto">
            <input name={((i*14)+j)} className="w-auto h-auto my-auto mr-5 ml-0" type={'checkbox'} />
            <p className="w-4/5 h-fit font-bold text-center my-auto">{temperatureRange}</p>
          </div>
          <div className="w-1/2 h-fit m-auto">
            <div className="w-3/4 h-fit mx-auto">
              <input className={"w-full h-fit text-center font-semibold " + bgColor }
                name={((i*14)+j)} 
                type={'number'} 
                step={0.5}
                value={d===''?'':(d/10)}
                onChange={TableValueChange} />
              </div>
            </div>
        </div>
        
      </div>
    })
    
    return <div className={"w-1/2 h-fit " + rounded} key={'flexBox'+i}>
      <div className={"w-full h-fit bg-indigo-900 text-white text-center " + (i==1?'rounded-tr-lg':null)}>
        <div className={"w-3/5 h-fit flex mx-auto " + rounded}>
          <p className={"w-1/2 h-fit " + rounded }>Temperature(℃)</p>
          <p className={"w-1/2 h-fit " + rounded }>Atten</p>
        </div>
      </div>
      <div className={"w-full h-fit "} >
        {secondDraw}
      </div>
      
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
          <p className="w-fit h-fit text-gray-700 text-4xl my-auto">Temperature Compensation Table</p>
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
          <div className="w-full h-fit border-2 border-indigo-900 bg-indigo-50 rounded-tr-xl rounded-b-xl">
            <div className="w-full h-fit flex">
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

            <div className="w-2/5 h-fit mt-3 mr-0 ml-auto"> {/* button */}
              <div className="w-fit h-fit mr-0 ml-auto">
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


export default AdminTemperatureAttenTablePage