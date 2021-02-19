var accountSid = 'ACd4bf517cd82634578cde4174a0edcd30'; // Your Account SID from www.twilio.com/console
var authToken = 'b5d7661ee67f403efc53710bb9e459a4'; // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

class SMSSender {

    async twilioSMSSender(body) {

        // {
        //     body: 'Hello from jabe, eres un mamaguebo',
        //     to: '+5029655628', // Text this number
        //     from: '+15022153924' // From a valid Twilio number
        // }
        return await client.messages.create(body)
            .then(message => {
                // console.log(message);
                // console.log(message.sid);
                return message;
            });

        /*
            {
                "sid": "SM3bda65c84d584d1b8565928620f82af2",
                "date_created": "Sat, 13 Feb 2021 07:24:30 +0000",
                "date_updated": "Sat, 13 Feb 2021 07:24:30 +0000",
                "date_sent": null,
                "account_sid": "ACd4bf517cd82634578cde4174a0edcd30",
                "to": "+15029655628",
                "from": null,
                "messaging_service_sid": "MG082a065818e4e5d152386321dc737bd4",
                "body": "jensy",
                "status": "accepted",
                "num_segments": "0",
                "num_media": "0",
                "direction": "outbound-api",
                "api_version": "2010-04-01",
                "price": null,
                "price_unit": null,
                "error_code": null,
                "error_message": null,
                "uri": "/2010-04-01/Accounts/ACd4bf517cd82634578cde4174a0edcd30/Messages/SM3bda65c84d584d1b8565928620f82af2.json",
                "subresource_uris": {
                    "media": "/2010-04-01/Accounts/ACd4bf517cd82634578cde4174a0edcd30/Messages/SM3bda65c84d584d1b8565928620f82af2/Media.json"
                }
            }


            curl 'https://api.twilio.com/2010-04-01/Accounts/ACd4bf517cd82634578cde4174a0edcd30/Messages.json' -X POST \
            --data-urlencode 'To=5029655628' \
            --data-urlencode 'MessagingServiceSid=MG082a065818e4e5d152386321dc737bd4' \
            --data-urlencode 'Body=jensy san' \
            -u ACd4bf517cd82634578cde4174a0edcd30:[AuthToken]
        */
    }
}

module.exports = SMSSender;
// '+15022153924 - (502) 215-3924'