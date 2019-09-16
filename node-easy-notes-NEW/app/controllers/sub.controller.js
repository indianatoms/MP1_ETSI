const TermSub = require('../models/sub.model.js');
const SerAva = require('../models/serAva.model.js');
var http = require('http');
var url = require('url') ;
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

		//	console.log(req.params.AppId + ' ' + req.body.AppTerminationNotificationSubscription.subscriptionType);
					
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
				var href = 'http://' + hostname + pathname + '/'  + termsub.AppTerminationNotificationSubscription.subscriptionType + termsub._id	
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

					if (req.body.SerAvailabilityNotificationSubscription.subscriptionType != "SerAvailabilityNotificationSubscription")
                                        {
                                            res.status(400).send({
                                                message: "Incorrect Body request. - sub type"
                                              });
                                            return;
                                        }
					
					checkEndpoint(req,res);					

				const serAva = new SerAva({
					appInstanceId	: req.params.AppId,
					SerAvailabilityNotificationSubscription : req.body.SerAvailabilityNotificationSubscription
					});
					var href = 'http://' + hostname + pathname + '/'  + serAva.SerAvailabilityNotificationSubscription.subscriptionType +  serAva._id
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
	 SerAva.find({"appInstanceId" : req.params.AppId},{"SerAvailabilityNotificationSubscription._links" : 1, "SerAvailabilityNotificationSubscription.subscriptionType" : 1})
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
                message: "Subscription not found with id " + req.params.subId
            });
        }
        res.send({message: "Subscription deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Subscription not found with id " + req.params.subId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Subscription with id " + req.params.subId
        });
    });
	}else if(req.params.subType == "SerAvailabilityNotificationSubscription"){

	 SerAva.findByIdAndRemove(req.params.subId)
                        .then(serava => {
        if(!serava) {
            return res.status(404).send({
                message: "Subscription not found with id " + req.params.subId
            });
        }
        res.send({message: "Subscription deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Subscription not found with id " + req.params.subId
            });
        }
        return res.status(500).send({
            message: "Could not delete Subscription with id " + req.params.subId
        });
    });

	}
};


function checkEndpoint(req,res) {

var isEmpty = true;
var checker = false;
var howManyElements = 0;
    for (var itemsFromBodyIndex in req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.endpoint){
            console.log(itemsFromBodyIndex);
            isEmpty = false;
	if(itemsFromBodyIndex == "uris")
                {
                     howManyElements++;
                     checker = true;
                }
            if(itemsFromBodyIndex == "addresses")
                {
                    howManyElements++;
                    checker = true;
                for (var host in req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.endpoint.addresses){
                       if((Object.keys(req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.endpoint.addresses[host]).findIndex(obj => obj == "host") < 0 ) ||  (Object.keys(req.body.SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.endpoint.addresses[host]).findIndex(obj => obj == "port") < 0 ) ){
                            console.log("false")
                            checker = false;
						}
					}
				}
            if(itemsFromBodyIndex == "alternative")
                {
                    howManyElements++;
                    checker = true;
                }
                if(howManyElements > 1)
                    {
                        checker = false;
                    }
                }
									
			if(!(isEmpty || checker))
               {
                res.status(400).send({
                message: "Incorrect Body request. - endpoint"
                });
                return;
               }
}




