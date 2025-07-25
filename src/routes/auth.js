const express = require('express')
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const {validateSignUp} = require("../utils/validation");


authRouter.post("/signup" , async (req,res) => {
    try {
    //validation of data
    validateSignUp(req);
    const {firstName , lastName, emailId, password, age, gender, photoUrl, skills , about} = req.body;
    //enncrypt the password
    const passswordHash = await bcrypt.hash(password , 10);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password : passswordHash,
        age,
        gender,
        photoUrl,
        skills,
        about
    });
      const savedUser =  await user.save();
       const token = await savedUser.getJWT();
            //Add the token
            res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(Date.now() + 8 * 3600000)
});

    res.json({message : "User saved successfully!", data : savedUser});
    
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
            res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now() + 8 * 3600000)
});
            res.send(user);
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
});


authRouter.post("/logout" , async  (req,res) => {
   res.cookie("token", null, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(Date.now())
});

    res.send("Logout Successfully");
})


module.exports = authRouter;