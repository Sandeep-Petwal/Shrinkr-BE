require('express-async-errors');
const express = require('express');
const routes = require('./routes/index.js')
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler.js')
const cookieParser = require('cookie-parser');
const { globalLimiter } = require("./utils/limiter.js")

// middleware
const app = express();
const corsOptions = {
    origin: process.env.BASE_SHORT_URL, // specify the exact origin
    credentials: true, // allow credentials (cookies, authorization headers)
  };
  
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/docker", (req, res) => {
  res.json({status : "Running inside a container"})
})

// routes
app.use("/api/v1", (req, res, next) => {
    console.log("Route :: ", req.path);
    next();
}, globalLimiter, routes);

// error handling middleware
app.use(errorHandler);

module.exports = app