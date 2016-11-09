const port = 3000;
const ip = "127.0.0.1";

const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
require("./passport-init");

const app = express();
//-----------------------------

app.set("views", "./views");
app.set("view engine", "jade");

// log to file
app.use(require("./logging"));

app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jquery/dist'));

//require("express-debug")(app, {}); // debuger

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// sessions
app.use(require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// log middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.url}`);
    next();
});

// auth
const authRouter = require("./auth");
app.use(authRouter);

app.use((req, res, next) => {
    if(req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
        return;
    }
    res.redirect('/login');
});

// homepage
app.get('/', (req, res, next) => {
    res.render("home", { title: "Home", baseUrl: "/admin" });
});

// admin module
const adminRouter = require("./admin");
app.use("/admin", adminRouter);

const apiRouter = require("./api");
app.use("/api", apiRouter);

app.get('/test', (req, res) => {res.send("It's just a test bro!!!!!")});


// error middleware
app.use((error, req, res, next) => {
    res.send("Super secret error");
});

// server debug
app.listen(port, () => {console.log(`Chat app is listening on port ${port}`)});
