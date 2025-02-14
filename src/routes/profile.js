
const express = require('express')
const profileRouter = express.Router();
const {UserAuth}= require("../middlewares/auth");

profileRouter.get("/profile", UserAuth, async  (req,res) => {

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

module.exports = profileRouter;
