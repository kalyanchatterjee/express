var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

// comments middleware
router.get('/comments', function (req, res, next) {
  // res.send("Comments route");
  console.log("Hello");
  next();
});

module.exports = router;