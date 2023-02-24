import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminNavBarPage from '../AdminNavbarPage/AdminNavbarPage'
import { BsWifi, BsMailbox2, BsFillDiagram3Fill } from "react-icons/bs";
import { randomNumberInRange, useInterval, convertDataSerialToObject } from '../../../lib/common'




function AdminNetworkConfigurationPage() {
  const [ip, setip] = useState([0,0,0,0]);
  const [subnetMask, setsubnetMask] = useState([0,0,0,0]);
  const [gateway, setgateway] = useState([0,0,0,0]);
  const [dhcp, setdhcp] = useState(true);
  
  const [port, setport] = useState('Set by BBBI (5000)');

  const [targetSnmpIp, setTargetSnmpIp] = useState([0,0,0,0])

  const [smtpHost, setSmtpHost] = useState("")
  const [smtpSiteID, setSmtpSiteID] = useState("")
  const [smtpType, setSmtpType] = useState("NONE")
  const [smtpPort, setSmtpPort] = useState("")
  const [smtpUserId, setSmtpUserId] = useState("")
  const [smtpUserPwd, setSmtpUserPwd] = useState("")
  const [emailNotificationEnalbe, setEmailNotificationEnable] = useState("DISABLE")
  const [emailNotificationAddress, setEmailNotificationAddress] = useState(["","","","",""])

  const changeRecipientEmails = (e) => {
    let data = [...emailNotificationAddress]
    data[e.target.name] = e.target.value
    setEmailNotificationAddress(data)
  }

  const targetSnmpIpChange = (e) => {
    let data = [...targetSnmpIp]
    if( (Number(e.target.value)!=NaN) || (e.target.value=='') ){
      if( e.target.value > 255 ){ e.target.value = 255; }
      else if( e.target.value < 0 ){ e.target.value = 0; }
      e.target.value = (e.target.value*1).toFixed(0)
      data[e.target.name] = e.target.value;

      setTargetSnmpIp(data);
    }
  }

  const ipChange = (e) => {
    let data = [...ip]
    if( (Number(e.target.value)!=NaN) || (e.target.value=='') ){
      if( e.target.value > 255 ){ e.target.value = 255; }
      else if( e.target.value < 0 ){ e.target.value = 0; }
      e.target.value = (e.target.value*1).toFixed(0)
      data[e.target.name] = e.target.value;

      setip(data);
    }
  }
  const subnetMaskChange = (e) => {
    let data = [...subnetMask]
    if( (Number(e.target.value)!=NaN) || (e.target.value=='') ){
      if( e.target.value > 255 ){ e.target.value = 255; }
      else if( e.target.value < 0 ){ e.target.value = 0; }
      e.target.value = (e.target.value*1).toFixed(0)
      data[e.target.name] = e.target.value;
      setsubnetMask(data);
    }
  }
  const gatewayChange = (e) => {
    let data = [...gateway]
    if( (Number(e.target.value)!=NaN) || (e.target.value=='') ){
      if( e.target.value > 255 ){ e.target.value = 255; }
      else if( e.target.value < 0 ){ e.target.value = 0; }
      e.target.value = (e.target.value*1).toFixed(0)
      data[e.target.name] = e.target.value;
      setgateway(data);
    }
  }
  const dhcpChange = (e) => {
    setdhcp(e.target.checked);
  }

  const DownloadMib = async() => {
    console.log("DownloadMib clicked..")
  }

  const SendingTestSnmp = async() => {
    // console.log("SendingTestSnmp clicked..")
    try {
			const datas = {  }
			const res = await fetch("/api/exeSnmpTrapTest", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
				const result = await res.json()
        console.log("http okay ==> ", res.status, result)
				// 받아온 결과값들 가지고 처리하기..
				if(result.message=="success" && result.sending=="success"){
          alert("Succeed..")
        // }else if(result.message=="success" && result.sending=="not"){
        //   alert("Don't Sending.. Notify is Disabled..")
        }else if(result.message=="success" && result.sending=="fail"){
          alert("Sending Fail..")
        }else{
          alert("Fail..")
        }
			}else { console.log("http error ==> ", res.status) }
		} catch (error) { console.log("error catch ==> ", error) }
  }
  const SendingTestEmail = async() => {
    // console.log("SendingTestEmail clicked..")
    try {
			const datas = {  }
			const res = await fetch("/api/exeMailTest", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
				const result = await res.json()
        console.log("http okay ==> ", res.status, result)
				// 받아온 결과값들 가지고 처리하기..
				if(result.message=="success" && result.sending=="success"){
          alert("Succeed..")
        }else if(result.message=="success" && result.sending=="not"){
          alert("Don't Sending.. Notify is Disabled..")
        }else if(result.message=="success" && result.sending=="fail"){
          alert("Sending Fail..")
        }else{
          alert("Fail..")
        }
			}else { console.log("http error ==> ", res.status) }
		} catch (error) { console.log("error catch ==> ", error) }
  }
  const ConfirmMail = async() => {
    // console.log("ConfirmMail clicked..")
    try {
      let addressString = ""
      for (let index = 0; index < 5; index++) {
        addressString = addressString + emailNotificationAddress[index].trim()
        if(index < 4) addressString = addressString + ","
      }
      const datas = {
        smtpHost: smtpHost.trim(),
        smtpType: smtpType.trim(),
        smtpPort: smtpPort.trim(),
        smtpUserId: smtpUserId.trim(),
        smtpUserPwd: smtpUserPwd,
        emailNotificationEnalbe: emailNotificationEnalbe.trim(),
        emailNotificationAddress: addressString,
      }
      const res = await fetch("/api/setMail", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify( datas ),
      })
      if(res.ok) {
        const result = await res.json()
        console.log("http okay ==> ", res.status, result)
        alert("Succeed..")

      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }
  const ResetMail = () => {
    console.log("ResetMail clicked..")
    
    setSmtpHost("")
    setSmtpType("NONE")
    setSmtpPort("")
    setSmtpUserId("")
    setSmtpUserPwd("")
    setEmailNotificationEnable("DISABLE")
    setEmailNotificationAddress(["","","","",""])
  }
  const RecallMail = async() => {
    console.log("RecallMail clicked..")
    try {
			const datas = {  }
			const res = await fetch("/api/getMail", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
				const result = await res.json()
        console.log("http okay ==> ", res.status, result)
				// 받아온 결과값들 가지고 처리하기..
				// setip(result.address.split("."))
        setSmtpHost(result.host)
        setSmtpType(result.type)
        setSmtpPort(result.port)
        setSmtpUserId(result.id)
        setSmtpUserPwd(result.password)
        setEmailNotificationEnable(result.notify)
        setEmailNotificationAddress(result.address.split(","))
			}else { console.log("http error ==> ", res.status) }
		} catch (error) { console.log("error catch ==> ", error) }
  }
  const ConfirmSnmp = async() => {
    // console.log("ConfirmSnmp clicked..")
    try {
      let targetIpString = ""
      for (let index = 0; index < 4; index++) {
        targetIpString = targetIpString + targetSnmpIp[index].toString()
        if(index < 3) targetIpString = targetIpString + "."
      }
      const datas = {
        snmpTargetIp: targetIpString,
        siteID : smtpSiteID
      }
      const res = await fetch("/api/setSnmp", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify( datas ),
      })
      if(res.ok) {
        const result = await res.json()
        console.log("http okay ==> ", res.status, result)
        alert("Succeed..")

      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }
  const ResetSnmp = () => {
    console.log("ResetSnmp clicked..")
    setTargetSnmpIp([0,0,0,0])
  }
  const RecallSnmp = async() => {
    console.log("RecallSnmp clicked..")
    try {
			const datas = {  }
			const res = await fetch("/api/getSnmp", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
				const result = await res.json()
        console.log("http okay ==> ", res.status, result)
				// 받아온 결과값들 가지고 처리하기..
				setTargetSnmpIp(result.targetSnmpIp.split("."))
        setSmtpSiteID(result.siteID)
        // 여기서는 site ID 읽어와야하네????? 이걸 serial로 읽어오는게 맞을까? 아니면 db로 저장시키는게 맞을까

        
			}else { console.log("http error ==> ", res.status) }
		} catch (error) { console.log("error catch ==> ", error) }
  }


  const ConfirmClick = async() => {
    try {
      const datas = {
        address: ip[0]+"."+ip[1]+"."+ip[2]+"."+ip[3],
        netmask: subnetMask[0]+"."+subnetMask[1]+"."+subnetMask[2]+"."+subnetMask[3],
        gateway: gateway[0]+"."+gateway[1]+"."+gateway[2]+"."+gateway[3],
        dhcp: dhcp,
      }
      const res = await fetch("/api/setEthernet", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify( datas ),
      })
      if(res.ok) {
        // 그치 여기서 값을 바꿔야지 수동은 문제없지만 DHCP는 알아서 잡는거니까? 
        console.log('Network IP serialData')
        const result = await res.json()
        console.log("http okay ==> ", res.status, result)
        alert("Succeed..")
        window.location.replace('http://'+result.afterIp+":5000/#/admin/networkConfiguration")

      }else { console.log("http error ==> ", res.status) }
    } catch (error) { console.log("error catch ==> ", error) }
  }
  const ResetClick = () => {
    setip([0,0,0,0]);
    setsubnetMask([0,0,0,0]);
    setgateway([0,0,0,0]);
    setdhcp(false);
  }
  const RecallClick = async() => {
    try {
			const datas = {  }
			const res = await fetch("/api/getEthernet", {
				method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
				const result = await res.json()
        console.log("http okay ==> ", res.status, result)
				// 받아온 결과값들 가지고 처리하기..
				setip(result.address.split("."))
        setsubnetMask(result.netmask.split("."))
        setgateway(result.gateway.split("."))
        setdhcp(result.dhcp)
			}else { console.log("http error ==> ", res.status) }
		} catch (error) { console.log("error catch ==> ", error) }
  }

  // 화면 1차적으로 그린뒤, 실행되는 곳..
  useEffect(() => {
		RecallClick()   // 최초 1회 네트워크 정보 가져오기
    RecallMail()    // 최초 1회 메일설정 정보 가져오기
    RecallSnmp()    // 최초 1회 SNMP 정보 가져오기
	},[])

  return (
    <div className="flex">
      <div> {/* NavBar */}
        <AdminNavBarPage />
      </div>
      <div style={{ width: "1030px", height: "100vh" }}>
        <div className="w-full h-1/10 flex font-sans font-bold">   {/* Header */}
          <BsWifi className='text-gray-700 my-auto mr-5' size={50} />
          <p className="w-fit h-fit text-gray-700 text-4xl my-auto">Network Configuration</p>
        </div>

        <div className="w-full h-userMain">   {/* body */}
          <div className="w-full h-fit font-sans font-semibold text-md pt-0">
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">IP Address: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input name={0} className="w-1/5 text-center" type={'text'} value={ip[0]} onChange={ipChange} disabled={dhcp}/> 
                <p>.</p>
                <input name={1} className="w-1/5 text-center" type={'text'} value={ip[1]} onChange={ipChange} disabled={dhcp}/>
                <p>.</p>
                <input name={2} className="w-1/5 text-center" type={'text'} value={ip[2]} onChange={ipChange} disabled={dhcp}/>
                <p>.</p>
                <input name={3} className="w-1/5 text-center" type={'text'} value={ip[3]} onChange={ipChange} disabled={dhcp}/>
              </div>
            </div>

            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">Port :</p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input name={0} className="w-full text-center bg-gray-200" type={'text'} value={port} readOnly/>
              </div>
            </div>

            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">Subnet Mask: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input name={0} className="w-1/5 text-center" type={'text'} value={subnetMask[0]} onChange={subnetMaskChange} disabled={dhcp}/> 
                <p>.</p>
                <input name={1} className="w-1/5 text-center" type={'text'} value={subnetMask[1]} onChange={subnetMaskChange} disabled={dhcp}/>
                <p>.</p>
                <input name={2} className="w-1/5 text-center" type={'text'} value={subnetMask[2]} onChange={subnetMaskChange} disabled={dhcp}/>
                <p>.</p>
                <input name={3} className="w-1/5 text-center" type={'text'} value={subnetMask[3]} onChange={subnetMaskChange} disabled={dhcp}/>
              </div>
            </div>

            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">Gateway: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input name={0} className="w-1/5 text-center" type={'text'} value={gateway[0]} onChange={gatewayChange} disabled={dhcp} /> 
                <p>.</p>
                <input name={1} className="w-1/5 text-center" type={'text'} value={gateway[1]} onChange={gatewayChange} disabled={dhcp} />
                <p>.</p>
                <input name={2} className="w-1/5 text-center" type={'text'} value={gateway[2]} onChange={gatewayChange} disabled={dhcp} />
                <p>.</p>
                <input name={3} className="w-1/5 text-center" type={'text'} value={gateway[3]} onChange={gatewayChange} disabled={dhcp} />
              </div>
            </div>

            <div className="w-full h-fit flex">
              <p className="w-1/5 h-fit text-right mr-5">DHCP: </p>
              <div className="w-1/4 flex justify-between rounded-lg font-medium">
                <label className="switch">
                  <input
                    id={"dhcp"}
                    type="checkbox"
                    checked={dhcp}
                    onChange={dhcpChange}
                  />
                  <span className="slider round"></span>
                </label>
                
              </div>
            </div>
          </div>  

          <div className="w-full h-fit mt-5 mr-0 ml-auto"> {/* button */}
            <div className="w-fit h-fit mr-0 ml-auto font-semibold">
              <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={ConfirmClick}>Confirm</button>
              {/* <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={ResetClick}>Reset</button> */}
              <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={RecallClick}>Recall</button>  
            </div>
          </div>

          {/* SNMP.. */}
          <div className="w-full h-1/10 flex font-sans font-bold mt-5">   {/* Header */}
            <BsFillDiagram3Fill className='text-gray-700 my-auto mr-5' size={50} />
            <p className="w-fit h-fit text-gray-700 text-4xl my-auto">SNMP Configuration</p>
          </div>
          <div className="w-full h-fit font-sans font-semibold text-md pt-2">
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">IP Address to be Notified: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input name={0} className="w-1/5 text-center" type={'text'} value={targetSnmpIp[0]} onChange={targetSnmpIpChange}/> 
                <p>.</p>
                <input name={1} className="w-1/5 text-center" type={'text'} value={targetSnmpIp[1]} onChange={targetSnmpIpChange}/>
                <p>.</p>
                <input name={2} className="w-1/5 text-center" type={'text'} value={targetSnmpIp[2]} onChange={targetSnmpIpChange}/>
                <p>.</p>
                <input name={3} className="w-1/5 text-center" type={'text'} value={targetSnmpIp[3]} onChange={targetSnmpIpChange}/>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">Site ID: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input className="w-full text-center" type={'text'} value={smtpSiteID} onChange={(e)=>{setSmtpSiteID(e.target.value)}}/>
              </div>
            </div>
          </div>
          <div className="w-full h-fit mt-5 mr-0 ml-auto"> {/* button */}
            <div className="w-fit h-fit mr-0 ml-auto font-semibold">
              <a href="/api/download/mib" className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4 p-1 cursor-pointer" >DownloadMIB</a>
              <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={SendingTestSnmp}>SendingTest</button>
              <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={ConfirmSnmp}>Confirm</button>
              {/* <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={ResetSnmp}>Reset</button> */}
              <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={RecallSnmp}>Recall</button>  
            </div>
          </div>

          {/* Mail.. */}
          <div className="w-full h-1/10 flex font-sans font-bold mt-5">   {/* Header */}
            <BsMailbox2 className='text-gray-700 my-auto mr-5' size={50} />
            <p className="w-fit h-fit text-gray-700 text-4xl my-auto">Mail Server Configuration</p>
          </div>

          <div className="w-full h-fit font-sans font-semibold text-md pt-2">
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">SMTP Host: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input className="w-full text-center" type={'text'} value={smtpHost} onChange={(e)=>{setSmtpHost(e.target.value)}}/>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">SMTP Encryption: </p>
              <div className="w-1/4 flex font-medium">
                <div className="flex mt-1.5">
                  <input name='SSL'
                    className="h-fit mt-1 mr-1" 
                    type='checkbox' 
                    checked={smtpType==='SSL'?true:false} 
                    onChange={(e)=>{setSmtpType("SSL")}} />
                  <p className='h-full text-sm font-semibold mr-14 cursor-pointer' onClick={()=>{setSmtpType("SSL")}}>SSL</p>
                </div>
                {/* <div className="flex mt-1.5">
                  <input name='TLS'
                    className="h-fit mt-1 mr-1" 
                    type='checkbox' 
                    checked={smtpType==='TLS'?true:false} 
                    onChange={(e)=>{setSmtpType("TLS")}} />
                  <p className='h-full text-sm font-semibold mr-14 cursor-pointer' onClick={()=>{setSmtpType("TLS")}}>TLS</p>
                </div> */}
                <div className="flex mt-1.5">
                  <input name='NONE'
                    className="h-fit mt-1 mr-1" 
                    type='checkbox' 
                    checked={smtpType==='NONE'?true:false} 
                    onChange={(e)=>{setSmtpType("NONE")}} />
                  <p className='h-full text-sm font-semibold mr-14 cursor-pointer' onClick={()=>{setSmtpType("NONE")}}>NONE</p>
                </div>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">SMTP Port Number: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input className="w-full text-center" type={'text'} value={smtpPort} onChange={(e)=>{setSmtpPort(e.target.value)}}/>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">SMTP User ID: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input className="w-full text-center" type={'email'} value={smtpUserId} onChange={(e)=>{setSmtpUserId(e.target.value)}}/>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">SMTP User Password: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input className="w-full text-center" type={'password'} value={smtpUserPwd} onChange={(e)=>{setSmtpUserPwd(e.target.value)}}/>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">Email Notifications: </p>
              <div className="w-1/4 flex font-medium">
                <div className="flex mt-1.5">
                  <input name='ENABLE'
                    className="h-fit mt-1 mr-1" 
                    type='checkbox' 
                    checked={emailNotificationEnalbe==='ENABLE'?true:false} 
                    onChange={(e)=>{setEmailNotificationEnable("ENABLE")}} />
                  <p className='h-full text-sm font-semibold mr-14 cursor-pointer' onClick={()=>{setEmailNotificationEnable("ENABLE")}}>ENABLE</p>
                </div>
                <div className="flex mt-1.5">
                  <input name='DISABLE'
                    className="h-fit mt-1 mr-1" 
                    type='checkbox' 
                    checked={emailNotificationEnalbe==='DISABLE'?true:false} 
                    onChange={(e)=>{setEmailNotificationEnable("DISABLE")}} />
                  <p className='h-full text-sm font-semibold mr-14 cursor-pointer' onClick={()=>{setEmailNotificationEnable("DISABLE")}}>DISABLE</p>
                </div>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">Recipient Email #1: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input name={0} className="w-full text-center" type={'text'} value={emailNotificationAddress[0]} onChange={changeRecipientEmails}/>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">Recipient Email #2: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input name={1} className="w-full text-center" type={'text'} value={emailNotificationAddress[1]} onChange={changeRecipientEmails}/>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">Recipient Email #3: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input name={2} className="w-full text-center" type={'text'} value={emailNotificationAddress[2]} onChange={changeRecipientEmails}/>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">Recipient Email #4: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input name={3} className="w-full text-center" type={'text'} value={emailNotificationAddress[3]} onChange={changeRecipientEmails}/>
              </div>
            </div>
            <div className="w-full h-fit flex mb-0.5">
              <p className="w-1/5 h-fit text-right mr-5">Recipient Email #5: </p>
              <div className="w-1/4 flex justify-between border border-gray-200 rounded-lg font-medium">
                <input name={4} className="w-full text-center" type={'text'} value={emailNotificationAddress[4]} onChange={changeRecipientEmails}/>
              </div>
            </div>
          </div>

          <div className="w-full h-fit mt-5 mr-0 ml-auto pb-2"> {/* button */}
            <div className="w-fit h-fit mr-0 ml-auto font-semibold">
              <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={SendingTestEmail}>SendingTest</button>
              <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={ConfirmMail}>Confirm</button>
              {/* <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={ResetMail}>Reset</button> */}
              <button className="w-32 h-fit text-white text-lg rounded-lg bg-indigo-500 hover:bg-indigo-900 my-auto mr-4" onClick={RecallMail}>Recall</button>  
            </div>
          </div>




        </div>
      </div>

    </div>
  )
}

export default AdminNetworkConfigurationPage