"use strict";
var express = require('express'), Campground = require('../models/campground'), Comment = require('../models/comment'), middleware = require('../middleware'), router = express.Router({ mergeParams: true });
router.get('/new', middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('comments/new', { campground: campground });
        }
    });
});
router.post('/', middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            Comment.create(req.body.comment, function (err, comment) {
                console.log(req.body.comment);
                if (err) {
                    req.flash('error', 'Something went wrong');
                    console.log(err);
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully added comment');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});
router.get('/:comment_id/edit', middleware.checkCommentOwnerShip, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err || !campground) {
            req.flash('error', 'Campground not found');
            res.redirect('back');
        }
        else {
            Comment.findById(req.params.comment_id, function (err, comment) {
                if (err || !comment) {
                    req.flash('error', 'Comment not found');
                    res.redirect('back');
                }
                else {
                    res.render('comments/edit', {
                        campground: campground,
                        comment: comment
                    });
                }
            });
        }
    });
});
router.put('/:comment_id', middleware.checkCommentOwnerShip, function (req, res) {
    Comment.findOneAndUpdate({ _id: req.params.comment_id }, req.body.comment, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
router.delete('/:comment_id', middleware.checkCommentOwnerShip, function (req, res) {
    Comment.findOneAndDelete({ _id: req.params.comment_id }, function (err) {
        if (err) {
            res.redirect('back');
        }
        else {
            req.flash('success', 'Comment deleted!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
module.exports = router;
