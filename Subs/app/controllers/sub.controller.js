const TermSub = require('../models/sub.model.js');
const SerAva = require('../models/serAva.model.js');
const Service = require('../models/service.model.js');
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
				var href = 'http://' + hostname + pathname + '/'  + termsub.AppTerminationNotificationSubscription.subscriptionType + '/' + termsub._id	
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
					var href = 'http://' + hostname + pathname + '/'  + serAva.SerAvailabilityNotificationSubscription.subscriptionType + '/' +  serAva._id
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

exports.createService = (req, res) => {
    // Validate request
	console.log("POST - Create - Service")
    if(!req.body) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

				checkEndpointService(req,res);    
   
    
				const service = new Service({
					serName : req.body.serName,
					serCategory 	: req.body.serCategory,
					version		: req.body.version,
					state		: req.body.state,
					transportId	: req.body.transportId,
					transportInfo   : req.body.transportInfo,
					serializer	: req.body.serializer 
					});
					service.serInstanceId = service._id;
					// Save Note in the database
    					service.save().then(data => {
								console.log(data);
        							res.send(data);
    								}).catch(err => {
        									res.status(500).send({
            									message: err.message || "Some error occurred while creating the Note."
        												});
    										}); 
};
// Retrieve and return all notes from the database.
exports.findAllServices = (req, res) => {
 var query = Service.find({},{"_id" : 0})
 if(req.query.ser_instance_id){
 console.log(req.query.ser_instance_id);
 query = Service.find({"_id" : { $in: req.query.ser_instance_id}},{"_id" : 0})
 }
 else if (req.query.ser_name){
 query = Service.find({"serName" : { $in:  req.query.ser_name}},{"_id" : 0})
 }
 else if (req.query.ser_category_id){
 query = Service.find({"serCategory.id" : { $in: req.query.ser_category_id}},{"_id" : 0})
 }
    query.then(services => {
        res.send(services);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};
// Find a single note with a noteId
exports.findOneService = (req, res) => {
	console.log("findone");

		  Service.findOne({"_id" : req.params.serviceId},{"_id" : 0})
    			.then(service => {
				console.log("One service");
        			if(!service) {
            				return res.status(404).send({
                			message: "Note not found with id " + req.params.serviceId});
        				}
      					 // res.send(note._links.subscription);
        				res.send(service);
    				}).catch(err => {
        						if(err.kind === 'ObjectId') {
            						return res.status(404).send({
                					message: "Note not found with id " + req.params.serviceId
            									});
        					}
        			return res.status(500).send({
            			message: "Error retrieving note with id " + req.params.serviceId
        							});
    						});


};

// Delete a note with the specified noteId in the request
exports.putService = (req, res) => {
	console.log("Update!");	

Service.findById(req.params.serviceId)
	.then(service => {
                                 console.log("ser in");
	                                if(!service) {
                                        return res.status(404).send({
                                        message: "Subscription not found with id " + req.params.AppId});
                                        }
	
					checkendpointService();
			
                                       
					Service.findOneAndUpdate({"_id" : req.params.serviceId},{ 
					serName : req.body.serName,
                                        "serCategory.href"      : req.body.serCategory.href,
					"serCategory.name"	: req.body.serCategory.name,
                                        state           	: req.body.state,                                                                           
					"transportInfo.name"		: req.body.transportInfo.name,
					"transportInfo.description"            : req.body.transportInfo.description,
					"transportInfo.type"            : req.body.transportInfo.type,
					"transportInfo.protocol"            : req.body.transportInfo.protocol,
					"transportInfo.endpoint"            : req.body.transportInfo.endpoint,
					"transportInfo.security"            : req.body.transportInfo.security,
					"transportInfo.implSpecificInfo"    : req.body.transportInfo.implSpecificInfo
 						}, {new: true, useFindAndModify: false, runValidators: true})
    					.then(service => {
        				if(!service) {
            					return res.status(404).send({
                				message: "Service not found with id " + req.params.serviceId
            					});
        				}
        				res.send(service);
    					}).catch(err => {
        					if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            					return res.status(404).send({
                				message: "Service not found with id " + req.params.serviceId
            					});
        				}
        				return res.status(500).send({
            				message: "Error updating service with " + req.params.serviceId
        						});
    						});
					
					
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
				
};

exports.deleteService = (req, res) => {
    console.log('deleteone');
       
    Service.findByIdAndRemove(req.params.serviceId)
    .then(service => {
        if(!service) {
            return res.status(404).send({
                message: "Service not found with id " + req.params.serviceId
            });
        }
        res.send({message: "Service deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Service not found with id " + req.params.serviceId
            });
        }
        return res.status(500).send({
            message: "Could not delete Service with id " + req.params.serviceId
        });
    });
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

function checkEndpointService(req,res) {
 var isEmpty = true;
 var checker = false;
 var howManyElements = 0;
    for (var itemsFromBodyIndex in req.body.transportInfo.endpoint){
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
                for (var host in req.body.transportInfo.endpoint.addresses){
                       if((Object.keys(req.body.transportInfo.endpoint.addresses[host]).findIndex(obj => obj == "host") < 0 ) ||  (Object.keys(req.body.transportInfo.endpoint.addresses[host]).findIndex(obj => obj == "port") < 0 ) ){
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



