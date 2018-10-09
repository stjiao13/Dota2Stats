var express = require("express");
var app = express();
var bodyParser  = require("body-parser");
// module for database info like password and will be ignored for public github account
var connection = require("./connection");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.set("view engine","ejs");


const { Pool, Client } = require('pg')
const connectionString = connection.uri;
const router = express.Router();
const matches = [];
var sort_status = [];

const client = new Client({
  connectionString: connectionString,
  ssl: true,
});
const pool = new Pool({
  connectionString: connectionString,
  ssl: true,
});
client.connect();

app.get("/",function(req,res) {
    var prefix = 'SELECT COUNT(*) FROM ';
    pool.query(prefix + 'matches;').then(matchesCount => {
        pool.query(prefix + 'players;').then(playersCount => {
            pool.query(prefix + 'teamfights;').then(teamfightsCount => {
                pool.query(prefix + 'purchase_log;').then(purchasesCount => {
                    
                    res.render("landing",{
                        matchesCount : matchesCount.rows[0].count,
                        playersCount : playersCount.rows[0].count,
                        teamfightsCount : teamfightsCount.rows[0].count,
                        purchasesCount : purchasesCount.rows[0].count
                    });

                })
            })
        })
    }).catch(e => console.error(e.stack));
});

// get 
app.get("/matches",function(req,res) {

    pool.query('SELECT * FROM matches;').then(matches => {
                    res.render("matches",{matches:matches.rows})
    }).catch(e => console.error(e.stack));
});

app.get("/matches/sort/:cond",function(req, res) {
    const cond = req.params.cond;
    if(sort_status[cond] === undefined) {
        sort_status[cond] = true;
    }
    else {
        sort_status[cond] = !sort_status[cond];
    }
    var text = 'SELECT * FROM matches'
    if (cond === 'byId') {
        text = 'SELECT * FROM matches ORDER BY match_id ' + (sort_status[cond] ? ' ASC ;' : ' DESC ;');
    } 
    else if (cond === 'byDuration' )  {
        text = 'SELECT * FROM matches ORDER BY duration ' + (sort_status[cond] ? ' ASC ;' : ' DESC ;');
    }
    else if (cond === 'byTower') {
        text = 'SELECT * FROM matches ORDER BY (tower_status_radiant - tower_status_dire) ' + (sort_status[cond] ? ' ASC ;' : ' DESC ;');
    }
    else if (cond === 'byBarrack') {
        text = 'SELECT * FROM matches ORDER BY (barracks_status_radiant - barracks_status_dire) ' + (sort_status[cond] ? ' ASC ;' : ' DESC ;');
    }
    else if (cond === 'byWin') {
        text = 'SELECT * FROM matches ORDER BY radiant_win ' + (sort_status[cond] ? ' ASC ;' : ' DESC ;');
    }

    pool.query(text).then(matches => {
                    res.render("matches",{matches:matches.rows})
    }).catch(e => console.error(e.stack));
}) 

app.get("/matches_sorted/:id/:table/:cond",function(req, res) {
    const cond = req.params.cond;

    if(sort_status[cond] === undefined) {
        sort_status[cond] = true;
    }
    else {
        sort_status[cond] = !sort_status[cond];
    }
    if (req.params.table == 'sortByTeamfights') {
        var text1 = 'SELECT * FROM teamfights WHERE match_id = ' + req.params.id + ' ORDER BY ' + cond + (sort_status[cond] ? ' ASC ;' : ' DESC ;');
    }
    else {
        var text1 = 'SELECT * FROM teamfights WHERE match_id = ' + req.params.id +';';
    }
    if (req.params.table == 'sortByPlayers') {
        var text2 = 'SELECT * FROM players WHERE match_id = ' + req.params.id + ' ORDER BY ' + cond + (sort_status[cond] ? ' ASC ;' : ' DESC ;');
    }
    else {
        var text2 = 'SELECT * FROM players WHERE match_id = ' + req.params.id +';';
    }

    const text3 = 'SELECT * FROM comments WHERE match_id = '+ req.params.id +';';
    const text4 = 'SELECT * FROM hero_name'

    pool.query(text1).then(teamfights => {
        pool.query(text2).then(players => {
            pool.query(text3).then(comments => {
                pool.query(text4).then(hero_name => {
                    res.render("show",{
                        teamfights:teamfights.rows,
                        players:players.rows,
                        comments:comments.rows,
                        hero_name:hero_name.rows
                    })                    
                })

            })
        })
    }).catch(e => console.error(e.stack))
})

app.get("/matches/:id",function(req, res) {
    const text1 = 'SELECT * FROM teamfights WHERE match_id = ' + req.params.id +';';
    pool.query(text1).then(teamfights => {
        const text2 = 'SELECT * FROM players WHERE match_id = ' + req.params.id +';';
        pool.query(text2).then(players => {
            const text3 = 'SELECT * FROM comments WHERE match_id = '+ req.params.id +';';
            pool.query(text3).then(comments => {
                const text4 = 'SELECT * FROM hero_name'
                pool.query(text4).then(hero_name => {
                    res.render("show",{
                        teamfights:teamfights.rows,
                        players:players.rows,
                        comments:comments.rows,
                        hero_name:hero_name.rows
                    })                    
                })

            })
        })
    }).catch(e => console.error(e.stack))
})


app.get("/purchases/:id",function(req, res) {
    const id = req.params.id;
    const arr = id.split('_');
    const text1 = 'SELECT * FROM purchase_log WHERE match_id = ' + arr[0]+' AND player_slot = ' + arr[1];
    
    pool.query(text1).then(purchase_log => {
        const text2 = 'SELECT * FROM item_id;'
        pool.query(text2).then(item_id => {

            const dict = [];
            item_id.rows.forEach((value) =>{
                dict[value['id']] = value['item_name'];
            })
            res.render("purchases",{purchase_log : purchase_log.rows,
                item_id : dict
            });
        })
    }).catch(e => console.error(e.stack))
})


app.get("/matches/:id/comments/new",function(req, res) {
   res.render("newcomment",{id:req.params.id});
})

app.post("/matches/:id",function(req,res) {

    
    const id = req.params.id;
    const content = req.body.comment.content;
    const author = req.body.comment.author;
    const text = 'INSERT INTO comments (match_id, content, author) VALUES ($1,$2,$3)'
    const values = [id,content,author];
    
    
    pool.query(text,values).then(created => {
        res.redirect("/matches/"+id);
    }).catch(e => console.error(e.stack))

    
})

//delete
app.get("/matches/:id/comments/delete/:commentId",function(req,res) {
    const text = 'delete FROM comments WHERE id = ' + req.params.commentId;
    pool.query(text).then(success => {
        res.redirect("/matches/" + req.params.id)
    }).catch(e => console.error(e.stack))
}) 


app.get("/matches/:id/comments/:commentId/edit",function(req,res) {
    const text = 'SELECT * FROM comments WHERE id = '+ req.params.commentId +';';
    pool.query(text).then(comment => {
        res.render("edit",{comment : comment.rows[0]});
    }).catch(e => console.error(e.stack))

})

app.post("/matches/:id/comments/:commentId",function(req, res) {
    const commentId = req.params.commentId;
    const matchId = req.params.id;
    const updatedContent = req.body.comment.content;

    const text = 'UPDATE comments SET content = \'' + updatedContent +'\' WHERE id = ' + commentId +';';
    console.log(text);
    pool.query(text).then(success => {
        res.redirect("/matches/" + matchId);
    }).catch(e => console.error(e.stack))
})


app.listen(process.env.PORT,process.env.IP,() =>{
    console.log("started");
});

