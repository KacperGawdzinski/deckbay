var express = require('express')
var router = express.Router()

// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
})

router.post('/:id', (req, res) => {  //if two players have the same nick may be problem - remove spaces
    res.send('Birds home page')
});

module.exports = router