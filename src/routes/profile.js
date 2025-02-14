
const express = require('express')
const profileRouter = express.Router();
const {UserAuth}= require("../middlewares/auth");
const { validateEditProfile } = require('../utils/validation');

profileRouter.get("/profile/view", UserAuth, async  (req,res) => {
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


profileRouter.patch("/profile/edit", UserAuth,async (req,res) => {
    try{
        if(!validateEditProfile(req)){
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.send(`${loggedInUser.firstName}, your profile updated successfully`);
    }
    catch(err){
        res.status(400).send("ERROR :" + err.message );
    }
})

module.exports = profileRouter;
