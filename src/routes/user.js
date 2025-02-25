const express = require("express");
const user = require("../models/user");
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received",UserAuth , async (req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested",
        });

        res.json({
            message : "Data fetched succesfully",
            data : connectionRequest,
        });
    }
    catch(err){
        req.statusCode(400).send("ERROR" + err.message);
    }
})

module.exports = userRouter;