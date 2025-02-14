const express = require('express')
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const {validateSignUp} = require("../utils/validation")


authRouter.post("/signup" , async (req,res) => {
    try {
    //validation of data
    validateSignUp(req);
    const {firstName , lastName, emailId, password} = req.body;
    //enncrypt the password
    const passswordHash = await bcrypt.hash(password , 10);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password : passswordHash,
    });
        await user.save();
    res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

authRouter.post("/login" , async (req,res) => {
    try{
        const {emailId , password} = req.body;

        const user = await User.findOne({emailId : emailId});
        if(!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);


        if(isPasswordValid){
            //Create a JWT token
            const token = await user.getJWT();
            //Add the token
            res.cookie("token" , token , {
                expires : new Date(Date.now() + 8 * 3600000),
            });
            res.send("Login successfulll");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
});



module.exports = authRouter;