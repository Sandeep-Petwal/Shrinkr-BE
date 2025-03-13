const Joi = require("joi");


// User Validation Schemas
exports.signupSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

exports.verifySchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
});


// Url Validation schema
exports.urlValidationSchema = Joi.object({
    originalUrl: Joi.string().required().uri()
});

