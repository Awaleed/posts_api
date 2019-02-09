var express  = require('express'),
    passport = require('passport'),
    User     = require('../models/user'),
    router   = express.Router();

/* GET home page. */
router.get('/', function (req, res){
    res.render('index', {title: 'YelpCamp'});
});


// =========================
// | AUTHENTICATION ROUTES |
// =========================

// SHOW REGISTER FORM
router.get('/register', function (req, res){
    res.render('register');
});

// HANDLE SIGN UP LOGIC
router.post('/register', function (req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user){
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function (){
            req.flash('success', 'Welcome to YelpCamp ' + user.username);
            res.redirect('/campgrounds');
        });
    });
});

// SHOW LOGIN FORM
router.get('/login', function (req, res){
    res.render('login');
});

// HANDLE LOGIN LOGIC
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }
));

// LOGOUT ROUTE
router.get('/logout', function (req, res){
    req.logout();
    req.flash('success', 'Successfully Logged Out');
    res.redirect('/campgrounds');
});


module.exports = router;
