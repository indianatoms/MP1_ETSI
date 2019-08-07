const Note = require('../models/note.model.js');
const SerAva = require('../models/serAva.model.js');
var http = require('http');
var url = require('url') ;

exports.create = (req, res) => {
    // Validate request
	console.log("POST - Create")
    if(!req.body.AppTerminationNotificationSubscription && !req.body.SerAvailabilityNotificationSubscription) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

			if(req.body.AppTerminationNotificationSubscription){

				

				if (req.params.noteId != req.body.AppTerminationNotificationSubscription.appInstanceId)
					{
						res.status(500).send({
                                                message: "AppInstance ID is different from URL appInstance ID."
						});
						return;
					}
				

    		// Create a Note
          			const note = new Note({
                			AppTerminationNotificationSubscription : req.body.AppTerminationNotificationSubscription
                			});
					
				    // Save Note in the database
    					note.save().then(data => {
        							res.send(data);
    								}).catch(err => {
        									res.status(500).send({
            									message: err.message || "Some error occurred while creating the Note."
       										 			});
									    	});
			}

			if(req.body.SerAvailabilityNotificationSubscription){
                                if (req.params.noteId != req.body.SerAvailabilityNotificationSubscription.filteringCriteria.serInstanceId)
                                        {
                                                res.status(500).send({
                                                message: "AppInstance ID is different from URL appInstance ID."
                                                });
                                                return;
                                        }


				const serAva = new SerAva({
					SerAvailabilityNotificationSubscription : req.body.SerAvailabilityNotificationSubscription
					});
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

Promise.all([
	 Note.find({"AppTerminationNotificationSubscription.appInstanceId" : req.params.noteId },{"AppTerminationNotificationSubscription._links" : 1, "AppTerminationNotificationSubscription.subscriptionType" : 1, "_id" : 0}),
	 SerAva.find({"SerAvailabilityNotificationSubscription.filteringCriteria.serInstanceId" : req.params.noteId},{"SerAvailabilityNotificationSubscription._links" : 1, "SerAvailabilityNotificationSubscription.subscriptionType" : 1, "_id" : 0})
	]).then(results=>{

	const [notes,seravas] = results;
	var subscription = [];

	for (var i = 0; i < results[0].length; i++) {
   		 subscription.push({
        	 href: results[0][i].AppTerminationNotificationSubscription._links.self.href,
       		 rel:  results[0][i].AppTerminationNotificationSubscription.subscriptionType
    	});
	}

	for (var i = 0; i < results[1].length; i++) {
                 subscription.push({
                 href: results[1][i].SerAvailabilityNotificationSubscription._links.self.href,
                 rel:  results[1][i].SerAvailabilityNotificationSubscription.subscriptionType
        });
	}

	var hostname = req.headers.host; // hostname = 'localhost:8080'
  	var pathname = url.parse(req.url).pathname; // pathname = '/MyApp'
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
// Find a single note with a noteId
exports.findOne = (req, res) => {
	console.log("findone");
	console.log( req.params.noteId + ' ' + req.params.subType + ' ' + req.params.subId);

	if(req.params.subType == "AppTerminationNotificationSubscription"){
		  Note.findOne({"AppTerminationNotificationSubscription.appInstanceId": req.params.noteId, "AppTerminationNotificationSubscription.subscriptionType": req.params.subType,"AppTerminationNotificationSubscription._links.self.href": req.params.subId })
    			.then(note => {
				console.log("App in");
        			if(!note) {
            				return res.status(404).send({
                			message: "Note not found with id " + req.params.noteId});
        				}
      					 // res.send(note._links.subscription);
        				res.json({
                				SupID  : note.AppTerminationNotificationSubscription._links.self.href,
                				SupType: note.AppTerminationNotificationSubscription.subscriptionType
                        		})
    				}).catch(err => {
        						if(err.kind === 'ObjectId') {
            						return res.status(404).send({
                					message: "Note not found with id " + req.params.noteId
            									});
        					}
        			return res.status(500).send({
            			message: "Error retrieving note with id " + req.params.noteId
        							});
    						});

	}else if(req.params.subType == "SerAvailabilityNotificationSubscription"){
		 SerAva.findOne({"SerAvailabilityNotificationSubscription.filteringCriteria.serInstanceId": req.params.noteId, "SerAvailabilityNotificationSubscription.subscriptionType": req.params.subType, "SerAvailabilityNotificationSubscription._links.self.href": req.params.subId})
                        .then(serava => {
				 console.log("ser in");
                                if(!serava) {
                                        return res.status(404).send({
                                        message: "Note not found with id " + req.params.noteId});
                                        }
                                         // res.send(note._links.subscription);
                                        res.json({
                                                SupID  : serava.SerAvailabilityNotificationSubscription._links.self.href,
                                                SupType: serava.SerAvailabilityNotificationSubscription.subscriptionType
                                        })
                                }).catch(err => {
                                                        if(err.kind === 'ObjectId') {
                                                        return res.status(404).send({
                                                        message: "Cannot foind given subscription " + req.params.noteId
                                                                                });
                                                }
                                return res.status(500).send({
                                message: "Error retrieving note with id " + req.params.noteId
                                                                });
                                                });

	}
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    console.log('deleteone');

	

 	if(req.params.subType == "AppTerminationNotificationSubscription")
	{
	Note.findOneAndRemove({"AppTerminationNotificationSubscription.appInstanceId": req.params.noteId, "AppTerminationNotificationSubscription.subscriptionType": req.params.subType,"AppTerminationNotificationSubscription._links.self.href": req.params.subId })
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.noteId
        });
    });
	}else if(req.params.subType == "SerAvailabilityNotificationSubscription"){

	 SerAva.findOneAndRemove({"SerAvailabilityNotificationSubscription.filteringCriteria.serInstanceId": req.params.noteId, "SerAvailabilityNotificationSubscription.subscriptionType": req.params.subType, "SerAvailabilityNotificationSubscription._links.self.href": req.params.subId})
                        .then(serava => {
        if(!serava) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.noteId
        });
    });

			



	}
};
