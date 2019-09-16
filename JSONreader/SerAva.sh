#!/usr/bin/env bash


#These parameters are to be defined by the user
baseUrl="172.20.5.12:3000"
appInstanceId="MEC1"
subscriptionType="ReplaceSubType"
callbackReference="ReplaceCallBack"
href="" #DEFINE AUTOMATICALY BY POST
serInstanceId="" #DEFINED BY BACKEND
serName="RepalceSerName" #Treated here as the app Instance ID - May be wrong
serCatHref="ReplaceSerCatHref"
serCatId="" #Defined by BACKEND
serCatName="ReplaceSerCatName"
serCatversion="ReplaceSerCatVer"
version="ReplaceSerVer"
state="ReplaceSerState"
tranInfoId=""  #By BackEnd
tranInfoName="ReplaceTranInfoName"
tranInfoDescription="ReplaceTranInfoDesc"
tranInfoType="ReplaceTranInfoType"
tranInfoProtocol="ReplaceTranInfoProt"
tranInfoVersion="ReplaceTranInfoVer"
tranInfoEndPoint="ReplaceTranInfoEndPoint"
tranInfoSecGrant="ReplaceTranInfoSecGrant"
tranInfoSecToken="ReplaceTranInfoSecToken"
implSpecificInfo="ReplaceImp1Spec"
serializer="JSON" #By BackEnd 

echo "$tranInfoEndPoint"

#GENERATE_POST_DATA
generate_post_data()
{
  cat <<EOF
 {
    "SerAvailabilityNotificationSubscription" :
	{
			"subscriptionType"  : "$subscriptionType",
			"callbackReference"	: "$callbackReference",
			"_links" : {
					"self" : {
							"href": "$href"}
														},
			"filteringCriteria" : {
									"serInstanceId"		: "$serInstanceId",
									"serName"		: "$serName",
									"serCategory"		: {
													"href" 		:	"$serCatHref",
													"id"		:	"$serCatId",
													"name"		:	"$serCatName",
													"version"	:	"$serCatversion"
															},
									"version"			: "$version",
									"state"				: "$state",
									"transportInfo"		: {
													"id"		:	"$tranInfoId",
													"name"		:	"$tranInfoName",
													"description"   :	"$tranInfoDescription",
													"type"		:	"$tranInfoType",
													"protocol"      :	"$tranInfoProtocol",
													"version"	:	"$tranInfoVersion",
													"endpoint"	:	$tranInfoEndPoint,
													"security"	:	{
																"oAuth2Info" : {
														"grantTypes" : 	["$tranInfoSecGrant"],
														"tokenEndpoint" : "$tranInfoSecToken"											}
																						},
																							"imp1SpecificInfo" : "$implSpecificInfo"
															},
										"serializer" : "$serializer"
														
									}
			
	}
 }
EOF
}



#NEEDS TO BE DEFINE BY A USER

#echo "$(generate_post_data)"

curl $baseUrl/mp1/v1/applications/$appInstanceId/subscriptions -X POST -H "Authorization: Basic YWRtaW46c3VwZXJzZWNyZXQ=" -H "Content-Type: application/json" -d "$(generate_post_data)"

