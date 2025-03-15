// rateLimiters.js

const rateLimit = require('express-rate-limit');

// Define a global limiter for all routes
const globalLimiter = rateLimit({
    windowMs: 10000 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Define a limiter for sensitive routes (e.g., login, password reset)
const authLimiter = rateLimit({
    windowMs: 10000 * 60 * 1000, // 60 minute
    max: 200, // limit each IP to 5 requests per minute
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Define a limiter for API routes
const freeUrlLimiter = rateLimit({
    windowMs: 24000 * 60 * 60 * 1000, // 1 day
    max: 200, // limit each IP to 20 requests per minute
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    globalLimiter,
    authLimiter,
    freeUrlLimiter,
};
