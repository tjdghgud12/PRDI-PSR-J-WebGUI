import React, { useState, useEffect } from "react";
import UserNavber from '../UserNavBar/UserNavbar'
import UserHeaderPage from '../UserHeaderPage/UserHeaderPage'
import { useDispatch, useSelector } from 'react-redux';
import { BsFillPersonLinesFill } from "react-icons/bs";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { RegisterChange } from '../../../../_reducers/RegisterSlice'


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

  }


  const ConfirmClick = async(e) => {
    e.preventDefault();
    dispatch(RegisterChange({ name: 'owner', value: owner }));
    dispatch(RegisterChange({ name: 'installBy', value: installBy }));
    dispatch(RegisterChange({ name: 'serviceProvider', value: serviceProvider }));

    // 프로토콜 제작 후 전송

    // API서버로 전송 (DB에 저장/MCU에 전송하여 저장)..
    try {
      const datas = {
        owner: owner,
        installBy: installBy,
        serviceProvider: serviceProvider,
      }
      const res = await fetch("/api/setRegister", {
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

  // 참고용 코드....
  // const RecallClick = async() => {
  //   try {
	// 		const datas = {  }
	// 		const res = await fetch("/api/getRegister", {
	// 			method: "POST",
	// 			headers: { "Content-Type": "application/json;charset=utf-8" },
	// 			body: JSON.stringify( datas ),
	// 		})
	// 		if(res.ok){
	// 			const result = await res.json()
  //       console.log("http okay ==> ", res.status, result)
	// 			// 받아온 결과값들 가지고 처리하기..
	// 			setowner({
  //         company: result.owner.company,
  //         contactName: result.owner.name,
  //         address1: result.owner.address_1,
  //         address2: result.owner.address_2,
  //         city: result.owner.city,
  //         state: result.owner.state,
  //         zip: result.owner.zip,
  //         email: result.owner.email,
  //         fax: result.owner.fax,
  //         phone: result.owner.phone,
  //       });

  //       // setserviceProvider(result.provider ? )
  //       // setinstallBy(dataMask);
        

	// 		}else { console.log("http error ==> ", res.status) }
	// 	} catch (error) { console.log("error catch ==> ", error) }
  // }

  useEffect(() => {
    const nowPage = document.getElementById("navbarButtonRegister");
    nowPage.className = nowPage.className + " " + "bg-indigo-600 text-white";
  })
  
  useEffect(() => { // 최초 1회만 실행되는 useEffect..
    async function fetchAndSetRegister() {
      try {
        const datas = {  }
        const res = await fetch("/api/getRegister", {
          method: "POST",
          headers: { "Content-Type": "application/json;charset=utf-8" },
          body: JSON.stringify( datas ),
        })
        if(res.ok){
          const result = await res.json()
          console.log("http okay ==> ", res.status, result)
          // 받아온 결과값들 가지고 처리하기..
          setowner({
            company: result.owner.company,
            contactName: result.owner.name,
            address1: result.owner.address_1,
            address2: result.owner.address_2,
            city: result.owner.city,
            state: result.owner.state,
            zip: result.owner.zip,
            email: result.owner.email,
            fax: result.owner.fax,
            phone: result.owner.phone,
          });
          setinstallBy({
            company: result.installer.company,
            contactName: result.installer.name,
            address1: result.installer.address_1,
            address2: result.installer.address_2,
            city: result.installer.city,
            state: result.installer.state,
            zip: result.installer.zip,
            email: result.installer.email,
            fax: result.installer.fax,
            phone: result.installer.phone,
          });
          setserviceProvider( (result.owner.provider=='' || !result.owner.provider) ? 'OTHER' : result.owner.provider )
          // setserviceProvider((result.installer.provider=='' || !result.installer.provider) ? 'OTHER' : result.installer.provider);
  
        }else { console.log("http error ==> ", res.status) }
      } catch (error) { console.log("error catch ==> ", error) }
    }
    fetchAndSetRegister()
  }, []); 

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
      <div style={{ width: "1030px", height: "100vh" }}>
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
                    <p className="w-full h-fit my-anto text-sm font-medium text-slate-700">Service Provider [Owner]</p>
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
                    <button className="w-2/5 h-9 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900 my-auto" onClick={ConfirmClick}>
                      Confirm
                    </button>
                    <button className="w-2/5 h-9 text-white text-xl rounded-xl bg-indigo-500 hover:bg-indigo-900 my-auto" onClick={ResetClick}>
                      Reset
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