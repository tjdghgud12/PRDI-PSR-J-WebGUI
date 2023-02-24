import React, { useState, useEffect } from 'react'
import UserNavber from '../UserNavBar/UserNavbar'
import UserHeaderPage from '../UserHeaderPage/UserHeaderPage'
import { useDispatch, useSelector } from "react-redux";
import { randomNumberInRange, useInterval, convertDataSerialToObject, ControlLED } from '../../../lib/common'

function UserViewLogsPage() {
  const dispahch = useDispatch();
  const commonState = useSelector((state) => state.commonSlice);
  const [time, settime] = useState('00:00:00');
  const [date, setdate] = useState('0001-01-01');
  const [logData, setlogData] = useState([]);
  const nowDate = new Date();

  useEffect(() => {
    const nowPage = document.getElementById("navbarButtonViewLogs");
    nowPage.className = nowPage.className + " " + "bg-indigo-600 text-white";
  })
  

  const Download = (name, value, type) => {
    const blob = new Blob([value], {type: type});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url
    a.download = name
    a.click();
    a.remove()
  }
  const DownloadClick = () => {
    Download('Alarm Logs_'+nowDate.toLocaleString('en-us'), JSON.stringify(logData), 'text')
    // Log를 text 파일로 저장
  }
  

  const timeChange = (e) => {
    settime(e.target.value);
  }
  const dateChange = (e) => {
    setdate(e.target.value)
  }

  const postSerialCommunication = async(ipcData) => {
    try {
			// const datas = { ipcData: {
      //   command: 0xB0,
      //   numberOfCommand: 8,
      //   band: 0,            // 0:ps700, 1:ps800, 2:UL
      //   data: [0x30, 0x2A, 0x26, 0x1C, 0x1E, 0x20, 0x22, 0x32]
      // }}
      ControlLED('Tx', 'on');
      const datas = { ipcData: ipcData }
			const res = await fetch("/api/serialCommunication", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
        ControlLED('Tx', 'off');
        ControlLED('Rx', 'on');
        const result = await res.json()
				const responseData_ = result.result
        console.log("http okay ==> ", res.status, result, responseData_)
				// 받아온 결과값들 가지고 처리하는 async/await 함수 넣어줄것..
        // 1. get logs 3C
        // 2. get time 3E
        // 총 2개
        const responseData = convertDataSerialToObject(responseData_);
        switch (ipcData.command) {
          case 0x3C:  // Get Logs
            ParsingRecallData(responseData);  
            break;
          case 0x3E:  // Get Time
            let addr = 0;
            let date, time;
            let share;
            let remain;
            let value = [];
            console.log(value);
            
            for (let i = 0; i < responseData.data.length; i++) {
              share = Math.floor(responseData.data[i]/16);
              remain = responseData.data[i]%16;
              value[i] = (share*10)+remain;
            }

            date = '20' + (value[addr]<10? '0':'');
            date += value[addr].toString() + '-';        addr++;  // 년도
            date += (value[addr]<10? '0':'');
            date += value[addr].toString() + '-';        addr++;     // 월
            date += (value[addr]<10? '0':'');
            date += value[addr].toString();              addr++;    // 일

            time = (value[addr]<10? '0':'');
            time += value[addr].toString() + ':';         addr++;   // 시
            time += (value[addr]<10? '0':'');
            time += value[addr].toString() + ':';        addr++;    // 분
            time += (value[addr]<10? '0':'');
            time += value[addr].toString();              addr++;    // 초

            console.log(date);
            console.log(time);
            setdate(date);
            settime(time);
            break;
          case 0x60:  // Clear Logs
            setlogData([]);
            break;
            
          default:
            break;
        }
        ControlLED('Rx', 'off');
      }else { 
        ControlLED('Tx', 'off');
        ControlLED('Rx', 'off');
        console.log("http error ==> ", res.status) 
      }
    } catch (error) { 
      ControlLED('Tx', 'off');
      ControlLED('Rx', 'off');
      console.log("error catch ==> ", error) 
    }
  }

  const ParsingRecallData = async(responseData) => {
    let addr = 0;
    let logLength = responseData.data.length/10;
    let log = [];

    for (let i = 0; i < logLength; i++) {
      log[i] = { id: '', value: 0, band: '', data: '' }

      // Log의 ID 파싱
      if(responseData.data[addr]==1){ log[i].id = 'Over System Temperature'; }
      else if(responseData.data[addr]===2 ){ log[i].id = 'AC Fail'; }
      else if(responseData.data[addr]===3){ log[i].id = 'DC Fail'; }
      else if(responseData.data[addr]===4){ log[i].id = 'Batt Low'; }
      else if(responseData.data[addr]===5){ log[i].id = 'Batt Charger'; }
      else if( (responseData.data[addr]===6) || (responseData.data[addr]===13) || (responseData.data[addr]===20) ){ log[i].id = 'Over Output Power'; }
      else if( (responseData.data[addr]===7) || (responseData.data[addr]===14) || (responseData.data[addr]===21) ){ log[i].id = 'Over Input Power'; }
      else if( (responseData.data[addr]===8) || (responseData.data[addr]===15) || (responseData.data[addr]===22) ){ log[i].id = 'SWR'; }
      else if( (responseData.data[addr]===9) || (responseData.data[addr]===16) || (responseData.data[addr]===23) ){ log[i].id = 'ALC'; }
      else if( (responseData.data[addr]===10) || (responseData.data[addr]===17) || (responseData.data[addr]===24) ){ log[i].id = 'PLL'; }
      else if( (responseData.data[addr]===11) || (responseData.data[addr]===18) || (responseData.data[addr]===25) ){ log[i].id = 'Over Temperature'; }
      else if( (responseData.data[addr]===12) || (responseData.data[addr]===19) || (responseData.data[addr]===26) ){ log[i].id = 'Shutdown'; }

      // Log의 Band 파싱
      if( responseData.data[addr] < 6 ){ log[i].band = 'Common'; }
      else if( responseData.data[addr] < 13 ){ log[i].band = 'PS700'; }
      else if( responseData.data[addr] < 20 ){ log[i].band = 'PS800'; }
      else { log[i].band = 'PSUL'; }
      addr++;

      // Log의 Value 파싱
      log[i].value = (responseData.data[addr]<<8)+responseData.data[addr+1];   addr++; addr++;
      if((log[i].value&0x8000) == 0x8000) { log[i].value = ((~log[i].value&0xFFFF)+1)*(-1); }


      // Log의 Date 파싱
      let share;
      let remain;
      let value = [];
      
      for (let j = 0; j < 6; j++) {
        share = Math.floor(responseData.data[addr]/16);
        remain = responseData.data[addr]%16;
        value[j] = (share*10)+remain;
        addr++;
      }
      //console.log(value)

      // 날짜 입력
      log[i].date = '20' + (value[0]<10? '0':'');
      log[i].date += value[0].toString() + '-';  // 년도
      log[i].date += (value[1]<10? '0':'');
      log[i].date += value[1].toString() + '-';     // 월
      log[i].date += (value[2]<10? '0':'');
      log[i].date += value[2].toString() + ' / ';    // 일

      // 시간 입력
      log[i].date += (value[3]<10? '0':'');
      log[i].date += value[3].toString() + ':';   // 시
      log[i].date += (value[4]<10? '0':'');
      log[i].date += value[4].toString() + ':';    // 분
      log[i].date += (value[5]<10? '0':'');
      log[i].date += value[5].toString();    // 초

      // log[i].date = value[0].toString() + '-';
      // log[i].date += value[1].toString() + '-';
      // log[i].date += value[2].toString() + ' / ';
      // // 시간 입력
      // log[i].date += value[3].toString() + ':';
      // log[i].date += value[4].toString() + ':';
      // log[i].date += value[5].toString();
    }
    
    setlogData(log);
  }

  const GetLogsClick = async() => {
    // Log 데이터 요청 프로토콜 전송
    console.log("Get Logs clicked..!")
    const ipcData = {
      command: 0x3C,
      numberOfCommand: 1,
      band: 0x03,            // 0:ps700, 1:ps800, 2:UL
      data: []
    }
    await postSerialCommunication(ipcData);

    //try {
      
		// 	const res = await fetch("/api/serialCommunication", {
		// 		method: "POST",
		// 		headers: { "Content-Type": "application/json;charset=utf-8" },
		// 		body: JSON.stringify( datas ),
		// 	})
		// 	if(res.ok){
    //     const result = await res.json()
		// 		const responseData = result.result
    //     console.log("http okay #ps700 ==> ", res.status, result, responseData)
		// 		// 받아온 결과값들 가지고 처리하기..
    //     await ParsingRecallData(convertDataSerialToObject(responseData))

    //   }else { console.log("http error ==> ", res.status) }
    // } catch (error) { console.log("error catch ==> ", error) }
  }

  const ClearLogsClick = async() => {
    // 보고있는 화면 클리어
    console.log("Clear Logs clicked..!")
    const ipcData = {
      command: 0x60,
      numberOfCommand: 1,
      band: 0x03,
      data: []
    }
    postSerialCommunication(ipcData);
    // try{
    //   const datas = { ipcData: {
    //     command: 0x60,
    //     numberOfCommand: 1,
    //     band: 0x03,
    //     data: []
    //   }}
    //   const res_ = await fetch("/api/serialCommunication", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json;charset=utf-8" },
    //     body: JSON.stringify( datas ),
    //   })
    //   if(res_.ok){
    //     const result_ = await res_.json()
    //     const responseData = result_.result
    //     console.log("http okay #ps800 ==> ", res_.status, result_, responseData)
        
    //   }else { console.log("http error ==> ", res_.status) }
  
      
    // }catch (error) { console.log("error catch ==> ", error) }
  }

  const GetTimeClick = async() => {
    // Time 정보 요청 프로토콜 전송
    console.log("Get Time clicked..!")
    const ipcData = {
      command: 0x3E,
      numberOfCommand: 1,
      band: 0x03,
      data: []
    }
    postSerialCommunication(ipcData);
    // try{
    //   const datas = { ipcData: {
    //     command: 0x3E,
    //     numberOfCommand: 1,
    //     band: 0x03,
    //     data: []
    //   }}
    //   const res_ = await fetch("/api/serialCommunication", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json;charset=utf-8" },
    //     body: JSON.stringify( datas ),
    //   })
    //   if(res_.ok){
    //     const result_ = await res_.json()
    //     const responseData_ = result_.result
    //     console.log("http okay #ps800 ==> ", res_.status, result_, responseData_)
    //     // 여기서 응답을 적용.
    //     const responseData = convertDataSerialToObject(responseData_)
    //     let addr = 0;
    //     let date, time;

    //     date = '20' + responseData.data[addr]<10? '0':'' + responseData.data[addr].toString() + '-';  addr++;
    //     date += responseData.data[addr].toString() + '-';        addr++;
    //     date += responseData.data[addr].toString();              addr++;

    //     time = responseData.data[addr].toString() + ':';         addr++;
    //     time += responseData.data[addr].toString() + ':';        addr++;
    //     time += responseData.data[addr].toString();              addr++;

    //     setdate(date);
    //     settime(time);
        
    //   }else { console.log("http error ==> ", res_.status) }
  
    //   //setlogData([]);
    // }catch (error) { console.log("error catch ==> ", error) }
  }

  const SetTimeClick = async() => {
    // Time 정보 Set 프로토콜 전송
    console.log("Set Time clicked..!")
    let ipcData = { 
      command: 0x0F,
      numberOfCommand: 1,
      band: 0x03,
      data: []
    };
    // 반복하여 post 통신..
    let transDate = date.split('-');
    let transTime = time.split(':');
    let test = 16;
    // 1. 10으로 나눠서 몫과 나머지를 구한다.
    // 2. 몫 * 16을 해서 상위부분을 만든다.
    // 3. 나머지를 더한다.
    let share;
    let remain;
    let value;
    console.log(value);
    
    ipcData.data[0] = Number(transDate[0])-2000;  // 2000년을 빼야 전송 가능한 년도 범위가 나옴.
    ipcData.data[1] = Number(transDate[1]);
    ipcData.data[2] = Number(transDate[2]);
    
    ipcData.data[3] = Number(transTime[0]);
    ipcData.data[4] = Number(transTime[1]);
    ipcData.data[5] = Number(transTime[2]);

    for (let i = 0; i < ipcData.data.length; i++) {
      share = Math.floor(ipcData.data[i]/10);
      remain = ipcData.data[i]%10;
      ipcData.data[i] = (share*16)+remain;
    }

    console.log('trans : ',ipcData)

    await postSerialCommunication(ipcData)

  }

  const renderCards = logData.map((d, i) => {

    let bgcolor = 'bg-white';
    if( i % 2 != 0 ) { bgcolor = 'bg-indigo-50'; }


    return <tr id={i} key={i}>  
        <td><p className={bgcolor}>{d.id}</p></td>
        <td><p className={bgcolor}>{d.value}</p></td>
        <td><p className={bgcolor}>{d.band}</p></td>
        <td><p className={bgcolor}>{d.date}</p></td>
      </tr>
  });

  return (
    <div style={{display: 'flex'}}>
      <div>
        <UserNavber />
      </div>
      <div style={{ width: "1030px", height: "820px", minWidth:'1030px' }}>
        <UserHeaderPage />
        <div className="w-full h-userMain font-sans font-bold text-stone-700">
          <div className='w-full h-4/5 '>
            <div className='scroll w-full h-9/10 text-center text-sm border-l-2 border-b-2 border-gray-500 rounded-lg overflow-y-scroll'>  {/* Table */}
              <table className='w-full h-auto table-auto' >
                <thead className='w-full h-1/5'>
                  <tr className='w-full h-full text-sm text-white bg-indigo-500'>
                    <th className='w-1/4 font-normal py-1.5 border-r-2 border-white rounded-tl-lg' >Log ID</th>
                    <th className='w-1/4 font-normal py-1.5 border-r-2 border-white' >Log Value</th>
                    <th className='w-1/4 font-normal py-1.5 border-r-2 border-white' >Band</th>
                    <th className='w-1/4 font-normal py-1.5 border-r-2 border-white rounded-tr-lg' >Date</th>
                  </tr>
                </thead>
                <tbody className='w-full h-9/10'>
                  {
                    renderCards
                    //bandSelect == 'ps800' ? (numberOfChannels > 0 ? renderCards : null) : renderCards
                  }
                </tbody>
              </table>
            </div>

            <div className='w-full h-1/10 flex '> {/* Button */}
              <div className='w-3/5 h-full flex justify-between mr-0 ml-auto'>
                <button className="w-1/6 h-9 text-white text-lg rounded-xl bg-indigo-500 my-auto hover:bg-indigo-900" onClick={GetLogsClick} > Get Logs </button>
                <button className="w-1/6 h-9 text-white text-lg rounded-xl bg-indigo-500 my-auto hover:bg-indigo-900" onClick={DownloadClick} > Download </button>
                <button className="w-1/6 h-9 text-white text-lg rounded-xl bg-indigo-500 my-auto hover:bg-indigo-900" onClick={ClearLogsClick} > Clear Logs </button>
                <button className="w-1/6 h-9 text-white text-lg rounded-xl bg-indigo-500 my-auto hover:bg-indigo-900" onClick={GetTimeClick} > Get Time </button>
                <button className="w-1/6 h-9 text-white text-lg rounded-xl bg-indigo-500 my-auto hover:bg-indigo-900" onClick={SetTimeClick} > Set Time </button>
              </div>

              <div className='w-3/10 h-full flex'>
                <input className='w-fit h-10 text-center mx-auto my-auto' type='date' value={ date } onChange={dateChange}  />
                <input className='w-fit h-10 text-center mx-auto my-auto' type='time' step='1' value={ time } onChange={timeChange}  />
              </div> 
            </div>

          </div>
          <div className='w-full h-1/5'>
            <p className='w-fit h-fit text-2xl text-gray-500 mx-auto pt-5'>Last System Access:</p>
            <p className='w-fit h-fit text-3xl mx-auto mt-2'>{commonState.lastAccess}</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default UserViewLogsPage