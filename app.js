var express = require("express");
var app = express();
var bodyParser  = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");


const { Pool, Client } = require('pg')
const connectionString = "postgres://qgoyzerrrddgkd:115fc521e731b0eb673a50366b03e6bacd5d1cb2209f88d49d5d5011df8781b7@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d7pgeu1vs3a7r";
const router = express.Router();
const matches = [];

const client = new Client({
  connectionString: connectionString,
  ssl: true,
});

client.connect();

app.get("/",function(req,res) {
    // res.render("home");
    res.render("landing");
});

// get 
app.get("/matches",function(req,res) {

    client.query('SELECT * FROM matches;',(err,matches) => {
        if (err) {
            console.log(err.stack);
        } else {
            // console.log(matches.rows);
            res.render("matches",{matches:matches.rows})
        }
    });

});

app.get("/matches/:id",function(req, res) {
    const text1 = 'select * from teamfights where match_id = ' + req.params.id +';';
    // console.log(req.params.id);
    client.query(text1, (err1,teamfights) => {
        if (err1) {
            console.log(err1.stack);
        } else {
            // console.log(teamfights);
            // res.render("show",{teamfights : teamfights.rows})
            const text2 = 'select * from players where match_id = ' + req.params.id +';';
            client.query(text2,(err2,players) => {
                if(err2) {
                    console.log(err2.stack);
                }
                else{
                    // console.log(players.rows);
                    res.render("show",{
                        teamfights:teamfights.rows,
                        players:players.rows
                    })
                }
            })
            
        }
    })
    // res.send(text);
    
})
app.get("/purchases/:id",function(req, res) {
    const id = req.params.id;
    const arr = id.split('_');
    const text = 'select * from purchase_log where match_id = ' + arr[0]+' AND player_slot = ' + arr[1];
    client.query(text,(err,purchase_log) => {
        if(err) {
            console.log(err);
        } else {
            res.render("purchases",{purchase_log : purchase_log.rows});
        }
    })
})



app.listen(process.env.PORT,process.env.IP,() =>{
    console.log("started");
});

