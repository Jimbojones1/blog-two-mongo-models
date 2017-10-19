const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const Author = require('../models/authors');

router.route('/')
  .get((req, res) => {
    Article.find((err, articles) => {
      res.render('articles/index', {articles: articles})
    })

  })
  .post((req, res) => {

    Author.findById(req.body.authorId, (err, foundAuthor) => {


          Article.create(req.body, (err, createdArticle) => {

            foundAuthor.articles.push(createdArticle);
            foundAuthor.save((err, data) => {
               res.redirect('/articles')
            });
          });
    });
  });

router.get('/new', (req, res) => {
  Author.find((err, allAuthors) => {
     res.render('articles/new', {authors: allAuthors})
  })

})

router.get('/:id/edit', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('articles/edit', {article: article})
  })
})

router.route('/:id')
  .get((req, res) => {
    Article.findById(req.params.id, (err, article) => {

      Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {
        res.render('articles/show', {
                                    article: article,
                                    author: foundAuthor
                                                  })
      })
    })
  })
  .delete((req, res) => {
      Article.findByIdAndRemove(req.params.id, (err, deletedArticle) => {
        // req.params.id gives us the articles id
        Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {
          foundAuthor.articles.id(req.params.id).remove();
          foundAuthor.save((err, data) => {
            res.redirect('/articles')
          })
        })
      })
    })
  .put((req, res) => {
    // new: true tells the method to return the new/updated article, otherwise
    // it returns the orignial copy
    Article.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, updatedArticle) => {

      Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {
        foundAuthor.articles.id(req.params.id).remove();
        foundAuthor.articles.push(updatedArticle);
        foundAuthor.save((err, data) => {
          res.redirect('/articles/' + req.params.id);
        })
      })
    })
  })






module.exports = router;
