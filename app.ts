import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";

import path = require("path");
import cookieParser = require("cookie-parser");
import logger = require("morgan");
import mongoose = require("mongoose");
import methodOverride = require("method-override");
import bodyParser = require("body-parser");
//  TODO: Fix passport
//  import passport = require("passport");
//  import LocalStrategy = require("passport-local");
import User = require("./models/user");
import flash = require("connect-flash");

var indexRouter = require("./routes/index"),
  campgroundsRouter = require("./routes/campgrounds"),
  commentsRoutes = require("./routes/comments");

var app = express();

mongoose.connect("mongodb://demo:demo1234@ds159020.mlab.com:59020/yelp_camp", {
  useNewUrlParser: true,
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "something for generating the password token",
    resave: false,
    saveUninitialized: false,
  })
);
// TODO: use passport
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy.Strategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// app.use(function (req, res, next) {
//   res.locals.currentUser = req.user;
//   res.locals.error = req.flash("error");
//   res.locals.success = req.flash("success");
//   next();
// });

app.use("/", indexRouter);
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/comments", commentsRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.send(req.app.get("env"));
  //   next(createError(500));
});

module.exports = app;
