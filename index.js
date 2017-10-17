const express = require('express');
const app     = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('./db/db')

const authorController = require('./controllers/authors');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static('public'))

app.use('/authors', authorController);

app.listen(3000, () => {
  console.log('server is listening at port 3000')
})
