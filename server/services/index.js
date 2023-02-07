const Twilio = require("twilio");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = Twilio(accountSid, authToken);

const User = require("../connectDB");
const UserService = {
  CreateNewAccessCode: async (phoneNumber) => {
    try {
      const otp = Math.floor(
        Math.random() * (999999 - 100000) + 100000
      ).toString();
      await User.add({ phone: phoneNumber, code: otp });
      const body = `your otp ${otp}`;
      const message = await UserService.SendSMS(body, phoneNumber);
      console.log(message);
      return {
        status: 200,
        message: "success",
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  ValidateAccessCode: async (accessCode, phoneNumber) => {
    const query = User.where("phone", "==", phoneNumber);
    const data = await query.get();
    let user, id;
    data.forEach(function (doc) {
      user = doc.data();
      id = doc.id;
    });
    if (!user)
      return {
        status: 404,
        message: "Phone number not found",
      };
    if (user.code === accessCode) {
      await User.doc(id).update({ code: "" });
      return {
        status: 200,
        success: true,
        message: "valid success",
      };
    } else {
      return {
        status: 401,
        success: false,
        message: "invalid code",
      };
    }
  },
  SendSMS: async (body, to) => {
    try {
      const message = await client.messages.create({
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
        body,
      });
      return message;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = UserService;
