var CronJob = require('cron').CronJob;
var http = require('http');
var mongoose = require('mongoose');
	mongoose.connect('mongodb://117.240.93.254/baabtra_db');
// var sec = '*'; // second
// var min = '*'; // minutes
// var hh = '*'; //hours
// var dom = '*'; // day of month
// var mm = '*'; // month
// var dow = '*'; //day of week
// // var count = 0;

// var job=new CronJob(sec+' '+min+' '+hh+' '+dom+' '+mm+' '+dow, function() {
//   // count++;
//   console.log('You will see this message every second');
//   // if(count==3){
//   // 	job.stop();
//   // }
// }, null, true, 'America/Los_Angeles');


//{type:'batch-status-update',data:{batchMappingId:'<string id>',date:'<string date>'},companyId:'<string id>',crmId:'<string rmId>',status:1}


var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.
  console.log('connected');
});


var clnBatchMappingSchema = new mongoose.Schema({users:Array},{ collection : 'clnCourseBatchMapping' });
var clnBatchMapping = mongoose.model('clnBatchMapping',clnBatchMappingSchema);

var clnUserDetailsSchema = new mongoose.Schema({profile:Object,userName:String},{ collection : 'clnUserDetails' });
var clnUserDetails = mongoose.model('clnUserDetails',clnUserDetailsSchema);


var clnTriggersSchema = new mongoose.Schema({status:Number,type:String,companyId:String,data:Object},{ collection : 'clnNotificationTriggers' });
var clnTriggers = mongoose.model('clnTriggers',clnTriggersSchema);

var clnConfigsSchema = new mongoose.Schema({},{ collection : 'clnNotificationConfigs' });
var clnConfigs = mongoose.model('clnConfigs',clnConfigsSchema);



function sendBatchUpdateMail (data) {
 	
  // companyName
  // address
  // fullName
  // batchName
  // newStatus
console.log(mongoose.Types.ObjectId(data.batchMappingId));
  clnBatchMapping.findOne({_id:mongoose.Types.ObjectId(data.batchMappingId)},function (err,batchMapping) {
    console.log(batchMapping);
  });  




 }; 






clnTriggers.find({
 status:1
 ,companyId:'54978cc57525614f6e3e70d3' // hardcoded for testing
 }, function(err, triggers) {
  if (err) return console.error(err);
  for(key in triggers){

  	console.log(triggers[key].type);
  	var configuration;
  	clnConfigs.findOne({companyId:triggers[key].companyId,configType:triggers[key].type},function (er,config) {
  		configuration = config;
  	});

  	switch(triggers[key].type){
  		case 'batch-status-update' :
  			 sendBatchUpdateMail(triggers[key].data);


  		case 'new-user-registration':break;
  	}


  	//triggers[key].status = 2;
  	//triggers[key].save();

  }

});


// var clnTriggers = mongoose.model('clnTriggers',clnCoursesSchema);

// clnTriggers.find({
//  status:1
//  }, function(err, triggers) {
//   if (err) return console.error(err);
//   // console.dir(thor);
//    for(key in triggers){
//    	if(key>2){
//    		return 0;
//    	}
   		
// 	 console.log(triggers[key]);
// 	 triggers[key].status=2;
// 	  var id = triggers[key]._id;
// 	  delete triggers[key]._id;
// 	  var trigger = clnTriggers(triggers[key]);
// 	      trigger._id = id;
// 	 trigger.update(function (e) {
// 	 	console.log(e);
// 	 });
//     }
//  console.log(triggers);


//   	  var data={};
//             data['companyLogo']="http://baabtra.com/assets/images/logo/baabtralogo.png";
//             data['companyName'] = "Baabtra.com";
//             data['fullName']="Lijin AR";
//             data['bgImage']="http://baabtra.com/assets/images/courseImages/python.png";
//             data['userEmail']="lijin@baabte.com";
//             data['userPassword']="password here";
//             data['loginLink']="http://beta.baabtra.com";
//             data['recipient']="lijin@baabte.com";
//       var str = JSON.stringify(data);

// 	  var options = {
// 		  host: 'localhost',
// 		  port: 8000,
// 		  path: '/sendNewUserRegistrationMail/',
// 		  method: 'POST',
// 		  json: true,
// 		  headers:{'Content-Type':'application/json','Content-Length':str.length}
// 		};

// 		var req = http.request(options, function(res) {
// 		  console.log('STATUS: ' + res.statusCode);
// 		  console.log('HEADERS: ' + JSON.stringify(res.headers));
// 		  res.setEncoding('utf8');
// 		  res.on('data', function (chunk) {
// 		    console.log('BODY: ' + chunk);
// 		  });
// 		});


		

		// write data to request body
		
		//req.write(str);
		// req.write('kkk');
		//req.end();





//});