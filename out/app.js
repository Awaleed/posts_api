"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_errors_1 = __importDefault(require("http-errors"));
var express_1 = __importDefault(require("express"));
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var indexRouter = require("./routes/index"), campgroundsRouter = require("./routes/campgrounds"), commentsRoutes = require("./routes/comments");
var app = express_1.default();
mongoose.connect("mongodb://demo:demo1234@ds159020.mlab.com:59020/yelp_camp", {
    useNewUrlParser: true,
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(cookieParser());
app.use(express_1.default.static(path.join(__dirname, "public")));
app.use(require("express-session")({
    secret: "something for generating the password token",
    resave: false,
    saveUninitialized: false,
}));
app.use("/", indexRouter);
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.send(req.app.get("env"));
});
module.exports = app;
