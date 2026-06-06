const axios = require("axios");

const sendSms = async ({ phone, message }) => {
    /*
      SMSAPI.LK documentation থেকে এখানে real endpoint বসাবেন.
  
      Example format:
      POST https://api.smsapi.lk/send
      headers: Authorization Bearer TOKEN
      body: { to, message, from }
  
      নিচেরটা placeholder.
    */

    const response = await axios.post(
        "https://api.smsapi.lk/send",
        {
            to: phone,
            message,
            from: process.env.SMSAPI_FROM,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.SMSAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};

module.exports = sendSms;