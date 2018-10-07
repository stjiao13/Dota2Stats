var express = require("express");
var app = express();
var bodyParser  = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

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

    // client.query('SELECT * FROM matches;',(err,matches) => {
    //     if (err) {
    //         console.log(err.stack);
    //     } else {
    //         // console.log(matches.rows);
    //         res.render("matches",{matches:matches.rows})
    //     }
    // });
    client.query('SELECT * FROM matches;').then(matches => {
                    res.render("matches",{matches:matches.rows})
    }).catch(e => console.error(e.stack));

});

app.get("/matches/:id",function(req, res) {
    const text1 = 'select * from teamfights where match_id = ' + req.params.id +';';
    // console.log(req.params.id);
    client.query(text1).then(teamfights => {
        const text2 = 'select * from players where match_id = ' + req.params.id +';';
        client.query(text2).then(players => {
            const text3 = 'select * from comments where match_id = '+ req.params.id +';';
            client.query(text3).then(comments => {
                res.render("show",{
                    teamfights:teamfights.rows,
                    players:players.rows,
                    comments:comments.rows
                })
            })
        })
    }).catch(e => console.error(e.stack))
    
    // client.query(text1, (err1,teamfights) => {
    //     if (err1) {
    //         console.log(err1.stack);
    //     } else {
    //         const text2 = 'select * from players where match_id = ' + req.params.id +';';
    //         client.query(text2,(err2,players) => {
    //             if(err2) {
    //                 console.log(err2.stack);
    //             }
    //             else{
    //                 const text3 = 'select * from comments where match_id = '+ req.params.id +';';
    //                 client.query(text3,(err3,comments) => {
    //                     if(err3) {
    //                         console.log(err3.stack);
    //                     }
    //                     else{
    //                         res.render("show",{
    //                             teamfights:teamfights.rows,
    //                             players:players.rows,
    //                             comments:comments.rows
    //                         })
    //                     }
    //                 })
    //             }
    //         })
            
    //     }
    // })
    
})
app.get("/purchases/:id",function(req, res) {
    const id = req.params.id;
    const arr = id.split('_');
    const text = 'select * from purchase_log where match_id = ' + arr[0]+' AND player_slot = ' + arr[1];
    
    client.query(text).then(purchase_log => {
        res.render("purchases",{purchase_log : purchase_log.rows});
    }).catch(e => console.error(e.stack))
    // client.query(text,(err,purchase_log) => {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         res.render("purchases",{purchase_log : purchase_log.rows});
    //     }
    // })
})


app.get("/matches/:id/comments/new",function(req, res) {
   res.render("newcomment",{id:req.params.id});
})

app.post("/matches/:id",function(req,res) {
    // console.log(req.body);
    // console.log(req.body.comment.content);
    
    const id = req.params.id;
    const content = req.body.comment.content;
    const author = req.body.comment.author;
    // const text = 'INSERT INTO comments (match_id, content, author) VALUES ( \'' + id +
    const text = 'INSERT INTO comments (match_id, content, author) VALUES ($1,$2,$3)'
    const values = [id,content,author];
    
    
    client.query(text,values).then(created => {
        res.redirect("/matches/"+id);
    }).catch(e => console.error(e.stack))
    // client.query(text,values,function(err,created) {
    //     if (err) {
    //         console.log(err.stack);
    //     } else {
    //         res.redirect("/matches/"+req.params.id);
    //     }
    // })
    
})

//delete
app.get("/matches/:id/comments/delete/:commentId",function(req,res) {
    const text = 'delete from comments where id = ' + req.params.commentId;
    client.query(text).then(success => {
        res.redirect("/matches/" + req.params.id)
    }).catch(e => console.error(e.stack))
}) 


app.get("/matches/:id/comments/:commentId/edit",function(req,res) {
    const text = 'select * from comments where id = '+ req.params.commentId +';';
    // console.log(text);
    client.query(text).then(comment => {
        // console.log(comment.rows[0]);
        res.render("edit",{comment : comment.rows[0]});
    }).catch(e => console.error(e.stack))

})

app.post("/matches/:id/comments/:commentId",function(req, res) {
    const commentId = req.params.commentId;
    const matchId = req.params.id;
    const updatedContent = req.body.comment.content;
    console.log("called!!!!!!!!")
    
    const text = 'UPDATE comments SET content = \'' + updatedContent +'\' WHERE id = ' + commentId +';';
    // const values = [updatedContent,commentId];
    console.log(text);
    client.query(text).then(success => {
        res.redirect("/matches/" + matchId);
    }).catch(e => console.error(e.stack))
})


app.listen(process.env.PORT,process.env.IP,() =>{
    console.log("started");
});

