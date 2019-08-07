const mongoose = require('mongoose');


const SerAvai = mongoose.Schema({
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
                        state                   : String,
			transportInfo           : {
                                                                                                                                id                :     String,
																name              :     String,
																description       :     String,
																protocol          :     String,
																version           :     String,
                                                                                                                                endpoint          :     String,
																security          :     {
                                                                                                  oAuth2Info : {                                                                                                                                                                        				grantTypes    : [String],																							tokenEndpoint : String}},
																implSpecificInfo : String										
						},
			serializer		: String
					}
        }
},
{
    versionKey: false // You should be aware of the outcome after set to false
   // _id : false
});

module.exports = mongoose.model('SerAva',SerAvai);

