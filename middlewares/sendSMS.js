import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

// Your Twilio Account SID and Auth Token from twilio.com/console
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Create a new Twilio client
const client = new twilio(accountSid, authToken);

// Function to send OTP
async function sendSMS(mobileNumber, otp) {
  await client.messages
    .create({
      body: `Your OTP is: ${otp}`,
      to: mobileNumber, // The mobile number you want to send OTP to
      from: '+17203300691', // Your Twilio phone number
    })
    .then((message) => console.log(`OTP sent! Message SID: ${message.sid}`))
    .catch((error) => console.error('Error sending OTP:', error));
}

export default sendSMS;