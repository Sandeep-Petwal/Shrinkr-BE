const Url = require("../models/url.model.js");
const Analytics = require("../models/analytics.model.js");
const generateShortURL = require("../utils/generateShortURL.js");
const validateRequest = require("../utils/validate");
const { urlValidationSchema } = require("../utils/joiSchema.js");
const response = require("../utils/response.js");
const BASE_SHORT_URL = process.env.BASE_SHORT_URL;
const shortUrlLength = process.env.SHORT_URL_LENGTH;
const validator = require("validator");

// Check if short URL already exists
const isUrlAlreadyExists = async (text) => {
    const urlToCheck = `${BASE_SHORT_URL}/${text}`;
    const existingShortUrl = await Url.findOne({ shortUrl: urlToCheck });
    return !!existingShortUrl;
};

// Create short URL (shared function)
const createShortUrl = async (originalUrl, customUrlText, userId) => {
    if (!validator.isURL(originalUrl, { protocols: ["http", "https"], require_protocol: true })) {
        throw new Error("Invalid URL format!");
    }

    let shortUrl = null;

    if (customUrlText) {
        if (customUrlText.length !== shortUrlLength) {
            throw new Error(`Custom URL length must be ${shortUrlLength}!`);
        }
        if (await isUrlAlreadyExists(customUrlText)) {
            throw new Error("Short URL already exists!");
        }
        shortUrl = `${BASE_SHORT_URL}/${customUrlText}`;
    } else {
        while (!shortUrl) {
            const shortText = generateShortURL();
            if (!(await isUrlAlreadyExists(shortText))) {
                shortUrl = `${BASE_SHORT_URL}/${shortText}`;
            }
        }
    }

    return await Url.create({ originalUrl, shortUrl, ...(userId && { userId }) });
};

// Create short URL for logged-in users
const createShortUrlLoggedIn = async (req, res) => {
    try {
        const validation = validateRequest(urlValidationSchema, req);
        if (!validation.success) return response.failled(res, 400, validation.message);

        const { customUrlText } = req.body;
        const { originalUrl } = validation.value;
        const { _id: userId } = req.user;

        const data = await createShortUrl(originalUrl, customUrlText, userId);
        response.success(res, data, 201, "Successfully created.");
    } catch (error) {
        response.failled(res, 400, error.message);
    }
};

// Create short URL for free users
const createShortUrlFree = async (req, res) => {
    try {
        const validation = validateRequest(urlValidationSchema, req);
        if (!validation.success) return response.failled(res, 400, validation.message);

        const { customUrlText } = req.body;
        const { originalUrl } = validation.value;

        const data = await createShortUrl(originalUrl, customUrlText);
        response.success(res, data, 201, "Successfully created.");
    } catch (error) {
        response.failled(res, 400, error.message);
    }
};

// Delete short URL (only logged-in user who created it)
const deleteShortUrl = async (req, res) => {
    const { shortUrl } = req.body;
    console.log('shortUrl', shortUrl)
    if (!shortUrl || !validator.isURL(shortUrl, { protocols: ["http", "https"], require_protocol: true, require_tld: false })) {
        return response.failled(res, 400, "Invalid shorturl.");
    }

    const { _id: userId } = req.user;
    const urlData = await Url.findOne({ shortUrl, userId });

    if (!urlData) {
        return response.failled(res, 404, "Short URL not found.");
    }

    if (urlData.userId.toString() !== userId.toString()) {
        return response.failled(res, 403, "You are not authorized to delete this URL.");
    }

    await Url.deleteOne({ shortUrl });
    response.success(res, {}, 200, "Short URL deleted successfully.");
};

// Get original URL and track analytics
const getOriginalUrl = async (req, res) => {
    const { short_text } = req.params;
    if (!short_text) {
        return response.failled(res, 400, "Short text is required.");
    }

    const shortUrl = `${BASE_SHORT_URL}/${short_text}`;
    const urlData = await Url.findOne({ shortUrl });

    if (!urlData) {
        return response.failled(res, 404, "Short URL not found.");
    }

    // Extract analytics data
    const analyticsData = {
        urlId: urlData._id,
        referrer: req.headers.referer || "Direct",
        userAgent: req.headers["user-agent"] || "Unknown",
        ipAddress: req.ip || "Unknown",
        country: req.headers["cf-ipcountry"] || "Unknown",
    };

    // Save analytics
    await Analytics.create(analyticsData);

    // Redirect to the original URL
    // res.redirect(urlData.originalUrl);

    // return the original URL
    const { originalUrl } = urlData;
    response.success(res, { originalUrl, shortUrl }, 200, "Successfully fetched the original url.")
};


// Get analytics for a specific URL (logged-in user only)
const getUrlAnalytics = async (req, res) => {
    const { short_text } = req.params;
    if (!short_text) {
        return response.failled(res, 400, "Short text is required.");
    }

    const shortUrl = `${BASE_SHORT_URL}/${short_text}`;

    const urlData = await Url.findOne({ shortUrl });

    if (!urlData) {
        return response.failled(res, 404, "Short URL not found.");
    }

    const {_id : userId} = req.user;        
    if (urlData.userId.toString() !== userId.toString()) {
        return response.failled(res, 403, "You are not authorized to view analytics for this URL.");
    }

    const analyticsData = await Analytics.find({urlId : urlData._id});

    response.success(res, analyticsData, 200, "Analytics retrieved successfully.");
};

module.exports = { createShortUrlFree, createShortUrlLoggedIn, deleteShortUrl, getOriginalUrl, getUrlAnalytics };
