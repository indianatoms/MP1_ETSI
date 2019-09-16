const fs = require('fs');
const exec = require('child_process').exec
var bodyParser = require('body-parser');
var script = fs.readFileSync('./ServiceHandler.sh','utf8')
var content = fs.readFileSync('./file.json','utf8')

//===============================================================================//
	var json = JSON.parse(content);
//	console.log(content);
	script = script.replace("ReplaceSerName",json.sevices.serName);
	script = script.replace("ReplaceHref",json.sevices.serCategory.href);
	script = script.replace("ReplaceName",json.sevices.serCategory.name);
	script = script.replace("ReplaceState",json.sevices.state);
	script = script.replace("ReplaceTransportName",json.sevices.transportInfo.name);
	script = script.replace("ReplaceDescription",json.sevices.transportInfo.description);
	script = script.replace("ReplaceTransType",json.sevices.transportInfo.type);
	script = script.replace("ReplaceProtocol",json.sevices.transportInfo.protocol);
	script = script.replace("ReplaceTranInfoEndPoint",json.sevices.transportInfo.endpoint);
	script = script.replace("ReplaceGrantType",json.sevices.transportInfo.security.oAuth2Info.grantTypes);
	script = script.replace("ReplaceToken",json.sevices.transportInfo.security.oAuth2Info.tokenEndpoint);
	script = script.replace("ReplaceImpl",json.sevices.implSpecificInfo);	

	exec(script,function(err,stdout,stderr){
		console.log(stdout + stderr + err);
	});
//console.log(script);
