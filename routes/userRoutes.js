const express = require("express");
const userRoutes = express.Router();
const {signup, login, verifySignup, getMyUrls, logout} = require("../controller/user.controller.js");
const auth = require("../middleware/auth.js");

userRoutes.post("/signup", signup);
userRoutes.post("/verify-signup", verifySignup);
userRoutes.post("/login", login);
userRoutes.post("/logout", auth, logout)

// get uesr's url
userRoutes.get("/my_urls", auth, getMyUrls)


module.exports = userRoutes