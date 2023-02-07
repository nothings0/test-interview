const router = require("express").Router();
const UserController = require("../controllers");

router.post("/register", UserController.smsOTP);
router.post("/valid", UserController.validOTP);

module.exports = router;
