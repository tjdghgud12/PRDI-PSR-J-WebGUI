import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminNavBarPage from '../AdminNavbarPage/AdminNavbarPage'
import { AiOutlineMonitor } from "react-icons/ai";
// import { ErrorMessage } from '../../../Renderer/Renderer'
import { CommonSetChange } from '../../../../_reducers/commonSlice'
// const { ipcRenderer } = window.require('electron');

import { randomNumberInRange, useInterval, convertDataSerialToObject } from '../../../lib/common'

function AdminDTUStatusPage() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.commonSlice);
  const [autoRefresh, setautoRefresh] = useState(true);
  const [refreshStac, setrefreshStac] = useState(true)

  const autoRefreshChange = (e) => {
    setautoRefresh(e.target.checked);
  }

  // const serialTest = async() => {
  //   try {
	// 		const datas = {  }
	// 		const res = await fetch("/api/serialTest", {
	// 			method: "POST",
	// 			headers: { "Content-Type": "application/json;charset=utf-8" },
	// 			body: JSON.stringify( datas ),
	// 		})
	// 		if(res.ok){
	// 			const result = await res.json()
  //       console.log("http okay ==> ", res.status, result)
	// 			// 받아온 결과값들 가지고 처리하기..
	// 			//
  //       //
	// 		}else { console.log("http error ==> ", res.status) }
	// 	} catch (error) { console.log("error catch ==> ", error) }
  // }

  // serialCommunication
  const RecallDtuStatus = async() => {
    console.log("RecallDtuStatus execute..")
    try {
			const datas = { ipcData: {
        command: 0xB0,
        numberOfCommand: 2,
        band: 0,            // 0:ps700, 1:ps800
        data: [0x16, 0x18]
      }}
			const res = await fetch("/api/serialCommunication", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
        const result = await res.json()
				const dataSerial = result.result
        console.log("http okay #ps700 ==> ", res.status, result, dataSerial)
				// 받아온 결과값들 가지고 처리하기..
        //
        const responseData = convertDataSerialToObject(dataSerial)
        //
        //
				let fwVer, fpgaVer, alarmPll, alarmDac, alarmAdc, mute;
        fwVer = (responseData.data[1]/10).toFixed(1);
        fpgaVer = (responseData.data[2]/10).toFixed(1);

        mute = responseData.data[4]===0 ? false:true;
        alarmPll = (responseData.data[5]&0x01)?true:false
        alarmDac = ((responseData.data[5]>>1)&0x01)?true:false
        alarmAdc = ((responseData.data[5]>>2)&0x01)?true:false

        if(mute){
          alarmPll = false;
          alarmDac = false;
          alarmAdc = false;
        }
        dispatch(CommonSetChange({ name: 'PS700DTUVer', value: fwVer }));
        dispatch(CommonSetChange({ name: 'PS700FPGAVer', value: fpgaVer }));
        dispatch(CommonSetChange({ name: 'alarmps700DTUPLL', value: alarmPll }));
        dispatch(CommonSetChange({ name: 'alarmps700DTUDAC', value: alarmDac }));
        dispatch(CommonSetChange({ name: 'alarmps700DTUADC', value: alarmAdc }));
        console.log("fwVer, fpgaVer, alarmPll, alarmDac, alarmAdc #700 ===> ", fwVer, fpgaVer, alarmPll, alarmDac, alarmAdc)

        //************ 2번째..-start ******************************/
        const datas_ = { ipcData: {
          command: 0xB0,
          numberOfCommand: 2,
          band: 1,            // 0:ps700, 1:ps800
          data: [0x16, 0x18]
        }}
        console.log("datas_ ===> ", datas_)
        const res_ = await fetch("/api/serialCommunication", {
          method: "POST",
          headers: { "Content-Type": "application/json;charset=utf-8" },
          body: JSON.stringify( datas_ ),
        })
        if(res_.ok){
          const result_ = await res_.json()
          const dataSerial_ = result_.result
          console.log("http okay #ps800 ==> ", res_.status, result_, dataSerial_)
          // 받아온 결과값들 가지고 처리하기..
          //
          const responseData_= convertDataSerialToObject(dataSerial)
          //
          //
          fwVer = (responseData_.data[1]/10).toFixed(1);
          fpgaVer = (responseData_.data[2]/10).toFixed(1);
          mute = responseData.data[4]===0 ? false:true;
          alarmPll = (responseData_.data[5]&0x01)?true:false
          alarmDac = ((responseData_.data[5]>>1)&0x01)?true:false
          alarmAdc = ((responseData_.data[5]>>2)&0x01)?true:false
          if(mute){
            alarmPll = false;
            alarmDac = false;
            alarmAdc = false;
          }
          // randomNumberInRange(0,1)===1 ? alarmPll=true : alarmPll=false       // test 구문..
          dispatch(CommonSetChange({ name: 'PS800DTUVer', value: fwVer }));
          dispatch(CommonSetChange({ name: 'PS800FPGAVer', value: fpgaVer }));
          dispatch(CommonSetChange({ name: 'alarmps800DTUPLL', value: alarmPll }));
          dispatch(CommonSetChange({ name: 'alarmps800DTUDAC', value: alarmDac }));
          dispatch(CommonSetChange({ name: 'alarmps800DTUADC', value: alarmAdc }));
          console.log("fwVer, fpgaVer, alarmPll, alarmDac, alarmAdc #800 ===> ", fwVer, fpgaVer, alarmPll, alarmDac, alarmAdc)
  
        }else { console.log("http error ==> ", res_.status) }
        //************ 2번째..-end ******************************/



			}else { console.log("http error ==> ", res.status) }
		} catch (error) { console.log("error catch ==> ", error) }
  }

  // 화면 1차적으로 그린뒤, 실행되는 곳..
  useEffect(() => {
		RecallDtuStatus()   // 최초 1회 DTU Status 정보 가져오기..
	},[])

  /*******************************************************
	* useInterval 타이머 사용 ...
	*******************************************************/
	useInterval(() => {
		// Your custom logic here
    console.log("interval...")
		if(autoRefresh){
      RecallDtuStatus()
    }
	}, 1500);

  return (
    <div className="flex">
      <div> {/* NavBar */}
        <AdminNavBarPage />
      </div>
      <div style={{ width: "1030px", height: "100vh" }}>
        <div className="w-full h-1/10 flex font-sans font-bold">   {/* Header */}
          <AiOutlineMonitor className='text-gray-700 my-auto mr-5' size={50} />
          <p className="w-fit h-fit text-gray-700 text-4xl my-auto">DTU Status</p>
        </div>

        <div className="w-full h-fit flex">
          <input className="w-fit h-fit my-auto mr-2 ml-auto" style={{zoom:'1.4'}} name="autoRefresh" type='checkbox' checked={autoRefresh} onChange={autoRefreshChange} />
          <p className="w-fit h-fit text-lg font-sans font-bold text-gray-600 my-auto mr-3">Auto Refresh</p>
        </div>

        <div className='w-full h-fit font-sans font-bold text-stone-700'>     {/* body */}
          <table className='w-full h-auto table-auto text-center' >
            <thead className='w-full h-fit  '>
              <tr className='w-full h-full text-lg text-white bg-indigo-500'>
                <th className='font-normal py-1.5 border-r-2 border-white rounded-tl-lg' >Band</th>
                <th className='font-normal py-1.5 border-r-2 border-white' >F/W Version</th>
                <th className='font-normal py-1.5 border-r-2 border-white' >FPGA Version</th>
                <th className='font-normal py-1.5 border-r-2 border-white' >PLL Alarm</th>
                <th className='font-normal py-1.5 border-r-2 border-white' >DAC Alarm</th>
                <th className='font-normal py-1.5 border-r-2 border-white rounded-tr-lg' >ADC Alarm</th>
              </tr>
            </thead>
            <tbody className='w-full h-fit'>
              <tr className="w-full h-fit">
                <td className="w-auto h-auto bg-white text-lg">PS700 + FirstNet</td>
                <td className="w-auto h-auto bg-white text-lg">{status.PS700DTUVer}</td>
                <td className="w-auto h-auto bg-white text-lg">{status.PS700FPGAVer}</td>
                <td className="w-auto h-auto bg-white text-lg">
                  <div 
                    id="ps700PllAlarmLED"
                    className={ "w-6 h-6 rounded-full border border-gray-500 m-auto " + (status.alarm.ps700DTUPLL ? 'bg-red-400':'bg-gray-300')}  />
                </td>
                <td className="w-auto h-auto bg-white text-lg">
                  <div 
                    id="ps700DacAlarmLED" 
                    className={ "w-6 h-6 rounded-full border border-gray-500 m-auto " + (status.alarm.ps700DTUDAC ? 'bg-red-400':'bg-gray-300')}  />
                </td>
                <td className="w-auto h-auto bg-white text-lg">
                  <div 
                    id="ps700AdcAlarmLED" 
                    className={ "w-6 h-6 rounded-full border border-gray-500 m-auto " + (status.alarm.ps700DTUADC ? 'bg-red-400':'bg-gray-300')}  />
                </td>
              </tr>
              <tr>
                <td className="w-auto h-auto bg-indigo-50 text-lg">PS800</td>
                <td className="w-auto h-auto bg-indigo-50 text-lg">{status.PS800DTUVer}</td>
                <td className="w-auto h-auto bg-indigo-50 text-lg">{status.PS800FPGAVer}</td>
                <td className="w-auto h-auto bg-indigo-50 text-lg">
                  <div 
                    id="ps800PllAlarmLED" 
                    className={ "w-6 h-6 rounded-full border border-gray-500 m-auto " + (status.alarm.ps800DTUPLL ? 'bg-red-400':'bg-gray-300')}  />
                </td>
                <td className="w-auto h-auto bg-indigo-50 text-lg">
                  <div 
                    id="ps800DacAlarmLED" 
                    className={ "w-6 h-6 rounded-full border border-gray-500 m-auto " + (status.alarm.ps800DTUDAC ? 'bg-red-400':'bg-gray-300')}  />
                </td>
                <td className="w-auto h-auto bg-indigo-50 text-lg">
                  <div 
                    id="ps800AdcAlarmLED" 
                    className={ "w-6 h-6 rounded-full border border-gray-500 m-auto " + (status.alarm.ps800DTUADC ? 'bg-red-400':'bg-gray-300')}  />
                </td>
              </tr>
              
            </tbody>
          </table>

        </div>

        {/* <div className="bg-black w-full text-white" onClick={()=>{serialTest()}}>ff</div> */}
      </div>
    </div>
  )
}

export default AdminDTUStatusPage