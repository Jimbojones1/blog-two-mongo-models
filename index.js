const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session        = require('express-session')
require('./db/db')

app.use(session({
  secret:'This is some random string you create',
  resave: false,
  saveUnitialized: false
}))



const authorController = require('./controllers/authors');
const homeController  = require('./controllers/home')
const articlesController = require('./controllers/articles');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static('public'))

app.use('/articles', articlesController);
app.use('/authors', authorController);
app.use('/', homeController);



app.listen(3000, () => {
  console.log('server is listening at port 3000')
})
