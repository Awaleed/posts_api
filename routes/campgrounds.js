var express    = require('express'),
    Campground = require('../models/campground'),
    middleware = require('../middleware'),
    router     = express.Router();

// INDEX ROUTE
router.get('/', function (req, res){
    Campground.find({}, function (err, campgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }

    });
});


// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function (req, res){
    req.body.campground.author = {
        id:       req.user._id,
        username: req.user.username
    };

    Campground.create(req.body.campground, function (err, campground){
        console.log(campground);
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, function (req, res){
    res.render('campgrounds/new');
});

// SHOW ROUTE
router.get('/:id', function (req, res){
    Campground.findById(req.params.id).populate('comments').exec(function (err, campground){
        if (err || !campground) {
            req.flash('error', 'Campground not found');
            res.redirect('back');
        } else {
            res.render('campgrounds/show', {campground: campground});
        }
    });
});

// EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnerShip, function (req, res){
    Campground.findById(req.params.id, function (err, campground){
        res.render('campgrounds/edit', {campground: campground});
    });
});

// UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnerShip, function (req, res){
    Campground.findOneAndUpdate({_id: req.params.id}, req.body.campground, function (err){
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnerShip, function (req, res){
    Campground.findOneAndRemove({_id: req.params.id}, function (err){
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});


module.exports = router;