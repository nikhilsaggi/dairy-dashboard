var express = require('express');
var router = express.Router();
const csv = require('fast-csv');
var count = 0; 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
