var express = require("express")
var app = express();

app.set("view engine","ejs");

app.get("/",function(req,res) {
    // res.render("home");
    res.render("landing");
});

app.get("/matches",function(req,res) {
        var matches = [
        {id:"1",time:"2"},
        {id:"2",time:"3"},
        ];
    res.render("matches",{matches:matches});
});


app.listen(process.env.PORT,process.env.IP,() =>{
    console.log("started");
});

// const { Client } = require('pg');

// const client = new Client({
//   connectionString: 'postgres://lsnkyahhknfvoa:5465e49f9d8cc79c2398324b61fa4ae81a14e2758c64ad912ebc8b0e3687d2bc@ec2-54-225-68-133.compute-1.amazonaws.com:5432/dackksvkda5i3v',
//   ssl: true,
// });

// client.connect();