const express = require("express");
const speedRoutes = express.Router();
const dbo = require("../db/conn");


speedRoutes.post("/setHighScore", async(req, res) => {
    const db_connect = await dbo.getDb();

    const highScores = req.body;
    console.log(highScores);
    try{
        const result = await db_connect.collection("highScores").insertOne({
        name: req.body.name,
        numOfGuesses: guesses,
        numOfLetters: count
    })
    res.status(200).send("Success");
    } catch(err) {
        res.status(401).send("Not Found");
    }
});


speedRoutes.get("/getHighScores/:numLetters", async(req, res) => {
    const db_connect = await dbo.getDb();
    const numLetters = parseInt(req.params.numLetters);

    let highScores = await db_connect.collection("highScores").find({numOfLetters: numLetters}).toArray();
    console.log("HighScores" + highScores);
    highScores = highScores.sort((a, b) => (a.numOfGuesses - b.numOfGuesses));
    let newHighScores = new Array();

    if (highScores.length < 10) {
        res.json(highScores);
    }
    else {
        for (i = 0; i < 10; i++) {
            newHighScores[newHighScores.length = highScores[i]];
        }
        res.json(newHighScores);
    }

    
});




module.exports = speedRoutes;