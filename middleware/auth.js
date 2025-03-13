const User = require("../models/users.model.js")
const jwt = require("jsonwebtoken");

// Middleware to protect routes
const auth = async (req, res, next) => {
    try {
        let token;

        // Get token from cookie
        if (req.cookies.url_auth) {
            token = req.cookies.url_auth;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please log in to access this resource'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        // Grant access to protected route
        req.user = user;
        next();
    } catch (error) {
        console.log('error :: ', error)
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};


module.exports = auth