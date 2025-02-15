const express = require('express')
const requestRouter = express.Router()
const {UserAuth}= require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");


requestRouter.post("/request/send/:status/:toUserId" , UserAuth, async (req,res) => {
   try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];

    if(!allowedStatus.includes(status)){
        return res.status(400).json({message : "Invalid status type : " + status});
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or : [
            {fromUserId , toUserId},
            {fromUserId : toUserId, toUserId : fromUserId},
        ],
    });

    if(existingConnectionRequest){
        return res.status(400).send({message : "Connection Request Already Exists"});
    }

    const connectionRequest = new   ConnectionRequest({
        fromUserId,
        toUserId,
        status,
    });
    const data = await connectionRequest.save();

    res.json({
        message : "Connection Request Sent Successfully",
        data,
    })
   }
   catch(err){
    res.status(400).send("ERROR" + err.message);
   }
})



module.exports = requestRouter;