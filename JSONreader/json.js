const fs = require('fs');
const exec = require('child_process').exec
var bodyParser = require('body-parser');
var script = fs.readFileSync('./DNSHandler.sh','utf8')
var content = fs.readFileSync('./file.json','utf8')


        var json = JSON.parse(content);

        script = script.replace("replaceDNSRule",json.appDNSRule[0].dnsRuleId);
        script = script.replace("replaceDomainName",json.appDNSRule[0].domainName);
        script = script.replace("replaceIpType",json.appDNSRule[0].ipAddressType);
        script = script.replace("replaceIpAddress",json.appDNSRule[0].ipAddress);
        script = script.replace("replaceTTL",json.appDNSRule[0].ttl);
        script = script.replace("replaceState",json.appDNSRule[0].state);

        exec(script,function(err,stdout,stderr){
                console.log(stdout + stderr + err);
        });
