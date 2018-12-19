// var db = require('../models');

var connection = require("../connection");
const { Pool, Client } = require('pg')
const connectionString = connection.uri;

const pool = new Pool({
  connectionString: connectionString,
  ssl: true,
});

var sort_status = [];

exports.getMainPage = function(req,res) {
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
};

// app.get("/matches",function(req,res) {

//     pool.query('SELECT * FROM matches;').then(matches => {
//                     res.render("matches",{matches:matches.rows})
//     }).catch(e => console.error(e.stack));
// });
exports.getMatches  = function(req,res) {
    pool.query('SELECT * FROM matches;').then(matches => {
                    res.render("matches",{matches:matches.rows})
    }).catch(e => console.error(e.stack));
};

exports.getSortedMatches = function(req, res) {
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
}

exports.getSortedShowpage = function(req, res) {
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
};

module.exports = exports;