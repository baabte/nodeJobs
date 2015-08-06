module.exports = {
  httpConfig:{
     host: 'localhost',
     port: 8000,
     // path: '/sendNewUserRegistrationMail/',
     method: 'POST',
     json: true,
     headers:{'Content-Type':'application/json','Content-Length':1000000000}
   },
   dbString:'mongodb://117.240.93.254/baabtra_db'
   // dbString:'mongodb://207.46.231.115/baabtra_db'
};

var zemba = function () {
}