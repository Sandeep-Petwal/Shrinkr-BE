const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes.js")
const urlRoutes = require("./urlRoutes.js");
const auth = require("../middleware/auth.js");
const { authLimiter } = require("../utils/limiter.js")
const fetch = require("node-fetch");


// Home route
router.get("/", (req, res) => {
    res.status(200).json({status : "working"})
})
router.get("/me", auth, (req, res) => {    
    return res.json({user : req.user, success : true})
});

//TODO: It was made for debugging the blackbox video api to see the screen recording 
router.get("/api/blackbox/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({error : "Please enter the id"})
    }
    console.log('hello')

    // const TARGET_URL = "https://www.blackbox.ai/recorded-sessions/blackbox_assistant_room_1";
    const TARGET_URL = `https://www.blackbox.ai/api/voice/get-recorded-link?roomName=blackbox_assistant_room_${id}`;

    try {
        const response = await fetch(TARGET_URL);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching from Blackbox:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});



// user route
router.use("/user", authLimiter, userRoutes);

// url route
router.use("/url", urlRoutes);

module.exports = router;
