const express = require("express");

const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();

const connectDB = require("./src/config/database");

app.use(cors(
    { origin: ['http://localhost:5173',
        "https://devsang.netlify.app",
    ],
        credentials : true
     }
));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");

app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

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


