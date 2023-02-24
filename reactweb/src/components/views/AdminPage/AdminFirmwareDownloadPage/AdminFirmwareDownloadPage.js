import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import AdminNavBarPage from '../AdminNavbarPage/AdminNavbarPage'
import { BsDownload, BsBoxArrowUp } from "react-icons/bs";

import { removeLogined, convertDataSerialToObject } from '../../../lib/common'

function AdminFirmwareDownloadPage() {
  const commonState = useSelector((state) => state.commonSlice);
  const [fileName, setfileName] = useState('');
  const [fileSize, setfileSize] = useState(0);
  const [fileData, setfileData] = useState([])
  const [nowPacket, setnowPacket] = useState(0);
  const [fileProgress, setfileProgress] = useState(0);
  

  // pakt87..
  const navigate = useNavigate();
  const [fileWeb, setFileWeb] = useState();
  const [fileWebSize, setFileWebSize] = useState(0);

  const FileLoad = ( Extention, cb ) => {
      let input = document.createElement("input");
  
      input.type = "file";
      input.accept = ".bin";
  
      input.onchange = async function(event) {
          let reader = new FileReader();
          let name = await event.target.files[0].name
          let size = await event.target.files[0].size
          let fileExtension = name.substr(name.length-3, 3)
          
          if(fileExtension == 'bin') {
              //reader.readAsText(event.target.files[0]);
              reader.readAsArrayBuffer(event.target.files[0]);
              reader.onload = (e) => {
                  let Data = new Uint8Array(e.target.result);
                  setfileData(Data);
                  setfileName(name);
                  setfileSize(size);

              }
          }else {
              console.log(" 확장자 에러 ")
              //ErrorMessage("File Opne Error", "Please Check file Extention")
          }
      }
      input.click();
      input.remove();
  }

  const FirmwareDownloadStart = async(e) => {
    //// 여기서 분기??
    // 1. mcu다운
    // 2. dtu다운
    // 각 함수로 빼고 여기서 if로 쪼개?
    let name = fileName.substring(0, 14);
    //console.log(name)
    if( fileData.length === 0 ){
      alert("Not Select Firmware file!!!!");
      return
    }
    if( name == 'PSR-J_MCUBoard' ){
      MCUDownlaod();
    }else if( name == 'PSR-J_DTUBoard' ){
      //console.log(fileName.substring(16,19));
      DTUDownload(fileName.substring(16,19));
    }else{
      alert("Please, Check firmware file name!!!!");
    }
  }
  const DTUDownload = async( selectModule ) => {
    try {
      console.log('DTU firmware Download Start!!!');
      let ipcData = {
        command: 0xD6,
        numberOfcommand : 1,
        band: 0,
        data: []
      };
      let uintID;
      // 다운로드 할 모듈 선택
      console.log(selectModule)
      if( selectModule === '700' ){ 
        uintID = 0x00; 
        ipcData.band = 0x00;
      }
      else if(selectModule === '800'){ 
        uintID = 0xA0; 
        ipcData.band = 0x01;
      }
      else{ alert("Please, Check firmware file name!!!!"); return }

      let length = Math.floor(fileData.length/512)+1;  // 총 프레임 길이
      ipcData.data[0] = uintID; // uint ID 0x00 : ps700, 0xA0 : ps800
      ipcData.data[1] = 100;    // SW Ver
      ipcData.data[2] = 100;    // FPGA Ver
      ipcData.data[3] = (length>>8)&0xFF;    // 총 프레임 길이. MSB
      ipcData.data[4] = length&0xFF;         // 총 프레임 길이. LSB
      ipcData.data[5] = 0x80;   // reserved
      ipcData.data[6] = 0x80;   // reserved
      ipcData.data[7] = 0x80;   // reserved

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
        let firmware = [...fileData];
        let loofStac = 0;
        for (let i = 0; i < length; i++) {
          try{
            ipcData.command = 0xD8;
            ipcData.data = [];
            ipcData.data[0] = (length>>8)&0xFF;
            ipcData.data[1] = length&0xFF;
            ipcData.data[2] = (i>>8)&0xFF;
            ipcData.data[3] = i&0xFF;
            
            //let transFileData = firmware.slice((i*512), ((i*512)+512));
            //console.log('transFileData   ===>', transFileData);
            ipcData.data = [...ipcData.data, ...firmware.slice((i*512), ((i*512)+512))];
            //console.log(ipcData.data);
            const datas_ = { ipcData: ipcData }
            const res_ = await fetch("/api/serialCommunication", {
              timeout: 10000,		// 10초 타임아웃 제한..
              method: "POST",
              headers: { "Content-Type": "application/json;charset=utf-8" },
              body: JSON.stringify( datas_ ),
            })
  
            if(res_.ok){
              const result_ = await res_.json();
              const responseData_ = result_.result;
              let protocolData = convertDataSerialToObject(responseData_);
              loofStac = 0;
              setfileProgress(((i+1)/length*100).toFixed(2));
              console.log('Packet Number ===> ', i+1, '/', length);
              let nowPacketNumber = (protocolData.data[2]<<8) + protocolData.data[3];
              if( (nowPacketNumber+1) === length ){
                let fileCrc = CRC16_CCITT(fileData);
                ipcData.command = 0xDA;   // 다운로드 종료
                ipcData.data = [];
                ipcData.data[0] = uintID; // uint ID 0x00 : ps700, 0xA0 : ps800
                ipcData.data[1] = 100;    // SW Ver
                ipcData.data[2] = 100;    // FPGA Ver
                ipcData.data[3] = (length>>8)&0xFF;    // 총 프레임 길이. MSB
                ipcData.data[4] = length&0xFF;         // 총 프레임 길이. LSB
                ipcData.data[5] = (fileCrc>>8)&0xFF;   // file CRC. MSB
                ipcData.data[6] = fileCrc&0xFF;        // file CRC. LSB
                ipcData.data[7] = 0x80;   // reserved
                const datas__ = { ipcData: ipcData }
                try{
                  const res__ = await fetch("/api/serialCommunication", {
                    timeout: 10000,		// 10초 타임아웃 제한..
                    method: "POST",
                    headers: { "Content-Type": "application/json;charset=utf-8" },
                    body: JSON.stringify( datas__ ),
                  })

                  if(res__.ok){ 
                    alert('DTU firmware Download Successfull!!!!');
                    //console.log('firmware Download Successfull!!!!'); 
                  }
                  else{ console.log("http error ==> ", res__.status) }
                }catch (error) { console.log("error catch ==> ", error) }
                
              }
            }else{ 
              loofStac++;   i--;
              if( loofStac > 5 ){
                try{
                  let fileCrc = CRC16_CCITT(fileData);
                  ipcData.command = 0xDC;   // 다운로드 종료
                  ipcData.data = [];
                  ipcData.data[0] = uintID; // uint ID 0x00 : ps700, 0xA0 : ps800
                  ipcData.data[1] = 100;    // SW Ver
                  ipcData.data[2] = 100;    // FPGA Ver
                  ipcData.data[3] = (length>>8)&0xFF;    // 총 프레임 길이. MSB
                  ipcData.data[4] = length&0xFF;         // 총 프레임 길이. LSB
                  ipcData.data[5] = (fileCrc>>8)&0xFF;   // file CRC. MSB
                  ipcData.data[6] = fileCrc&0xFF;        // file CRC. LSB
                  ipcData.data[7] = 0x80;   // reserved
                  const datas__ = { ipcData: ipcData }
                  const res__ = await fetch("/api/serialCommunication", {
                    timeout: 10000,		// 10초 타임아웃 제한..
                    method: "POST",
                    headers: { "Content-Type": "application/json;charset=utf-8" },
                    body: JSON.stringify( datas__ ),
                  })
                  if(res__.ok){ 
                    // 여기서 실패했을때 알람을 어케할껀지.
                    // 아래에 그대로 둘껀지 나중에 정하기로 합시다. 
                  }
                }catch (error){
                  console.log("error catch ==> ", error);
                }
                alert('Firmware Download Fail!!'); 
                //console.log('Firmware Download Fail!!'); 
                return 
              }
              console.log("http error ==> ", res_.status) 
            }
          }catch(error) { 
            loofStac++;   i--;
            if( loofStac > 5 ){ 
              try{
                let fileCrc = CRC16_CCITT(fileData);
                ipcData.command = 0xDC;   // 다운로드 종료
                ipcData.data = [];
                ipcData.data[0] = uintID; // uint ID 0x00 : ps700, 0xA0 : ps800
                ipcData.data[1] = 100;    // SW Ver
                ipcData.data[2] = 100;    // FPGA Ver
                ipcData.data[3] = (length>>8)&0xFF;    // 총 프레임 길이. MSB
                ipcData.data[4] = length&0xFF;         // 총 프레임 길이. LSB
                ipcData.data[5] = (fileCrc>>8)&0xFF;   // file CRC. MSB
                ipcData.data[6] = fileCrc&0xFF;        // file CRC. LSB
                ipcData.data[7] = 0x80;   // reserved
                const datas__ = { ipcData: ipcData }
                const res__ = await fetch("/api/serialCommunication", {
                  timeout: 10000,		// 10초 타임아웃 제한..
                  method: "POST",
                  headers: { "Content-Type": "application/json;charset=utf-8" },
                  body: JSON.stringify( datas__ ),
                })
                if(res__.ok){ 
                  // 여기서 실패했을때 알람을 어케할껀지.
                  // 아래에 그대로 둘껀지 나중에 정하기로 합시다. 
                }
              }catch (error){
                console.log("error catch ==> ", error);
              }
              alert('Firmware Download Fail!!'); 
              console.log('Firmware Download Fail!!'); 
              return 
            }
            console.log("error catch ==> ", error)
          }
        }
      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }
  const MCUDownlaod = async() => {
    try {
      console.log('MCU firmware Download Start!!!');
      let ipcData = {
        command: 0xD0,
        numberOfcommand : 1,
        band: 3,
        data: []
      };
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
        let length = Math.floor(fileData.length/2048)+1;
        let firmware = [...fileData];
        let loofStac = 0;
        for (let i = 0; i < length; i++) {
          try{
            ipcData.command = 0xD2;
            ipcData.data = [i, ...firmware.slice((i*2048), ((i*2048)+2048))];
            const datas_ = { ipcData: ipcData }
            const res_ = await fetch("/api/serialCommunication", {
              timeout: 10000,		// 10초 타임아웃 제한..
              method: "POST",
              headers: { "Content-Type": "application/json;charset=utf-8" },
              body: JSON.stringify( datas_ ),
            })
  
            if(res_.ok){
              const result_ = await res_.json();
              const responseData_ = result_.result;
              let protocolData = convertDataSerialToObject(responseData_);
              loofStac = 0;
              setfileProgress((i+1)/length*100);
              console.log('Packet Number ===> ', i+1, '/', length);
              if( (protocolData.data[0]+1) == length ){
                ipcData.command = 0xD4;
                ipcData.data = [];
                const datas__ = { ipcData: ipcData }
                try{
                  const res__ = await fetch("/api/serialCommunication", {
                    timeout: 10000,		// 10초 타임아웃 제한..
                    method: "POST",
                    headers: { "Content-Type": "application/json;charset=utf-8" },
                    body: JSON.stringify( datas__ ),
                  })

                  if(res__.ok){ 
                    alert('MCU firmware Download Successfull!!!!');
                    //console.log('firmware Download Successfull!!!!'); 
                  }
                  else{ console.log("http error ==> ", res__.status) }
                }catch (error) { console.log("error catch ==> ", error) }
                
              }
            }else{ 
              loofStac++;   i--;
              if( loofStac > 5 ){ console.log('Firmware Download Fail!!'); return }
              console.log("http error ==> ", res_.status) 
            }
          }catch(error) { 
            loofStac++;   i--;
            if( loofStac > 5 ){ console.log('Firmware Download Fail!!'); return }
            console.log("error catch ==> ", error) 
          }
        }
      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }

  const FileLoadWeb = ( e ) => {
    if(e.target.files[0]){
      setFileWeb(e.target.files[0]);
      setFileWebSize(e.target.files[0].size)
      console.log("e.target.files[0] ===> ", e.target.files[0])
      console.log(e.target.files[0].name);
    }else{
      setFileWeb();
    }
  }

  const WebDownloadStart = async(e) => {
    console.log("submit clicked..!")
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", fileWeb);
    // formData.append("data", { name: "gofogo" });
    console.log(e);
    try{
      const res = await fetch("/api/exeUpdateFromFile", {
        method: "POST",
        body: formData,
        // headers: { "Content-Type": "multipart/form-data", },
      })
      if(res.ok) {
        const result = await res.json()
        console.log("http okay ==> ", res.status, result)
        alert("update successed..! You will be SignOut..")
        
        window.location.reload(true)    // 페이지 새로고침 :: true:서버에서 다시 가져오기, false:캐쉬에서 가져오기
        removeLogined();                // 세션스토리지에서 로그인 정보 삭제
        window.localStorage.removeItem('productNumber');
        window.localStorage.removeItem('serialNumber');
        window.localStorage.removeItem('lastAccess');
        navigate('/', {replace:true});  // 페이지 이동
        // navigate('/admin/firmwareDownload', { replace:true })
      }
    } catch (error) { console.log("error catch ==> ", error) }
  }



  const crc16tab = [
    0x0000,0x1021,0x2042,0x3063,0x4084,0x50a5,0x60c6,0x70e7,
      0x8108,0x9129,0xa14a,0xb16b,0xc18c,0xd1ad,0xe1ce,0xf1ef,
      0x1231,0x0210,0x3273,0x2252,0x52b5,0x4294,0x72f7,0x62d6,
      0x9339,0x8318,0xb37b,0xa35a,0xd3bd,0xc39c,0xf3ff,0xe3de,
      0x2462,0x3443,0x0420,0x1401,0x64e6,0x74c7,0x44a4,0x5485,
      0xa56a,0xb54b,0x8528,0x9509,0xe5ee,0xf5cf,0xc5ac,0xd58d,
      0x3653,0x2672,0x1611,0x0630,0x76d7,0x66f6,0x5695,0x46b4,
      0xb75b,0xa77a,0x9719,0x8738,0xf7df,0xe7fe,0xd79d,0xc7bc,
      0x48c4,0x58e5,0x6886,0x78a7,0x0840,0x1861,0x2802,0x3823,
      0xc9cc,0xd9ed,0xe98e,0xf9af,0x8948,0x9969,0xa90a,0xb92b,
      0x5af5,0x4ad4,0x7ab7,0x6a96,0x1a71,0x0a50,0x3a33,0x2a12,
      0xdbfd,0xcbdc,0xfbbf,0xeb9e,0x9b79,0x8b58,0xbb3b,0xab1a,
      0x6ca6,0x7c87,0x4ce4,0x5cc5,0x2c22,0x3c03,0x0c60,0x1c41,
      0xedae,0xfd8f,0xcdec,0xddcd,0xad2a,0xbd0b,0x8d68,0x9d49,
      0x7e97,0x6eb6,0x5ed5,0x4ef4,0x3e13,0x2e32,0x1e51,0x0e70,
      0xff9f,0xefbe,0xdfdd,0xcffc,0xbf1b,0xaf3a,0x9f59,0x8f78,
      0x9188,0x81a9,0xb1ca,0xa1eb,0xd10c,0xc12d,0xf14e,0xe16f,
      0x1080,0x00a1,0x30c2,0x20e3,0x5004,0x4025,0x7046,0x6067,
      0x83b9,0x9398,0xa3fb,0xb3da,0xc33d,0xd31c,0xe37f,0xf35e,
      0x02b1,0x1290,0x22f3,0x32d2,0x4235,0x5214,0x6277,0x7256,
      0xb5ea,0xa5cb,0x95a8,0x8589,0xf56e,0xe54f,0xd52c,0xc50d,
      0x34e2,0x24c3,0x14a0,0x0481,0x7466,0x6447,0x5424,0x4405,
      0xa7db,0xb7fa,0x8799,0x97b8,0xe75f,0xf77e,0xc71d,0xd73c,
      0x26d3,0x36f2,0x0691,0x16b0,0x6657,0x7676,0x4615,0x5634,
      0xd94c,0xc96d,0xf90e,0xe92f,0x99c8,0x89e9,0xb98a,0xa9ab,
      0x5844,0x4865,0x7806,0x6827,0x18c0,0x08e1,0x3882,0x28a3,
      0xcb7d,0xdb5c,0xeb3f,0xfb1e,0x8bf9,0x9bd8,0xabbb,0xbb9a,
      0x4a75,0x5a54,0x6a37,0x7a16,0x0af1,0x1ad0,0x2ab3,0x3a92,
      0xfd2e,0xed0f,0xdd6c,0xcd4d,0xbdaa,0xad8b,0x9de8,0x8dc9,
      0x7c26,0x6c07,0x5c64,0x4c45,0x3ca2,0x2c83,0x1ce0,0x0cc1,
      0xef1f,0xff3e,0xcf5d,0xdf7c,0xaf9b,0xbfba,0x8fd9,0x9ff8,
      0x6e17,0x7e36,0x4e55,0x5e74,0x2e93,0x3eb2,0x0ed1,0x1ef0
  ];
  const CRC16_CCITT = ( buffer = [] ) =>{
      let crc = 0x0000;
      for (let i = 1; i < buffer.length; i++) {
        crc = (crc<<8) ^ crc16tab[((crc>>8) ^ buffer[i])&0x00FF];
        //console.log(i, crc)
      }
      return crc&0xFFFF;
  }

  

  return (
    <div className="flex">
      <div> {/* NavBar */}
        <AdminNavBarPage />
      </div>
      <div style={{ width: "1030px", height: "100vh" }}>
        <div className="w-full h-1/10 flex font-sans font-bold">   {/* Header */}
          <BsDownload className='text-gray-700 my-auto mr-5' size={50} />
          <p className="w-fit h-fit text-gray-700 text-4xl my-auto">F/W Downlaod</p>
        </div>
        {/* F/W */}
        <div className="w-full h-userMain">   {/* body */}
          <div className="w-full h-1/5 font-sans font-semibold">
            <div className="w-full h-1/4 flex">
              <button className="w-32 h-7 text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4"
                      onClick={FileLoad}
              >Choose File</button>
              <p className="w-fit h-fit text-lg my-auto">Selected file name : {fileName}</p>
            </div>
            <div className="w-full h-1/4 flex">
              <p className="w-fit h-fit text-lg my-auto">File size : {fileSize} Byte</p>
              <p className="w-fit h-fit text-lg my-auto ml-10">Progress : {fileProgress}%</p>
            </div>

            <div className="w-full h-1/4 flex">
              <p className="w-fit h-fit text-lg my-auto" hidden>File size : {fileSize} Byte</p>
            </div>
            <div className="w-full h-1/4">
              <button className="w-72 h-10 text-white text-xl rounded-lg bg-indigo-500 mt-4 hover:bg-indigo-900"
                      onClick={FirmwareDownloadStart}
              >Start Firmware Download</button>
            </div>
          </div>

          {/* WEB */}
          <form action="#" method="POST" onSubmit={(e)=>{WebDownloadStart(e)}} encType="multipart/form-data" className="w-full h-1/5 font-sans font-semibold mt-16">
            <div className="w-full h-1/4 flex text-xl text-indigo-600">
              <BsBoxArrowUp className='text-indigo-700 mr-1.5 mt-1.5'/> WebService Update from File (*.tgz)
            </div>
            <div className="w-full h-1/4 flex">
              {/* <button className="w-32 h-7 text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4"
                      onClick={FileLoad}
              >Choose File</button>
              <p className="w-fit h-fit text-lg my-auto">Selected file name : {fileName}</p> */}
              {/* <label className="block mb-2 text-sm font-medium text-gray-900 " htmlFor="file_input">Upload file</label> */}
              <input 
                className="block w-fit text-md text-gray-900 bg-gray-50 rounded-sm border border-gray-300 cursor-pointer disabled:cursor-not-allowed" 
                id="file_input" 
                type="file"
                accept=".tgz"
                onChange={(e)=>{FileLoadWeb(e)}}
                disabled={ false } 
              />
            </div>
            <div className="w-full h-1/4 flex">
              <p className="w-fit h-fit text-lg my-auto">File size : {fileWebSize / 1000000.0} MB</p>
            </div>
            <div className="w-full h-1/4">
              <button type="submit"
                      disabled={ !fileWeb }
                      className="w-72 h-10 text-white text-xl rounded-lg bg-indigo-500 mt-4 hover:bg-indigo-900 disabled:cursor-not-allowed"
                      // onClick={FirmwareDownloadStart}
              >Start WebService Update</button>
            </div>
          </form>


          <div className="w-full h-3/5 font-sans font-semibold mt-16">
            <div className="w-full h-fit mt-5 flex">
              <div className="w-1/5 h-fit">
                <p className="w-fit h-fit text-lg my-auto">MCU F/W Ver </p>
                <p className="w-fit h-fit text-lg my-auto">DTU F/W Ver-PS700 </p>
                <p className="w-fit h-fit text-lg my-auto">DTU F/W Ver-PS800 </p>
                <p className="w-fit h-fit text-lg my-auto">DTU FPGA Ver-PS700 </p>
                <p className="w-fit h-fit text-lg my-auto">DTU FPGA Ver-PS800 </p>
                <p className="w-fit h-fit text-lg my-auto">WEB Ver </p>
              </div>
              <div className="w-1/4 h-fit">
                <p className="w-fit h-fit text-lg my-auto"> : {commonState.MCUVer}</p>
                <p className="w-fit h-fit text-lg my-auto"> : {commonState.PS700DTUVer}</p>
                <p className="w-fit h-fit text-lg my-auto"> : {commonState.PS800DTUVer}</p>
                <p className="w-fit h-fit text-lg my-auto"> : {commonState.PS700FPGAVer}</p>
                <p className="w-fit h-fit text-lg my-auto"> : {commonState.PS800FPGAVer}</p>
                <p className="w-fit h-fit text-lg my-auto"> : 1.0.0</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminFirmwareDownloadPage