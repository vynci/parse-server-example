Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.afterSave("Booking", function(request) {
    console.log(request.object.attributes);
    var booking = request.object.attributes;
    var nexmo = require('../notificationAPI/nexmo.js');
    var mailgun = require('../notificationAPI/mailgun.js');
    var pubnub = require('../notificationAPI/pubnub.js');
    
    if(booking.artistInfo.contactNumber){
        nexmo.send(booking);          
    }

    if(booking.artistInfo.email){
        mailgun.send(booking);                    
    }
    
    if(booking.artistInfo.id){
        var channel = 'book/' + booking.artistInfo.id;
        var payload = {
            content: request.object,
            sender: {
                name: booking.customerInfo.firstName + ' ' + booking.customerInfo.lastName,
                avatar : booking.customerInfo.avatar
            },
            date: new Date()
        }        
        pubnub.publish(channel, payload);    
    }
});

Parse.Cloud.afterSave("Message", function(request) {
    console.log(request.object.attributes);
    var message = request.object.attributes;
    var pubnub = require('../notificationAPI/pubnub.js');

    if(booking.artistInfo.id){
        var channel = 'message/' + message.artistId;
        var payload = {
            content: request.object,
            sender: {
                name: booking.customerInfo.firstName + ' ' + booking.customerInfo.lastName,
                avatar : booking.customerInfo.avatar
            },
            date: new Date()
        }        
        pubnub.publish(channel, payload);    
    }
});
