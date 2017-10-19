const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('-------------------------------------')
  console.log(req.session)
  console.log('-------------------------------------')
  const message = req.session.logged ? 'Hey Your logged congrats' : '';


  res.render('index', {
                      logged: req.session.logged,
                      message: message,
                      notLoggedInMessage: req.session.notLoggedMessage
                          })
})

router.post('/login', (req, res) => {
  req.session.notLoggedMessage = '';
  req.session.username = req.body.username;
  req.session.logged = true;

  res.redirect('/')

})



module.exports = router;
