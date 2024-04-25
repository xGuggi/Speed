const express = require("express");
const speedRoutes = express.Router();
const dbo = require("../db/conn");
let playerName;
let cards;
let loser;

speedRoutes.post("/setScore", async(req, res) => {
    const db_connect = await dbo.getDb();
    playerName = req.body.userName; 
    console.log(cards);
    const myobj = 
    {
        Name: playerName,
        Cards: cards,
        Loser: loser
    };
    const result = await db_connect.collection("SpeedHighScores").insertOne(myobj);
    console.log(playerName);
    
    res.json(result);
    
});



speedRoutes.post("/gather", async(req, res) => {
    cards = req.body.cards; 
    loser = req.body.loser;
    console.log(cards + " " + loser);   
});





speedRoutes.get("/getScores", async(req, res) => {
    const db_connect = await dbo.getDb();
    const scores = await db_connect.collection("SpeedHighScores").find({Name: playerName}).toArray();
    //console.log("HighScores " + scores.Name);
    console.log("player name " + scores);
    res.json(scores);
});




module.exports = speedRoutes;