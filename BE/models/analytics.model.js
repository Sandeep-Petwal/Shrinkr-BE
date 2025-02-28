const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
    {
        urlId: mongoose.Schema.Types.ObjectId,
        referrer: String,
        userAgent: String,
        ipAddress: String,
        country: String
    },
    {
        timestamps: true,
    }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;