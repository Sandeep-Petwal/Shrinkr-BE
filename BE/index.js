require('dotenv').config();
const connectDB = require('./db/index.js');
const app = require('./app.js')


// database connection
connectDB()
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));


// listning the server
const port = process.env.PORT
app.listen(port, () => {
    console.log("App listning on port:", port)
})