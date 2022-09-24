const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middlewares/authMiddleware')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://Richey14:Richey1989@ninja-cluster.rswgjzn.mongodb.net/ninja-data?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000), console.log('listening...S'))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser) //to check current user if logged in
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

// cookies
/* app.get('/set-cookies', (req, res) => {
    res.cookie('newUser', false)
    res.cookie('isEmployee', true, {maxAge: 1000, httpOnly: true})
    res.send('you got the cookie')
});

app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies
    console.log(cookies)
    res.json(cookies)
}) */