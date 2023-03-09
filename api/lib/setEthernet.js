/********************************************
 * 실제 사용하지는 않고 있는 소스임..
 * api.js 의 funcSetEtherInfo() 또는 post함수인 /setEthernet 구현을 위한 참고용 코드임..
 * ............
 */


// 1. spawn을 불러오고.
import { spawn, execSync, exec } from 'child_process';
import path from "path"
import fs from "fs"
// var ip = require('ip');

import os from "os"
// const defaultGateway = require('default-gateway');
import defaultGateway from "../node_modules/default-gateway/index.js"


export function setEthernet(request) {
  console.log(request)
  if(request.dhcp === true) {
    return true
  }else{
    return false
  }
}





const handler = async(req, res) => {
  const { method, body } = req
  // GET, POST, PUT, PATCH 등 요청에 맞는 작업 실행
  if(method === "POST"){
    const __dirname = path.resolve()
    const myPathEnv = path.join(__dirname, "./.env.local")

    try {

      const getInfoEther = () => {
        // 리턴값 dic 선언
        let ether
        // 네트워크 정보 가져오기..
        const osNets = os.networkInterfaces();
        const osResults = Object.create(null); // Or just '{}', an empty object
        for (const name of Object.keys(osNets)) {
            for (const net of osNets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    if (!osResults[name]) {
                        osResults[name] = [];
                    }
                    // osResults[name].push(net.address);
                    osResults[name].push(net);
                }
            }
        }
        // OS 플랫폼 정보 가져오기..
        const myTYPE = os.type()
        const myPLATFORM = os.platform()
        // 플랫폼에 따라 IP, SerialPort 값 넣어주기..
        if(myPLATFORM === "win32" && myTYPE === "Windows_NT"){  // 윈도우즈 일경우..
          // 이더넷 or Ethernet 을 적용
          if( "Ethernet" in osResults)      { ether = (osResults["Ethernet"])[0] }
          else if("이더넷" in osResults)     { ether = (osResults["이더넷"])[0] }
          else                              { ether = "localhost" }
        }else if(myPLATFORM === "linux" && myTYPE === "Linux"){     // 리눅스 일경우..
          // eth0 을 적용  
          ether = (osResults["eth0"])[0]
        }else{
          ether = "localhost"
        }
        
        // result.ip = result.ip.toString()    // 배열이기때문에, string 화해서 1개만 넣음..
      
        const { gateway } = defaultGateway.v4.sync();
        // const {gateway} = await defaultGateway.v4();
        ether.gateway = gateway
        return ether
      }

      // ##. 딜레이 주기.. 함수 선언
      let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("완료!"), 1500)
      });

      // // eth0 서비스이름 가져오기..
      // const name = execSync('connmanctl services').toString().trim().replace(/(\s*)/g, "").split("Wired")[1]
      // delay = await promise;
      // const beforeIp = execSync("hostname -I").toString().trim().split(" ")[0]
      // delay = await promise;
      // const afterIp = body.address

      const name = execSync('connmanctl services').toString().trim().replace(/(\s*)/g, "").split("Wired")[1]
      const beforeIp = ip.address()
      let afterIp = body.address

      // dhcp 에 따라 가르기..
      if(body.dhcp){
        // dhcp 인 경우..
        // !!!! dhcp 인 경우에는, 절대.. body 의 이더넷 관련정보를 사용하면 안됨..!
        // !!!! 신뢰할 수 없는 데이터임..!!
        // 기존에 이미 dhcp 인 경우에..
        // 다시 dhcp 세팅하라는 명령 post 통신이 오면..
        // 무시하도록 수정할것..

        // #1.. 현재의 설정되어있는 이더넷 정보 가져와서 저장해두기..
        const etherBefore = getInfoEther()
        // console.log("etherBefore ===> ", etherBefore)

        // // 일단 자동으로 설정해서.. ip 받고.. after 에 넣어주고..
        execSync("connmanctl config " + name + " --ipv4 dhcp")
        const delay_d1 = await promise;
        const sendAfterIp = execSync("hostname -I").toString().trim().split(" ")[0]
        const delay_d2 = await promise;
        const etherAfter = getInfoEther()
        // afterIp = ip.address()


        // 다시 기존 ip 로 돌아간뒤에..
        // 통신전송하고..
        execSync("connmanctl config " + name + " --ipv4 manual "+ etherBefore.address +" "+ etherBefore.netmask +" "+ etherBefore.gateway +"")
        const delay_d3 = await promise;
        res.status(200).json({ 
          beforeIp: beforeIp,
          afterIp: sendAfterIp,
          // afterIp: afterIp,
          body: body,
          msg: "success",
          etherBefore: etherBefore,
          etherAfter: etherAfter,
        })

        // // 다시 dhcp 설정상태로 돌림..
        execSync("connmanctl config " + name + " --ipv4 manual "+ etherAfter.address +" "+ etherAfter.netmask +" "+ etherAfter.gateway +"")
        const delay_d4 = await promise;
        const InternalAfterIp = execSync("hostname -I").toString().trim().split(" ")[0]
        const delay_d5 = await promise;
        
        // 딜레이 강제적용..
        // let delay = await promise;

        // dhcp 인 경우..
        // execSync("connmanctl config " + name + " --ipv4 dhcp")
        // afterIp = ip.address()



        // 밑의 수동ip 설정처럼 똑같이..
        // 파일들 전부 교체해줘야 하고..
        // pm2 reload webgui 도 해줘야함..
        const nextauthUrl = "http://" + InternalAfterIp + ":5000"
        process.env.NEXTAUTH_URL = nextauthUrl   // 로그인관련 환경변수 변경 (현재 node 환경변수를 직접 변경해주는 것)
        // 이후 node 재실행일 경우를 대비해, 파일까지 변경..
        fs.writeFileSync(myPathEnv, "NEXTAUTH_URL="+nextauthUrl); // 파일 덮어쓰기
        exec("pm2 restart webgui");
        // exec("pm2 reload webgui");


      }else{  // Static IP 설정인 경우..
        // static ip 부분도 다시한번..
        // 설계에 문제가 없는지..
        // 확인 필요함..
        // const beforeIp = execSync("hostname -I").toString().trim().split(" ")[0]
        // delay = await promise;
        

        // 일단 통신완료 지음..
        res.status(200).json({ 
          beforeIp: beforeIp,
          afterIp: afterIp,
          body: body,
          msg: "success",
        })

        
        // 딜레이 강제적용..
        // let delay = await promise;

        // connamn 으로 수동ip로 설정.. (비글본은 connman 으로만 변경됨..)
        // 명령어 참고 >> https://manpages.debian.org/testing/connman/connmanctl.1.en.html#ipv4
        execSync("connmanctl config " + name + " --ipv4 manual "+ afterIp +" "+ body.netmask +" "+ body.gateway +"")
        const delay_s1 = await promise;
        const realAfterIp = execSync("hostname -I").toString().trim().split(" ")[0]
        const delay_s2 = await promise;

        
        // NEXTAUTH_URL=http://192.168.128.160:5000
        const nextauthUrl = "http://" + realAfterIp + ":5000"
        process.env.NEXTAUTH_URL = nextauthUrl   // 로그인관련 환경변수 변경 (현재 node 환경변수를 직접 변경해주는 것)
        // 이후 node 재실행일 경우를 대비해, 파일까지 변경..
        fs.writeFileSync(myPathEnv, "NEXTAUTH_URL="+nextauthUrl); // 파일 덮어쓰기
        exec("pm2 restart webgui");
        // exec("pm2 reload webgui");
        
      }

      
      
      
      
      


      // res.status(200).json({ 
      //   afterIp: afterIp,
      //   body: body,
      //   msg: "success",
      // })

      ;
    } catch (error) {
      // result = "connmanctl error.."
      ;
    }
    
    // (execSync('connmanctl services').toString().trim().replace(/(\s*)/g, "").split("AOWired")[1]).then(()=>{
    //   res.status(200).json({ 
    //     body: body,
    //     msg: "success",
    //     result: result
    //   })
    // })

    // if(result) {
    //   res.status(200).json({ 
    //     body: body,
    //     msg: "success",
    //     result: result
    //   })
    // }
  }else{
    if(method === "GET") {}
    if(method === "PUT") {}
    if(method === "PATCH") {}
    return res.status(405).send({ message: "Only POST requests allowed", })
  }
}
export default handler;
