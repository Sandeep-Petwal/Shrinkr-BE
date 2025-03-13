const shortUrlLength = process.env.SHORT_URL_LENGTH;

const generateShortURL = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let shortURL = "";
    for (let i = 0; i < shortUrlLength; i++) {
        shortURL += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return shortURL;
};

module.exports = generateShortURL;