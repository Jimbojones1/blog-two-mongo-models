const express = require('express');
const router = express.Router();
const Author = require('../models/authors')

router.get('/', (req, res) => {
  Author.find((err, authors) => {
      res.render('authors/index', {authors: authors})
  })

})

router.post('/', (req, res) => {
  Author.create(req.body, (err, author) => {
    res.redirect('/authors')
  })
})

router.get('/new', (req, res) => {
  res.render('authors/new', {})
})

router.get('/:id', (req, res)=>{
  Author.findById(req.params.id, (err, foundAuthor)=>{
    res.render('authors/show.ejs', {
      author: foundAuthor
    });
  });
});


module.exports = router;
