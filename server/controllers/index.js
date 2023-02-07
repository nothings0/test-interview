const { CreateNewAccessCode, ValidateAccessCode } = require("../services");

const UserController = {
  smsOTP: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const { status, message } = await CreateNewAccessCode(phoneNumber);
      return res.status(status).json({ message });
    } catch (error) {
      throw new Error(error);
    }
  },
  validOTP: async (req, res) => {
    try {
      const { accessCode, phoneNumber } = req.body;

      const { status, message } = await ValidateAccessCode(
        accessCode,
        phoneNumber
      );

      return res.status(status).json({ message });
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = UserController;
