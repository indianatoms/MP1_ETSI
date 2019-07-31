const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const NoteSchema = mongoose.Schema({

			_links : {
			self :   { href : String},
	
			subscription : [
					{href : String,
					rel  : String}
				       ]
	}
},
{
    versionKey: false // You should be aware of the outcome after set to false
   // _id : false
});
NoteSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Note', NoteSchema);
