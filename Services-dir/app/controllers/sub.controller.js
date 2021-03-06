const Service = require('../models/service.model.js');
var http = require('http');
var url = require('url') ;
const now = require('nano-time');
const publicIp = require('public-ip');
const exec = require('child_process').exec

exports.createService = (req, res) => {
    // Validate request
	console.log("POST - Create - Service")
    if(!req.body) {
        return res.status(400).send({
		type   : "URI",
                title  : "Wrong request body",
                status : 400,
                detail :  "Note content can not be empty",
                instance : "URI"
        });
    }
    
  				if(!checkEndpointService(req,res)){
				  return
				} 
   
   				console.log(req.body.transportInfo.security) 
				const service = new Service({
					serName : req.body.serName,
					serCategory 	: req.body.serCategory,
					version		: req.body.version,
					state		: req.body.state,
					transportId	: req.body.transportId,
					"transportInfo.id" : req.body.transportInfo.id,
					"transportInfo.name" : req.body.transportInfo.name,
					"transportInfo.description" : req.body.transportInfo.description,
					"transportInfo.type" : req.body.transportInfo.type,
					"transportInfo.protocol" : req.body.transportInfo.protocol,
					"transportInfo.version" : req.body.transportInfo.version,
					"transportInfo.endpoint" : req.body.transportInfo.endpoint,
					"transportInfo.security"   : req.body.transportInfo.security,
					serializer	: req.body.serializer 
					});
					service.serInstanceId = service._id;
					// Save Note in the database
    					service.save().then(data => {
								console.log(data);
        							res.send(data);
    								}).catch(err => {
        									res.status(500).send({
            								 	type   : "URI",
										title  : "Add service error",
										status : 500,
										detail :  err.message || "Some error occurred while creating the Service.",
										instance : "URI"
        												});
    										}); 
};
// Retrieve and return all notes from the database.
exports.findAllServices = (req, res) => {
 console.log("find all")
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
	    type   : "URI",
	    title  : "Add Service Error",
	    status : 500,
	    detail :  err.message || "Some error occurred while retrieving services.",
	    instance : "URI"
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
                				type   : "URI",
						title  : "Wrong ID",
						status : 404,
						detail :   "Note not found with id " + req.params.serviceId,
						instance : "URI"
        				})
				}
      					 // res.send(note._links.subscription);
        				res.send(service);
    				}).catch(err => {
        						if(err.kind === 'ObjectId') {
            						return res.status(404).send({
                						type   : "URI",
								title  : "Wrong ID",
								status : 404,
								detail :   "Note not found with id " + req.params.serviceId,
								instance : "URI"
            									});
        					}
        			return res.status(500).send({
        							type   : "URI",
								title  : "Wrong ID",
								status : 500,
								detail : "Error retrieving note with id " + req.params.serviceId,
								instance : "URI"
								});
    						});


};


exports.putService = (req, res) => {
	console.log("Update!");	

Service.findById(req.params.serviceId)
	.then(service => {
                                 console.log("ser in");
                                if(!service) {
                                        return res.status(404).send({
                                        	type   : "URI",
						title  : "Wrong ID",
						status : 404,
						detail : "Service not found with id " + req.params.AppId,
						instance : "URI"
							});
                                        }

					checkEndpointService(req,res);
				
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
                					type   : "URI",
							title  : "Wrong ID",
							status : 404,
							detail : "Service not found with id " + req.params.serviceId,
							instance : "URI"
            					});
        				}
					console.log(service);
        				res.send(service);
    					}).catch(err => {
        					if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            						return res.status(404).send({
                				    		type   : "URI",
						    		title  : "Wrong ID",
						    		status : 404,
						    		detail : "Service not found with id " + req.params.serviceId,
						    		instance : "URI"
            						});
        					}
						else{
							return res.status(500).send({
                                                                type   : err.name,
                                                                title  : err._message,
                                                                status : 500,
                                                                detail : err.message,
                                                                instance : "URI"
                                                        })

						}
    					});
					
                                }).catch(err => {
                                                        if(err.kind === 'ObjectId') {
                                                        return res.status(404).send({
                                                        	type   : "URI",
								title  : "Wrong ID",
								status : 404,
								detail : "Cannot foind given service " + req.params.AppId,
								instance : "URI"
                                                                                });
                                                }
                                return res.status(500).send({
                                		type   : "URI",
						title  : "Wrong ID",
						status : 500,
						detail :  "Error retrieving service with id " + req.params.AppId,
						instance : "URI"
                                                                });
                                         });
				
};

exports.purge = (req, res)=> {
 console.log('purge');
 Service.remove({}, function(err) {
        console.log('Service collection removed')
  });
 res.send({message: "DB purged successfully!"});
}


exports.deleteService = (req, res) => {
    console.log('deleteone');
       
    Service.findByIdAndRemove(req.params.serviceId)
    .then(service => {
        if(!service) {
            return res.status(404).send({
                type   : "URI",
		title  : "Wrong ID",
		status : 404,
		detail :  "Service not found with id " + req.params.serviceId,
		instance : "URI"
            });
        }
        res.send({message: "Service deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                type   : "URI",
		title  : "Wrong ID",
		status : 404,
		detail :  "Service not found with id " + req.params.serviceId,
		instance : "URI"
            });
        }
        return res.status(500).send({
        	type   : "URI",
		title  : "Wrong ID",
		status : 500,
		detail :  "Could not delete Service with id " + req.params.serviceId,
		instance : "URI"
	});
    });
};


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
                	type   : "URI",
			title  : "Wrong Endpoint",
			status : 400,
			detail :  "Incorrect Body request. - endpoint",
			instance : "URI"
                });
                return false;
               }else{
	         return true;
		}

}

