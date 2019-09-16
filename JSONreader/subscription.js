const fs = require('fs');
const exec = require('child_process').exec
var bodyParser = require('body-parser');
var script;
var content = fs.readFileSync('./file.json','utf8')


        
	var json = JSON.parse(content);

	if(json.subscriptions[0].AppTerminationNotificationSubscription)
		{
			script = fs.readFileSync('./AppTerm.sh','utf8');
			console.log("APP TERM!");
		        script = script.replace("ReplaceSubType",json.subscriptions[0].AppTerminationNotificationSubscription.subscriptionType);
			script = script.replace("ReplaceCallback",json.subscriptions[0].AppTerminationNotificationSubscription.callbackReference);

			exec(script,function(err,stdout,stderr){
                		console.log(stdout + stderr + err);
        		});
	
		}
	else if (json.subscriptions[0].SerAvailabilityNotificationSubscription)
		{
		script = fs.readFileSync('./SerAva.sh','utf8');
		console.log("SER AVA!");
		script = script.replace("ReplaceSubType",json.subscriptions[0].SerAvailabilityNotificationSubscription.subscriptionType);
		script = script.replace("ReplaceCallBack",json.subscriptions[0].SerAvailabilityNotificationSubscription.callbackReference);
                script = script.replace("RepalceSerName",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.serName);
		script = script.replace("ReplaceSerCatName",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.serCategory.name);
		script = script.replace("ReplaceSerCatHref",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.serCategory.href);
		script = script.replace("ReplaceSerCatVer",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.serCategory.version);
		script = script.replace("ReplaceSerVer",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.version);
		script = script.replace("ReplaceSerState",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.state);
		script = script.replace("ReplaceTranInfoName",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.name);
		script = script.replace("ReplaceTranInfoDesc",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.description);
		script = script.replace("ReplaceTranInfoType",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.type);
		script = script.replace("ReplaceTranInfoProt",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.protocol);
		script = script.replace("ReplaceTranInfoVer",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.version);
		script = script.replace("ReplaceTranInfoEndPoint",JSON.stringify(json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.endpoint).split("\"").join("\\\""));
		script = script.replace("ReplaceTranInfoSecGrant",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.security.oAuth2Info.grantTypes);
		script = script.replace("ReplaceTranInfoSecToken",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.security.oAuth2Info.tokenEndpoint);
		script = script.replace("ReplaceImp1Spec",json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.imp1SpecificInfo);
		
	//	console.log(JSON.stringify(json.subscriptions[0].SerAvailabilityNotificationSubscription.filteringCriteria.transportInfo.endpoint));
		
			 exec(script,function(err,stdout,stderr){
                                console.log(stdout + stderr + err);
                        })		
}
     

