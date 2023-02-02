var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Some content');
});

router.get('/cool/', (req, res, next) => {
  res.render('users', { title: 'Users', text: 'cool'});
});

module.exports = router;