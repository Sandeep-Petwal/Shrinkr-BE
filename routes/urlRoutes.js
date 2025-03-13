const express = require("express");
const urlRoutes = express.Router();
const { createShortUrlFree, createShortUrlLoggedIn, deleteShortUrl, getOriginalUrl, getUrlAnalytics } = require("../controller/url.controller.js")
const auth = require("../middleware/auth.js");
const { freeUrlLimiter    } = require("../utils/limiter.js")


urlRoutes.get("/get/:short_text", getOriginalUrl);
urlRoutes.get("/get-analytics/:short_text", auth, getUrlAnalytics);

urlRoutes.post("/create-free-url", freeUrlLimiter, createShortUrlFree);
urlRoutes.post("/create-url", auth, createShortUrlLoggedIn);
urlRoutes.delete("/delete", auth, deleteShortUrl);




module.exports = urlRoutes