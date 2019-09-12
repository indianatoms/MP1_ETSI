const mongoose = require('mongoose');

const AppTerm = mongoose.Schema({

			AppTerminationNotificationSubscription :
	{
			subscriptionType  : String,
			callbackReference : String,
			_links : {
					self : {
							href : {type : String, unique : true}}
														},
			appInstanceId     : String
	}
},
{
    versionKey: false // You should be aware of the outcome after set to false
   // _id : false
});
module.exports = mongoose.model('TermSub', AppTerm);
