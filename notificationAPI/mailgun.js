var api_key = 'key-67b86d7ad8fdbd8b29156d4d246a5731';
var domain = 'sandboxa20b47392fdb41d18b3629e330882f57.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

function send(booking){
    var data = {
        from: 'BlushPH <blushphilippines@gmail.com>',
        to: booking.artistInfo.email,
        subject: 'BlushPH - New Booking From ' + booking.customerInfo.firstName + ' ' + booking.customerInfo.lastName,
        text: 'Hi ' + booking.artistInfo.firstName +',\n\nNew Booking From ' + booking.customerInfo.firstName + ' ' + booking.customerInfo.lastName + ' - Schedule: ' + schedule + ', Total Bill: ' + booking.totalBill +'\n\nPlease check your account, to accept/reject the booking. Thank You! [BLUSH-PH]'
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });    
}

module.exports = {
    send : send
}

  