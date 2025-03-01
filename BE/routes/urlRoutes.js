const express = require("express");
const urlRoutes = express.Router();
const { createShortUrlFree, createShortUrlLoggedIn, deleteShortUrl, getOriginalUrl, getUrlAnalytics } = require("../controller/url.controller.js")
const auth = require("../middleware/auth.js")

urlRoutes.get("/get/:shortUrl", getOriginalUrl);
urlRoutes.get("/get-analytics/:shortUrl", getUrlAnalytics);

urlRoutes.post("/create-free-url", createShortUrlFree);
urlRoutes.post("/create-url", auth, createShortUrlLoggedIn);
urlRoutes.delete("/delete", auth, deleteShortUrl);




module.exports = urlRoutes