const express = require('express')
const requestRouter = express.Router()
const {UserAuth}= require("../middlewares/auth");






requestRouter.post("/sendConnectionRequest" , UserAuth, async (req,res) => {
    const user = req.user;

    console.log("Sending the connection request");

    res.send(user.firstName + "Sent the connection request");
})



module.exports = requestRouter;