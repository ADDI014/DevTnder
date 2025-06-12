const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";



//ye sabhi pending interested requests ki list dega
userRouter.get("/user/requests/received",UserAuth , async (req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested",
        }).populate("fromUserId" , USER_SAFE_DATA);
        
        // .populate("fromUserId",["firstName" , "lastName"]);

        res.json({
            message : "Data fetched succesfully",
            data : connectionRequest,
        });
    }
    catch(err){
        req.statusCode(400).send("ERROR" + err.message);
    }
})

userRouter.get("/user/connections", UserAuth, async (req ,res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            $or : [
                {toUserId : loggedInUser._id, status : "accepted"},
                {fromUserId: loggedInUser._id, status :"accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

       const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
    }
    catch(err) {
        res.status(400).send({message : err.message});
    }
})



module.exports = userRouter;