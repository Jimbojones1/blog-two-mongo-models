const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('articles/index', {})
})

router.get('/new', (req, res) => {
  res.render('articles/new', {})
})

module.exports = router;
