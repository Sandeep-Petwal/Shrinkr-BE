const jwt = require("jsonwebtoken");
const nodemailer = require("../utils/nodeMailer.js");
const fetch = require('node-fetch'); // For making HTTP requests to Google's API
const User = require("../models/users.model.js");
const { signupSchema, loginSchema, verifySchema } = require("../utils/joiSchema.js");
const validateRequest = require("../utils/validate.js");
const response = require("../utils/response.js");
const Url = require("../models/url.model.js");

// Your reCAPTCHA secret key (keep this secret!)
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SITE_SECRET;



const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });
};

// Utility: Send JWT in HTTP-only Cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    res.cookie("url_auth", token, cookieOptions);

    res.status(statusCode).json({
        success: true,
        data: {
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified,
            },
        },
    });
};

// Controller: Login
const login = async (req, res) => {
    const validation = validateRequest(loginSchema, req);
    if (!validation.success) {
        return response.failled(res, 400, validation.message)
    }
    const { email, password, recaptchaToken} = req.body;


    // 1. Check if recaptchaToken is present
    if (!recaptchaToken) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA token is missing.' });
    }

    // 2. Verify the reCAPTCHA token with Google
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await fetch(googleVerifyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const googleResponse = await response.json();

    if (!googleResponse.success) {
        return res.status(401).json({ success: false, message: 'reCAPTCHA verification failed.', 'error-codes': googleResponse['error-codes'] });
    }


    const user = await User.findOne({ email }).select("+password");
    console.log("user :: email ::" + email + JSON.stringify(user))
    if (!user || !user.isVerified || !(await user.comparePassword(password))) {
        return response.failled(res, 400, "Invalid email or password")
    }

    sendTokenResponse(user, 200, res);
};

// Controller : Logout
const logout = async (req, res) => {
    // clear the cookies
    res.cookie('url_auth', '', { expires: new Date(0), httpOnly: true }); // Set cookie to empty value with expired date
    response.success(res, {}, 201, "Successfully Logged out.")
}

// Controller: Signup
const signup = async (req, res) => {
    const validation = validateRequest(signupSchema, req);
    if (!validation.success) {
        return response.failled(res, 400, validation.message);
    }

    const { name, email, password } = validation.value;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ email });

    if (user?.isVerified) {
        return response.failled(res, 400, "User already exists.");
    }

    if (user) {
        Object.assign(user, { name, password, otp });
        await user.save();
    } else {
        user = await User.create({ name, email, password, otp });
    }

    await nodemailer.transporter.sendMail({
        to: email,
        subject: "Email Verification",
        text: `Your verification code is: ${otp}`,
    });

    response.success(res, { email: user.email }, 201, "Please check your email for verification code.");
};




// Controller: Verify Signup
const verifySignup = async (req, res) => {
    const validation = validateRequest(verifySchema, req);
    if (!validation.success) {
        return response.failled(res, 400, validation.message)
    }

    const { email, otp } = validation.value;

    const user = await User.findOne({ email, otp });
    if (!user) {
        return response.failled(res, 400, "Invalid email or OTP")
    }

    await User.findByIdAndUpdate(user._id, {
        isVerified: true,
        $unset: { otp: "" },
    });

    response.success(res, [], 200, "Your account verified successfully.")
};


// controller to get the list of  users total shorten url's
const getMyUrls = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { _id: userId } = req.user;

    const total = await Url.countDocuments({ userId });

    if (!total) {
        return response.success(res, [], 200, "No url found.");
    }

    const skip = (page - 1) * limit;

    try {
        const urls = await Url.find({ userId }).skip(skip).limit(parseInt(limit));
        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            totalPage: parseInt(Math.ceil(total / limit)),
            data: urls
        })
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return response.error(res, "Failed to fetch URLs.", 500);
    }
};

module.exports = { signup, login, verifySignup, getMyUrls, logout };
