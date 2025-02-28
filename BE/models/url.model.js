const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: "Original URL is required.",
        },
        shortUrl: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            // required: "UserId is required.",
        }
    },
    {
        timestamps: true,
    }
);




const Url = mongoose.model('Url', urlSchema);
module.exports = Url;