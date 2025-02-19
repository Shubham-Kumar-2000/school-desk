// var AWS = require('aws-sdk');
// // Set region
// AWS.config.update({region: 'REGION'});

// // Create publish parameters
// var params = {
//   Message: 'TEXT_MESSAGE', /* required */
//   PhoneNumber: 'E.164_PHONE_NUMBER',
// };

// // Create promise and SNS service object
// var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

// // Handle promise's fulfilled/rejected states
// publishTextPromise.then(
//   function(data) {
//     console.log("MessageID is " + data.MessageId);
//   }).catch(
//     function(err) {
//     console.error(err, err.stack);
//   });

const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns'); // CommonJS import
const client = new SNSClient({ region: 'ap-south-1' });

exports.sendOtp = (phone, otp) => {
    return this.sendMsg(
        phone,
        `Use the OTP code ${otp} to log in to your SchoolDesk's account.
Please do not share this code with anyone.`
    );
};

exports.sendMsg = async (phone, msg) => {
    const input = {
        PhoneNumber: phone,
        Message: msg
    };
    if (!phone.startsWith('+91')) {
        console.error('Ignoring international number ' + phone);
        return;
    }
    const command = new PublishCommand(input);
    await client.send(command);
};
