const express = require('express');
const { registerUser } = require('../controllers/user_controller');
const router = express.Router();

router.route("/classified/login").post(registerUser);

module.exports = router;