const express = require("express");
const userRoutes = express.Router();
const {signup, login, verifySignup} = require("../controller/user.controller.js")

userRoutes.post("/signup", signup);
userRoutes.post("/verify-signup", verifySignup);
userRoutes.post("/login", login);



module.exports = userRoutes