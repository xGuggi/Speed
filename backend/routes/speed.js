const express = require("express");
const speedRoutes = express.Router();
const dbo = require("../db/conn");
let playerName;
let cards;
let win;

speedRoutes.post("/setScore", async(req, res) => {
    const db_connect = await dbo.getDb();
    const playerName = req.body.userName; 
    const myobj = 
    {
        Name: playerName,
        Cards: cards,
        Win: win
    };
    const result = await db_connect.collection("SpeedHighScores").insertOne(myobj);
    res.json(result);
    console.log(playerName);
    console.log(playerPass);
});



speedRoutes.post("/gather", async(req, res) => {
    const cards = req.body.cards; 
    const win = req.body.win;   
});





speedRoutes.get("/getScores", async(req, res) => {
    const db_connect = await dbo.getDb();
    let scores = await db_connect.collection("SpeedHighScores").find({Name: "Hannah"}).toArray();
    console.log("HighScores " + scores.Name);
    res.json(scores);
});




module.exports = speedRoutes;