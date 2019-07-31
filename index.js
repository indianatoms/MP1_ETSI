const express = require('express');
const app = express();
const publicIp = require('public-ip');
const exec = require('child_process').exec
const now = require('nano-time');

//Set static folder
//app.use(express.static(path.join(__dirname, 'public')))

//homepage
app.get('/', function (req, res) {
        res.send('ETSI MP1 - TRY - /timing/current_time || /timing/timing_caps')
})



//display /timing/current_time page
app.get('/timing/current_time', function (req, res)
{

//curentlly using UNIX time
        var seconds = new Date().getTime() / 1000;
        seconds = parseInt(Math.floor(seconds));
        //nano seconds do not work properly.
        var timeInNs = parseInt(now());
        var istracable = "TRACEABLE";//I asume that unix time is an UTC time therefore it is traceable
 //store value is JSON as required
                res.json({
                        seconds : seconds,
                        nanoSeconds : timeInNs,
                        timeSourceStatus : istracable
                        });
})

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};


//display /timing/current_time page
app.get('/timing/timing_caps', function (req, res, data) {


var seconds = new Date().getTime() / 1000;
seconds = parseInt(Math.floor(seconds));
//nano seconds do not work properly
var timeInNs = parseInt(now());
//IP or DNS name? When?
var ip = require("ip");
var serverAddrType = "IP_ADDRESS";

//Calback 3 data done async way - linux cmd
var myCallback = function(data,data2,data3) {
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
//reqdelay and local priorities has a fixed values

res.json({
timeStamp : {
        seconds : seconds,
        nanosecond : timeInNs,
},
ntpServers : [
        {
        ntpServerAddrType : serverAddrType,
        ntpServerAddr : ip.address(),
        minPollingInterval : minPoll,
        maxPollingInterval : maxPoll,
        localPriority   : 1,
        authenticationOption : auth,
        authenticationKeyNum : keyNumber
        }
],
  ptpMasters :
                [
                        {
                        ptpMasterIpAddress : ip.address(),
                        ptpMasterLocalPriority : priority,
                        delayReqMaxRate : reqDelay
                        }
                ]

        });

  };

var usingItNow = function(callback){
execute("ntpq -p | awk '{print $6}'", function(poll){
        execute("cat /etc/ntp.keys", function(keys){
                execute("cat /etc/linuxptp/ptp4l.conf | grep priority1", function(priority){
                        callback(poll, keys, priority );
                });
        });
    });
};



usingItNow(myCallback);

});


const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));