const mongoose = require('mongoose');
function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.error("MongoDB connection error:", err);
            process.exit(1); // Optional: exit process on DB connection failure
        });
}

module.exports = connectToDB;