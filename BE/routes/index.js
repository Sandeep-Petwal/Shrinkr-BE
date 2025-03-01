const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes.js")
const urlRoutes = require("./urlRoutes.js")


// Home route
router.get("/", (req, res) => {
    res.status(200).json({status : "working"})
})

// user route
router.use("/user", userRoutes);

// url route
router.use("/url", urlRoutes);

module.exports = router;
