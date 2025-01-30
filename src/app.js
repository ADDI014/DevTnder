const express = require("express");

const app = express();

app.use('/',(req,res) => {
    res.send("Hello From the DashBoard");
});

app.use("/hello",(req,res) => {
    res.send("Hello Hello Hello");
});

app.use("/test", (req,res) => {
    res.send("Hello From the server");
});

app.listen(7777, () => {
    console.log("Server is listening on port 7777...");
})

