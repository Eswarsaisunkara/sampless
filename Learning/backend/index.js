const express = require("express");
const app = express();

app.get("/", (req,res) => {
    res.send("Server running at port : 3000");
});

app.get("/date",(req,res)=>{
    let date = new Date();
    res.send(`Today's date is ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`);
});

app.get("/package",(req,res)=>{
    res.sendFile("./package.json", {root:__dirname});
});

app.get("/page",(req,res)=>{
    res.sendFile("./page.html",{root:__dirname});
});

app.listen(3000);