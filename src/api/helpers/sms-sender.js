var accountSid = ''; // Your Account SID from www.twilio.com/console
var authToken = ''; // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

class SMSSender {

    async twilioSMSSender(body) {
        return await client.messages.create(body)
            .then(message => {
                // console.log(message);
                // console.log(message.sid);
                return message;
            });

       
    }
}

module.exports = SMSSender;
