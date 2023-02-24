import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LastAccessChange } from '../../../../_reducers/commonSlice'
import { BsFileEarmarkPerson, BsBroadcastPin, BsGear, BsCpu } from "react-icons/bs";
import { AiOutlineDashboard, AiOutlineAlert, AiOutlineDatabase, AiOutlineLogout } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
// const { ipcRenderer } = window.require('electron');

import { isLoginedCheck, removeLogined } from '../../../lib/common'

function UserNavbar(props) {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const commonstate = useSelector((state) => state.commonSlice);
  const [lastAccess, setlastAccess] = useState(window.localStorage.getItem('lastAccess'));
  const [productNumber, setproductNumber] = useState(window.localStorage.getItem('productNumber'));
  const [serialNumber, setserialNumber] = useState(window.localStorage.getItem('serialNumber'));
  const [verGUI, setverGUI] = useState('1.0.0');
  

  const NavbarDashboardClick = (e) =>{
    e.preventDefault();
    navigate('/user/dashboard');
  }
  const NavbarBandSelectClick = (e) =>{
    e.preventDefault();
    navigate('/user/bandSelect');
  }
  const NavbarSetParameterClick = (e) =>{
    e.preventDefault();
    navigate('/user/setParameter');
  }
  const NavbarSetAlarmsClick = (e) =>{
    e.preventDefault();
    navigate('/user/setAlarm');
  }
  const NavbarRegsterClick = (e) =>{
    e.preventDefault();
    navigate('/user/register');
  }
  const NavbarViewLogsClick = (e) =>{
    e.preventDefault();
    navigate('/user/viewLogs');
  }
  const NavbarAdminClick = (e) =>{
    e.preventDefault();
    navigate('/admin/DTUStatus');
  }
  const NavbarSignOutClick = (e) =>{
    // window.localStorage.clear();
    // ipcRenderer.send('SerialClose')
    e.preventDefault();
    removeLogined();                // 세션스토리지에서 로그인 정보 삭제
    window.localStorage.removeItem('productNumber');
    window.localStorage.removeItem('serialNumber');
    window.localStorage.removeItem('lastAccess');
    navigate('/', {replace:true});  // 페이지 이동
  }

  useEffect(() => {
		if(! isLoginedCheck()) {
      navigate('/', { replace:true })
    } else {
      //dispatch(LastAccessChange(new Date().toLocaleString('en-us')));	// 마지막 접속시간 기록..
    }
	},[])

  return (
    <div style={{ justifyContent:'center', width:'220px', height:'100vh', backgroundColor:'#eeeeff',marginRight:'18px', minHeight: '820px' }}>
      <div className='text-1xl font-bold p-5'>
        <div>
          <p className='w-48 h-14 font-sans text-center text-4xl text-indigo-800 italic'>JDTECK</p>
        </div>
        <div className='w-48 h-36 box-border border-2 border-violet-200 rounded-xl text-xs'>
          <div className='p-2 text-stone-500'>
            <p className='text-base'>Last Access:</p>
            <p id='navbarLastAccess'>&nbsp;&nbsp;&nbsp;{lastAccess}</p> 
            <p className='text-base'>Product Number:</p>
            <p id='navbarProductNumber'>&nbsp;&nbsp;&nbsp;{productNumber}</p>
            <p className='text-base'>Serial Number:</p>
            <p id='navbarSerialNumber'>&nbsp;&nbsp;&nbsp;{serialNumber}</p>
          </div>
        </div>
      </div>

      <div className='w-full h-2/5 text-stone-500 text-lg font-semibold font-sans'>
        <button id='navbarButtonDashboard' className='w-48 h-12 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarDashboardClick}>
          <AiOutlineDashboard className='m-2' size="30" />
          <p className='m-auto'>Dashboard</p>
        </button>
        <button id='navbarButtonBandSelect' className='w-48 h-12 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarBandSelectClick}>
          <BsBroadcastPin className='m-2' size="30" />
          <p className='m-auto'>Band Select</p>
        </button><br />
        <button id='navbarButtonSetParameter' className='w-48 h-12 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarSetParameterClick}>
          <BsCpu className='m-2' size="30" />
          <p className='m-auto'>Set Parameter</p>
        </button><br />
        <button id='navbarButtonSetAlarms' className='w-48 h-12 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarSetAlarmsClick}>
          <AiOutlineAlert className='m-2' size="30" />
          <p className='m-auto'>Set Alarms</p>
        </button><br />
        <button id='navbarButtonRegister' className='w-48 h-12 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarRegsterClick}>
          <BsFileEarmarkPerson className='m-2' size="30" />
          <p className='m-auto'>Register</p>
        </button><br />
        <button id='navbarButtonViewLogs' className='w-48 h-12 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarViewLogsClick}>
          <AiOutlineDatabase className='m-2' size="30" />
          <p className='m-auto'>View Logs</p>
        </button><br />
      </div>
      
      <div className='w-full h-1/8 text-stone-500 font-semibold font-sans text-lg mt-auto'>
        <button id='navbarButtonAdmin' className='w-48 h-12 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarAdminClick}>
          <BsGear className='m-2' size="30" />
          <p className='m-auto'>Admin</p>
        </button><br />
        <button id='navbarButtonSignOut' className='w-48 h-12 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarSignOutClick}>
          <AiOutlineLogout className='m-2' size="30" />
          <p className='m-auto'>Sign Out</p>
        </button><br />
      </div>

      <div className='w-full h-1/8 text-stone-500 font-semibold font-sans pt-4 mb-0'>
        <div className='w-full h-2/3 flex justify-center'>
          <p className='w-auto h-full align-middle text-lg'>Tx :</p>
          <div id='NavbarTxLED' className='w-8 h-8 ml-3 border-2 border-gray-500 rounded-full bg-gray-300'></div>
          <p className='w-auto h-full ml-7 text-lg'>Rx :</p>
          <div id='NavbarRxLED' className='w-8 h-8 ml-3 border-2 border-gray-500 rounded-full bg-gray-300'></div>
        </div>
        <div className='w-full h-auto flex justify-end pr-10'>
          <p>ver : {verGUI}</p>
        </div>
      </div>
    </div>
  )
}

export default UserNavbar