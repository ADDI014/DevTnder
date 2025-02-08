const express = require("express");

const app = express();

const connectDB = require("./config/database");

const User = require("./models/user");

app.use(express.json());
// const {adminAuth , UserAuth} = require("./middlewares/auth");


// app.use('/',(req,res) => {
//     res.send("Hello From the DashBoard");
// });

// app.use("/test", (req,res) => {
//     res.send("Hello From the server");
// });

// app.use("/hello/2",(req,res) => {
//     res.send("Abracadabra");
// });

// app.use("/hello",(req,res) => {
//     res.send("Hello Hello Hello");
// });

// app.use("/user",(req,res)=> {
//     res.send("hahahahahahha");
// })

// app.get("/user", (req , res) => {
//     res.send({firstName : "Ankit" , lastName: "Kumar"});
// })

// app.post("/user", (req,res) => {
//     res.send("Data successfully saved to the database!");
// })

// app.delete("/user",(req,res) => {
//     res.send("deleted successfully");
// });


// app.use("/user",[(req,res, next) => {
//     console.log("Handling the route user!!");
//     res.send("Response");
//     next();
// },(req,res,next)=> {
//    console.log("Handling the route user 2!!");
//     res.send("Response 2");
//     next();
// },
// (req,res,next)=> {
//     console.log("Handling the route user 3!!");
//      res.send("Response 3");
//     next();
//  },
//  (req,res)=> {
//     console.log("Handling the route user 4!!");
//      res.send("Response 4");
//  }]);

// app.get("/user",(req,res, next) => {
//     console.log("Handling the route user1!!");
    // res.send("Response");
//     next();
// });

// app.get("/user",(req,res, next) => {
//     console.log("Handling the route user2!!");
    // res.send("Response2");
//     next();
// });




//handle Auth Middleware for all GET POST ,... requests
// app.use('/admin', adminAuth );

// app.get("/user", (req,res) => {
//     res.send("Uaser data Sent");
// });

// app.get("/admin/getAllData",(req,res)=> {
//     res.send("All data sent");
// })

// app.get("/user/login", (req,res)=>{
//     res.send("user logged in successfully");
// })

// app.get("/user", UserAuth, (req,res) => {
//     res.send("Uaser data Sent");
// });

// app.get("/admin/deleteUser",(req,res)=> {
//     res.send("Deleted a User");
// })


// app.use('/', ( req, res) => {
//     throw new Error('BROKEN') // Express will catch this on its own.
//     // if(err){
//     //     res.status(500).send("something went wrong");
//     // }
//   })

// app.get("/error" , (req, res) => {
//     try {
//         let result = 10;
//         res.send(`result= ${result}`);
//     }
//     catch(err){
//         res.status(500).send("something went wrong");
//     }
// })

// app.get("/getUserData" , (req, res) => {
//     try {
//         throw new Error('BROKEN')
//         res.send("user data doesnt exist");
//     }
//     catch(err){
//         res.status(500).send("something went wrong");
//     }
// });

app.post("/signup" , async (req,res) => {
    console.log(req.body);
    const user = new User(req.body);

    try {
        await user.save();
    res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("Error saving the user:" + err.message);
    }
})


app.get("/user",async (req,res) => {
    
    const userEmail = req.body.emailId;
    try{
        const users = await User.find({emailId : userEmail});

        if(users.length === 0){
           res.status(404).send("User Not Found");
        }
        else{
            res.send(users); 
        }
    }
    catch(err) {
        res.status(400).send("Something went Wrong");
    }
})



app.get("/feed",async (req,res) => {
    
    // const userEmail = req.body.emailId;
    try{
        const users = await User.find();

        if(users.length === 0){
           res.status(404).send("User Not Found");
        }
        else{
            res.send(users); 
        }
    }
    catch(err) {
        res.status(400).send("Something went Wrong");
    }
})

app.get("/getOneUser",async (req,res) => {
    
    const userEmail = req.body.emailId;
    try{
        const users = await User.findOne({emailId : userEmail});

        if(users.length === 0){
           res.status(404).send("User Not Found");
        }
        else{
            res.send(users); 
        }
    }
    catch(err) {
        res.status(400).send("Something went Wrong");
    }
})

app.get("/findById",async (req,res) => {
    
    // const userEmail = req.body.emailId;
    try{
        const users = await User.findById({_id : "67a3a59022124aa0d1a751c0"});

        if(users.length === 0){
           res.status(404).send("User Not Found");
        }
        else{
            res.send(users); 
        }
    }
    catch(err) {
        res.status(400).send("Something went Wrong");
    }
})

app.delete("/user", async (req,res) => {
    const userId = req.body.userId;

    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted succesfully");
    }
    catch(err) {
        res.status(400).send("Something went wrong");
    }
});


app.patch("/user", async (req , res) => {
    const userId = req.body.userId;
    const data = req.body;

    try {

        const ALLOWED_UPDATES = [
            "userId",
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


