#!/usr/bin/env bash


baseUrl="172.20.5.12:3000"
serviceId="5d6e78a34b5a7b0c81e625a4"


serName="ReplaceSerName"
serCathref="ReplaceHref"
serCatName="ReplaceName"
state="ReplaceState"
tranInfoName="ReplaceTransportName"
tranInfoDescription="ReplaceDescription"
tranInfoType="ReplaceTransType"
tranInfoEndPoint="ReplaceTranInfoEndPoint"
tranInfoProtocol="ReplaceProtocol"
tranInfoSecGrant="ReplaceGrantType"
tranInfoSecToken="ReplaceToken"
implSpecificInfo="ReplaceImpl"

generate_post_data()
{
  cat <<EOF
{
  "serName": "$serName",
  "serCategory": {
    "href": "$serCathref",
     "name": "$serCatName"
  },
  "state": "$state",
  "transportInfo": {
    "name": "$tranInfoName",
    "description": "$tranInfoDescription",
    "type": "$tranInfoType",
    "protocol": "$tranInfoProtocol",
    "endpoint": {},
    "security": {
      "oAuth2Info": {
        "grantTypes": [
          "$tranInfoSecGrant"
        ],
        "tokenEndpoint": "$tranInfoSecToken"
      }
    },
    "implSpecificInfo": "$implSpecificInfo"
  }
}
EOF
}




curl $baseUrl/mp1/v1/services/$serviceId -X PUT -H "Authorization: Basic YWRtaW46c3VwZXJzZWNyZXQ=" -H "Content-Type: application/json" -d "$(generate_post_data)"
