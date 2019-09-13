const mongoose = require('mongoose');

const Service = mongoose.Schema({
	
	serInstanceId : String,
	serName : String,
	serCategory : 
	{
		href  	: String,
		id    	: String,
		name  	: String,
		version : String
	},
	version     : String,
	state       : {type : String, enum : ['ACTIVE','INACTIVE']},
	transportId : String,
	transportInfo :
	{
		id   	    : String,
		name 	    : String,
		description : String,
		type	    : {type : String,  enum : ['REST_HTTP','MB_TOPIC_BASED','MB_ROUTING','MB_PUBSUB','RPC','RPC_STREAMING','WEBSOCKET']},
		protocol    : String,
		version	    : String,
		endpoint    : Object,
		security    : 
		{
			oAuth2Info : 
				{
					tokenEndpoint : String,
					grantTypes : [String]
				}
		}
	},
	serializer : {type : String , enum : ['JSON','XML','PROTOBUF3'] }
},
{
    versionKey: false // You should be aware of the outcome after set to false
   // _id : false
});


module.exports = mongoose.model('Service', Service);
