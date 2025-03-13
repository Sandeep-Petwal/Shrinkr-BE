const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes.js")
const urlRoutes = require("./urlRoutes.js");
const auth = require("../middleware/auth.js");
const { authLimiter } = require("../utils/limiter.js")


// Home route
router.get("/", (req, res) => {
    res.status(200).json({status : "working"})
})
router.get("/me", auth, (req, res) => {    
    return res.json({user : req.user, success : true})
});



// user route
router.use("/user", authLimiter, userRoutes);

// url route
router.use("/url", urlRoutes);

module.exports = router;
