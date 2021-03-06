const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const hbs = require("handlebars");
const moment = require("moment");
const expressHbs = require("express-handlebars");
const mongodb = require("mongodb");
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose')
const passport = require('passport')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/tutoringwebsite')
const app = express()
const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.use(morgan('dev'))
 
// 2 for views
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', expressHandlebars({ defaultLayout: 'loginLayout' }))
app.engine('handlebars', expressHandlebars({ defaultLayout: 'dashboardLayout' }))
app.engine(" handlebars", expressHbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

 

// 3 for body parsing and cookies, sessions
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// app.use('/public',express.static('public'))
const static = express.static(path.join(__dirname, '/public'))
app.use("/public",static)
const vendor = express.static(path.join(__dirname+'/vendor'))

const port = process.env.PORT || 3000;

app.use('/vendor',vendor)

app.use(session({
  key:'user_sid',
  cookie: { maxAge: 20* 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));

hbs.registerHelper("formatDate", (date) => {
    return moment(date).format("MMMM Do YYYY, h:mm a");
});


// 4 for flash messages
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_mesages = req.flash('success')
  res.locals.error_messages = req.flash('error')
  next()
})

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});
 
// 5 Define routes
 
// 7
// app.listen(5000 , () => console.log('Server started listening on port 5000!'))

// module.exports = app


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tutoringwebsite', (err, db) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    // console.log(mongoose.connection);

    console.log("Connected to database");
    app.use("/forum", require("./routes/index")(db));
    require("./socket/index")(io, db);
    app.use('/', require('./routes/login'))
    app.use('/users',require('./routes/users'))
    app.use('/calendar',require('./routes/events'));

    app.use(express.static(path.join(__dirname, "./public")));
    app.use("/topics", require("./routes/topics")(db));
    app.use("/comments", require("./routes/comments")(db));
    app.use("/categories", require("./routes/categories")(db));
    
// app.use('*', (req, res) => {
//   res.redirect('/users/login')});
// 6
// catch 404 and forward to error handler
    app.use("*",(req, res, next) => {
      res.render('partials/notFound')
    });

    server.listen(port, () => {
        console.log("Listening on port", port);
    });
});
