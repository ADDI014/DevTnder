const express = require("express");

const User = require("./src/models/user");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const {validateSignUp} = require("./utils/validation");
const {UserAuth}= require("./src/middlewares/auth");


const app = express();

const connectDB = require("./src/config/database");




app.use(express.json());
app.use(cookieParser());


app.post("/signup" , async (req,res) => {
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


app.post("/login" , async (req,res) => {
    try{
        const {emailId , password} = req.body;

        const user = await User.findOne({emailId : emailId});
        if(!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            //Create a JWT token
            const token = await jwt.sign({ _id : user._id} , "DEV@Tinder$790", {
                expiresIn : "7d",
            });
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

app.get("/profile", UserAuth, async  (req,res) => {

    try {
 
        const user = req.user;
    
    if(!user){
        throw new Error("No user found");
    }
    res.send(user);
    }catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
})

app.post("/sendConnectionRequest" , UserAuth, async (req,res) => {
    const user = req.user;

    console.log("Sending the connection request");

    res.send(user.firstName + "Sent the connection request");
})


app.patch("/user/:userId", async (req , res) => {
    // const userId = req.body.userId;
    const userId = req.params?.userId;
    const data = req.body;

    try {

        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
        ];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Updates not allowed");
        }
        if(data?.skills.length > 10){
            throw new Error("Skills can not be more than 10");
        }
        const user = await User.findByIdAndUpdate(userId , data, {
            returnDocument : "after",
            runValidators : true,
        });
        console.log(user);
        res.send("user Updated successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

connectDB().then(() => {
    console.log("Database connection established");

    app.listen(7777, () => {
        console.log("Server is listening on port 7777...");
    })
}).catch((err) => {
    console.log("Database cannot be connected");
});


