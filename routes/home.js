var express = require('express');
var router = express.Router();
var helpers = require("../helpers/home");

router.route('/')
 .get(helpers.getMainPage)
//  .post(helpers.createTodo)
router.route('/matches').get(helpers.getMatches);

router.route('/matches/sort/:cond').get(helpers.getSortedMatches);

router.route('/matches_sorted/:id/:table/:cond').
get(helpers.getSortedShowpage);


  
  
  
module.exports = router;