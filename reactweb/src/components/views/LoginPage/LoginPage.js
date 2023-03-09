import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
// import UserDashBoardPage from '../UserPage/UserDashBoardPage/UserDashBoardPage';
import { LastAccessChange } from '../../../_reducers/commonSlice'
import { BsFillLockFill } from "react-icons/bs";
// import { ErrorMessage } from '../../Renderer/Renderer'
// const { SerialPort } = window.require('serialport')
// const { ipcRenderer } = window.require('electron')

import { isLoginedCheck, useInterval, convertDataSerialToObject } from '../../lib/common'

function LoginPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [id, setid] = useState("")
	const [Password, setPassword] = useState("")
	const [comPort, setcomPort] = useState([])
	const date = new Date();
	let createComport;

	const [statusServerApi, setStatusServerApi] = useState(false)


	useEffect(() => {
		if(isLoginedCheck()) { navigate('/user/dashBoard', { replace:true })}	// 참고 >> https://basemenks.tistory.com/278
		// CheckComPort();
	},[])

	/*******************************************************
	* useInterval 타이머 사용 ...
	*******************************************************/
	useInterval(() => {
		// Your custom logic here
    	console.log("interval...")
		checkServerApi()	// API 서버 상태 주기적으로 체크/갱신..

	}, 1500);

	

	const onIdHandler = (event) => {
		setid(event.currentTarget.value)
	}
	const onPasswordHandler = (event) => {
		setPassword(event.currentTarget.value)
	}

	const CheckComPort = () => {
		// SerialPort.list().then((ports, err) => {
		// 		if(err){ console.log('err : ', err) }
		// 		else{ setcomPort(ports) }
		// })
	}
	

	const checkServerApi = async() => {
		try {
			const datas = {  }
			const res = await fetch("/api/checkServerApi", {
				timeout: 1000,		// 1초 타임아웃 제한..
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
				const result = await res.json()
        		console.log("http okay ==> ", res.status, result)
				// 받아온 결과값들 가지고 처리하기..
				if(result.message === "success"){
					console.log("Alive API Server..")
					// API 서버 살아있는 상태로 표시..
					setStatusServerApi(true)
				}
			}else { 
				console.log("Dead API Server.. http error ==> ", res.status) 
				// API 서버 다운된 상태로 표시..
				setStatusServerApi(false)
			}
		} catch (error) { console.log("error catch ==> ", error) }
	}


	const RecallModuleInformation = async() => {
		console.log("RecallModuleInformation execute..")
		try {
			const datas = { ipcData: {
			command: 0xB0,
			numberOfCommand: 2,
			band: 0x03,
			data: [0x3E, 0x52]		//3E : 시간, 52: 장비 정보
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
				const responseData = convertDataSerialToObject(dataSerial)

				let addr = 1;
				let date, time;
				let share;
				let remain;
				let value = [];
				console.log(value);
				
				for (let i = 1; i < 7; i++) {
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


				
				// let date, time;
				// let addr = 1;		// command 스킵을 위해 초기값 1로 설정

				// date = '20' + (responseData.data[addr]<10? '0':'') + responseData.data[addr].toString() + '-';		addr++;
				// date += responseData.data[addr].toString() + '-';			addr++;
				// date += responseData.data[addr].toString();					addr++;

				// time = responseData.data[addr].toString() + ':';		addr++;
				// time += responseData.data[addr].toString() + ':';		addr++;
				// time += responseData.data[addr].toString();				addr++;

				addr++;		//command 스킵

				let string = '';

				for( let i = addr; i<responseData.data.length; i++){
				string += responseData.data[i] === 0x00 ? 0x00:String.fromCharCode(responseData.data[i]);
				}

				let productData = string.split(0x00);

				//productData[3] = productData[3].replace("X", "");
				
				let moduleInfo = {
					lastAccess: date + '  ' + time,
					productNumber: productData[1],
					serialNumber: productData[2]
				}
				console.log(moduleInfo);
				window.localStorage.setItem('lastAccess', date + ' / ' + time);
				window.localStorage.setItem('productNumber', productData[1]);
				window.localStorage.setItem('serialNumber', productData[2]);

				try{
					//console.log('#################1')
					const res_ = await fetch("/api/snmpModuleInfomation", {
						method: "POST",
						headers: { "Content-Type": "application/json;charset=utf-8" },
						body: JSON.stringify( productData ),
					})
					console.log('#################2')
					if(res_.ok){
						let ressult_ =  await res_.json()
						console.log('Modeule info Trans Success!! ===> ', ressult_)
					}else { console.log("http error ==> ", res_.status) }

				}catch (error) { console.log("error catch ==> ", error) }

				return	productData;
				// Post 통신 한번 진행. => SNMP 데이터를 위한 Post 통신(장비 정보만 back의 snmp에 저장)

			}else { console.log("http error ==> ", res.status) }
		} catch (error) { console.log("error catch ==> ", error) }
	}

	const onSubmitHandler = async(e) => {
		// if( e.target.id.value == 'prdi' ){
		// 	if( e.target.password.value == 'prdi' ){
		// 		// 여기서 Serial Open 진행
		// 		let userInfo = { id: e.target.id.value, login: true, comPort: e.target.comSelect.value };
				
		// 		// window.localStorage.setItem("user", JSON.stringify(userInfo));
		// 		// console.log(window.localStorage.getItem('user'))

		// 		dispatch(LastAccessChange(date.toLocaleString('en-us')));
		// 		// ipcRenderer.send('SerialOpen', e.target.comSelect.value);
				
		// 		navigate('/user/dashBoard');
		// 	}else{
				
		// 		// ErrorMessage('Password','Error')	/* Error masage로 변경 */
		// 		alert('Password Error')	/* Error masage로 변경 */
		// 	}
		// }else{
		// 	// ErrorMessage('ID','Error')
		// 	alert('ID Error')
		// }

		e.preventDefault()	// submit 이벤트 방지.. react 에선 return false; 를 지원하지 않음..
		const inputId = e.target.id.value
		const inputPassword = e.target.password.value
		console.log("#1!!!!!!!!!!!!!!!!!!!!111111111")
		try {
			console.log("request Log in =====================>> try")
			const datas = { id: inputId, password: inputPassword }
			// const res = await fetch("http://localhost:5001/dbLoginCheck/", {
			const res = await fetch("/api/dbLoginCheck", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
				const result = await res.json()
        		console.log("http okay ==> ", res.status, result)
				// 받아온 결과값들 가지고 처리하기..
				if(result.message === "success"){
					console.log("로그인 성공, 페이지 이동..")
					// 요청 데이터 : 현재 장비 시간, Serial Number, Product Number 총 3가지 요청.
					let moduleInfo = await RecallModuleInformation();	// 장비 정보 요청

					//dispatch(LastAccessChange(date.toLocaleString('en-us')));	// 마지막 접속시간 기록..
					dispatch(LastAccessChange(window.localStorage.getItem('lastAccess')))
					sessionStorage.setItem("loginId", inputId)					// ID 값 저장..
					navigate('/user/dashBoard', {replace:true});				// 페이지 전환..
				}else{
					console.log("로그인 실패, 페이지 이동하지 않음..")
					alert('Login Failed.')
				}
			}else { console.log("http error ==> ", res.status) }
		} catch (error) { console.log("error catch ==> ", error) }
	}

	const renderCards = comPort.map((d, i) => {

		return <option
				key={d.path}
				className="text-center"
				value={d.path}
			>
				{d.path}	
			</option>
	})

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-indigo-50" style={{height: '100vh'}}>
			<div className="w-full max-w-md space-y-8">
				<div>
					<div className="w-full h-fit">
						<p className="w-fit h-fit m-auto text-indigo-900 font-sans font-bold text-9xl">JDTECK</p>
					</div>
					<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
				</div>
				<form className="mt-8 space-y-6" action="#" onSubmit={onSubmitHandler}>
				{/* <form className="mt-8 space-y-6" > */}
					<div className="-space-y-px rounded-md shadow-sm">
						<div>
							<input id="id" 
								name="id"
								type="text" 
								required 
								className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
								placeholder="Id" />
						</div>
						<div>
							<input 
								id="password" 
								name="password" 
								type="password" 
								autoComplete="current-password" 
								required 
								className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
								placeholder="Password" />
						</div>
					</div>
					{/* <div className="">
						<select 
							id="comSelect"
							className="relative block w-1/4 rounded-lg border border-gray-300 py-1 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-center" 
							placeholder="COM"
						>
							{renderCards}
						</select>
					</div> */}
					<div className='w-full flex justify-center'>
						<p className='w-auto align-middle text-lg'>API Server's Status :</p>
						{statusServerApi 
							? <div className='w-7 ml-3 border border-gray-500 rounded-full bg-green-400'></div>
							: <div className='w-7 ml-3 border border-gray-500 rounded-full bg-gray-300'></div>
						}
					</div>

					<div>
						<button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3">
								<BsFillLockFill className="text-indigo-500 group-hover:text-indigo-400" size={20} />
							</span>
							Sign in
						</button>
					</div>
				</form>
        </div>
    	</div> 
  )
}

export default LoginPage