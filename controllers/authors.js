const express = require('express');
const router = express.Router();
const Author = require('../models/authors');
const Article = require('../models/articles');

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

router.delete('/:id', (req, res) => {

  Author.findByIdAndRemove(req.params.id, (err, foundAuthor) => {
    const articleIds = [];

    for (let i = 0; i < foundAuthor.articles.length; i++){
      articleIds.push(foundAuthor.articles[i]._id)
    }
    Article.remove({
      _id: {$in: articleIds}
    },
    (err, data) => {
      res.redirect('/authors')
    })
  }) // end of Author query
})
























module.exports = router;
