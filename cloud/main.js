Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('request-reset', function(req, res) {
  Parse.initialize("myAppId", "myAppId", "myMasterKey");
  Parse.serverURL = 'https://muse-rest-api.herokuapp.com/parse';
  Parse.Cloud.useMasterKey();

  var mailgun = require('../notificationAPI/mailgun.js');
  var User = Parse.Object.extend("User");
  var user = new Parse.Query(User);

  user.equalTo("username", req.params.email);
  user.find({
    success: function(results) {
      console.log(results[0].id);
      res.success({result: 'success'});
      mailgun.resetPasswordRequest({
        userId : results[0].id,
        email: req.params.email
      });
    },
    error: function(error) {
      console.log(error);
    }
  });

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
