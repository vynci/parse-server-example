Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.afterSave("Booking", function(request) {
    console.log(request.object.attributes);
    var booking = request.object.attributes;
    
    if(booking.artistInfo.contactNumber){
        var nexmo = require('../notificationAPI/nexmo.js');
        nexmo.send(booking);          
    }

    if(booking.artistInfo.email){
        var mailgun = require('../notificationAPI/mailgun.js');
        mailgun.send(booking);                    
    }          
});
