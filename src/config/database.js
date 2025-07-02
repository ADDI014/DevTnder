const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect(
        // "mongodb+srv://ankit2237129aiml:Ankit132asdf@alok.iadhh.mongodb.net/devTinder"
        'mongodb+srv://ADDI0147C:TK6ngsa2CuTpQiWo@cluster0.mdtnub5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
};

module.exports = connectDB;

