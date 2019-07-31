const Note = require('../models/note.model.js');

// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request
	console.log("POST")
    if(!req.body._links) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
    
   if(req.params.noteId != req.body._links.self.href)
	{
		return res.status(400).send({
        	message: "ID is different from a body!"
		});
	}
 console.log(req.body._links.self.href);
 console.log(req.body._links.subscription[0].href);
 console.log(req.body._links.subscription[0].rel);

    Note.findOne({ "_links.self.href": req.body._links.self.href, "_links.subscription.href" : req.body._links.subscription[0].href, "_links.subscription.rel":  req.body._links.subscription[0].rel}) 
    .then(note => {
        console.log(note);
        if(note) {
            return res.status(404).send({
                message: "Note found with id "
            });
        }
	else{
    		// Create a Note
          const note = new Note({
                _links: req.body._links
                });

    // Save Note in the database
    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });   
};
});
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
	console.log("findall");
	Note.find({"_links.self.href": req.params.noteId}, {'_id': false, '_links.subscription._id' : false})
    .then(notes => {
	console.log(notes);
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};
// Find a single note with a noteId
exports.findOne = (req, res) => {
	console.log("findone");
	console.log( req.params.noteId + ' ' + req.params.subType + ' ' + req.params.subId);
    Note.findOne({"_links.self.href": req.params.noteId, "_links.subscription.rel": req.params.subType, "_links.subscription.href": req.params.subId}, {'_links.subscription._id': false})
    .then(note => {
	console.log(note._links);
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });            
        }
        res.send(note._links.subscription);
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
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    console.log('deleteone');
	Note.findOneAndRemove({"_links.self.href": req.params.noteId, "_links.subscription.rel": req.params.subType, "_links.subscription.href": req.params.subId})
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
};
