var Nexmo = require('nexmo');

var nexmo = new Nexmo({
  apiKey: '2c909569', 
  apiSecret: '80c3b6a1fed15b33'
}
);

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.afterSave("Booking", function(request) {
    console.log(request.object.attributes);
    var booking = request.object.attributes;
    if(booking.artistInfo.contactNumber){
        var schedule = booking.schedule.toString();     
        nexmo.message.sendSms('639272326087', booking.artistInfo.contactNumber, 'Hi ' + booking.artistInfo.firstName +',\n\nNew Booking From ' + booking.customerInfo.firstName + ' ' + booking.customerInfo.lastName + ' - Schedule: ' + schedule + ', Total Bill: ' + booking.totalBill +'\n\nPlease check your account, to accept/reject the booking. Thank You! [BLUSH-PH]', function(){
            console.log('sent')
        });              
    }  
});
