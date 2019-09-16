#!/usr/bin/env bash
#
# Provides      : Automatical configuration od Network interfaces of Openstack machine

#
#NEEDS TO BE DEFINE BY A USER!!!



yum install curl

#These parameters are to be defined by the user
baseUrl="172.20.5.15:8080"
AppId="1"
dnsRuleId="replaceDNSRule"
domainName="replaceDomainName"
ipAddressType="replaceIpType"
ipAddress="replaceIpAddress"
ttl="replaceTTL"
state="replaceState"

#GENERATE_POST_DATA
generate_post_data()
{
  cat <<EOF
 {
    "dnsRuleId": "$dnsRuleId",
    "domainName": "$domainName",
    "ipAddressType": "$ipAddressType",
    "ipAddress": "$ipAddress",
    "ttl": "$ttl",
    "state": "$state"
 }
EOF
}



#NEEDS TO BE DEFINE BY A USER

curl $baseUrl/applications/$AppId/dns_rules/$dnsRuleId -X PUT -H "Authorization: Basic YWRtaW46aGVzbG8=" -H "Content-Type: application/json" -d "$(generate_post_data)"

