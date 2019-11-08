const mongoose = require('mongoose');

const AppTerm = mongoose.Schema({

			AppTerminationNotificationSubscription :
	{
			subscriptionType  : { type : String, required: true},
			callbackReference : { type : String, required: true},
			_links : {
					self : {
							href : {type : String, unique : true}}
														},
			appInstanceId     : { type : String , required: true }
	}
},
{
    versionKey: false // You should be aware of the outcome after set to false
   // _id : false
});
module.exports = mongoose.model('TermSub', AppTerm);
