const axios = require("axios");

const sendSms = async ({ phone, message }) => {
    try {
        const cleanPhone = String(phone).replace(/\+/g, "").trim();

        const response = await axios.post(
            "https://dashboard.smsapi.lk/api/v3/sms/send",
            {
                recipient: cleanPhone,
                sender_id: process.env.SMSAPI_FROM,
                type: "plain",
                message: message,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.SMSAPI_TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (response.data?.status !== "success") {
            throw new Error(response.data?.message || "SMS sending failed");
        }

        return response.data;
    } catch (error) {
        console.log("SMSAPI.LK Error:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = sendSms;