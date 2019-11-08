const mongoose = require('mongoose');

const OAuth2Info = mongoose.Schema(
{
    grantTypes: [{type: String,enum: ['OAUTH2_AUTHORIZATION_CODE', 'OAUTH2_IMPLICIT_GRANT', 'OAUTH2_RESOURCE_OWNER', 'OAUTH2_CLIENT_CREDENTIALS'],required: true}],
    tokenEndpoint: {type : String, required: true}
},
{
     versionKey: false,
     _id : false // You should be aware of the outcome after set to false
});


const Security = mongoose.Schema(
{
    oAuth2Info : {type:OAuth2Info}
},
{
     versionKey: false,
     _id : false // You should be aware of the outcome after set to false
});


const SerCategory = mongoose.Schema(
{
    href: {type : String, required: true},
    id: {type : String, required: true},
    name: {type : String, required: true},
    version: {type : String, required: true}
},
{
     versionKey: false,
     _id : false // You should be aware of the outcome after set to false
});

const TransportInfo = mongoose.Schema(
{
   id: {type : String, required: true},
   name: {type : String, required: true},
   description: String,
   type: {type : String, required : true, enum : ['REST_HTTP','MB_TOPIC_BASED','MB_ROUTING','MB_PUBSUB','RPC','RPC_STREAMING','WEBSOCKET']},
   protocol: { type : String, required: true},
   version: {type : String, required: true},
   endpoint: {type: Object, required: true},
   security: {type: Security, required: true},
   implSpecificInfo: Object

},
{
     versionKey: false,
     _id : false// You should be aware of the outcome after set to false
});



const Service = mongoose.Schema({
	
	serInstanceId : String,
	serName : { type : String, required : true},
	serCategory: {
	     type : SerCategory
    	},
	version     : {type : String, required : true},
	state       : {type : String, required : true, enum : ['ACTIVE','INACTIVE']},
	transportId : String,
	transportInfo: {type: TransportInfo, required: true },
	serializer : {type : String, required : true, enum : ['JSON','XML','PROTOBUF3'] }
},
{
    versionKey: false
});


module.exports = mongoose.model('Service', Service);
