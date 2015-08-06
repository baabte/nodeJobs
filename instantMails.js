var config = require('./config'); // importing config file
var CronJob = require('cron').CronJob;
var http = require('http');
var mongoose = require('mongoose');
	mongoose.connect(config.dbString); // connecting to mongo db
var httpConfig = config.httpConfig;


var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.
  console.log('connected');
});

// schemas and modals for fetching data from collections
var clnBatchMappingSchema = new mongoose.Schema({users:Array,status:String,batchName:String,startDate:Date,startTime:String,endTime:String},{ collection : 'clnCourseBatchMapping' });
var clnBatchMapping = mongoose.model('clnBatchMapping',clnBatchMappingSchema);

var clnUserDetailsSchema = new mongoose.Schema({profile:Object,userName:String},{ collection : 'clnUserDetails' });
var clnUserDetails = mongoose.model('clnUserDetails',clnUserDetailsSchema);

var clnCompanySchema = new mongoose.Schema({companyName:String,appSettings:Object},{ collection : 'clnCompany' });
var clnCompany = mongoose.model('clnCompany',clnCompanySchema);

var clnTriggersSchema = new mongoose.Schema({status:Number,type:String,companyId:String,data:Object},{ collection : 'clnNotificationTriggers' });
var clnTriggers = mongoose.model('clnTriggers',clnTriggersSchema);

var clnCoursesSchema = new mongoose.Schema({},{ collection : 'clnCourses' });
var clnCourses = mongoose.model('clnCourses',clnCoursesSchema);

var clnConfigsSchema = new mongoose.Schema({},{ collection : 'clnNotificationConfigs' });
var clnConfigs = mongoose.model('clnConfigs',clnConfigsSchema);



function sendBatchUpdateMail (data,companyId) {
 	
  // companyName
  // address
  // fullName
  // batchName
  // newStatus
  // companyLogo
  var dataObj = {};
  clnCompany.findOne({_id:mongoose.Types.ObjectId(companyId)},function (err,company){
    // console.log(company.companyName);
    dataObj.companyName = company.companyName;
    if(company.appSettings){
      if(company.appSettings.logo){
        dataObj.companyLogo = company.appSettings.logo;
      }
    }
  });
// console.log(mongoose.Types.ObjectId(data.batchMappingId));
  clnBatchMapping.findOne({_id:mongoose.Types.ObjectId(data.batchMappingId)},function (err,batchMapping) {
    var req=[];
    var users = JSON.parse(JSON.stringify(batchMapping.users));
        dataObj.newStatus = batchMapping.status;
        dataObj.batchName = batchMapping.batchName;
        dataObj.startDate = batchMapping.startDate;
        dataObj.startTime = batchMapping.startTime;
        dataObj.endTime = batchMapping.endTime;
        var options = JSON.parse(JSON.stringify(httpConfig));
        options.path = '/sendBatchStatusUpdateMail/';
    for(var key in users)
    {
      var userLoginId = users[key].fkUserLoginId;
      // dataObj.fullName
      // dataObj.recipient
      clnUserDetails.findOne({fkUserLoginId:mongoose.Types.ObjectId(userLoginId)},function(error,userDetail){
        dataObj.fullName = userDetail.profile.firstName+' '+userDetail.profile.lastName;
        dataObj.recipient = userDetail.userName;
        
        // options.body = dataString;
        // console.log(httpConfig);

           var dataString = JSON.stringify(dataObj);
          options.headers['Content-Length']=dataString.length;
           req[key] = http.request(options, function(res) {
            //console.log(key);
             //console.log('STATUS: ' + res.statusCode);
             //console.log('HEADERS: ' + JSON.stringify(res.headers));
             res.setEncoding('utf8');
             res.on('data', function (chunk) {
               //console.log('BODY: ' + chunk);
             });
           });

            req[key].write(dataString);
            // req[key].end();


      });

    }
  });  




 }; 





var saveCompleted = true;
var count=0;
var length = 0;
function findTriggers () {
      //console.log('find');
            if(count==length){
            saveCompleted = true;
      }
  if(saveCompleted){

  clnTriggers.find({
     status:1
     //,companyId:'54978cc57525614f6e3e70d3' // hardcoded for testing
     }, function(err, triggers) {
      if (err) return console.error(err);
      saveCompleted = false;
      count=0;
      length = triggers.length;
      for(key in triggers){

        // console.log(triggers[key].type);
        var configuration;
        clnConfigs.findOne({companyId:triggers[key].companyId,configType:triggers[key].type},function (er,config) {
          configuration = config;
        });

        switch(triggers[key].type){
          case 'batch-status-update' :
             //calling function for sending notification mail
             sendBatchUpdateMail(triggers[key].data,triggers[key].companyId);
             break;


          case 'new-user-registration':break;
        }


        triggers[key].status = 2;
        triggers[key].save(function (argument) {
          count++;
          //console.log('send');
        });
        //console.log(Object.keys(triggers[key]));

      }



      findTriggers();

    });  
  }
  else{
      setTimeout(findTriggers,100);    
  }
  

};

try{
  findTriggers();  
}
catch(ex){
  console.log(ex);
}
