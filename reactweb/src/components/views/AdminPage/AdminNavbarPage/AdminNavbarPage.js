import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LastAccessChange } from '../../../../_reducers/commonSlice'
import { BsGear, BsCpu, BsTable, BsDownload, BsWifi, BsBoxArrowLeft } from "react-icons/bs";
import { AiOutlineMonitor } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";

import { isLoginedCheck } from '../../../lib/common'




function AdminNavBarPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

	const NavbarDTUStastus = (e) =>{
    e.preventDefault();
    navigate('/admin/DTUStatus');
  }
	const NavbarMCUControl = (e) =>{
    e.preventDefault();
    navigate('/admin/MCUControl');
  }
	const NavbarAttenTable = (e) =>{
    e.preventDefault();
    navigate('/admin/attenTable');
  }
	const NavbarTemperatureAttenTable = (e) =>{
    e.preventDefault();
    navigate('/admin/temperatureAttenTable');
  }
	const NavbarPowerAmpPowerTable = (e) =>{
    e.preventDefault();
    navigate('/admin/powerAmpPowerTable');
  }
	const NavbarFirmwareDownlaod = (e) =>{
    e.preventDefault();
    navigate('/admin/firmwareDownload');
  }
	const navbarDataExportDownload = (e) =>{
    e.preventDefault();
    navigate('/admin/dataExportDownload');
  }
	const NavbarNetworkConfiguration = (e) =>{
    e.preventDefault();
    navigate('/admin/networkConfiguration');
  }
	const NavbarJDTECKGUI = (e) =>{
    e.preventDefault();
    navigate('/user/dashboard');
  }

  	useEffect(() => {
		if(! isLoginedCheck()) {
			navigate('/', { replace:true })
		} else {
			dispatch(LastAccessChange(new Date().toLocaleString('en-us')));	// 마지막 접속시간 기록..
		}
	},[])
	

  
  return (
    <div className='bg-indigo-100' style={{ justifyContent:'center', width:'220px', height:'100vh', backgroundColor:'#eeeeff',marginRight:'18px' }}>
			<div className='w-full h-1/10'>
				<p className='w-full h-fit text-3xl font-bold font-sans italic text-center text-gray-700 pt-2'>Administrator</p>
			</div>
			

			<div className='w-full h-9/10 text-stone-500 text-lg font-semibold font-sans'>
				<button id='navbarButtonDTUStatus' className='w-48 h-14 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarDTUStastus}>
					<AiOutlineMonitor className='m-2 my-auto' size="35" />
					<p className='w-40 h-fit my-auto'>DTU Status</p>
				</button><br />
				<button id='navbarButtonMCUControl' className='w-48 h-14 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarMCUControl}>
					<BsCpu className='m-2 my-auto' size="35" />
					<p className='w-40 h-fit my-auto'>MCU Control</p>
				</button><br />
				<button id='navbarButtonAttenTable' className='w-48 h-14 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarAttenTable}>
					<BsTable className='m-2 my-auto' size="30" />
					<p className='w-40 h-fit my-auto'>Atten Table</p>
				</button><br />
				<button id='navbarButtonTemperatureAttenTable' className='w-48 h-14 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarTemperatureAttenTable}>
					<BsTable className='m-2 my-auto' size="30" />
					<p className='w-40 h-fit text-sm my-auto'>Temp compensation Table</p>
				</button><br />
				<button id='navbarButtonPowerAmpPowerTable' className='w-48 h-14 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarPowerAmpPowerTable}>
					<BsTable className='m-2 my-auto' size="30" />
					<p className='w-40 h-fit text-sm my-auto'>Power Amp <br /> Output Power Table</p>
				</button><br />
				<button id='navbarButtonFirmwareDownload' className='w-48 h-14 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarFirmwareDownlaod}>
					<BsDownload className='m-2 my-auto' size="30" />
					<p className='w-40 h-fit my-auto'>F/W Downlaod</p>
				</button><br />
				<button id='navbarButtonDataExportDownload' className='w-48 h-14 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={navbarDataExportDownload}>
					<BsDownload className='m-2 my-auto' size="30" />
					<p className='w-40 h-fit text-base my-auto'>Data Export & Download</p>
				</button><br />
				<button id='navbarButtonDTUStatus' className='w-48 h-14 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex' onClick={NavbarNetworkConfiguration}>
					<BsWifi className='m-2 my-auto' size="30" />
					<p className='w-40 h-fit text-base my-auto'>Network Configuration</p>
				</button><br />
				<button id='navbarButtonDTUStatus' className='w-48 h-14 rounded float-right stroke-0 hover:bg-indigo-600 hover:text-white flex mt-14' onClick={NavbarJDTECKGUI}>
					<BsBoxArrowLeft className='m-2 my-auto' size="30" />
					<p className='w-40 h-fit my-auto'>JDTECK GUI</p>
				</button><br />
			</div>
    </div>
  )
}

export default AdminNavBarPage