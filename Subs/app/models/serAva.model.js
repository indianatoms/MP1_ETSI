const mongoose = require('mongoose');


const SerAvai = mongoose.Schema({
			appInstanceId     : String,
                        SerAvailabilityNotificationSubscription :
        {
                        subscriptionType  : String,
                        callbackReference : String,
			_links : {
                                  self : {href :{type : String, unique : true}}},
			filteringCriteria : {
	                           		serInstanceId           : String,
                                                serName                 : String,
                                                serCategory             : {
                                                                           href            :       String,
                                                                           id              :       String,
                                                                           name            :       String,
                                                                           version         :       String
                                                                                                         },
			version                 : String,
                        state                   : { type : String, enum : ['ACTIVE','INACTIVE']},
			transportInfo           : {
                                                                                                                                id                :     String,
																name              :     String,
																description       :     String,
																type    	  :     {type : String},
																protocol	  : 	String,
																version           :     String,
                                                                                                                                endpoint          :     {type : Object},
																security          :     {
                                                                                                  oAuth2Info : {                                                                                                                                                                        				grantTypes    : [{type : String, enum : ['OAUTH2_AUTHORIZATION_CODE', 'OAUTH2_IMPLICIT_GRANT', 'OAUTH2_RESOURCE_OWNER', 'OAUTH2_CLIENT_CREDENTIALS' ]}],																							tokenEndpoint : String}},
																implSpecificInfo : String										
						},
			serializer		: { type : String, enum : ['JSON','XML','PROTOBUF3 ']}
					}
        }
},
{
    versionKey: false // You should be aware of the outcome after set to false
   // _id : false
});

module.exports = mongoose.model('SerAva',SerAvai);

