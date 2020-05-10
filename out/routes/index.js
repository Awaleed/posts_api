"use strict";
var express = require('express'), passport = require('passport'), User = require('../models/user'), router = express.Router();
router.get('/', function (req, res) {
    res.render('index', { title: 'YelpCamp' });
});
router.get('/register', function (req, res) {
    res.render('register');
});
router.post('/register', function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function () {
            req.flash('success', 'Welcome to YelpCamp ' + user.username);
            res.redirect('/campgrounds');
        });
    });
});
router.get('/login', function (req, res) {
    res.render('login');
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}));
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'Successfully Logged Out');
    res.redirect('/campgrounds');
});
module.exports = router;
