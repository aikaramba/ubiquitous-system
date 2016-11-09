const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const users = require("./data/users.json");
const _ = require("lodash");

passport.use(new LocalStrategy((username, password, done) => {
    let user = _.find(users, u => u.name === username);
    if(!user || user.password !== password){ done(null, false);}
    done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    let user = _.find(users, u => u.id === id);
    done(null, user);
});