import express from "express"
import cors from "cors"
import SQLite3 from "sqlite3"

import { getEtherInfo } from "./lib/getEtherInfo.js"
import { setEthernet } from "./lib/setEthernet.js"

import { spawn, execSync, exec } from 'child_process';
import wait from 'waait';

import path, { resolve } from "path"
import fs from "fs"
import multer from "multer";

import nodemailer from "nodemailer";

// SNMP 관련..
import snmp from "net-snmp"
import { skScalars } from "./snmp/skema_scalars.js"     // snmp 기본 뼈대
import { dvScalars, nmAlarmScalars, oidAlarmScalars } from "./snmp/defval_scalars.js"     // snmp 기본값들 외

// SerialPort 관련..
import { SerialPort } from "serialport"
import { DelimiterParser } from '@serialport/parser-delimiter'

// import delay from "./node_modules/express-delay/index.js"



/*******************************************************
 * # 1-1
 *
 * 
 * 
 * SNMP 기준 :: 갖고 있을 전역 변수들.. 
 * -> SNMP 는 따로 갖고 있어야 할 것으로 예상됨..
 * -> WEBGUI 는 요청 왔을때만 주고 받는형태로 하는것이 더 좋을듯?..
 * 
 * 
 * 
*******************************************************/











/*******************************************************
 * # 2-1
 *
 * 
 * 
 * WEBGUI 기준 :: 갖고 있을 전역 변수들..
 * 
 * 
 * 
 * 
 * 
*******************************************************/
/*** settings, navbar(information) 화면 ***/
const infoEther = {
    address: "0.0.0.0",
    netmask: "0.0.0.0",
    family: "maybe IPv4",
    mac: "macaddress",
    internal: false,
    cidr: "0.0.0.0/24",
    gateway: "0.0.0.0",
    managerSnmp: "222.222.222.221",
    dhcp: true,
}
const isProgress = {
    SerialFromWeb : false,
    SerialFromApiInterval3sec : false,
    SerialWaitPipe : false
}
const PREFIX_OID = "1.3.6.1.4.1.19865"
const isAlarmStateListForSnmpTrap = {
    acpowerAlarmState : {state:false, idxOfOid:1, name:"acpowerAlarmState"},
    tempAlarmState: {state:false, idxOfOid:2, name:"tempAlarmState"},
    dcFailAlarmState: {state:false, idxOfOid:3, name:"dcFailAlarmState"},
    batteryCapacityAlarmState: {state:false, idxOfOid:4, name:"batteryCapacityAlarmState"},
    dcdcFailAlarmState: {state:false, idxOfOid:5, name:"dcdcFailAlarmState"},

    dl700PllAlarmState: {state:false, idxOfOid:6, name:"dl700PllAlarmState"},
    dl800PllAlarmState: {state:false, idxOfOid:7, name:"dl800PllAlarmState"},
    ulPllAlarmState: {state:false, idxOfOid:8, name:"ulPllAlarmState"},

    dl700ANTFailAlarmState: {state:false, idxOfOid:9, name:"dl700ANTFailAlarmState"},
    dl800ANTFailAlarmState: {state:false, idxOfOid:10, name:"dl800ANTFailAlarmState"},
    ulANTFailAlarmState: {state:false, idxOfOid:11, name:"ulANTFailAlarmState"},

    dl700HighOutputAlarmState: {state:false, idxOfOid:12, name:"dl700HighOutputAlarmState"},
    dl800HighOutputAlarmState: {state:false, idxOfOid:13, name:"dl800HighOutputAlarmState"},
    ulHighOutputtAlarmState: {state:false, idxOfOid:14, name:"ulHighOutputtAlarmState"},
}







/*******************************************************
 * # 2-2
 *
 * 
 * 
 * WEBGUI 기준 :: 함수들...
 * 
 * 
 * 
 * 
 * 
*******************************************************/
const funcGetEtherInfo = () => {
    const latestEth = getEtherInfo()
    // console.log(latestEth)
    infoEther.address = latestEth.address
    infoEther.netmask = latestEth.netmask
    infoEther.family  = latestEth.family
    infoEther.mac     = latestEth.mac
    infoEther.internal= latestEth.internal
    infoEther.cidr    = latestEth.cidr
    infoEther.gateway = latestEth.gateway
    // infoEther.managerSnmp = // 여기서 시리얼통신 등으로 최근정보로 갱신해줘야함..
    // infoEther.dhcp = // // 여기서 시리얼통신 등으로 최근정보로 갱신해줘야함..
}
const funcGetEtherInfoJustReturn = () => {
    const latestEth = getEtherInfo()
    return latestEth
}
const funcSendMail = (res=null, isTest=false, subject="WebServer Email Alarm", html=`You got a message from <br />WebServer`) => {
    const query = `
        SELECT idx, tool, host, type, port, id, password, notify, address FROM mail
        WHERE tool = 'nodemailer'
        ORDER BY idx ASC
    `;
    db.serialize(() => {
        db.get(query, [], async(err, row) => {
            if(err) { 
                if(res !== null){
                    res.send({
                        message: "fail",
                        error: err,
                    })
                }else{
                    console.log("funcSendMail.. email sending failed..", err)
                }
            } else {
                console.log(row)
                // DB 조회 성공했을 경우..
                if(row.notify==="ENABLE" || isTest===true){ // 메일알림발송이 체크되어 있거나, 테스트메일발송일 경우에.. 메일 발송함..
                    const transporter = nodemailer.createTransport({
                        // service: 'gmail',
                        host: row.host,         // ex)gmail server->'smtp.gmail.com'
                        port: row.port,         // Gmail:465/SSL, Naver:587/TLSorSSL
                        secure: row.type==="NONE" ? false : (row.type==="SSL" ? true : false),   // true:useSSL, false:NONE
                        // 메일 계정 및 비밀번호
                        auth: {
                          user: row.id,             // 'tjdghgud12@gmail.com',
                          pass: row.password,       // 'zfbmkivvmledspwk',
                        },
                        // 서명받지 않은 사이트의 요청도 받겠다.
                        tls:{   
                            rejectUnauthorize:false
                        },
                    });
                    const recipientAddress = () =>{
                        let str = ""
                        const arr = row.address.split(",")
                        for (let index = 0; index < 5; index++) {
                            if (arr[index].includes("@") && arr[index].includes(".")){
                                str = str + arr[index]
                                if(index < 4){
                                    if(arr[index+1].includes("@") && arr[index+1].includes["."]){
                                        str = str + ","
                                    }
                                }
                            }
                        }
                        return str
                    }
                    const mailAddress = recipientAddress()
                    console.log("mailAddress ===> ", mailAddress)
                    const mailOption = {
                        from: `"WebServer 👻" <${row.id}>`,
                        to: mailAddress==="" ? row.id : mailAddress,         // bar@example.com, baz@example.com", // list of receivers
                        subject: subject,
                        html: html,
                        //   `You got a message from <br /> 
                        //   Email : ${email} <br />
                        //   Name: ${name} <br />
                        //   Message: ${message}`,
                    };
                    try {
                        // 이메일 발송..
                        const info = await transporter.sendMail(mailOption);
                        console.log('메세지 전송됨: %s', info.messageId);
                        console.log('프리뷰 URL: %s', nodemailer.getTestMessageUrl(info));
                        if(res !== null){
                            res.send({
                                message: "success",
                                sending: "success",
                            })
                        }else{
                            console.log("funcSendMail.. email sending successed..")
                        }
                        
                    } catch (error) {
                        if(res !== null){
                            res.send({
                                message: "success",
                                sending: "fail",
                                error: error,
                            })
                        }else{
                            console.log("funcSendMail.. email sending failed..", error)
                        }
                    }
                }else{  // 그 외의 경우..
                    if(res !== null) {
                        res.send({
                            message: "success",
                            sending: "not",
                        })
                    }else{
                        console.log("funcSendMail.. email sending failed..")
                    }
                    
                }
            }
        });       
    })
    
}






/*******************************************************
 *
 *
 * 
 * 
 * 1. Express 서버 설정 및 기동
 * 2. SQLite3 초기 확인 및 기동
 * 
 * 
 * 
 * 
*******************************************************/
/*******************************************************
* 1-1. Express 서버 설정
*******************************************************/
const app = express()
app.use(cors({
  origin: "*",        // 출처 허용 옵션,, cors 에러에 대응.. but 보안엔 취약.. but 그래도 괜찮음..
  credential: "true"  // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// 동적 요청에 대한 응답을 보낼 때 etag 생성을 하지 않도록 설정
app.set("etag", false);
// 정적 요청에 대한 응답을 보낼 때 etag 생성을 하지 않도록 설정
const options = { etag: false };
app.use(express.static("public", options));
/*******************************************************
* 2-1. SQLite3 초기 확인
*******************************************************/
const sqlite3 = SQLite3.verbose()
const db = new sqlite3.Database("./db/prdi.db", sqlite3.OPEN_READWRITE, (err) => {
  if(err) { console.error(err.message) }
  else { console.log("Connected to the 'prdi.db' database."); }
})
/*** [ Drop ===> Table ] ***/
const querySelectTableUsers = `SELECT * FROM users`;                // id VARCHAR(20),
const queryDropTableUsers = `DROP TABLE IF EXISTS users`;               
const queryDropTableConfig = `DROP TABLE IF EXISTS config`;
const queryDropTableRegister = `DROP TABLE IF EXISTS register`;
const queryDropTableMail = `DROP TABLE IF EXISTS mail`;
/*** [ Create ===> Table ] ***/
const queryCreateTableConfig = `
  CREATE TABLE IF NOT EXISTS config(
    idx INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    data TEXT NOT NULL
  )
`;
const queryCreateTableUsers = `
  CREATE TABLE IF NOT EXISTS users(
    idx INTEGER PRIMARY KEY AUTOINCREMENT,
    id TEXT UNIQUE,
    password TEXT NOT NULL
  )
`;
const queryCreateTableRegister = `
  CREATE TABLE IF NOT EXISTS register(
    idx INTEGER PRIMARY KEY AUTOINCREMENT,
    id TEXT UNIQUE,
    company TEXT,
    name TEXT,
    address_1 TEXT,
    address_2 TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    email TEXT,
    fax TEXT,
    phone TEXT,
    provider TEXT
  )
`;
const queryCreateTableMail = `
  CREATE TABLE IF NOT EXISTS mail(
    idx INTEGER PRIMARY KEY AUTOINCREMENT,
    tool TEXT UNIQUE,
    host TEXT,
    type TEXT,
    port TEXT,
    id TEXT,
    password TEXT,
    notify TEXT,
    address TEXT
  )
`;
/*** [ Insert ===> Data ] ***/
// const queryInsertDataConfigInit = `
//     INSERT INTO config(name, data) VALUES 
//         ('isDhcp', '1'), ('portWeb', '5000')
// `;
const queryInsertDataConfigInit_1 = `
    INSERT INTO config(name, data)
        SELECT 'isDhcp', '1'
        WHERE NOT EXISTS(SELECT 1 FROM config WHERE name='isDhcp')
`;
const queryInsertDataConfigInit_2 = `
    INSERT INTO config(name, data)
        SELECT 'portWeb', '5000'
        WHERE NOT EXISTS(SELECT 1 FROM config WHERE name='portWeb')
`;
const queryInsertDataConfigInit_3 = `
    INSERT INTO config(name, data)
        SELECT 'snmpTargetIp', '127.0.0.1'
        WHERE NOT EXISTS(SELECT 1 FROM config WHERE name='snmpTargetIp')
`;

const queryInsertDataConfigInit_4 = `
    INSERT INTO config(name, data)
        SELECT 'siteID', ''
        WHERE NOT EXISTS(SELECT 1 FROM config WHERE name='siteID')
`;

const queryInsertDataUsersInit_1 = `
    INSERT INTO users(id, password)
        SELECT 'admin', 'administrator'
        WHERE NOT EXISTS(SELECT 1 FROM users WHERE id='admin')
`;
const queryInsertDataUsersInit_2 = `
    INSERT INTO users(id, password)
        SELECT 'paradigm', 'helloprdi!'
        WHERE NOT EXISTS(SELECT 1 FROM users WHERE id='paradigm')
`;
const queryInsertDataUsersInit_3 = `
    INSERT INTO users(id, password)
        SELECT 'jdteck', 'jdteck'
        WHERE NOT EXISTS(SELECT 1 FROM users WHERE id='jdteck')
`;
const queryInsertDataRegisterInit_1 = `
    INSERT INTO register(id, company, name, address_1, address_2, city, state, zip, email, fax, phone, provider)
        SELECT 'owner', '', '', '', '', '', '', '', '', '', '', ''
        WHERE NOT EXISTS(SELECT 1 FROM register WHERE id='owner') 
`;
const queryInsertDataRegisterInit_2 = `
    INSERT INTO register(id, company, name, address_1, address_2, city, state, zip, email, fax, phone, provider)
        SELECT 'installer', '', '', '', '', '', '', '', '', '', '', ''
        WHERE NOT EXISTS(SELECT 1 FROM register WHERE id='installer')
`;
const queryInsertDataMailInit = `
    INSERT INTO mail(tool, host, type, port, id, password, notify, address)
        SELECT 'nodemailer', '', 'NONE', '', '', '', 'DISABLE', ',,,,'
        WHERE NOT EXISTS(SELECT 1 FROM mail WHERE tool='nodemailer')
`;

// db.run('CREATE TABLE users(idx integer primary key, id text unique, password text not null)');   <<== run문 예제..
// 초기 테이블 있는지 확인후, 없으면 생성
db.serialize(() => {  // 순서대로 실행, 이전것이 완료되어야 다음것으로 넘어감.
    // 테스트용 초기에 모두 일단 테이블들 드롭.. 추후 주석처리 필요함.. !!!
    // db.each(queryDropTableUsers)        
    // db.each(queryDropTableConfig)
    // db.each(queryDropTableRegister)
    // db.each(queryDropTableMail)

    // 테이블이 만약 없다면 생성해줌..
    db.each(queryCreateTableUsers)
    db.each(queryCreateTableConfig)
    db.each(queryCreateTableRegister)
    db.each(queryCreateTableMail)

    // 테이블에 초기 데이터 있는지 확인하여 없으면 삽입..
    db.each(queryInsertDataUsersInit_1)
    db.each(queryInsertDataUsersInit_2)
    db.each(queryInsertDataUsersInit_3)
    db.each(queryInsertDataConfigInit_1)
    db.each(queryInsertDataConfigInit_2)
    db.each(queryInsertDataConfigInit_3)

    db.each(queryInsertDataConfigInit_4)

    db.each(queryInsertDataRegisterInit_1)
    db.each(queryInsertDataRegisterInit_2)
    db.each(queryInsertDataMailInit)
})
/*******************************************************
* 1-2. Express 서버 기동
*******************************************************/
app.listen(5001, () => {
    console.log(`Example app listening at http://localhost:${5001}`);
    console.log(`Current [NODE_ENV] is ===> ${process.env.NODE_ENV}`);  // 
});
  








/*******************************************************
 *
 *
 * 
 * 
 * 3. SNMP 서버 기동/설정
 * 
 * 
 * 
 * 
 * 
*******************************************************/
/*******************************************************
* 3-1. SNMP 값,옵션관련 변수들 (agent, session)
*******************************************************/
const resultSnmp = dvScalars    // 변경되는 값들을 담아놓을 변수..

const infoSnmp = {
    targetIp: "127.0.0.1",   // 최초 초기값 :: 127.0.0.1
    // targetIp: "192.168.0.110",
    targetCommunity: "public",
}
const optionsAgent = {
    port: 161,                              // 에이전트가 수신 대기할 포트 - 기본값은 161입니다. 일부 시스템에서 포트 161에 바인딩하려면 수신기 프로세스가 관리 권한으로 실행되어야 합니다.  이것이 가능하지 않으면 1024보다 큰 포트를 선택하십시오.
    disableAuthorization: true,             // 수신된 모든 커뮤니티 기반 알림과 메시지 인증 또는 개인 정보 보호 없이 수신된 사용자 기반 알림(noAuthNoPriv)에 대한 로컬 인증 비활성화 - 기본값은 false
    accessControlModelType: snmp.AccessControlModelType.None,    // 사용할 액세스 제어 모델을 지정합니다.  기본값은 snmp.AccessControlModelType.None이지만 추가 액세스 제어 기능을 위해 snmp.AccessControlModelType.Simple로 설정할 수 있습니다.  자세한 내용은 권한 부여 클래스 설명을 참조하세요.
    engineID: "800007DB03360102101100",     // 여기서 X는 임의의 16진수입니다.. // 16진 문자열로 제공된 SNMPv3 통신에 사용되는 엔진 ID - 기본적으로 임의의 요소를 포함하는 시스템 생성 엔진 ID
    address: null,                          // 바인딩할 IP 주소 - 기본값은 null로 모든 IP 주소에 바인딩을 의미합니다.
    transport: "udp4"                       // 사용할 전송 제품군 - 기본값은 udp4입니다.
}
const optionsSession = {
    port: 161,
    retries: 1,
    timeout: 5000,
    backoff: 1.0,
    transport: "udp4",
    trapPort: 162,
    version: snmp.Version2c,
    backwardsGetNexts: true,
    reportOidMismatchErrors: false,
    idBitsSize: 32
}
// SNMP session 재생성 해주는 함수.. (targetIp 가 변경되면 새로 호출되도록 할 것..)
const regenerationSnmpSession = () => {
    session = snmp.createSession (
        infoSnmp.targetIp, 
        infoSnmp.targetCommunity, 
        optionsSession
    )
}
// DB에서 targetSnmpIp 주소가져와서 덮어씌우기.. (서버기동후, 최초1회)
db.serialize(() => {
    const query = `
        SELECT idx, name, data FROM config
        WHERE name = 'snmpTargetIp'
        ORDER BY idx ASC
    `;
    db.get(query, [], (err, row) => {
        if(err) { res.send({ message: "error", err: err}); throw err; }
        else {
            console.log("get successm, row is ==> ", row)
            if(row){
                infoSnmp.targetIp = row.data
                if(session){
                    // SNMP session 재구성/재시작..
                    console.log("SNMP session 최초 1회 재구성 생성시작..")
                    regenerationSnmpSession()
                    // session = snmp.createSession (
                    //     infoSnmp.targetIp, 
                    //     infoSnmp.targetCommunity, 
                    //     optionsSession
                    // )
                    console.log("SNMP session 최초 1회 재구성 생성완료..")
                }
            }
        }
    });
})


/*******************************************************
* 3-2. SNMP 콜백함수들 (agent)
*******************************************************/
/*******************************************************
 * 비동기로 snmp 값 post 로 보내는 함수
 *******************************************************/
 const setSnmpData = async(varbind) => {
    console.log("setSnmpData Func, varbind ===> ", varbind)
    //
    //
    //
    //
    // 갈라치기 할 부분..
    // 갈라치기 => MCU에게 데이터 전송할 부분
    // 프로토콜 생성 후 적용 해야 한다고??
    //
    //

} 
const callbackAgent = (error, data) => {
    if ( error ) { console.error (error) } 
    else {
        console.log("여기는 콜백함수내부의 ELSE 문 입니다.")
        console.log(JSON.stringify(data, null, 2))
        // pakt87:: MIB 브라우저 등에서 수정가능한 값들을 수정하게 되면, 자동으로 해당값을 수정하게 됨..
        // varbinds 배열 반복문 실행..
        data.pdu.varbinds.forEach(
            (varbind) => {
                // 수정한 값이 있는지 확인하는 과정.. >> 수정된 값은 oldValue 를 갖고 있음..
                if("oldValue" in varbind){
                    console.log(`"oldValue" in varbind ==> `, varbind)
                    // pakt87:: 여기서 변경된 항목들에 맞게, 실제값을 변경해줄수 있도록, MCU 에 통신보내도록 할 것..
                    setSnmpData(varbind)
                    
                }
        })

        // console.log("현재의 mib data >>> ")
        // console.log(mib)
    }
}
/*******************************************************
* 3-3. SNMP 서버 생성 (agent, session)
*       >> session 은 target IP 가 변경되면..
*       >> 새로 할당해줘야하기 때문에.. let 으로 생성함..
*******************************************************/
// snmp agent, session 생성 및 작동시작 / 대기
const agent = snmp.createAgent(optionsAgent, callbackAgent) // agent 생성
console.log("SNMP session 최초 생성시작..")
let session = snmp.createSession (                          // session 생성
    infoSnmp.targetIp,
    infoSnmp.targetCommunity,
    optionsSession
)
console.log("SNMP session 최초 생성완료..")
// mib 최초 뼈대 구성
skScalars.forEach( (element) => {
    agent.registerProvider(element)
})
// mib 데이터 생성, 그리고 agent 뼈대값 일단 그대로 가져오기
const mib = agent.getMib();
// mib 를 텍스트 형식으로 덤프합니다.
// options 객체는 다음 옵션 필드를 사용하여 덤프 표시를 제어합니다 (모두 기본값이 true인 부울입니다).
mib.dump ({
	leavesOnly: true,       // 내부 노드를 별도로 표시하지 않음 - 리프 노드(인스턴스 노드)의 접두사 부분으로만
    showProviders: true,    // 공급자가 MIB에 연결된 노드 표시
    showValues: true,       // 인스턴스 값 유형 표시
    showTypes: true         // 인스턴스 값 표시
})
// pakt87:: 최초로 한번 기본값들로 mib 데이터 덮어씌우기..
for(var key in resultSnmp) {    // pakt87:: getSnmpAll 함수에서 기능 발췌함..
    mib.setScalarValue(key, resultSnmp[key])    // 반복문안에서, agent 내부값 변경해주기..
}
/*******************************************************
* 3-4. SNMP....
*******************************************************/












/*******************************************************
 *
 *
 * 
 * 
 * 4. SerialPort 설정/연결
 * 
 * 
 * 
 * 
 * 
*******************************************************/
/*******************************************************
* 4-1. SerialPort 관련 값,옵션관련 변수들 
*******************************************************/
const myPathSerial = "/dev/ttyS1"
const myBaudRateSerial = 115200
const bbbSerial = new SerialPort({ path: myPathSerial, baudRate: myBaudRateSerial })
const bbbParser = bbbSerial.pipe(new DelimiterParser({ delimiter: [0x7F] }))
let receiveData = { flag: false, data : [] };
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

bbbParser.on('data', (data) => {
    //여기 뿐이야. 
  // 1. commen 0xC0인거 확인 필요.
  // 2. 만약 C0라면 응답 프로토콜을 전송하고, 아니라면 front로 전달 즉, 정상 전달 필요.
  // 여기서 command 갈라야함.
  if(data[2] === 0xC0){
      console.log('Request IP Address  ======>  ', data);
      // 재부팅을 통해 MCU로부터 IP주소를 다시 받아와 설정.
      // 따라서 데이터 파싱 및 DB기록은 불필요.
      execSync("pm2 restart all");
  }

  receiveData.flag = true;
  receiveData.data = data;
  ///console.log('receiveData.data =====> ', receiveData.data);
  
  // isProgress.SerialWaitPipe = false
  // bbbParser.destroy()
})

const convertDataSerialToObject = (data) => {
    const resultData = { // 시리얼통신에서 수신되는 데이터의 형태..
      band: '',
      // flag: false,
      data: []
    }
     
    let crcBuffer = [];
    let crc = 0x00;
    let addr = 4;
    let receiveCrc = 0x00;
    let dataLength = data.length-9;
    let receiveDataLength = 0;
    // const endOfBuffer = Buffer.from([0x7F])
    // console.log("'data' Buffer is (Before) ===> ", data)
    // console.log("'endOfBuffer' Buffer is ===> ", endOfBuffer)
    // data = Buffer.concat([data, endOfBuffer])    // 버퍼 합치기..
    // console.log("'data' Buffer is (After,Concat) ===> ", data)
    if( data[0] == 0x7E ){
    //   console.log("funcTranslateReceiveData In.. ### 002 ..")
    //   console.log("data.length is ===> ", data.length)
    //   console.log("data[data.length-1] is ===> ", data[data.length-1])
      if( data[data.length-1] == 0x7F ){
        // console.log("funcTranslateReceiveData In.. ### 003 ..")
        // crc 길이에 따라 변경되네? data Length가 
        if( data[addr] == 0x7D ){ 
            // console.log("funcTranslateReceiveData In.. ### 004 ..")
            dataLength--;   addr++;
            receiveDataLength = (data[addr]+0x20)<<8;
        }else{ 
            receiveDataLength = data[addr]<<8;
            // console.log("funcTranslateReceiveData In.. ### 005 ..")
        }   addr++;   // data Length MSB
        if( data[addr] == 0x7D ){ 
            // console.log("funcTranslateReceiveData In.. ### 006 ..")
            dataLength--;   addr++;
            receiveDataLength += data[addr]+0x20;
        }else{ 
            receiveDataLength += data[addr];
            // console.log("funcTranslateReceiveData In.. ### 007 ..")
        }   addr++;   // data Length LSB
        
        let crcAddr = addr+receiveDataLength;
        for (let i = 1; i < crcAddr; i++) { crcBuffer[i] = data[i]; }
        crc = CRC16_CCITT(crcBuffer);
        if( data[crcAddr] == 0x7D ){
            // console.log("funcTranslateReceiveData In.. ### 008 ..")
            dataLength--;   crcAddr++;
            receiveCrc = (data[crcAddr]+0x20)<<8;
        }else{ 
            receiveCrc = data[crcAddr]<<8; 
            // console.log("funcTranslateReceiveData In.. ### 009 ..")
        }   crcAddr++;    // crc MSB
        if( data[crcAddr] == 0x7D ){
            // console.log("funcTranslateReceiveData In.. ### 010 ..")
            dataLength--;   crcAddr++;
            receiveCrc += data[crcAddr]+0x20;
        }else{ 
            receiveCrc += data[crcAddr]; 
            // console.log("funcTranslateReceiveData In.. ### 011 ..")
        }   crcAddr++;    // crc LSB
  
        if( dataLength == receiveDataLength ){
            // console.log("funcTranslateReceiveData In.. ### 012 ..")
            if( crc == receiveCrc ){
                // console.log("funcTranslateReceiveData In.. ### 013 ..")
                // resultData.flag = true;
                resultData.band = data[3];
                resultData.command = data[2];
                resultData.data = Array.from(() => 0);
                let receiveDataAddr = 0;
                // console.log('Receive Success!!!  ' + resultData.command);
                for (addr; addr < crcAddr-2; addr++) { 
                    if( data[addr] == 0x7D ){
                        addr++;
                        resultData.data[receiveDataAddr] = data[addr]+0x20;
                    }else{ resultData.data[receiveDataAddr] = data[addr];  }
                    receiveDataAddr++;
                }
                //console.log("resultData ===> ", resultData)
  
                return resultData
            }
            // console.log("funcTranslateReceiveData In.. ### 014 ..")
        }
      }
    }
    return null
}
const SerialTransmit = (arg) => {
    let transBuffer = [];
    let addr = 0;
    let crc = 0x0000;
    let crcMSB;
    let crcLSB;

    transBuffer[addr] = 0x7E;                   addr++;
    transBuffer[addr] = arg.numberOfCommand;    addr++;
    transBuffer[addr] = arg.command;            addr++;
    transBuffer[addr] = arg.band;               addr++;
    transBuffer[addr] = 0x00;                   addr++;   // addr == 4
    transBuffer[addr] = 0x00;                   addr++;   // addr == 5

    arg.data.map((d, i) => {
        if( (d==0x7D)||(d==0x7E)||(d==0x7F) ){
        transBuffer[addr] = 0x7D;     addr++;
        transBuffer[addr] = d-0x20;   addr++;
        }else{ transBuffer[addr] = d;   addr++; }
    })
    transBuffer[4] = ((addr-6)>>8)&0xFF;
    transBuffer[5] = (addr-6)&0xFF;
    
    crc = CRC16_CCITT(transBuffer);
    crcMSB = (crc>>8)&0xFF;
    crcLSB = crc&0xFF;
    
    if( (crcMSB === 0x7D)||(crcMSB === 0x7E)||(crcMSB === 0x7F) ){
        transBuffer[addr] = 0x7D;  addr++;
        transBuffer[addr] = crcMSB-0x20;  addr++;
    }else{ transBuffer[addr] = crcMSB;    addr++; }
    if( (crcLSB == 0x7D)||(crcLSB == 0x7E)||(crcLSB == 0x7F) ){
        transBuffer[addr] = 0x7D;  addr++;
        transBuffer[addr] = crcLSB-0x20;  addr++;
    }else{ transBuffer[addr] = crcLSB;  addr++; }
    transBuffer[addr] = 0x7F;           addr++;
    
    console.log('Transmit : ', arg.band, ' , ',arg.command);
    // receiveData.flag = false;
    bbbSerial.write(transBuffer);
}
let testTime;
let testTime1;

const asyncFunction = (ipcData, from="snmp") => {
    //const bbbParser = bbbSerial.pipe(new DelimiterParser({ delimiter: [0x7F] }))
    return new Promise((resolve, reject) => { 
        // let cnt
        // while(isProgress.SerialWaitPipe === false){
        //     cnt++
        //     if(cnt > 5000) break;
        // }
        // isProgress.SerialWaitPipe = true
        receiveData.flag = false;
        receiveData.data = [];

        SerialTransmit(ipcData);
        let time = 1000
        if(from === "snmp"){
            time = 500
        }else if(from === "web") {
            time = 1200
        }
        //let internalId;
        const timeoutId = setTimeout(_ => {
            console.log('fail-asyncFunction')
            clearInterval(internalId);
            reject({ message: 'fail-asyncFunction' })
            // isProgress.SerialWaitPipe = false
        }, time);
        testTime = new Date();
        // flag가 true면 멈춰라!
        console.log('Wait Receive Serial Communication............');
        const internalId = setInterval(_ => {
            //console.log('Wait Receive Serial Communication............');
            if( receiveData.flag ){
                receiveData.flag = false;
                clearTimeout(timeoutId);
                clearInterval(internalId);
                resolve(receiveData.data);
            }
        },1)


        //resolve(receiveData.data);
        //testTime1 = new Date();

        // bbbParser.on('data', (data) => {
        //     console.log('received Data ====> ', data);
        //   	//여기 뿐이야. 
		// 	// 1. commen 0xC0인거 확인 필요.
		// 	// 2. 만약 C0라면 응답 프로토콜을 전송하고, 아니라면 front로 전달 즉, 정상 전달 필요.
		// 	// 여기서 command 갈라야함.
		// 	// if(data[2] === 0xC0){
        //     //     console.log('Request IP Address  ======>  ', data);
        //     //     // 재부팅을 통해 MCU로부터 IP주소를 다시 받아와 설정.
        //     //     // 따라서 데이터 파싱 및 DB기록은 불필요.
        //     //     execSync("pm2 restart all");
		// 	// }

        //     clearTimeout(timeoutId);
        //     resolve(data);

        //     // receiveData.flag = true;
        //     // receiveData.data = data;
        //     //data = Buffer.alloc(3000);
        //     testTime1 = new Date();
        //     // isProgress.SerialWaitPipe = false
        //     // bbbParser.destroy()
        // })
    })

}

const BootRequestNetworkInformation = async() => {
    console.log('BootRequestNetworkInformation!!!!!!!!!!!!!!!!!!!!!!!')
    let serialData = { 
        command: 0x42,
        numberOfCommand: 1,
        band: 3,
        data: []
    };

    try {
        isProgress.SerialFromWeb = true;
        const resultBuffer = await asyncFunction(serialData, "web")       // Buffer 형태의 리턴값 받아옴..  시리얼 데이터 전송.
        const endOfBuffer = Buffer.from([0x7F])
        const resultMixed = Buffer.concat([resultBuffer, endOfBuffer])    // 버퍼 합치기..
        const result = [...resultMixed] // serial 수신 결과
        //isProgress.SerialFromWeb = false    // 통신종료로 바꿈

        const receiveObject = convertDataSerialToObject(result);    // serial 데이터에서 실제 Data 부분만 추출
        let ip = [ receiveObject.data[0], receiveObject.data[1], receiveObject.data[2], receiveObject.data[3] ];
        let subnetMask = [ receiveObject.data[4], receiveObject.data[5], receiveObject.data[6], receiveObject.data[7] ];
        let gateway = [ receiveObject.data[8], receiveObject.data[9], receiveObject.data[10], receiveObject.data[11] ];
        let dhcp = receiveObject.data[14];

        
        
        // let serialData_ = { 
        //     command: 0xB0,
        //     numberOfCommand: 1,
        //     band: 3,
        //     data: [0x42, 0x58]
        // };
        // try{
        //     isProgress.SerialFromWeb = true;
        //     const resultBuffer_ = await asyncFunction(serialData_, "web")       // Buffer 형태의 리턴값 받아옴..  시리얼 데이터 전송.
        //     const endOfBuffer_ = Buffer.from([0x7F])
        //     const resultMixed_ = Buffer.concat([resultBuffer_, endOfBuffer_])    // 버퍼 합치기..
        //     const result_ = [...resultMixed_] // serial 수신 결과
        //     const receiveObject_ = convertDataSerialToObject(result_);

        //     let string = ''
        //     for( let i = addr; i<responseData.data.length; i++){
        //         string += responseData.data[i] === 0x00 ? 0x00:String.fromCharCode(responseData.data[i]);
        //     }

        //     let productData = string.split(0x00);

        //     mib.setScalarValue("siteID", active);

        // }catch(error){
        //     console.log("Site ID Request Fail...")
        //     isProgress.SerialFromWeb = false    // 통신종료로 바꿈
        // }


        
        

        // 1. 네트워크 세팅 진행.
        const networkDatas = {
            address: ip[0]+"."+ip[1]+"."+ip[2]+"."+ip[3],
            netmask: subnetMask[0]+"."+subnetMask[1]+"."+subnetMask[2]+"."+subnetMask[3],
            gateway: gateway[0]+"."+gateway[1]+"."+gateway[2]+"."+gateway[3],
            dhcp: dhcp,
        }
        const name = execSync('connmanctl services').toString().trim().replace(/(\s*)/g, "").split("Wired")[1]      // 네트워크 이름 가져오기
        execSync("connmanctl config " + name + " --ipv4 manual "+ networkDatas.address +" "+ networkDatas.netmask +" "+ networkDatas.gateway +"")  // ip 설정 진행
        await wait(1000)    // 딜레이

        // 2. sqlite3 에 dhcp 설정값 저장
        const data = [dhcp.toString(), 'isDhcp']
        const query = `
            UPDATE config 
            SET data = ?
            WHERE name = ?;
        `;
        db.run(query, data, function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);
        });

        isProgress.SerialFromWeb = false    // 통신종료로 바꿈
    } catch {
        console.log("IP Request Fail...")
        isProgress.SerialFromWeb = false    // 통신종료로 바꿈
    }
} 




app.post("/serialCommunication", async(req, res) => {
    if(isProgress.SerialFromWeb === true){
        res.send({
            message: "success",
            serial: "fail-proceeding",
        })
    }else {
        isProgress.SerialFromWeb = true
        const startTime = new Date();
        try {
            const request = req.body
            let countWhile = 0
            // isProgress.SerialFromWeb = true  // 통신중으로 바꿈
            // console.log("request ==> ", request)
            // while(isProgress.SerialFromApiInterval3sec === true){
            //     countWhile++
            //     console.log("countWhile is ===> ", countWhile)
            //     if(countWhile > 1000) break;
            // }
            // console.log("END ## countWhile is ===> ", countWhile)
            while(isProgress.SerialFromApiInterval3sec === true){
                countWhile++
                if(countWhile > 10000) break;
            }
            console.log("countWhile is ===> ", countWhile)

            //testTime = new Date();
            const resultBuffer = await asyncFunction(request.ipcData, "web")       // Buffer 형태의 리턴값 받아옴..

            const endOfBuffer = Buffer.from([0x7F])
            const resultMixed = Buffer.concat([resultBuffer, endOfBuffer])    // 버퍼 합치기..
            const result = [...resultMixed]
            res.send({
                message: "success",
                serial: result===null ? "fail-timeout" : "success",
                result: result
            })
            const endTime = new Date();
            //console.log("--------------Serial Communication 2023 02 02 13 09 --------------");
            //console.log("걸린시간 :: serialCommunication ===> ", testTime1-testTime)
            console.log("걸린시간 :: serialCommunication ===> ", endTime-startTime)
            isProgress.SerialFromWeb = false    // 통신종료로 바꿈
    
        } catch (error) {
            console.log("catch,, error.. in.. ")
            res.send({message: "fail", serial: "fail-catch", result: null})
            const endTime = new Date();
            console.log("걸린시간 :: serialCommunication ===> ", endTime-startTime)
            isProgress.SerialFromWeb = false    // 통신종료로 바꿈
            // throw error
        }
    }
})











/**************************************************************
 * 
 * 
 * 
 * 
 * 
 * api.js 시작시, 1차적으로 한번은 해줘야 하는 것들..
 * 
 * 
 * 
 * 
 */
funcGetEtherInfo();     // 네트워크 정보 가져오기 (ip 등)
BootRequestNetworkInformation();    // MCU로부터 IP 정보 가져오기.


















/**************************************************************
 * 
 * 
 * 
 * 
 * 
 * api.js 시작후, 일정주기로 작동되는 인터벌 함수관련들..
 * 
 * 
 * 
 * 
 */
const timeCounter = {
    countCommon: -1,
    countSNMP: 0,
    countSerial: 0,
    idxCmdSerial: 0,
    countReleaseTimeFromWeb: 0,
}
const INFOMATION = {
    statusMcuSerial : false,
}
const COMMAND = [
    {   
        idx: 0,
        title: "get_admin_McuControl_700",
        command: 0xB0,
        numberOfCommand: 8,
        band: 0,            // 0:ps700, 1:ps800, 2:UL
        data: [0x30, 0x2A, 0x26, 0x1C, 0x1E, 0x20, 0x22, 0x32]
    },
    {   
        idx: 1,
        title: "get_admin_McuControl_800",
        command: 0xB0,
        numberOfCommand: 8,
        band: 1,            // 0:ps700, 1:ps800, 2:UL
        data: [0x30, 0x2A, 0x26, 0x1C, 0x1E, 0x20, 0x22, 0x32]
    },
    {   
        idx: 2,
        title: "get_admin_McuControl_ul",
        command: 0xB0,
        numberOfCommand: 8,
        band: 2,            // 0:ps700, 1:ps800, 2:UL
        data: [0x30, 0x2A, 0x26, 0x1C, 0x1E, 0x20, 0x22, 0x32]
    },
    {   
        idx: 3,
        title: "get_user_SetAlarms_700",
        command: 0x2E,
        numberOfCommand: 1,
        band: 0,    // 0:ps700, 1:ps800, 2:UL
        data: []
    },
    {   
        idx: 4,
        title: "get_user_SetAlarms_800",
        command: 0x2E,
        numberOfCommand: 1,
        band: 1,    // 0:ps700, 1:ps800, 2:UL
        data: []
    },
    {   
        idx: 5,
        title: "get_user_SetAlarms_ul",
        command: 0x2E,
        numberOfCommand: 1,
        band: 2,    // 0:ps700, 1:ps800, 2:UL
        data: []
    },
    {   
        idx: 6,
        title: "get_user_SetParameter_700",
        command: 0xB0,
        numberOfCommand: 4,
        band: 0,        // 0:ps700, 1:ps800, 2:UL
        data: [0x28, 0x2A, 0x24, 0x26]
    },
    {   
        idx: 7,
        title: "get_user_SetParameter_800",
        command: 0xB0,
        numberOfCommand: 4,
        band: 1,        // 0:ps700, 1:ps800, 2:UL
        data: [0x28, 0x2A, 0x24, 0x26]
    },
    {   
        idx: 8,
        title: "get_user_SetParameter_ul",
        command: 0xB0,
        numberOfCommand: 5,
        band: 2,        // 0:ps700, 1:ps800, 2:UL
        data: [0x28, 0x2A, 0x24, 0x26, 0x34]
    },
    {   
        idx: 9,
        title: "get_user_DashBoard_700",
        command: 0xB0,
        numberOfCommand: 7,
        band: 0,    // 0:ps700, 1:ps800, 2:UL, 3:COMMON
        data: [0x1E, 0x20, 0x22, 0x26, 0x1C, 0x2C, 0x1A]
    },
    {   
        idx: 10,
        title: "get_user_DashBoard_800",
        command: 0xB0,
        numberOfCommand: 7,
        band: 1,    // 0:ps700, 1:ps800, 2:UL, 3:COMMON
        data: [0x1E, 0x20, 0x22, 0x26, 0x1C, 0x2C, 0x1A]
    },
    {   
        idx: 11,
        title: "get_user_DashBoard_ul",
        command: 0xB0,
        numberOfCommand: 6,
        band: 2,    // 0:ps700, 1:ps800, 2:UL, 3:COMMON
        data: [0x1E, 0x20, 0x22, 0x26, 0x1C, 0x2C]
    },
    {   
        idx: 12,
        title: "get_user_DashBoard_common",
        command: 0xB0,
        numberOfCommand: 2,
        band: 3,    // 0:ps700, 1:ps800, 2:UL, 3:COMMON
        data: [0x36, 0x44]
    },



    // {   
    //     idx: 0,
    //     title: "get_adminDtuStatus_700",
    //     command: 0xB0,
    //     numberOfCommand: 2,
    //     band: 0,            // 0:ps700, 1:ps800
    //     data: [0x16, 0x18]
    // },
    // {
    //     idx: 1,
    //     title: "get_adminDtuStatus_800",
    //     command: 0xB0,
    //     numberOfCommand: 2,
    //     band: 1,            // 0:ps700, 1:ps800
    //     data: [0x16, 0x18]
    // }
]
const sendSerial = async(ipcData) => {
    try {
        const resultBuffer = await asyncFunction(ipcData, "snmp")       // Buffer 형태의 리턴값 받아옴..
        const endOfBuffer = Buffer.from([0x7F])
        const resultMixed = Buffer.concat([resultBuffer, endOfBuffer])    // 버퍼 합치기..
        const result = convertDataSerialToObject([...resultMixed])
        return result
        // res.send({
        //     message: "success",
        //     serial: result===null ? "fail-timeout" : "success",
        //     result: result
        // })
    } catch (error) {
        console.log("catch,, error.. in.. ")
        // res.send({message: "fail", serial: "fail-catch", result: null})
    }
}
const interval = setInterval(async() => {
    /*** (1초)카운터 증가 ***/
    timeCounter.countCommon = timeCounter.countCommon + 1
    if(isProgress.SerialFromWeb === false) {
        timeCounter.countReleaseTimeFromWeb = timeCounter.countReleaseTimeFromWeb + 1
        if(timeCounter.countReleaseTimeFromWeb > 100) {
            timeCounter.countReleaseTimeFromWeb = 100
        }
    }else{
        timeCounter.countReleaseTimeFromWeb = 0
    }

    /*** (5초)sendSerial Test...  ***/
    if(timeCounter.countCommon%5 === 0 && timeCounter.countReleaseTimeFromWeb > 0){
        if(isProgress.SerialFromApiInterval3sec === true || isProgress.SerialFromWeb === true) {
            ;    
        }else{
            isProgress.SerialFromApiInterval3sec = true
            const receivedData = await sendSerial(COMMAND[timeCounter.idxCmdSerial])
            try { postProcessOfIntervalSerial(timeCounter.idxCmdSerial, receivedData)} catch (error) {
                console.log("postProcessOfIntervalSerial excute error, ===> ", error)
            }
            isProgress.SerialFromApiInterval3sec = false
            // console.log(`setInterval.. 5 sec... sendSerial's receivedData is "${COMMAND[timeCounter.idxCmdSerial].title}"\n===> `, receivedData)
            timeCounter.idxCmdSerial = timeCounter.idxCmdSerial + 1
            if(timeCounter.idxCmdSerial >= COMMAND.length) {
                timeCounter.idxCmdSerial = 0
            }
        }
    }

    /*** (4초)snmp trap 검사...  ***/  
    if(timeCounter.countCommon%4 === 0){
        // console.log(mib)
    }
    /*** (200초)카운터 초기화 :: countCommon ***/
    if(timeCounter.countCommon > 200) {
        timeCounter.countCommon = -1
    }
}, 1000)

const postProcessOfIntervalSerial = (idxOfCommand, receivedData) => {
    console.log("## postProcessOfIntervalSerial in, (idxOfCommand, receivedData) ===> \nidx :: ", idxOfCommand, "\n", receivedData)
    if(idxOfCommand === 0){
        // get_admin_McuControl_700 
        // ===> dl700PAUEnable
        const active = receivedData.data[20] ? 1 : 0;
        mib.setScalarValue("dl700PAUEnable", active)
    }else if(idxOfCommand === 1){
        // get_admin_McuControl_800 
        // ===> dl800PAUEnable
        const active = receivedData.data[20] ? 1 : 0;
        mib.setScalarValue("dl800PAUEnable", active)
    }else if(idxOfCommand === 2){
        // get_admin_McuControl_800 
        // ===> ulPAUEnable
        const active = receivedData.data[20] ? 1 : 0;
        mib.setScalarValue("ulPAUEnable", active)
    }else if(idxOfCommand === 3){
        // get_user_SetAlarms_700 
        // ===> dl700LowInputThreshold, dl700HighInputThreshold, dl700HighOutputThreshold, dl700LowOutputThreshold
        const inputLowTh  = (receivedData.data[1]<<8)+receivedData.data[2]
        const inputHighTh = (receivedData.data[3]<<8)+receivedData.data[4]
        const outputLowTh = (receivedData.data[5]<<8)+receivedData.data[6]
        const outputHighTh= (receivedData.data[7]<<8)+receivedData.data[8]
        mib.setScalarValue("dl700LowInputThreshold", inputLowTh)
        mib.setScalarValue("dl700HighInputThreshold", inputHighTh)
        mib.setScalarValue("dl700LowOutputThreshold", outputLowTh)
        mib.setScalarValue("dl700HighOutputThreshold", outputHighTh)
    }else if(idxOfCommand === 4){
        // get_user_SetAlarms_700 
        // ===> dl800LowInputThreshold, dl800HighInputThreshold, dl800HighOutputThreshold, dl800LowOutputThreshold
        const inputLowTh  = (receivedData.data[1]<<8)+receivedData.data[2]
        const inputHighTh = (receivedData.data[3]<<8)+receivedData.data[4]
        const outputLowTh = (receivedData.data[5]<<8)+receivedData.data[6]
        const outputHighTh= (receivedData.data[7]<<8)+receivedData.data[8]
        mib.setScalarValue("dl800LowInputThreshold", inputLowTh)
        mib.setScalarValue("dl800HighInputThreshold", inputHighTh)
        mib.setScalarValue("dl800LowOutputThreshold", outputLowTh)
        mib.setScalarValue("dl800HighOutputThreshold", outputHighTh)
    }else if(idxOfCommand === 5){
        // get_user_SetAlarms_ul
        // ===> ulHighOutputThreshold
        const outputHighTh= (receivedData.data[7]<<8)+receivedData.data[8]
        mib.setScalarValue("ulHighOutputThreshold", outputHighTh)
    }else if(idxOfCommand === 6){
        // get_user_SetParameter_700
        // ===> dl700ALCLevel, dl700ALCEnable, dl700UserAttenuator1
        const ALCEnable = receivedData.data[1]
        const ALCLevel = (receivedData.data[2]<<8) + receivedData.data[3]
        let Atten_  = (receivedData.data[16]<<8) + receivedData.data[17]
            Atten_ += (receivedData.data[18]<<8) + receivedData.data[19]
        const Atten = Atten_
        mib.setScalarValue("dl700ALCEnable", ALCEnable)
        mib.setScalarValue("dl700ALCLevel", ALCLevel)
        mib.setScalarValue("dl700UserAttenuator1", Atten)
    }else if(idxOfCommand === 7){
        // get_user_SetParameter_800
        // ===> dl800ALCLevel, dl800ALCEnable, dl800UserAttenuator1
        const ALCEnable = receivedData.data[1]
        const ALCLevel = (receivedData.data[2]<<8) + receivedData.data[3]
        let Atten_  = (receivedData.data[16]<<8) + receivedData.data[17]
            Atten_ += (receivedData.data[18]<<8) + receivedData.data[19]
        const Atten = Atten_
        mib.setScalarValue("dl800ALCEnable", ALCEnable)
        mib.setScalarValue("dl800ALCLevel", ALCLevel)
        mib.setScalarValue("dl800UserAttenuator1", Atten)
    }else if(idxOfCommand === 8){
        // get_user_SetParameter_ul
        // ===> ulALCLevel, ulALCEnable, ulUserAttenuator1
        const ALCEnable = receivedData.data[1]
        const ALCLevel = (receivedData.data[2]<<8) + receivedData.data[3]
        let Atten_  = (receivedData.data[16]<<8) + receivedData.data[17]
            Atten_ += (receivedData.data[18]<<8) + receivedData.data[19]
        const Atten = Atten_
        mib.setScalarValue("ulALCEnable", ALCEnable)
        mib.setScalarValue("ulALCLevel", ALCLevel)
        mib.setScalarValue("ulUserAttenuator1", Atten)
    }else if(idxOfCommand === 9){
        // get_user_DashBoard_700
        // ===> dl700InputPower, dl700OutputPower, dl700IsolationValue, 
        // ===> dl700PllAlarmState, dl700HighOutputAlarmState, dl700ANTFailAlarmState
        let input_ = (receivedData.data[3]<<8) + receivedData.data[4]
        if((input_&0x8000) == 0x8000) { input_ = ((~input_&0xFFFF)+1)*(-1) }
        const input = input_
        const output = (receivedData.data[8]<<8) + receivedData.data[9]
        const disol = receivedData.data[19]
        const alarmValue = receivedData.data[17]
        const pll = (alarmValue>>6)&0x01 ? 1:0
        const overOutput = (alarmValue>>1)&0x01 ? 1:0
        const swr = (alarmValue>>4)&0x01 ? 1:0
        mib.setScalarValue("dl700InputPower", input)
        mib.setScalarValue("dl700OutputPower", output)
        mib.setScalarValue("dl700IsolationValue", disol)
        mib.setScalarValue("dl700PllAlarmState", pll)
        mib.setScalarValue("dl700HighOutputAlarmState", overOutput)
        mib.setScalarValue("dl700ANTFailAlarmState", swr)
        // SNMP TRAP 검사/발송, PREFIX_OID = "1.3.6.1.4.1.19865", 
        // 사용재료 ===> isAlarmStateListForSnmpTrap, sendingSnmpTrap()
        if(pll === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.dl700PllAlarmState)
            isAlarmStateListForSnmpTrap.dl700PllAlarmState.state = true 
        }else{ isAlarmStateListForSnmpTrap.dl700PllAlarmState.state = false }
        if(overOutput === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.dl700HighOutputAlarmState)
            isAlarmStateListForSnmpTrap.dl700HighOutputAlarmState.state = true 
        }else{ isAlarmStateListForSnmpTrap.dl700HighOutputAlarmState.state = false }
        if(swr === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.dl700ANTFailAlarmState)
            isAlarmStateListForSnmpTrap.dl700ANTFailAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.dl700ANTFailAlarmState.state = false }
    }else if(idxOfCommand === 10){
        // get_user_DashBoard_800
        // ===> dl800InputPower, dl800OutputPower, dl800IsolationValue, 
        // ===> dl800PllAlarmState, dl800HighOutputAlarmState, dl800ANTFailAlarmState
        let input_ = (receivedData.data[3]<<8) + receivedData.data[4]
        if((input_&0x8000) == 0x8000) { input_ = ((~input_&0xFFFF)+1)*(-1) }
        const input = input_
        const output = (receivedData.data[8]<<8) + receivedData.data[9]
        const disol = receivedData.data[19]
        const alarmValue = receivedData.data[17]
        const pll = (alarmValue>>6)&0x01 ? 1:0
        const overOutput = (alarmValue>>1)&0x01 ? 1:0
        const swr = (alarmValue>>4)&0x01 ? 1:0
        mib.setScalarValue("dl800InputPower", input)
        mib.setScalarValue("dl800OutputPower", output)
        mib.setScalarValue("dl800IsolationValue", disol)
        mib.setScalarValue("dl800PllAlarmState", pll)
        mib.setScalarValue("dl800HighOutputAlarmState", overOutput)
        mib.setScalarValue("dl800ANTFailAlarmState", swr)
        // SNMP TRAP 검사/발송, PREFIX_OID = "1.3.6.1.4.1.19865", 
        // 사용재료 ===> isAlarmStateListForSnmpTrap, sendingSnmpTrap()
        if(pll === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.dl800PllAlarmState)
            isAlarmStateListForSnmpTrap.dl800PllAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.dl800PllAlarmState.state = false }
        if(overOutput === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.dl800HighOutputAlarmState) 
            isAlarmStateListForSnmpTrap.dl800HighOutputAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.dl800HighOutputAlarmState.state = false }
        if(swr === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.dl800ANTFailAlarmState) 
            isAlarmStateListForSnmpTrap.dl800ANTFailAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.dl800ANTFailAlarmState.state = false }
    }else if(idxOfCommand === 11){
        // get_user_DashBoard_ul
        // ===> ulInputPower, ulOutputPower, ulIsolationValue, 
        // ===> ulPllAlarmState, ulHighOutputtAlarmState, ulANTFailAlarmState
        let input_ = (receivedData.data[3]<<8) + receivedData.data[4]
        if((input_&0x8000) == 0x8000) { input_ = ((~input_&0xFFFF)+1)*(-1) }
        const input = input_
        const output = (receivedData.data[8]<<8) + receivedData.data[9]
        const disol = receivedData.data[19]
        const alarmValue = receivedData.data[17]
        const pll = (alarmValue>>6)&0x01 ? 1:0
        const overOutput = (alarmValue>>1)&0x01 ? 1:0
        const swr = (alarmValue>>4)&0x01 ? 1:0
        mib.setScalarValue("ulInputPower", input)
        mib.setScalarValue("ulOutputPower", output)
        mib.setScalarValue("ulIsolationValue", disol)
        mib.setScalarValue("ulPllAlarmState", pll)
        mib.setScalarValue("ulHighOutputtAlarmState", overOutput)
        mib.setScalarValue("ulANTFailAlarmState", swr)
        // SNMP TRAP 검사/발송, PREFIX_OID = "1.3.6.1.4.1.19865", 
        // 사용재료 ===> isAlarmStateListForSnmpTrap, sendingSnmpTrap()
        if(pll === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.ulPllAlarmState) 
            isAlarmStateListForSnmpTrap.ulPllAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.ulPllAlarmState.state = false }
        if(overOutput === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.ulHighOutputtAlarmState) 
            isAlarmStateListForSnmpTrap.ulHighOutputtAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.ulHighOutputtAlarmState.state = false }
        if(swr === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.ulANTFailAlarmState) 
            isAlarmStateListForSnmpTrap.ulANTFailAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.ulANTFailAlarmState.state = false }
    }else if(idxOfCommand === 12){
        // get_user_DashBoard_common
        // ===> temperature, acpowerAlarmState, tempAlarmState, dcFailAlarmState, batteryCapacityAlarmState, dcdcFailAlarmState
        const alarm = receivedData.data[1]
        const temperature = receivedData.data[3]
        const ACFail = (alarm>>1)&0x01?1:0
        const systemTemperature = alarm&0x01?1:0
        const DCFail = (alarm>>2)&0x01?1:0
        const BATTLow = (alarm>>3)&0x01?1:0
        const BATTChg = (alarm>>4)&0x01?1:0
        mib.setScalarValue("temperature", temperature)
        mib.setScalarValue("acpowerAlarmState", ACFail)
        mib.setScalarValue("tempAlarmState", systemTemperature)
        mib.setScalarValue("dcFailAlarmState", DCFail)
        mib.setScalarValue("batteryCapacityAlarmState", BATTLow)
        mib.setScalarValue("dcdcFailAlarmState", BATTChg)
        // SNMP TRAP 검사/발송, PREFIX_OID = "1.3.6.1.4.1.19865", 
        // 사용재료 ===> isAlarmStateListForSnmpTrap, sendingSnmpTrap()
        if(ACFail === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.acpowerAlarmState) 
            isAlarmStateListForSnmpTrap.acpowerAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.acpowerAlarmState.state = false }
        if(systemTemperature === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.tempAlarmState) 
            isAlarmStateListForSnmpTrap.tempAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.tempAlarmState.state = false }
        if(DCFail === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.dcFailAlarmState) 
            isAlarmStateListForSnmpTrap.dcFailAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.dcFailAlarmState.state = false }
        if(BATTLow === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.batteryCapacityAlarmState) 
            isAlarmStateListForSnmpTrap.batteryCapacityAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.batteryCapacityAlarmState.state = false }
        if(BATTChg === 1){ 
            sendingSnmpTrap(isAlarmStateListForSnmpTrap.dcdcFailAlarmState) 
            isAlarmStateListForSnmpTrap.dcdcFailAlarmState.state = true
        }else{ isAlarmStateListForSnmpTrap.dcdcFailAlarmState.state = false }
    }
}
const sendingSnmpTrap = (varAlarm) => {
    if(varAlarm.state === true){
        ;
    }else{
        // Test.. 하드코딩으로..
        // const result = resultSnmp
        const siteId = mib.getScalarValue("siteID")
        const valueAlarm = mib.getScalarValue(varAlarm.name)
        const varbinds = [
            {
                oid: "1.3.6.1.4.1.19865.1.5",       // siteID 의 oid 값..
                type: snmp.ObjectType.OctetString,
                value: siteId
            },
            {
                oid: ("1.3.6.1.4.1.19865.3." + varAlarm.idxOfOid),  // 해당하는 Alarm 의 oid 값..
                type: snmp.ObjectType.Integer,                      // 해당하는 oid's value 의 type 유형선언..
                value: valueAlarm                                   // 해당하는 Alarm 의 value 값..
            }
        ]
        session.trap (("1.3.6.1.4.1.19865.4."+varAlarm.idxOfOid), varbinds, function (error) {
            if (error) { 
                console.error (error)
            }else{ 
                console.log("## sendingSnmpTraptrap... sending completed... ===> ", varAlarm.name)
            }
        })
        try{
            // email 알림 발송..
            funcSendMail(
                null,                       // res
                false,                      // isTest
                "WebServer Email Alarm",    // subject
                // html
                `You got a message from <br />WebServer<br /><br />
                        Site : ${siteId}<br />
                        Alarm : ${varAlarm.name}<br />
                        OID : 1.3.6.1.4.1.19865.3.${varAlarm.idxOfOid}<br />
                        State : ${valueAlarm}`
            )
        }catch(error){
            console.log("funcSendMail Error..." )
        }
        
    }
}











































/*******************************************************
*           GETGETGETGETGET
*       GETGET
*     GETGET
*   GETGET
*   GETGET                  
*   GETGET                  ET 통신관련 함수들 선언부..
*   GETGET          
*   GETGET          GETGETGETGETGET
*   GETGET          GETGETGETGETGET
*   GETGET                  GETGET
*   GETGET                  GETGET
*     GETGET                GETGET
*       GETGET              GETGET
*           GETGETGETGETGET GETGET
*                           GETGET
*******************************************************/
/*** [ MIB 브라우저에서 사용할, .mib 파일 다운로드 해주는 함수 ] ***/
app.get("/download/mib", (req, res, nextFunction) => {
    const __dirname = path.resolve()    // 현재 경로값을 절대경로형태로 반환..
    const filePathString = path.join(__dirname, "./snmp/downloadable_snmp.mib")    // MIB 파일 경로..
    const fileNameString = "loadable_snmp.mib"
    res.download(filePathString, fileNameString)
})



















/*******************************************************
* POSTPOSTPOSTPOSTPOST
* POST              POST
* POST                POST
* POST                POST
* POST                POST
* POST              POST
* POSTPOSTPOSTPOSTPOST     OST 통신관련 함수들 선언부..
* POST
* POST
* POST
* POST
* POST
* POST
* POST
*******************************************************/
/*******************************************************
 * POST 통신함수 :: DB 사용
 * 절대!!!!! 네버!!!! 앞에 / 빼먹지 말것.. 하..
 * https://github.com/TryGhost/node-sqlite3/wiki/API
 * https://github.com/TryGhost/node-sqlite3/wiki/Control-Flow
 * https://docko.tistory.com/678 (페이징쿼리/처리방법)
 * https://www.codegrepper.com/code-examples/sql/pagination+in+sqlite (페이징쿼리/처리방법)
*******************************************************/
/*** [ DB에서 사용자 아이디/비밀번호 확인후 인증값 돌려주는 함수 ] ***/
app.post("/dbLoginCheck", (req, res) => {
    const request = req.body
    console.log("request ==> ", request)
    const query = `
        SELECT idx, id, password FROM users
        WHERE id = '${request.id}' AND password = '${request.password}'
        ORDER BY idx ASC
      `;
    db.serialize(() => {
      /** db.get 은 한줄만 결과값으로 리턴함.. **/
      db.get(query, [], (err, row) => {
          if(err) { res.send({ message: "error", err: err}); /* throw err; */ }
          else {
              console.log("get successm, row is ==> ", row)
              if(row){
                res.send({message: "success"/*, row: row*/})
              }else{
                res.send({message: "fail"/*, row: row*/})
              }
          }
      });
    })
  })
/*** [ DB users 전체 셀렉팅 함수 ] ***/
app.post("/dbSelectTableUsers", (req, res) => {
    const request = req.body
    console.log("request ==> ", request)
    const query = `
        SELECT idx, id, password FROM users
        ORDER BY idx ASC
    `;
    db.serialize(() => {
        /** db.get 은 한줄만 결과값으로 리턴함.. **/
        // db.get(query, [], (err, row) => {
        //     if(err) { res.send({ message: "error", err: err}); throw err; }
        //     else {
        //         console.log(row)
        //         res.send({message: "success", row: row})
        //     }
        // });
        /** db.all 은 전체 전부의 결과값을 리턴함.. **/
        db.all(query, [], (err, rows) => {
            if(err) { res.send({ message: "error", err: err}); throw err; }
            else {
                console.log(rows)
                res.send({message: "success", row: rows})
            }
        });
    })
})


/*******************************************************
	* 
  *
  * 
  * 
  * app.post >> webgui 용
  * 
  * 
  * 
  * 
  * 
*******************************************************/
// COMMON 함수들........................................


// EXE 함수들...........................................
// exeUpdateFromFile
app.post("/exeUpdateFromFile", (req, res) => {
    // res.send({message:"success, upload File."})
    
    const __dirname = path.resolve()    // 현재 경로값을 절대경로형태로 반환..
    const myPathFolder = path.join(__dirname, "../update")  // 경로 조인..하여 반환..
    const myPathFile = path.join(__dirname, "../update/updates.tgz")    // 업데이트압축 파일 경로..
    const myPathCommand = path.join(__dirname, "../commandAfterUpdate.sh")      // 명령 실행..
    
    //Directory 존재 여부 체크
    const isDirectory = fs.existsSync(myPathFolder) //디렉토리 경로 입력
    if(!isDirectory) {
      fs.mkdirSync(myPathFolder)  // 생성
    }else{
      fs.rmdirSync(myPathFolder, { recursive: true });  // 삭제 후
      fs.mkdirSync(myPathFolder)  // 생성
    }
    
    // 파일이동
    let storage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, "../update/")},
        filename: function(req, file, cb) { cb(null, "updates.tgz")},
      });
    const upload = multer({ storage: storage}).single("file")

    upload(req, res, err => {
        // 실패시..
        if(err){
          return res.send({message:"fail", err:err.toString()})
        }
        
        // 성공시..
        execSync("tar -zxf " + myPathFile + " -C" + path.join(__dirname, "../"))  // 압축해제..
        execSync("chmod +x " + myPathCommand)       // 실행권한 주기
        // const pathExecute = execSync(myPathCommand) // 스크립트 명령 실행
        
        res.send({  // 일단 응답은 전송..
          message: "success",
          url: res.req.file.path,
          fileName: res.req.file.fileName,
          __dirname: __dirname,
        //   __pathExcute: pathExecute.toString(),
        })
        
        execSync("pm2 restart all")                  // pm2 전체 재시작
    
    })
})
app.post("/exeMailTest", (req, res) => {
    const request = req.body
    console.log("request ==> ", request)
    // const sending = await funcSendMail()
    funcSendMail(res, true)     // true:isTest
})
app.post("/exeSnmpTrapTest", (req, res) => {
    const request = req.body
    console.log("request ==> ", request)
    
    // Test.. 하드코딩으로..
    const result = resultSnmp
    const varbinds = [
        {
            oid: "1.3.6.1.4.1.19865.1.5",       // siteID 의 oid 값..
            type: snmp.ObjectType.OctetString,
            value: result["siteID"]
        },
        {
            oid: "1.3.6.1.4.1.19865.3.999",       // 해당하는 trap 의 oid 값..
            type: snmp.ObjectType.Integer,      // 해당하는 oid's value 의 type 유형선언..
            value: result["testAlarmState"]  // 해당하는 trap 의 value 값..
        }
    ]
    session.trap ("1.3.6.1.4.1.19865.4.999", varbinds, function (error) {
        if (error) { 
            console.error (error)
            res.send({
                message:"success",
                sending:"fail",  // success or fail
            })
        }else{ 
            console.log("trap send..")
            res.send({
                message:"success",
                sending:"success",  // success or fail
            })
        }
    })
    
})




// GET 함수들...........................................
app.post("/snmpModuleInfomation", (req, res) => {
    console.log(req.body);
    mib.setScalarValue("repeaterType", req.body[0])
    mib.setScalarValue("productNumber", req.body[1])
    mib.setScalarValue("serialNumber", req.body[2])
    const query_ = `
    SELECT idx, name, data FROM config
    WHERE name = 'siteID'
    ORDER BY idx ASC
    `;
    db.get(query_, [], (err_, row_) => {
        console.log('siteID ===> ', row_);
        if(err_){ res.send({ message: "error", err: err_}); throw err_; }
        else{
            mib.setScalarValue("siteID", row_.data);

            res.send({
                message: "success",
                type: req.body[0],
                product: req.body[1],
                serial: req.body[2],
                siteID: row_.data,
            })
        }
    })
    //mib.setScalarValue("siteID", req[3])
})

app.post("/getSnmp", (req, res) => {
    const query = `
        SELECT idx, name, data FROM config
        WHERE name = 'snmpTargetIp'
        ORDER BY idx ASC
    `;
    db.get(query, [], (err, row) => {
        if(err) { res.send({ message: "error", err: err}); throw err; }
        else {
            console.log("get successm, row is ==> ", row)
            if(row){
                const query_ = `
                    SELECT idx, name, data FROM config
                    WHERE name = 'siteID'
                    ORDER BY idx ASC
                `;
                let ip = row.data;
                db.get(query_, [], (err_, row_) => {
                    if(err_){ res.send({ message: "error", err: err_}); throw err_; }
                    else{
                        res.send({
                            message: "success",
                            targetSnmpIp: ip,
                            siteID: row_.data,
                        })
                    }
                })
                
            }
        }
    });
})
app.post("/checkServerApi", (req, res) => {
    res.send({message: "success"})
})
app.post("/getMail", (req, res) => {
    const request = req.body
    console.log("request ==> ", request)
    const query = `
        SELECT idx, tool, host, type, port, id, password, notify, address FROM mail
        WHERE tool = 'nodemailer'
        ORDER BY idx ASC
    `;
    db.serialize(() => {
        db.get(query, [], (err, row) => {
            if(err) { res.send({ message: "error", err: err}); throw err; }
            else {
                console.log(row)
                res.send({
                    idx: row.idx,
                    tool: row.tool,
                    host: row.host,
                    type: row.type,
                    port: row.port,
                    id: row.id,
                    password: row.password,
                    notify: row.notify,
                    address: row.address,
                })
            }
        });       
    })
})

app.post("/getRegister", (req, res) => { 
    const request = req.body
    console.log("request ==> ", request)

    // funcGetEtherInfo()      // 이더넷 정보 가져오기..

    const query_1 = `
        SELECT idx, id, company, name, address_1, address_2, city, state, zip, email, fax, phone, provider FROM register
        WHERE id = 'owner'
    `;
    const query_2 = `
        SELECT idx, id, company, name, address_1, address_2, city, state, zip, email, fax, phone, provider FROM register
        WHERE id = 'installer'
    `;
    db.serialize(() => {
        // 첫번째 쿼리문 실행..
        db.get(query_1, [], (err, row_1) => {
            if(err) { res.send({ message: "error", err: err}); /* throw err; */ }
            else {
                console.log(row_1)
                // 두번째 쿼리문 실행..
                db.get(query_2, [], (err, row_2) => {
                    if(err) { res.send({ message: "error", err: err}); /* throw err; */ }
                    else {
                        console.log(row_2)
                        res.send({owner: row_1, installer: row_2})
                    }
                });
            }
        });
    })
})
app.post("/getEthernet", async(req, res) => { 
    const request = req.body
    console.log("request ==> ", request)

    funcGetEtherInfo()      // 이더넷 정보 가져오기..

    const query = `
        SELECT idx, name, data FROM config
        WHERE name = 'isDhcp'
        ORDER BY idx ASC
    `;
    db.serialize(() => {
        db.get(query, [], (err, row) => {
            if(err) { res.send({ message: "error", err: err}); throw err; }
            else {
                console.log(row)
                row.data == '1' ? infoEther.dhcp = true : infoEther.dhcp = false 
                res.send(infoEther);
            }
        });       
    })
}) 


// SET 함수들...........................................
app.post("/setSnmp", async(req, res) => {
    const request = req.body
    console.log("request ==> ", request)
    const data = [request.snmpTargetIp]
    const query = `
        UPDATE config 
        SET data=?
        WHERE name = 'snmpTargetIp';
    `;
    db.run(query, data, function(err) { // config's SNMP 데이터 업데이트..
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row updated: ${this.changes}`);
        // 전역변수인 infoSnmp 의 targetIp 를 변경해주기..
        infoSnmp.targetIp = request.snmpTargetIp    
        // SNMP session 새로 구성해주기..
        console.log("regenerationSnmpSession() Execute..!")
        regenerationSnmpSession()
        // 통신결과값 보내기..
        const query_ = `
            UPDATE config 
            SET data=?
            WHERE name = 'siteID';
        `;
        const data_ = [request.siteID];
        db.run(query_, data_, function(err_) {
            if(err_) {
                return console.error(err_.message);
            }

            res.send({message: "success"})
        });
    });
})

app.post("/setMail", async(req, res) => {
    const request = req.body
    console.log("request ==> ", request)
    const data = [request.smtpHost, request.smtpType, request.smtpPort, request.smtpUserId, request.smtpUserPwd, request.emailNotificationEnalbe, request.emailNotificationAddress]
    const query = `
        UPDATE mail 
        SET host=?, type=?, port=?, id=?, password=?, notify=?, address=?
        WHERE tool = 'nodemailer';
    `;
    db.run(query, data, function(err) { // mail 데이터 업데이트..
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row updated: ${this.changes}`);
        res.send({message: "success"})
    });
})
app.post("/setRegister", async(req, res) => {
    const request = req.body
    console.log("request ==> ", request)
    const data_1 = [request.owner.company, request.owner.contactName, request.owner.address1, request.owner.address2, request.owner.city, request.owner.state, request.owner.zip, request.owner.email, request.owner.fax, request.owner.phone, request.serviceProvider]
    const query_1 = `
        UPDATE register 
        SET company=?, name=?, address_1=?, address_2=?, city=?, state=?, zip=?, email=?, fax=?, phone=?, provider=?
        WHERE id = 'owner';
    `;
    const data_2 = [request.installBy.company, request.installBy.contactName, request.installBy.address1, request.installBy.address2, request.installBy.city, request.installBy.state, request.installBy.zip, request.installBy.email, request.installBy.fax, request.installBy.phone, '']
    const query_2 = `
        UPDATE register 
        SET company=?, name=?, address_1=?, address_2=?, city=?, state=?, zip=?, email=?, fax=?, phone=?, provider=?
        WHERE id = 'installer';
    `;
    db.run(query_1, data_1, function(err) { // owner 데이터 업데이트..
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row updated: ${this.changes}`);
        db.run(query_2, data_2, function(err) { // installer 데이터 업데이트..
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row updated: ${this.changes}`);
            res.send({message: "success"})
        });
    });
}) 
app.post("/setEthernet", async(req, res) => {
    const request = req.body
    console.log("request ==> ", request)

    // 이더넷 이름 가져와 놓기..    
    const name = execSync('connmanctl services').toString().trim().replace(/(\s*)/g, "").split("Wired")[1]
    
    // dhcp 에 따라 가르기..
    if(request.dhcp === true) {
        // #1.. 현재의 설정되어있는 이더넷 정보 가져와서 저장해두기..
        console.log("/setEthernet 의 step, #1 ...")
        const etherBefore = getEtherInfo()
        // const beforeIp = execSync("hostname -I").toString().trim().split(" ")[0]
        // #2.. 일단 자동으로 설정해서.. ip 받고.. after 에 넣어주고..
        console.log("/setEthernet 의 step, #2 ...")
        exec("connmanctl config " + name + " --ipv4 dhcp", async(error, stdout, stderr) => {
            // const sendAfterIp = execSync("hostname -I").toString().trim().split(" ")[0]
            await wait(1000)    // 지연함수 참조 >> https://www.daleseo.com/js-sleep/
            const etherAfter = getEtherInfo()
            // #3.. 다시 기존 ip 로 돌아간뒤에..
            console.log("/setEthernet 의 step, #3 ...")
            exec("connmanctl config " + name + " --ipv4 manual "+ etherBefore.address +" "+ etherBefore.netmask +" "+ etherBefore.gateway +"", async(error, stdout, stderr) => {
                // #4.. 통신전송하고..
                console.log("/setEthernet 의 step, #4 ...")
                await wait(1000)
                res.send({
                    beforeIp: etherBefore.address,
                    afterIp: etherAfter.address,
                    etherBefore: etherBefore,
                    etherAfter: etherAfter,
                    message: "success",
                })
                // #5.. 다시 dhcp 설정상태로 돌림..
                console.log("/setEthernet 의 step, #5 ...")
                execSync("connmanctl config " + name + " --ipv4 manual "+ etherAfter.address +" "+ etherAfter.netmask +" "+ etherAfter.gateway +"")
                // const InternalAfterIp = execSync("hostname -I").toString().trim().split(" ")[0]
                // #6. sqlite3 에 dhcp 설정값 저장, MCU 에 전달 => MCU에 전달은 front에서 진행
                const data = ['1', 'isDhcp']
                const query = `
                    UPDATE config 
                    SET data = ?
                    WHERE name = ?;
                `;
                db.run(query, data, function(err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log(`Row(s) updated: ${this.changes}`);
                });
                try {
                    funcGetEtherInfo();
                    let newIp = etherAfter.address.split('.');;
                    let newSubnetMask = etherAfter.netmask.split('.');
                    let newGateway = etherAfter.gateway.split('.');
                    let serialData = {
                      command: 0x10,
                      numberOfCommand: 1,
                      band: 3,
                      data: []
                    }
                    serialData.data[serialData.data.length] = newIp[0]&0xFF;
                    serialData.data[serialData.data.length] = newIp[1]&0xFF;
                    serialData.data[serialData.data.length] = newIp[2]&0xFF;
                    serialData.data[serialData.data.length] = newIp[3]&0xFF;
              
                    serialData.data[serialData.data.length] = newSubnetMask[0]&0xFF;
                    serialData.data[serialData.data.length] = newSubnetMask[1]&0xFF;
                    serialData.data[serialData.data.length] = newSubnetMask[2]&0xFF;
                    serialData.data[serialData.data.length] = newSubnetMask[3]&0xFF;
              
                    serialData.data[serialData.data.length] = newGateway[0]&0xFF;
                    serialData.data[serialData.data.length] = newGateway[1]&0xFF;
                    serialData.data[serialData.data.length] = newGateway[2]&0xFF;
                    serialData.data[serialData.data.length] = newGateway[3]&0xFF;
              
                    serialData.data[serialData.data.length] = (5000>>8)&0xFF;
                    serialData.data[serialData.data.length] = (5000)&0xFF;
                    serialData.data[serialData.data.length] = 1;
                    // 여기서 처리 했어야 하는구나.
                    let response = await asyncFunction(serialData);
                    console.log('Network IP serialData  =====> ', serialData);
                  } catch (error) { console.log('error Catch set IP MCU ==>', error) }
            })
        })

    }else{
        // #1.. 현재의 설정되어있는 이더넷 정보 가져와서 저장해두기..
        const etherBefore = getEtherInfo()
        // #2.. 일단 통신완료 지음..
        res.status(200).json({ 
            beforeIp: etherBefore.address,
            afterIp: request.address,
            etherBefore: etherBefore,
            etherAfter: request,
            message: "success",
        })
        // #3. connamn 으로 수동ip로 설정.. (비글본은 connman 으로만 변경됨..)
        execSync("connmanctl config " + name + " --ipv4 manual "+ request.address +" "+ request.netmask +" "+ request.gateway +"")
        await wait(1000)

        // #4. sqlite3 에 dhcp 설정값 저장, MCU 에 전달 => MCU에 전달은 front에서 진행
        const data = ['0', 'isDhcp']
        const query = `
            UPDATE config 
            SET data = ?
            WHERE name = ?;
        `;
        db.run(query, data, function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);
        });

        try {
            funcGetEtherInfo();
            let newIp = infoEther.address.split('.');;
            let newSubnetMask = infoEther.netmask.split('.');
            let newGateway = infoEther.gateway.split('.');
            let serialData = {
              command: 0x10,
              numberOfCommand: 1,
              band: 3,
              data: []
            }
            serialData.data[serialData.data.length] = newIp[0]&0xFF;
            serialData.data[serialData.data.length] = newIp[1]&0xFF;
            serialData.data[serialData.data.length] = newIp[2]&0xFF;
            serialData.data[serialData.data.length] = newIp[3]&0xFF;
      
            serialData.data[serialData.data.length] = newSubnetMask[0]&0xFF;
            serialData.data[serialData.data.length] = newSubnetMask[1]&0xFF;
            serialData.data[serialData.data.length] = newSubnetMask[2]&0xFF;
            serialData.data[serialData.data.length] = newSubnetMask[3]&0xFF;
      
            serialData.data[serialData.data.length] = newGateway[0]&0xFF;
            serialData.data[serialData.data.length] = newGateway[1]&0xFF;
            serialData.data[serialData.data.length] = newGateway[2]&0xFF;
            serialData.data[serialData.data.length] = newGateway[3]&0xFF;
      
            serialData.data[serialData.data.length] = (5000>>8)&0xFF;
            serialData.data[serialData.data.length] = (5000)&0xFF;
            serialData.data[serialData.data.length] = 0;
            // 여기서 처리 했어야 하는구나.
            let response = await asyncFunction(serialData);
            console.log('Network IP serialData  =====> ', serialData);
          } catch (error) { console.log('error Catch set IP MCU ==>', error) }
    }
})