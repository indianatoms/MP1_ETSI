var http = require('http');
var url = require('url') ;
const now = require('nano-time');
const publicIp = require('public-ip');
const exec = require('child_process').exec

exports.currentTime = (req, res) => {
	console.log('currenttime!')

	
//curentlly using UNIX time
        var seconds = new Date().getTime() / 1000;
        seconds = parseInt(Math.floor(seconds));
                        //nano seconds do not work properly.
        var timeInNs = parseInt(now());
                               //      var timeInNs = now();
        var istracable = "TRACEABLE";//I asume that unix time is an UTC time therefore it is traceable
       //store value is JSON as required
        res.json({
                 seconds : seconds,
                 nanoSeconds : timeInNs,
                 timeSourceStatus : istracable
                                           });

};

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

exports.timingCaps = (req, res) => {
	console.log('timing caps!')

  var seconds = new Date().getTime() / 1000;
  seconds = parseInt(Math.floor(seconds));
//nano seconds do not work properly
  var timeInNs = parseInt(now());
//IP or DNS name? When?
  var ip = require("ip");
  var serverAddrType = "IP_ADDRESS";

  var myCallback = function(data,data2,data3,data4) {
  //get the address column from ntpq -p -n
  var host_addreses = data4
  host_addreses = host_addreses.substring(6);
  var host_adreses_array = host_addreses.split("\n");
  //first two parameters are remote and =====
  var i = 2;
  var hostname = host_adreses_array[i];
  while(hostname[0] != "*")
  {
   i++;
   hostname = host_adreses_array[i];
   if (hostname == null){
        console.log("error");
	res.status(400).send({
                              type   : "NTP problem",
                              title  : "Problem with NTPD deamon",
                              status : 0,
                              detail : "Check if * occuers in ntpd -q -n command on host machine",
                              instance : "ToD"
                            });
                        return;

     }
  }
  hostname = hostname.substring(1)
  console.log(hostname);

  var str = data;
  var str2 = data2;
  var reqDelay = Math.floor(Math.random() * (60 - 5) + 5);
  var priority = data3;
  priority = parseInt(priority.substring(11,priority.length-1));
  str = str.substring(6);
  var arr = str.split("\n").map(val => Number(val));
  var arr2 = str2.split(" ").map(val => Number(val));
  var max = Math.max(...arr);
  var min = Math.min(...arr);
  arr.splice(arr.indexOf(min), 1);
  min = Math.min(...arr);
  var minPoll = Math.log2(min);
  var maxPoll = Math.log2(max);
  var auth;
  var keyNumber;
  if(!data2)
        {
        auth="none";
        KeyNumber = null;
        }
  else
        {
        auth="SYMMETRIC_KEY";
        keyNumber = arr2[0]
        }

//Placing JSON structure on the html site
////reqdelay and local priorities has a fixed values

res.json({
timeStamp : {
        seconds : seconds,
        nanosecond : timeInNs,
},
ntpServers : [
        {
        ntpServerAddrType : serverAddrType,
        ntpServerAddr : hostname,
        minPollingInterval : minPoll,
        maxPollingInterval : maxPoll,
        localPriority   : 1,
        authenticationOption : auth,
        authenticationKeyNum : keyNumber
        }
]
  });
}

var usingItNow = function(callback){
execute("ntpq -p -n | awk '{print $6}'", function(poll){
        execute("cat /etc/ntp.keys", function(keys){
                execute("cat /etc/linuxptp/ptp4l.conf | grep priority1", function(priority){
			execute("ntpq -p -n | awk '{print $1}'", function(remote){
                        	callback(poll, keys, priority, remote );
			});
                });
        });
    });
};

usingItNow(myCallback);

};


