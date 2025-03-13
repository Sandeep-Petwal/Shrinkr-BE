const uri = `${process.env.MONOGO_URL}`;
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(uri);
        console.log(`\nMonogoDB Connected, DBHost : ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB Connection error !", error);
    }
};

module.exports = connectDB;