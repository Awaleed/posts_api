var createError    = require('http-errors'),
    express        = require('express'),
    path           = require('path'),
    cookieParser   = require('cookie-parser'),
    logger         = require('morgan'),
    mongoose       = require('mongoose'),
    methodOverride = require('method-override'),
    bodyParser     = require('body-parser'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local'),
    User           = require('./models/user'),
    flash          = require('connect-flash');

var indexRouter       = require('./routes/index'),
    campgroundsRouter = require('./routes/campgrounds'),
    commentsRoutes    = require('./routes/comments');

var app = express();

mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret:            'something for generating the password token',
    resave:            false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRouter);
app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/comments', commentsRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next){
    next(createError(404));
});

// error handler
app.use(function (err, req, res){
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
