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
    // this is finding all the authors which will return the variable allAuthors
    Author.find((err, allAuthors) => {
      // Finding the Author the current article we are editing
      // that variable will foundAuthor
      Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {

        res.render('articles/edit', {
                                      article: article,
                                      authors: allAuthors,
                                      articleAuthor: foundAuthor
                                     })
      });
    });
  });
});

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
    if(req.session.logged === true){

      Article.findByIdAndRemove(req.params.id, (err, deletedArticle) => {
        // req.params.id gives us the articles id
        Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {
          foundAuthor.articles.id(req.params.id).remove();
          foundAuthor.save((err, data) => {
            res.redirect('/articles')
          })
        })
      })
    } else {
      req.session.notLoggedMessage = 'Hey You gotta log in to delete an article, idiot';
      res.redirect('/')
    }

    })
  .put((req, res) => {
    // new: true tells the method to return the new/updated article, otherwise
    // it returns the orignial copy
    Article.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, updatedArticle) => {

      Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {

        // were removing the article from the author that the article belong too
        // then after we save it we want to add the article to the new author
        // that was selected in the drop down menu
        if(foundAuthor._id.toString() !== req.body.authorId){
            foundAuthor.articles.id(req.params.id).remove();
            foundAuthor.save((err, savedFoundAuthor) => {
              // finding the new author that was selected in the dropdown
              Author.findById(req.body.authorId, (err, newAuthor) => {
                // add the updated article to the new Author
                newAuthor.articles.push(updatedArticle);
                newAuthor.save((err, savedNewAuthor) => {
                   res.redirect('/articles/' + req.params.id);
                });
              });
            });
        } else {

            foundAuthor.articles.id(req.params.id).remove();
            foundAuthor.articles.push(updatedArticle);
            foundAuthor.save((err, data) => {
              res.redirect('/articles/' + req.params.id);
            })
        }
      })
    })
  })






module.exports = router;
