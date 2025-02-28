const generateShortURL = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let shortURL = "";
    for (let i = 0; i < 4; i++) {
        shortURL += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return shortURL;
};

module.exports = generateShortURL;