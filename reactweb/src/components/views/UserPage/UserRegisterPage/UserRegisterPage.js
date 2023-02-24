import React, { useState, useEffect } from "react";
import UserNavber from '../UserNavBar/UserNavbar'
import UserHeaderPage from '../UserHeaderPage/UserHeaderPage'
import { useDispatch, useSelector } from 'react-redux';
import { BsFillPersonLinesFill } from "react-icons/bs";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { RegisterChange } from '../../../../_reducers/RegisterSlice'
// import { ErrorMessage } from '../../../Renderer/Renderer'
// const { ipcRenderer } = window.require('electron');

import {useInterval, randomNumberInRange, convertDataSerialToObject, ControlLED} from "../../../lib/common"

function UserRegisterPage() {
  const dispatch = useDispatch();
  const registerState = useSelector((state) => state.RegisterSlice);
  const [owner, setowner] = useState(registerState.owner);
  const [installBy, setinstallBy] = useState(registerState.installBy);
  const [ownerPhone, setownerPhone] = useState(registerState.owner.phone);
  const [ownerFax, setownerFax] = useState(registerState.owner.fax);
  const [installByPhone, setinstallByPhone] = useState(registerState.installBy.phone);
  const [installByFax, setinstallByFax] = useState(registerState.installBy.fax);
  const [serviceProvider, setserviceProvider] = useState('');

  useEffect(() => {
    const nowPage = document.getElementById("navbarButtonRegister");
    nowPage.className = nowPage.className + " " + "bg-indigo-600 text-white";
    
    RecallClick()

    /************************************************************************* *
    let ipcData = { 
      command: 0x3A,
      numberOfCommand: 1,
      band: 3,
      data: []
    };
    
    ipcRenderer.sendSync('SerialTransmit', ipcData);

    let waitStac = 0;
    const interval = setInterval(() => {
      let responseData = ipcRenderer.sendSync('SerialResponse');
      waitStac++;
      if( waitStac < 20 ) {
        if( responseData.flag ){
          clearInterval(interval);
          console.log(responseData)
          let string = ''

          if( responseData.data[0]==0 ){ setserviceProvider('VERIZON'); }
          else if( responseData.data[0]==1 ){ setserviceProvider('AT&T'); }
          else if( responseData.data[0]==2 ){ setserviceProvider('SPRINT'); }
          else if( responseData.data[0]==3 ){ setserviceProvider('T-MOBILE'); }
          else if( responseData.data[0]==4 ){ setserviceProvider('OTHER'); }

          

          for (let i = 1; i < responseData.data.length; i++) {
            console.log()
            string += responseData.data[i] == 0x00 ? ',':String.fromCharCode(responseData.data[i]);
          }
          let registerData = string.split(',');
          console.log(string)
          console.log(registerData)
          setowner({
            company: registerData[0],
            contactName: registerData[1],
            address1: registerData[2],
            address2: registerData[3],
            city: registerData[4],
            state: registerData[5],
            zip: registerData[6],
            phone: registerData[7],
            fax: registerData[8],
            email: registerData[9],
          })
          
          setinstallBy({
            company: registerData[10],
            contactName: registerData[11],
            address1: registerData[12],
            address2: registerData[13],
            city: registerData[14],
            state: registerData[15],
            zip: registerData[16],
            phone: registerData[17],
            fax: registerData[18],
            email: registerData[19],
          })
        }
      }else{
        clearInterval(interval);
        ErrorMessage('Register Recall Error', "can't Recall Data from MCU");
      }
    }, 100)
    /************************************************************************* */
  },[])
  

  const companyChange = (e) => { e.target.name=='owner' ? setowner({...owner, company: e.target.value }) : setinstallBy({...installBy, company: e.target.value}) }
  const contactNameChange = (e) => { e.target.name=='owner' ? setowner({...owner, contactName: e.target.value }) : setinstallBy({...installBy, contactName: e.target.value}) }
  const address1Change = (e) => { e.target.name=='owner' ? setowner({...owner, address1: e.target.value }) : setinstallBy({...installBy, address1: e.target.value}) }
  const address2Change = (e) => { e.target.name=='owner' ? setowner({...owner, address2: e.target.value }) : setinstallBy({...installBy, address2: e.target.value}) }
  const cityChange = (e) => { e.target.name=='owner' ? setowner({...owner, city: e.target.value }) : setinstallBy({...installBy, city: e.target.value}) }
  const stateChange = (e) => { e.target.name=='owner' ? setowner({...owner, state: e.target.value }) : setinstallBy({...installBy, state: e.target.value}) }
  const zipChange = (e) => { e.target.name=='owner' ? setowner({...owner, zip: e.target.value }) : setinstallBy({...installBy, zip: e.target.value}) }
  const emailChange = (e) => { e.target.name=='owner' ? setowner({...owner, email: e.target.value }) : setinstallBy({...installBy, email: e.target.value}) }

  const ServiceProviderChange = (e) => {
    switch (e.target.name) {
      case 'VERIZON':
        e.target.checked ? setserviceProvider('VERIZON') : setserviceProvider('')
        break;
      case 'AT&T':
        e.target.checked ? setserviceProvider('AT&T') : setserviceProvider('')
        break;
      case 'SPRINT':
        e.target.checked ? setserviceProvider('SPRINT') : setserviceProvider('')
        break;
      case 'T-MOBILE':
        e.target.checked ? setserviceProvider('T-MOBILE') : setserviceProvider('')
        break;
      case 'OTHER':
        e.target.checked ? setserviceProvider('OTHER') : setserviceProvider('')
        break;
    
      default:
        break;
    }
  }

  const RecallClick = async() => {
    console.log("RecallClick clicked..!")
    const ipcData = { 
      command: 0x3A,
      numberOfCommand: 1,
      band: 3,
      data: []
    }
    // ipcRenderer.send('SerialTransmit', ipcData);
    // pakt87
    const postSuccessed = await postSerialCommunication(ipcData, "get")
    console.log("postSuccessed is ===> ", postSuccessed)
  }
  const postSerialCommunication = async(ipcData, act) => {
    try {
      ControlLED('Tx', 'on');
      const datas = { ipcData: ipcData }
			const res = await fetch("/api/serialCommunication", {
				timeout: 10000,		// 10초 타임아웃 제한..
        method: "POST",
				headers: { "Content-Type": "application/json;charset=utf-8" },
				body: JSON.stringify( datas ),
			})
			if(res.ok){
        ControlLED('Tx', 'off');
        ControlLED('Rx', 'on');
        const result = await res.json()
				const responseData = result.result
        console.log("http okay ==> ", res.status, result, responseData)
				// 받아온 결과값들 가지고 처리하는 async/await 함수 넣어줄것..
        if(act === "set") { processOfResponseDataSet(convertDataSerialToObject(responseData)) }
        else if(act === "get") { processOfResponseDataGet(convertDataSerialToObject(responseData)) }
        ControlLED('Rx', 'off');
        return true   // 통신성공 했음을 true 로 리턴..
        
      } else { 
        ControlLED('Tx', 'off');
        ControlLED('Rx', 'off');
        console.log("http error ==> ", res.status) 
        return false  // 통신실패 했음을 false 로 리턴..
      }
    } catch (error) { 
      ControlLED('Tx', 'off');
      ControlLED('Rx', 'off');
      console.log("error catch ==> ", error) 
      return false    // 통신실패 했음을 false 로 리턴..
    }
  }
  const processOfResponseDataSet = (responseData) => {
    console.log("processOfResponseDataSet's responseData is ===> ", responseData)
    
    dispatch(RegisterChange({ name: 'owner', value: owner }));
    dispatch(RegisterChange({ name: 'installBy', value: installBy }));
    dispatch(RegisterChange({ name: 'serviceProvider', value: serviceProvider }));
  }
  const processOfResponseDataGet = (responseData) => {
    console.log("processOfResponseDataGet's responseData is ===> ", responseData)
    
    let string = ''

    if( responseData.data[0]==0 ){ setserviceProvider('VERIZON'); }
    else if( responseData.data[0]==1 ){ setserviceProvider('AT&T'); }
    else if( responseData.data[0]==2 ){ setserviceProvider('SPRINT'); }
    else if( responseData.data[0]==3 ){ setserviceProvider('T-MOBILE'); }
    else if( responseData.data[0]==4 ){ setserviceProvider('OTHER'); }

    for (let i = 1; i < responseData.data.length; i++) {
      console.log()
      string += responseData.data[i] === 0x00 ? 0x00:String.fromCharCode(responseData.data[i]);
    }
    let registerData = string.split(0x00);
    console.log(string)
    console.log(registerData)
    setowner({
      company: registerData[0],
      contactName: registerData[1],
      address1: registerData[2],
      address2: registerData[3],
      city: registerData[4],
      state: registerData[5],
      zip: registerData[6],
      phone: registerData[7],
      fax: registerData[8],
      email: registerData[9],
    })
    
    setinstallBy({
      company: registerData[10],
      contactName: registerData[11],
      address1: registerData[12],
      address2: registerData[13],
      city: registerData[14],
      state: registerData[15],
      zip: registerData[16],
      phone: registerData[17],
      fax: registerData[18],
      email: registerData[19],
    })
  }
  const ConfirmClick = async(e) => {
    e.preventDefault();
    const trasnData = [
      {title: 'owner', band: 3, data: owner},
      {title: 'installBy', band: 3, data: installBy},
    ]
    let addr = 0;
    let ipcData = { 
      command: 0x0E,
      numberOfCommand: 1,
      band: 3,
      data: []
    };
    if( serviceProvider=='VERIZON' ){ ipcData.data[addr] = 0; }
    else if( serviceProvider=='AT&T' ){ ipcData.data[addr] = 1; }
    else if( serviceProvider=='SPRINT' ){ ipcData.data[addr] = 2; }
    else if( serviceProvider=='T-MOBILE' ){ ipcData.data[addr] = 3; }
    else if( serviceProvider=='OTHER' ){ ipcData.data[addr] = 4; }
    addr++;

    trasnData.map((d,i) => {
      Array.from(d.data.company.toString()).map((d,i) => { ipcData.data = [...ipcData.data, d.charCodeAt(0)] })
      ipcData.data = [...ipcData.data, 0x00];
      Array.from(d.data.contactName.toString()).map((d,i) => { ipcData.data = [...ipcData.data, d.charCodeAt(0)] })
      ipcData.data = [...ipcData.data, 0x00];
      Array.from(d.data.address1.toString()).map((d,i) => { ipcData.data = [...ipcData.data, d.charCodeAt(0)] })
      ipcData.data = [...ipcData.data, 0x00];
      Array.from(d.data.address2.toString()).map((d,i) => { ipcData.data = [...ipcData.data, d.charCodeAt(0)] })
      ipcData.data = [...ipcData.data, 0x00];
      Array.from(d.data.city.toString()).map((d,i) => { ipcData.data = [...ipcData.data, d.charCodeAt(0)] })
      ipcData.data = [...ipcData.data, 0x00];
      Array.from(d.data.state.toString()).map((d,i) => { ipcData.data = [...ipcData.data, d.charCodeAt(0)] })
      ipcData.data = [...ipcData.data, 0x00];
      Array.from(d.data.zip.toString()).map((d,i) => { ipcData.data = [...ipcData.data, d.charCodeAt(0)] })
      ipcData.data = [...ipcData.data, 0x00];
      Array.from(d.data.phone.toString()).map((d,i) => { ipcData.data = [...ipcData.data, d.charCodeAt(0)] })
      ipcData.data = [...ipcData.data, 0x00];
      Array.from(d.data.fax.toString()).map((d,i) => { ipcData.data = [...ipcData.data, d.charCodeAt(0)] })
      ipcData.data = [...ipcData.data, 0x00];
      Array.from(d.data.email.toString()).map((d,i) => { ipcData.data = [...ipcData.data, d.charCodeAt(0)] })
      ipcData.data = [...ipcData.data, 0x00];
    })

    ipcData.data.map((d,i) => { 
      //console.log(i, isNaN(d));
      if( isNaN(d) ){ ipcData.data[i] = d.charCodeAt(0); }
    })
    console.log(ipcData)
    
    // ipcRenderer.send('SerialTransmit', ipcData);
    // pakt87
    const postSuccessed = await postSerialCommunication(ipcData, "set")
    console.log("postSuccessed is ===> ", postSuccessed)

    console.log(owner.phone);
    // dispatch(RegisterChange({ name: 'owner', value: owner }));
    // dispatch(RegisterChange({ name: 'installBy', value: installBy }));
    // dispatch(RegisterChange({ name: 'serviceProvider', value: serviceProvider }));
  }

  const ResetClick = (e) => {
    let dataMask = {company: "",
      contactName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      fax: "",
      email: "",
    }
    setowner(dataMask);
    setinstallBy(dataMask);
  }


  const drawData = [{title: 'owner', data: owner}, {title: 'installBy', data: installBy}];
  const registerDraw = drawData.map((d, i) => {

    return <div className="w-1/2 h-fit" key={d.title}>
      <div className='w-fill h-1/8 flex'>
        <div className="w-1/2 h-full">
          <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">Company</p>
          <input className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-md" 
                name={d.title}
                id={d.title+'Company'} 
                type='string' 
                value={d.data.company}
                onChange={companyChange} />
        </div>
        <div className="w-1/2 h-full">
          <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">Contact Name</p>
          <input className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-md" 
                name={d.title}
                id={d.title+'ContactName'} 
                type='string' 
                value={d.data.contactName}
                onChange={contactNameChange} />
        </div>
      </div>

      <div className='w-full h-fit mt-2'>
        <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">Address</p>
        <input className="w-95/100 h-1/4 text-sm border border-slate-300 rounded-md" 
              name={d.title} 
              id={d.title+'Address1'} 
              type='string' 
              value={d.data.address1}
              onChange={address1Change} />
        <input className="w-95/100 h-1/4 text-sm border border-slate-300 rounded-md mt-0" 
              name={d.title} 
              id={d.title+'Address2'} 
              type='string' 
              value={d.data.address2}
              onChange={address2Change} />
      </div>

      <div className='w-fill h-1/8 flex mt-2'>
        <div className="w-1/2 h-full">
          <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">City</p>
          <input className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-md" 
                name={d.title} 
                id={d.title+'City'} 
                type='string' 
                value={d.data.city}
                onChange={cityChange} />
        </div>
        <div className="w-1/2 h-full">
          <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">State</p>
          <input className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-md" 
                name={d.title} 
                id={d.title+'State'} 
                type='string' 
                value={d.data.state}
                onChange={stateChange} />
        </div>
      </div>

      <div className='w-fill h-1/8 flex mt-2'>
        <div className="w-1/2 h-full">
          <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">Zip</p>
          <input className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-md" 
                name={d.title} 
                id={d.title+'Zip'} 
                type='string' 
                value={d.data.zip}
                onChange={zipChange} />
        </div>
        <div className="w-1/2 h-full">
          <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">E-mail</p>
          <input className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-md" 
                name={d.title} 
                type='email' 
                id={d.title+'Email'} 
                value={d.data.email}
                onChange={emailChange} />
        </div>  
      </div>

      <div className='w-fill h-1/8 flex mt-2'>
        <div className="w-1/2 h-full">
          <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">Fax</p>
          <PhoneInput className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-md" 
            placeholder="Enter phone number"
            name={d}
            id={d+'Fax'}
            value={d.data.fax}
            onChange={ function (e) { d.title=='owner' ? setowner({...owner, fax:e}):setinstallBy({...installBy, fax:e})}
            } /> 
        </div>
        <div className="w-1/2 h-full">
          <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">Phone</p>
          <PhoneInput className="w-9/10 h-1/2 text-sm border border-slate-300 rounded-md" 
            placeholder="Enter phone number" 
            name={d}
            id={d+'Phone'}
            value={d.data.phone}
            onChange={ function (e) {
              d.title=='owner' ? setowner({...owner, phone:e}):setinstallBy({...installBy, phone:e})
            }} />
        </div>
      </div>
    </div>
  })

  return (
    <div style={{ display: "flex" }}>
      <div>
        <UserNavber />
      </div>
      <div style={{ width: "1030px", height: "820px", minWidth:'1030px' }}>
        <UserHeaderPage />
        <div className="w-full h-userMain">
          <div className="w-full h-3/5">
            <div className="w-full h-9/10">
                <div className='w-9/10 h-1/10 flex mx-auto'>
                  <div className="w-1/2 h-full flex">
                    <BsFillPersonLinesFill
                      className="my-auto mr-3 text-gray-500"
                      size={30}
                    />
                    <p className="w-fit h-fit font-sans font-semibold my-auto">
                      Repeater Owner
                    </p>
                  </div>
                  <div className="w-1/2 h-full flex">
                    <BsFillPersonLinesFill
                      className="my-auto mr-3 text-gray-500"
                      size={30}
                    />
                    <p className="w-fit h-fit font-sans font-semibold my-auto">
                      Install By
                    </p>
                  </div>
                </div>

                <div className="w-9/10 h-full mx-auto">
                  <div className='w-full h-fit flex'>
                    {registerDraw}
                  </div>
                  
                  <div className='w-fill h-1/8 mt-5'>
                    <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">Service Provider</p>
                    <div className='w-full h-fit flex'>
                      <input name='VERIZON' 
                        className="w-fit h-fit my-auto mr-1" 
                        id="serviceProvider" 
                        type='checkbox' 
                        checked={serviceProvider=='VERIZON'?true:false} 
                        onChange={ServiceProviderChange} />
                      <p className='w-fit h-full text-sm font-semibold mr-14'>VERIZON</p>
                      <input name='AT&T' 
                        className="w-fit h-fit my-auto mr-1" 
                        id="serviceProvider" 
                        type='checkbox' 
                        checked={serviceProvider=='AT&T'?true:false} 
                        onChange={ServiceProviderChange} />
                      <p className='w-fit h-full text-sm font-semibold mr-14'>AT&T</p>
                      <input name='SPRINT' 
                        className="w-fit h-fit my-auto mr-1" 
                        id="serviceProvider" 
                        type='checkbox' 
                        checked={serviceProvider=='SPRINT'?true:false} 
                        onChange={ServiceProviderChange}/>
                      <p className='w-fit h-full text-sm font-semibold mr-14'>SPRINT</p>
                      <input name='T-MOBILE' 
                        className="w-fit h-fit my-auto mr-1" 
                        id="serviceProvider" 
                        type='checkbox' 
                        checked={serviceProvider=='T-MOBILE'?true:false} 
                        onChange={ServiceProviderChange}/>
                      <p className='w-fit h-full text-sm font-semibold mr-14'>T-MOBILE</p>
                      <input name='OTHER' 
                        className="w-fit h-fit my-auto mr-1" 
                        id="serviceProvider" 
                        type='checkbox' 
                        checked={serviceProvider=='OTHER'?true:false} 
                        onChange={ServiceProviderChange}/>
                      <p className='w-fit h-full text-sm font-semibold mr-14'>OTHER</p>
                    </div>
                  </div>

                  <div className="w-1/2 h-fit flex justify-between mx-auto mt-1">
                    {/* Button */}
                    <button className="w-2/5 h-9 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900" onClick={ConfirmClick}>
                      Confirm
                    </button>
                    {/* <button className="w-1/4 h-9 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900" onClick={ResetClick}>
                      Reset
                    </button> */}
                    <button className="w-2/5 h-9 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900" onClick={RecallClick}>
                      Recall
                    </button>
                  </div>
                </div>
              
            </div>
          </div>
          <div className="w-full h-2/5 border border-gray-500">
            <h1 className="w-full h-fit text-2xl font-bold text-center text-slate-700">
              IMPORTANT NOTICE!
            </h1>
            <p className="w-11/12 h-fit text-13px mx-auto">
              If you are contacted by a representative of any network operator
              and informed that your repeater system has been identified as the
              source of interference, you are required by FCC Law to comply with
              their request to mitigate the interference immediately. In the
              event you are unable to make the needed adjustments in a timely
              manner either by yourself or by reaching our technical support
              department at 1-866-4-JDTECK, please go to the Band Select page of
              this GUI and switch OFF the repeater till such time you are able
              to reach our technical support department to assist you in
              adjusting the settings.
              <br />
              <br />
              IMPORTANT! Please remember to obtain the name and contact number
              of the representative as well as the channel numbers they were
              experiencing the interference on. This will help our tech support
              team get right to the specific channels that need adjusting as
              well as make contact with the representative to schedule a time to
              recommission the repeater. Your prompt attention to treating this
              event with utmost urgency will go a long way to ensuring you are
              able to use your repeater for many years to come.
            </p>
            <h1 className="w-4/5 h-fit text-base font-semibold text-center text-slate-700 border border-gray-500 mx-auto mt-2">
              WARNING! This is NOT a CONSUMER device.
            </h1>
            <p className="w-4/5 h-fit text-13px text-center mx-auto border-x border-b border-gray-500">
              It is Designed for installation by FCC LICENSEES and QUALIFIED
              INSTALLERS. You MUST have and FCC License to operate this device.
              Unauthorized use may result in significant forfeiture penalties,
              including penaties in excess of $100,000 for each continuing
              volation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRegisterPage