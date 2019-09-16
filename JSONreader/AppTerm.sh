#!/usr/bin/env bash


#These parameters are to be defined by the user
baseUrl="172.20.5.12:3000"
subscriptionType="ReplaceSubType"
callbackReference="ReplaceCallback"
href="" #Y DB
appInstanceId="MEC1"

#GENERATE_POST_DATA
generate_post_data()
{
  cat <<EOF
 {
    "AppTerminationNotificationSubscription" :
	 {
	  "subscriptionType" : "$subscriptionType",
	  "callbackReference" : "$callbackReference",
	  "_links": {
	    "self": { "href": "$href"}
	      },
	  "appInstanceId" : "$appInstanceId"
	  
	}
 }
EOF
}



#NEEDS TO BE DEFINE BY A USER

curl $baseUrl/mp1/v1/applications/$appInstanceId/subscriptions -X POST -H "Authorization: Basic YWRtaW46c3VwZXJzZWNyZXQ=" -H "Content-Type: application/json" -d "$(generate_post_data)"
