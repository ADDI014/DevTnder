const express = require("express");

const app = express();


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


app.use("/user",[(req,res, next) => {
    console.log("Handling the route user!!");
    // res.send("Response");
    next();
},(req,res,next)=> {
   console.log("Handling the route user 2!!");
    // res.send("Response 2");
    next();
},
(req,res,next)=> {
    console.log("Handling the route user 3!!");
    //  res.send("Response 3");
    next();
 },
 (req,res)=> {
    console.log("Handling the route user 4!!");
     res.send("Response 4");
 }]);




app.listen(7777, () => {
    console.log("Server is listening on port 7777...");
})


