const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://ankit2237129aiml:Ankit132asdf@alok.iadhh.mongodb.net/devTinder"
    );
};

module.exports = connectDB;

