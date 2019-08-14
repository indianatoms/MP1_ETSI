const TermSub = require('../models/sub.model.js');
const SerAva = require('../models/serAva.model.js');
var http = require('http');
var url = require('url') ;
const now = require('nano-time');
const publicIp = require('public-ip');
const exec = require('child_process').exec



exports.create = (req, res) => {
    // Validate request
	console.log("POST - Create")
    if(!req.body.AppTerminationNotificationSubscription && !req.body.SerAvailabilityNotificationSubscription) {
        return res.status(400).send({
            message: "Subscription content can not be empty"
        });
    }
                                var hostname = req.headers.host; // hostname = 'localhost:8080'
                                var pathname = url.parse(req.url).pathname; // pathname = '/MyApp

			if(req.body.AppTerminationNotificationSubscription){

				
					
				if (req.params.AppId != req.body.AppTerminationNotificationSubscription.appInstanceId)
					{
						res.status(400).send({
                                                message: "AppInstance ID is different from URL appInstance ID."
						});
						return;
					}
				if (req.body.AppTerminationNotificationSubscription.subscriptionType != "AppTerminationNotificationSubscription")
					{
						res.status(400).send({
                                                message: "Incorrect Body request."
                                                });
                                                return;
					} 
				

    		// Create a Subscription
          			const termsub = new TermSub({
                			AppTerminationNotificationSubscription : req.body.AppTerminationNotificationSubscription
                			});
				var href = 'http://' + hostname + pathname  + termsub.AppTerminationNotificationSubscription.subscriptionType + '/' + termsub._id	
				termsub.AppTerminationNotificationSubscription._links.self.href = href;

					
				    // Save Subscription in the database
    					termsub.save().then(data => {
        							res.send(data);
    								}).catch(err => {
        									res.status(500).send({
            									message: err.message || "Some error occurred while creating the Note."
       										 			});
									    	});
			}

			if(req.body.SerAvailabilityNotificationSubscription){
                                if (req.params.AppId != req.body.SerAvailabilityNotificationSubscription.filteringCriteria.serInstanceId)
                                        {
                                                res.status(500).send({
                                                message: "AppInstance ID is different from URL appInstance ID."
                                                });
                                                return;
                                        }

					if (req.body.SerAvailabilityNotificationSubscription.subscriptionType != "SerAvailabilityNotificationSubscription")
                                        {
                                            res.status(400).send({
                                                message: "Incorrect Body request. - sub type"
                                              });
                                            return;
                                        }

					
					if (req.body.SerAvailabilityNotificationSubscription.filteringCriteria.serializer != "JSON"
						&& req.body.SerAvailabilityNotificationSubscription.filteringCriteria.serializer != "XML" 
						&& req.body.SerAvailabilityNotificationSubscription.filteringCriteria.serializer != "PROTOBUF3") 
                                        {
                                                res.status(400).send({
                                                message: "Incorrect Body request. filteringCriteria-Serializer"
                                                });
                                                return;
                                        }

					if (req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.type != "REST_HTTP"
						&& req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.type != "MB_TOPIC_BASED"
						&& req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.type != "MB_ROUTING"
						&& req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.type != "MB_PUBSUB"
						&& req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.type != "RPC"
						&& req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.type != "RPC_STREAMING"
						&& req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.type != "WEBSOCKET ")
					  {
                                                res.status(400).send({
                                                message: "Incorrect Body request.filteringCriteria-TransportInfo -type"
                                                });
                                                return;
                                          }

				const serAva = new SerAva({
					SerAvailabilityNotificationSubscription : req.body.SerAvailabilityNotificationSubscription
					});
					var href = 'http://' + hostname + pathname  + serAva.SerAvailabilityNotificationSubscription.subscriptionType + '/' +  serAva._id
					serAva.SerAvailabilityNotificationSubscription._links.self.href = href;
					// Save Note in the database
    					serAva.save().then(data => {
								console.log(data);
        							res.send(data);
    								}).catch(err => {
        									res.status(500).send({
            									message: err.message || "Some error occurred while creating the Note."
        												});
    										});   
				};		

};
// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
        var hostname = req.headers.host; // hostname = 'localhost:8080'
        var pathname = url.parse(req.url).pathname; // pathname = '/MyApp'

Promise.all([
	 TermSub.find({"AppTerminationNotificationSubscription.appInstanceId" : req.params.AppId },{"AppTerminationNotificationSubscription._links" : 1, "AppTerminationNotificationSubscription.subscriptionType" : 1}),
	 SerAva.find({"SerAvailabilityNotificationSubscription.filteringCriteria.serInstanceId" : req.params.AppId},{"SerAvailabilityNotificationSubscription._links" : 1, "SerAvailabilityNotificationSubscription.subscriptionType" : 1})
	]).then(results=>{

	const [termsubs,seravas] = results;
	var subscription = [];

	for (var i = 0; i < results[0].length; i++) {
		// var href = 'http://' + hostname + pathname  + results[0][i].AppTerminationNotificationSubscription.subscriptionType + '/' + results[0][i]._id
   		 subscription.push({
        	 href: results[0][i].AppTerminationNotificationSubscription._links.self.href,
       		 rel:  results[0][i].AppTerminationNotificationSubscription.subscriptionType
    	});
	}

	for (var i = 0; i < results[1].length; i++) {
		// var href = 'http://' + hostname + pathname  +  results[1][i].SerAvailabilityNotificationSubscription.subscriptionType + '/' + results[1][i]._id
                 subscription.push({
                 href: results[1][i].SerAvailabilityNotificationSubscription._links.self.href,
                 rel:  results[1][i].SerAvailabilityNotificationSubscription.subscriptionType
        });
	}

	var URI = 'http://' + hostname + pathname;	


	res.json({
		_links : {
				self: {
					href : URI
					},
				subscription
				}
	})



	}).catch(err=>{
    console.error("Something went wrong",err);
})
       
};
// Find a single Subscription with a AppId
exports.findOne = (req, res) => {
	console.log("findone");
	console.log( req.params.AppId + ' ' + req.params.subType + ' ' + req.params.subId);

	if(req.params.subType == "AppTerminationNotificationSubscription"){
		  TermSub.findById(req.params.subId)
    			.then(termsub => {
				console.log("App in");
        			if(!termsub) {
            				return res.status(404).send({
                			message: "Subscription not found with id " + req.params.AppId});
        				}
      					 // res.send(Subscription._links.subscription);
        				res.send(termsub);
    				}).catch(err => {
        						if(err.kind === 'ObjectId') {
            						return res.status(404).send({
                					message: "Subscription not found with id " + req.params.AppId
            									});
        					}
        			return res.status(500).send({
            			message: "Error retrieving Subscription with id " + req.params.AppId
        							});
    						});

	}else if(req.params.subType == "SerAvailabilityNotificationSubscription"){
		 SerAva.findById(req.params.subId)
                        .then(serava => {
				 console.log("ser in");
                                if(!serava) {
                                        return res.status(404).send({
                                        message: "Subscription not found with id " + req.params.AppId});
                                        }
                                         // res.send(Subscription._links.subscription);
                                        res.json(serava);
                                }).catch(err => {
                                                        if(err.kind === 'ObjectId') {
                                                        return res.status(404).send({
                                                        message: "Cannot foind given subscription " + req.params.AppId
                                                                                });
                                                }
                                return res.status(500).send({
                                message: "Error retrieving Subscription with id " + req.params.AppId
                                                                });
                                                });

	}
};

// Delete a Subscription with the specified AppId in the request
exports.delete = (req, res) => {
    console.log('deleteone');

	

 	if(req.params.subType == "AppTerminationNotificationSubscription")
	{
	TermSub.findByIdAndRemove(req.params.subId)
    .then(termsub => {
        if(!termsub) {
            return res.status(404).send({
                message: "Subscription not found with id " + req.params.AppId
            });
        }
        res.send({message: "Subscription deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Subscription not found with id " + req.params.AppId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Subscription with id " + req.params.AppId
        });
    });
	}else if(req.params.subType == "SerAvailabilityNotificationSubscription"){

	 SerAva.findByIdAndRemove(req.params.subId)
                        .then(serava => {
        if(!serava) {
            return res.status(404).send({
                message: "Subscription not found with id " + req.params.AppId
            });
        }
        res.send({message: "Subscription deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Subscription not found with id " + req.params.AppId
            });
        }
        return res.status(500).send({
            message: "Could not delete Subscription with id " + req.params.AppId
        });
    });

	}
};

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
////reqdelay and local priorities has a fixed values

res.json({
timeStamp : {
        seconds : seconds,
        nanosecond : timeInNs,
},
ntpServers : [
        {
        ntpServerAddrType : serverAddrType,
        ntpServerAddr : req.hostname,
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
execute("ntpq -p | awk '{print $6}'", function(poll){
        execute("cat /etc/ntp.keys", function(keys){
                execute("cat /etc/linuxptp/ptp4l.conf | grep priority1", function(priority){
                        callback(poll, keys, priority );
                });
        });
    });
};

usingItNow(myCallback);

};


