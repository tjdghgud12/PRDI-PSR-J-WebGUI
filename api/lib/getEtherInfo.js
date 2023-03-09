import os from "os"
// const defaultGateway = require('default-gateway');
import defaultGateway from "../node_modules/default-gateway/index.js"

// export function getEtherInfo() {
//   return "A";
// }

export function getEtherInfo() {
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
    console.log("osResults ===> ", osResults)
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