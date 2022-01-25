const express = require('express');
const router = express.Router();
const userService = require("../services/userService")

router.post("/signup", userService.userSignup);

router.post("/login", userService.userLogin);

module.exports = router;
